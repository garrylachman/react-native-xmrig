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

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import javax.net.ssl.HttpsURLConnection;

public class XMRigModule extends ReactContextBaseJavaModule {
    private MiningService.MiningServiceBinder binder;
    private ScheduledExecutorService svc;
    private String walletAddr;
    private Context context;

    XMRigModule(ReactApplicationContext context) {
        super(context);
        this.context = context;
        Intent intent = new Intent(context, MiningService.class);
        context.bindService(intent, serverConnection, context.BIND_AUTO_CREATE);
        context.startService(intent);
    }

    private void startMining(String wallet, boolean forceNew) {
        Log.d("XMRigModule", "isBinder: " + Boolean.toString(binder == null));
        this.walletAddr = wallet;
        if (binder == null) return;
        MiningService.MiningConfig cfg = binder.getService().newConfig(
                wallet,
                true);
        binder.getService().startMining(cfg, forceNew);

        svc = Executors.newSingleThreadScheduledExecutor();
        svc.scheduleWithFixedDelay(this::updateLog, 1, 10, TimeUnit.SECONDS);

    }

    private void updateLog() {
        WritableMap payload = Arguments.createMap();
        payload.putArray("log", Arguments.fromArray(binder.getService().getStdout()));

        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onLog", payload);
    }


    private void stopMining() {
        binder.getService().stopMining();
    }


    @Override
    public String getName() {
        return "XMRigModule";
    }

    @ReactMethod
    public void start(String wallet) {
        Log.d("XMRigModule", "Create event called with wallet: " + wallet);
        this.startMining(wallet, false);
    }

    @ReactMethod
    public void rebench(String wallet) {
        this.stopMining();
        Log.d("XMRigModule", "Create event called with wallet: " + wallet);
        this.startMining(wallet, true);
    }

    @ReactMethod
    public void stop() {
        Log.d("XMRigModule", "Create event stop");
        this.stopMining();
    }

    private ServiceConnection serverConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            Log.d("XMRigModule", "onServiceConnected");
            binder = (MiningService.MiningServiceBinder) iBinder;

        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            binder = null;
        }
    };
}