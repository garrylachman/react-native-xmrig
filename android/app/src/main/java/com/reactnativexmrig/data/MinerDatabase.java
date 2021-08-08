package com.reactnativexmrig.data;

import android.content.Context;

import com.reactnativexmrig.data.DAO.MinerHistoryDao;
import com.reactnativexmrig.data.entity.MinerHistory;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

@Database(entities = MinerHistory.class, exportSchema = false, version = 2)
public abstract class MinerDatabase extends RoomDatabase {
    private static final String DB_NAME = "miner_db";
    private static MinerDatabase instance;

    public static synchronized MinerDatabase getInstance(Context context) {
        if (instance == null) {
            instance = Room.databaseBuilder(context.getApplicationContext(), MinerDatabase.class, DB_NAME)
                    .fallbackToDestructiveMigration()
                    .build();
        }
        return instance;
    }

    public abstract MinerHistoryDao minerHistoryDao();
}
