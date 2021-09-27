package com.reactnativexmrig;

import android.app.AlertDialog;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Binder;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.os.RemoteException;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.facebook.soloader.SoLoader;
import com.reactnativexmrig.data.DAO.MinerHistoryDao;
import com.reactnativexmrig.data.MinerDatabase;
import com.reactnativexmrig.data.entity.MinerHistory;

import org.greenrobot.eventbus.EventBus;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

enum MinnerState  {
    BENCHMARKING,
    MINNING,
    STOPPED
}

public class MiningService extends Service {

    public static class StdoutEvent {
        public String value;

        StdoutEvent(String _value) {
            this.value = _value;
        }

    }


    private static final String LOG_TAG = "MiningSvc";
    private static final String NOTIFICATION_CHANNEL_ID = "com.reactnativexmrig.service";
    private static final String NOTIFICATION_CHANNEL_NAME = "React Native XMRIG Service";
    private static final int NOTIFICATION_ID = 200;
    private Notification.Builder notificationbuilder;
    private Process process;
    private String configTemplate;
    private String privatePath;
    private String workerId;
    private OutputReaderThread outputHandler;
    private MinerHistoryInserterThread historyInserterHandler;

    @Override
    public void onCreate() {
        super.onCreate();

        // load config template
        configTemplate = Tools.loadConfigTemplate(this);

        // path where we may execute our program
        privatePath = getFilesDir().getAbsolutePath();

        workerId = fetchOrCreateWorkerId();
        Log.w(LOG_TAG, "workerId: " + workerId);

        Intent notificationIntent = new Intent(this, MiningService.class);
        PendingIntent pendingIntent =
                PendingIntent.getActivity(this, 0, notificationIntent, 0);

        notificationbuilder =
                new Notification.Builder(this, NOTIFICATION_CHANNEL_ID)
                        .setContentTitle("React Native XMRig")
                        .setContentText("React Native XMRig Service")
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setContentIntent(pendingIntent)
                        .setTicker("React Native XMRig Service")
                        .setOngoing(true)
                        .setOnlyAlertOnce(true);

        NotificationManager notificationManager = (NotificationManager) getApplication().getSystemService(Context.NOTIFICATION_SERVICE);
        NotificationChannel channel = new NotificationChannel(NOTIFICATION_CHANNEL_ID,
                NOTIFICATION_CHANNEL_NAME,
                NotificationManager.IMPORTANCE_DEFAULT);
        notificationManager.createNotificationChannel(channel);

        notificationManager.notify(NOTIFICATION_ID, notificationbuilder.build());

        // Notification ID cannot be 0.
        this.startForeground(NOTIFICATION_ID, notificationbuilder.build());
    }


    public class MiningServiceBinder extends Binder {
        public MiningService getService() {
            return MiningService.this;
        }
    }

    public static class MiningConfig {
        String username;
    }

    public MiningConfig newConfig(String username, boolean useWorkerId) {
        MiningConfig config = new MiningConfig();
        config.username = username;
        if (useWorkerId)
            config.username += "." + workerId;
        return config;
    }


    /**
     * @return unique workerId (created and saved in preferences once, then re-used)
     */
    private String fetchOrCreateWorkerId() {
        SharedPreferences preferences = getSharedPreferences("MoneroMining", 0);
        String id = preferences.getString("id", null);
        if (id == null) {
            id = UUID.randomUUID().toString();
            SharedPreferences.Editor ed = preferences.edit();
            ed.putString("id", id);
            ed.apply();
        }
        return id;
    }

    @Override
    public IBinder onBind(Intent intent) {
        // Return the interface
        return binder;
    }

    private final IMiningService.Stub binder = new IMiningService.Stub() {
        @Override
        public void startMiner(String wallet, boolean forceNew, int threads, int devFee) {
            MiningConfig cfg = newConfig(
                    wallet,
                    true);
            startMining(cfg, forceNew, threads, devFee);
        }

        @Override
        public void stopMiner() {
            stopMining();
        }
    };

    @Override
    public void onDestroy() {
        stopMining();
        super.onDestroy();
    }

    public void stopMining() {
        if (outputHandler != null) {
            outputHandler.interrupt();
            outputHandler = null;
        }
        if (historyInserterHandler != null) {
            historyInserterHandler.interrupt();
            historyInserterHandler.gracefullyQuit();
            historyInserterHandler = null;
        }
        if (process != null) {
            process.destroy();
            process = null;
            Log.i(LOG_TAG, "stopped");
            Toast.makeText(this, "stopped", Toast.LENGTH_SHORT).show();
        }
    }

    public void startMining(MiningConfig config, boolean forceNew, int threads, int devFee) {
        PowerManager powerManager = (PowerManager) getSystemService(POWER_SERVICE);
        PowerManager.WakeLock wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK,
                "ReactNativeMiner::MinerWakeLock");
        wakeLock.acquire();

