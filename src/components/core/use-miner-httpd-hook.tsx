/*{
    "id": "59df265af557d94c",
    "worker_id": "localhost",
    "uptime": 317,
    "restricted": true,
    "resources": {
        "memory": {
            "free": 38916096,
            "total": 1863864320,
            "resident_set_memory": 308178944
        },
        "load_average": [32.75, 32.4, 31.79],
        "hardware_concurrency": 8
    },
    "features": ["api", "http"],
    "results": {
        "diff_current": 10979,
        "shares_good": 0,
        "shares_total": 0,
        "avg_time": 0,
        "avg_time_ms": 0,
        "hashes_total": 0,
        "best": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "algo": "cn/half",
    "connection": {
        "pool": "gulf.moneroocean.stream:10032",
        "ip": "3.125.10.23",
        "uptime": 124,
        "uptime_ms": 124495,
        "ping": 0,
        "failures": 0,
        "tls": null,
        "tls-fingerprint": null,
        "algo": "cn/half",
        "diff": 10979,
        "accepted": 0,
        "rejected": 0,
        "avg_time": 0,
        "avg_time_ms": 0,
        "hashes_total": 0
    },
    "version": "6.12.0-mo1",
    "kind": "miner",
    "ua": "XMRig/6.12.0-mo1 (Linux arm) libuv/1.23.1 clang/8.0.7",
    "cpu": {
        "brand": "ARM Cortex-A53",
        "aes": false,
        "avx2": false,
        "x64": false,
        "64_bit": false,
        "l2": 0,
        "l3": 0,
        "cores": 0,
        "threads": 8,
        "packages": 1,
        "nodes": 0,
        "backend": "basic/1",
        "msr": "none",
        "assembly": "none",
        "arch": "aarch32",
        "flags": []
    },
    "donate_level": 0,
    "paused": false,
    "algorithms": ["cn/1", "cn/2", "cn/r", "cn/fast", "cn/half", "cn/xao", "cn/rto", "cn/rwz", "cn/zls", "cn/double", "cn-lite/1", "cn-pico", "cn-pico/tlo", "cn/upx2", "rx/0", "rx/wow", "rx/arq", "rx/sfx", "rx/keva", "panthera"],
    "hashrate": {
        "total": [22.82, 23.46, null],
        "highest": 24.29
    },
    "hugepages": [0, 8]
}*/

import React, { useState, useEffect } from 'react';

export interface IMinerSummary {
    id: string;
    worker_id: string,
    uptime: number;
    restricted: boolean;
    resources: {
        memory: {
            free: number,
            total: number,
            resident_set_memory: number
        },
        load_average: number[],
        hardware_concurrency: number
    };
    features: string[];
    results: {
        diff_current: number,
        shares_good: number,
        shares_total: number,
        avg_time: number,
        avg_time_ms: number,
        hashes_total: number,
        best: number[]
    };
    algo: string;
    connection: {
        pool: string,
        ip: string,
        uptime: number,
        uptime_ms: number,
        ping: number,
        failures: number,
        tls: null,
        "tls-fingerprint": null,
        algo: string,
        diff: number,
        accepted: number,
        rejected: number,
        avg_time: number,
        avg_time_ms: number,
        hashes_total: number
    },
    version: string;
    kind: string;
    ua: string;
    cpu: {
        brand: string,
        aes: boolean,
        avx2: boolean,
        x64: boolean,
        "64_bit": boolean,
        l2: number,
        l3: number,
        cores: number,
        threads: number,
        packages: number,
        nodes: number,
        backend: string,
        msr: string,
        assembly: string,
        arch: string,
        flags: any[]
    },
    donate_level: number,
    paused: boolean,
    algorithms: string[],
    hashrate: {
        total: any[],
        highest: number | null
    },
    hugepages: number[]
}

const getDataApi = (port: number):Promise<IMinerSummary | null> => {
    console.log("fetch data")
    return fetch(`http://127.0.0.1:${port}/2/summary`)
      .then((response) => response.json())
      .then((json:IMinerSummary) => {
          console.log("data", json)
        return json;
      })
      .catch((error) => {
          console.log("error", error);
        return null;
      });
  };

export const useMinerHttpd = (port:number) => {
    const [status, setStatus] = useState<boolean>(false);
    const [data, setData] = useState<IMinerSummary | null>(null);

    useEffect(() => {
        const intervalID = setInterval(() => {
            getDataApi(port)
                .then(value => {
                    if (value) {
                        setData(value)
                        setStatus(true);
                    } else {
                        setStatus(false);
                    }
                })
                .catch((error) => {
                    setStatus(false);
                })
        }, 10*1000);
        return () => clearInterval(intervalID)
    }, [])

    return {
        status,
        data
    }
}