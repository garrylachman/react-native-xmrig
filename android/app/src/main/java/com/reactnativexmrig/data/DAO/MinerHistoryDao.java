package com.reactnativexmrig.data.DAO;

import com.reactnativexmrig.data.entity.MinerHistory;

import java.util.List;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;

@Dao
public interface MinerHistoryDao {
    @Query("Select * from miner_history")
    List<MinerHistory> getMinerHistory();

    @Query("Select datetime(min(timestamp)/1000, 'unixepoch') as start_date, datetime(max(timestamp)/1000, 'unixepoch') as end_date, session_id, (max(timestamp)-min(timestamp))/60000 as mining_in_minutes, algo, avg(hashrate) as avg_hashrate FROM miner_history group by session_id, algo")
    List<MinerHistoryBySessionAndAlgo> getMinerHistoryBySessionAndAlgo();

    @Query("select IFNULL(sum(delta), 0) as total_mining from (SELECT (max(timestamp)-min(timestamp))/60000 as delta FROM miner_history group by session_id)")
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
