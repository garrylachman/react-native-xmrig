package com.reactnativexmrig;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Promise;
import com.reactnativexmrig.data.DAO.MinerHistoryDao;
import com.reactnativexmrig.data.MinerDatabase;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;
import android.widget.Toast;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import javax.net.ssl.HttpsURLConnection;

import androidx.core.app.NotificationCompat;

public class XMRigModule extends ReactContextBaseJavaModule {
    private MiningService.MiningServiceBinder binder;
    private ScheduledExecutorService svc;
    private String walletAddr;
    private Context context;
    IMiningService iMiningService;
    MinerDatabase minerDatabase;

    XMRigModule(ReactApplicationContext context) {
        super(context);
        this.context = context;
        Intent intent = new Intent(context, MiningService.class);
        context.bindService(intent, serverConnection, context.BIND_AUTO_CREATE);

        context.startForegroundService(intent);

        minerDatabase = MinerDatabase.getInstance(this.context);
    }

    @Override
    public void initialize() {
        super.initialize();
        EventBus.getDefault().register(this);
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        EventBus.getDefault().unregister(this);
    }

    @Subscribe(threadMode = ThreadMode.ASYNC)
    public void onMessageEvent(MiningService.StdoutEvent event) {
        WritableMap payload = Arguments.createMap();
        String[] strArr = {event.value};
        payload.putArray("log", Arguments.fromArray(strArr));

        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onLog", payload);
    };

    @Override
    public String getName() {
        return "XMRigModule";
    }

    @ReactMethod
    public void totalMiningMinutes(Promise promise) {
        //Log.d("XMRigModule", "totalMiningMinutes="+minerDatabase.minerHistoryDao().getTotalMiningMinutes().get(0).total_mining);
        try {
            Float total_mining = minerDatabase.minerHistoryDao().getTotalMiningMinutes().get(0).total_mining;
            promise.resolve(total_mining);
        } catch(Exception e) {
            promise.reject("minerDatabase.minerHistoryDao().getTotalMiningMinutes().get(0).total_mining", e);
        }
    }

    @ReactMethod
    public void getMinerHistoryBySessionAndAlgo(int days, Promise promise) {
        //Log.d("XMRigModule", "totalMiningMinutes="+minerDatabase.minerHistoryDao().getMinerHistoryBySessionAndAlgo(days));
        String daysStr = String.format("-%d days", days);
        Log.d("XMRigModule", "daysStr="+daysStr);
        try {
            WritableArray history = new WritableNativeArray();
            for (MinerHistoryDao.MinerHistoryBySessionAndAlgo item : minerDatabase.minerHistoryDao().getMinerHistoryBySessionAndAlgo(daysStr)) {

                WritableMap info = new WritableNativeMap();
                info.putString("start_date", item.start_date);
                info.putString("end_date", item.end_date);
                info.putDouble("mining_in_minutes", Double.valueOf(item.mining_in_minutes));
                info.putString("algo", item.algo);
                info.putDouble("avg_hashrate", Double.valueOf(item.avg_hashrate));
                history.pushMap(info);
                Log.d("XMRigModule", "item.start_date: " + item.start_date);
            }

            promise.resolve(history);
        } catch(Exception e) {
            promise.reject("minerDatabase.minerHistoryDao().getTotalMiningMinutes().getMinerHistoryBySessionAndAlgo()", e);
        }
    }

    @ReactMethod
    public void start(String wallet, int threads, int devFee) {
        Log.d("XMRigModule", "Create event called with wallet: " + wallet);
        //this.startMining(wallet, false);
        try {
            iMiningService.startMiner(wallet, false, threads, devFee);
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void rebench(String wallet, int threads, int devFee) {
        this.stop();
        Log.d("XMRigModule", "Create event called with wallet: " + wallet);
        try {
            iMiningService.startMiner(wallet, true, threads, devFee);
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void stop() {
        Log.d("XMRigModule", "Create event stop");
        try {
            iMiningService.stopMiner();
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void availableProcessors(Promise promise) {
        Log.d("XMRigModule", "availableProcessors="+String.valueOf(Runtime.getRuntime().availableProcessors()));
        try {
            Integer availableProcessors = Integer.valueOf(Runtime.getRuntime().availableProcessors());
            promise.resolve(availableProcessors);
        } catch(Exception e) {
            promise.reject("Runtime.getRuntime().availableProcessors()", e);
        }
    }

    private ServiceConnection serverConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName className, IBinder service) {
            // Following the example above for an AIDL interface,
            // this gets an instance of the IRemoteInterface, which we can use to call on the service
            iMiningService = IMiningService.Stub.asInterface(service);
        }

        @Override
        public void onServiceDisconnected(ComponentName className) {
            iMiningService = null;
        }
    };
}