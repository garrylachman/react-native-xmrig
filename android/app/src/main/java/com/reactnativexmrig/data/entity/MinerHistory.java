package com.reactnativexmrig.data.entity;

import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "miner_history")
public class MinerHistory {
    @PrimaryKey(autoGenerate = true)
    public Integer id;

    @ColumnInfo(name = "timestamp", defaultValue = "CURRENT_TIMESTAMP")
    public Long timestamp;

    @ColumnInfo(name = "session_id")
    public String session_id;

    @ColumnInfo(name = "algo")
    public String algo;

    @ColumnInfo(name = "hashrate")
    public Float hashrate;

    public MinerHistory(String session_id, String algo, Float hashrate) {
        this.session_id = session_id;
        this.algo = algo;
        this.hashrate = hashrate;
        this.timestamp = System.currentTimeMillis();
    }
}
