package com.reactnativexmrig;

import android.app.AlertDialog;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Binder;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.facebook.soloader.SoLoader;

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

enum MinnerState  {
    BENCHMARKING,
    MINNING,
    STOPPED
}

public class MiningService extends Service {

    private static final String LOG_TAG = "MiningSvc";
    private final String[] XMRigABIs = {"arm64-v8a", "armeabi-v7a", "x86", "x86_64"};
    private Process process;
    private String configTemplate;
    private String privatePath;
    private String workerId;
    private OutputReaderThread outputHandler;
    private OutputReaderThread errorHandler;

    private List<String> stdout = new ArrayList<String>();



    @Override
    public void onCreate() {
        super.onCreate();

        // load config template
        configTemplate = Tools.loadConfigTemplate(this);

        // path where we may execute our program
        privatePath = getFilesDir().getAbsolutePath();

        workerId = fetchOrCreateWorkerId();
        Log.w(LOG_TAG, "my workerId: " + workerId);

    }

    private String getABI() {

        for (String supportedAbi : Build.SUPPORTED_ABIS) {
            if (Arrays.stream(this.XMRigABIs).anyMatch(supportedAbi::equalsIgnoreCase)) {
                return  supportedAbi;
            }
        }
        return null;
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
    public void onDestroy() {
        stopMining();
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return new MiningServiceBinder();
    }

    public void stopMining() {
        if (outputHandler != null) {
            outputHandler.interrupt();
            outputHandler = null;
        }
        if (process != null) {
            process.destroy();
            process = null;
            Log.i(LOG_TAG, "stopped");
            Toast.makeText(this, "stopped", Toast.LENGTH_SHORT).show();
        }
    }

    public void startMining(MiningConfig config, boolean forceNew) {
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
            Tools.writeConfig(configTemplate, config.username, privatePath, getAvailableCores(), forceNew);

            Log.d(LOG_TAG, "PRIVATE DIR: " + getApplicationContext().getDataDir().getAbsolutePath());

            // run xmrig using the config
            String[] args = {"./"+SoLoader.getLibraryPath("libxmrig.so"), "-c", getApplicationContext().getFilesDir().getAbsolutePath() + "/config.json"};
            ProcessBuilder pb = new ProcessBuilder(args);
            // in our directory
            //pb.directory(new File(getApplicationContext().getFilesDir().getAbsolutePath()+"/../lib/"));
            // in case of errors, read them
            pb.redirectErrorStream();



            // run it!
            process = pb.start();
            // start processing xmrig's output
            outputHandler = new MiningService.OutputReaderThread(process.getInputStream());
            outputHandler.start();

            errorHandler = new MiningService.OutputReaderThread(process.getErrorStream());
            errorHandler.start();

            Toast.makeText(this, "started", Toast.LENGTH_SHORT).show();

        } catch (Exception e) {
            Log.e(LOG_TAG, "exception:", e);
            Toast.makeText(this, e.getLocalizedMessage(), Toast.LENGTH_SHORT).show();
            process = null;
            wakeLock.release();
        }

    }


    public String getOutput() {
        if (outputHandler != null && outputHandler.getOutput() != null)
            return outputHandler.getOutput().toString();
        else return "";
    }

    public String[] getStdout() {
        String[] ret = stdout.toArray(new String[0]);
        stdout.clear();
        return ret;
    }

    public int getAvailableCores() {
        return Runtime.getRuntime().availableProcessors()/2;
    }

    /**
     * thread to collect the binary's output
     */
    private class OutputReaderThread extends Thread {

        private InputStream inputStream;
        private StringBuilder output = new StringBuilder();
        private BufferedReader reader;

        OutputReaderThread(InputStream inputStream) {
            this.inputStream = inputStream;
        }

        public void run() {
            try {
                reader = new BufferedReader(new InputStreamReader(inputStream));
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line + System.lineSeparator());
                    stdout.add(line);

                    Log.d(LOG_TAG, line);

                    if (currentThread().isInterrupted()) return;
                }
            } catch (IOException e) {
                Log.w(LOG_TAG, "exception", e);
            }
        }

        public StringBuilder getOutput() {
            return output;
        }

    }
}