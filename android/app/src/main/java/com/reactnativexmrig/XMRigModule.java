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
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Promise;


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

    XMRigModule(ReactApplicationContext context) {
        super(context);
        this.context = context;
        Intent intent = new Intent(context, MiningService.class);
        context.bindService(intent, serverConnection, context.BIND_AUTO_CREATE);

        context.startForegroundService(intent);

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
    public void start(String wallet, int threads) {
        Log.d("XMRigModule", "Create event called with wallet: " + wallet);
        //this.startMining(wallet, false);
        try {
            iMiningService.startMiner(wallet, false, threads);
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void rebench(String wallet, int threads) {
        this.stop();
        Log.d("XMRigModule", "Create event called with wallet: " + wallet);
        try {
            iMiningService.startMiner(wallet, true, threads);
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