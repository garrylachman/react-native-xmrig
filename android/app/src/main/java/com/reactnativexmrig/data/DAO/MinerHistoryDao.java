package com.reactnativexmrig.data.DAO;

import com.reactnativexmrig.data.entity.MinerHistory;

import java.util.List;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;

@Dao
public interface MinerHistoryDao {
    @Query("SELECT * FROM miner_history")
    List<MinerHistory> getMinerHistory();

    @Query("SELECT datetime(min(timestamp)/1000, 'unixepoch') AS start_date, datetime(max(timestamp)/1000, 'unixepoch') AS end_date, session_id, (max(timestamp)-min(timestamp))/60000 AS mining_in_minutes, algo, avg(hashrate) AS avg_hashrate FROM miner_history GROUP BY session_id, algo")
    List<MinerHistoryBySessionAndAlgo> getMinerHistoryBySessionAndAlgo();

    @Query("SELECT a.* FROM (SELECT datetime(min(timestamp)/1000, 'unixepoch') AS start_date, datetime(max(timestamp)/1000, 'unixepoch') AS end_date, session_id, (max(timestamp)-min(timestamp))/60000 AS mining_in_minutes, algo, avg(hashrate) AS avg_hashrate FROM miner_history GROUP BY session_id, algo) AS a WHERE a.start_date >= date('now', :days)")
    List<MinerHistoryBySessionAndAlgo> getMinerHistoryBySessionAndAlgo(String days);

    @Query("SELECT IFNULL(sum(delta), 0) AS total_mining FROM (SELECT (max(timestamp)-min(timestamp))/60000 AS delta FROM miner_history GROUP BY session_id)")
    List<TotalMiningMinutes> getTotalMiningMinutes();

    @Insert
    void insertMinerHistory(MinerHistory minerHistory);

    static class MinerHistoryBySessionAndAlgo {
        public String start_date;
        public String end_date;
        public String session_id;
        public Float mining_in_minutes;
        public String algo;
        public Float avg_hashrate;
    };

    static class TotalMiningMinutes {
        public  Float total_mining;
    }
}