        Log.i(LOG_TAG, "starting...");
        if (process != null) {
            process.destroy();
        }
        try {
            Log.d(LOG_TAG, "libxmrig: " + SoLoader.getLibraryPath("libxmrig.so"));
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            // write the config
            Tools.writeConfig(configTemplate, config.username, privatePath, getAvailableCores(), forceNew, devFee);

            Log.d(LOG_TAG, "PRIVATE DIR: " + getApplicationContext().getDataDir().getAbsolutePath());

            // run xmrig using the config
            String[] args = {
                    "./"+SoLoader.getLibraryPath("libxmrig.so"),
                    "-c", getApplicationContext().getFilesDir().getAbsolutePath() + "/config.json",
                    "-t", String.valueOf(threads)};
            ProcessBuilder pb = new ProcessBuilder(args);
            // in our directory
            //pb.directory(new File(getApplicationContext().getFilesDir().getAbsolutePath()+"/../lib/"));
            // in case of errors, read them
            pb.redirectErrorStream(true);


            // run it!
            process = pb.start();
            // start processing xmrig's output
            outputHandler = new MiningService.OutputReaderThread(process.getInputStream());
            outputHandler.start();

            historyInserterHandler = new MiningService.MinerHistoryInserterThread(
                    MinerDatabase.getInstance(getApplicationContext()).minerHistoryDao()
            );
            historyInserterHandler.start();



            Toast.makeText(this, "started", Toast.LENGTH_SHORT).show();

        } catch (Exception e) {
            Log.e(LOG_TAG, "exception:", e);
            Toast.makeText(this, e.getLocalizedMessage(), Toast.LENGTH_SHORT).show();
            process = null;
            wakeLock.release();
        }

    }


    public int getAvailableCores() {

        return Runtime.getRuntime().availableProcessors()/2;
    }

    public void updateNotification(String str) {
        notificationbuilder.setContentText(str);

        NotificationManager notificationManager = (NotificationManager) getApplication().getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(NOTIFICATION_ID, notificationbuilder.build());
    }

    /**
     * thread to collect the binary's output
     */
    private class OutputReaderThread extends Thread {

        private InputStream inputStream;
        private BufferedReader reader;

        OutputReaderThread(InputStream inputStream) {
            this.inputStream = inputStream;
        }

        public void run() {
            try {
                reader = new BufferedReader(new InputStreamReader(inputStream));
                String line;
                while ((line = reader.readLine()) != null) {
                    updateNotification(line);
                    EventBus.getDefault().post(new StdoutEvent(line));

                    Log.d(LOG_TAG, line);

                    if (currentThread().isInterrupted()) return;
                }
            } catch (IOException e) {
                Log.w(LOG_TAG, "exception", e);
            }
        }
    }

    private class MinerHistoryInserterThread extends Thread {

        private volatile boolean active;

        private OkHttpClient client = new OkHttpClient();
        private Request request = new Request.Builder()
                .url("http://127.0.0.1:50080/2/summary")
                .build();
        private String session_id = UUID.randomUUID().toString();
        private MinerHistoryDao minerHistoryDao;

        MinerHistoryInserterThread(MinerHistoryDao minerHistoryDao) {
            this.minerHistoryDao = minerHistoryDao;
            this.active = true;
        }

        public void gracefullyQuit() {
            this.active = false;
        }

        public void run() {
            while (active) {
                try {
                    Response response = client.newCall(request).execute();

                    JSONParser parser = new JSONParser();
                    JSONObject obj = (JSONObject) parser.parse(response.body().string());
                    // Algo
                    String algo = (String) obj.get("algo");

                    // Hashrate
                    JSONObject hashrateObj = (JSONObject) obj.get("hashrate");
                    JSONArray hashrateTotalsArr = (JSONArray) hashrateObj.get("total");
                    Double hashrate = (Double) hashrateTotalsArr.get(0);

                    Log.d(LOG_TAG, "MinerHistoryInserterThread algo: " + algo);
                    Log.d(LOG_TAG, "MinerHistoryInserterThread hashrate: " + hashrate);

                    if (algo != null && hashrate != null) {
                        minerHistoryDao.insertMinerHistory(new MinerHistory(
                                session_id,
                                algo,
                                hashrate.floatValue()
                        ));
                    }

                    Log.d("XMRigModule", "getMinerHistory.size: " +  minerHistoryDao.getMinerHistory().size());
                    for (MinerHistoryDao.MinerHistoryBySessionAndAlgo item: minerHistoryDao.getMinerHistoryBySessionAndAlgo()) {
                        Log.d("XMRigModule", "getMinerHistory.size: " +
                                item.start_date + " | " +
                                item.end_date + " | " +
                                item.algo + " | " +
                                item.avg_hashrate + " | " +
                                item.mining_in_minutes);

                    }

                    Thread.sleep(1000 * 60);
                } catch (ClassCastException | NullPointerException | IOException | InterruptedException | ParseException e) {

                }
            }
        }

    }
}