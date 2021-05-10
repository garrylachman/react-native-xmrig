package com.reactnativexmrig;

import android.content.Context;
import android.util.Log;

import com.facebook.infer.annotation.FalseOnNull;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;


public class Tools {


    /**
     * load the config.json template file
     * @param context
     * @return
     * @throws IOException
     */
    public static String loadConfigTemplate(Context context)  {
        try {
            StringBuilder buf = new StringBuilder();
            InputStream json = context.getAssets().open("config.json");
            BufferedReader in = new BufferedReader(new InputStreamReader(json, "UTF-8"));
            String str;

            while ((str = in.readLine()) != null) {
                buf.append(str);
            }

            in.close();
            return buf.toString();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * write a config.json using the template and the given values
     * @param configTemplate
     * @param username
     * @param privatePath
     * @throws IOException
     */
    public static void writeConfig(String configTemplate, String username, String privatePath, int cores, boolean forceNew) {

        File f = new File(privatePath+"/config.json");
        if(!forceNew && f.exists() && !f.isDirectory()) {
            JSONParser parser = new JSONParser();
            try {
                Object obj = parser.parse(new FileReader(privatePath+"/config.json"));
                JSONObject jsonObject = (JSONObject) obj;
                JSONArray poolList = (JSONArray) jsonObject.get("pools");
                JSONObject pool = (JSONObject) poolList.get(0);
                pool.put("user", username);

                FileWriter file = new FileWriter(privatePath+"/config.json");
                file.write(jsonObject.toJSONString());
                file.flush();
                file.close();

            } catch (Exception e) {
                Log.e("XMRIGModule", e.toString());
            }
        } else {

            String config = configTemplate.replace("$username$", username).replace("$cores$", String.valueOf(cores));
            PrintWriter writer = null;
            try {
                writer = new PrintWriter(new FileOutputStream(privatePath + "/config.json"));
                writer.write(config);
            } catch (IOException e) {
                throw new RuntimeException(e);
            } finally {
                if (writer != null) writer.close();
            }
        }
    }

}