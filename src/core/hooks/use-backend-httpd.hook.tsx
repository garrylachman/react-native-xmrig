/*[
    {
        "type": "cpu",
        "enabled": true,
        "algo": "astrobwt",
        "profile": "astrobwt",
        "hw-aes": true,
        "priority": -1,
        "msr": false,
        "asm": "intel",
        "argon2-impl": null,
        "astrobwt-max-size": 550,
        "hugepages": [0, 80],
        "memory": 167772160,
        "hashrate": [332.28, null, null],
        "threads": [
            {
                "intensity": 1,
                "affinity": 0,
                "av": 1,
                "hashrate": [41.94, null, null]
            },
            {
                "intensity": 1,
                "affinity": 1,
                "av": 1,
                "hashrate": [40.78, null, null]
            },
            {
                "intensity": 1,
                "affinity": 2,
                "av": 1,
                "hashrate": [42.04, null, null]
            },
            {
                "intensity": 1,
                "affinity": 3,
                "av": 1,
                "hashrate": [41.1, null, null]
            },
            {
                "intensity": 1,
                "affinity": 4,
                "av": 1,
                "hashrate": [40.89, null, null]
            },
            {
                "intensity": 1,
                "affinity": 5,
                "av": 1,
                "hashrate": [41.52, null, null]
            },
            {
                "intensity": 1,
                "affinity": 6,
                "av": 1,
                "hashrate": [42.15, null, null]
            },
            {
                "intensity": 1,
                "affinity": 7,
                "av": 1,
                "hashrate": [41.83, null, null]
            }
        ]
    },
    {
        "type": "opencl",
        "enabled": false,
        "algo": null,
        "profile": null,
        "platform": null
    },
    {
        "type": "cuda",
        "enabled": false,
        "algo": null,
        "profile": null
    }
]*/

import React from 'react';
import { useInterval } from './use-interval.hook';

export interface IMinerBackendThread {
    intensity: number,
    affinity: number,
    av: number,
    hashrate: any[]
}

export interface IMinerBackend {
    type: string,
    enabled: boolean,
    algo: string,
    profile: string,
    "hw-aes": boolean,
    priority: number,
    msr: boolean,
    asm: string,
    "argon2-impl": any,
    "astrobwt-max-size": number,
    hugepages: number[],
    memory: number,
    hashrate: any
    threads: IMinerBackendThread[]
}

const getDataApi = (port: number):Promise<IMinerBackend | null> => {
    console.log("fetch data")
    return fetch(`http://127.0.0.1:${port}/2/backends`)
      .then((response) => response.json())
      .then((json:any[]) => {
          console.log("data", json[0])
        return json[0];
      })
      .catch((error) => {
          console.log("error", error);
        return null;
      });
  };

export const useBackendHttpd = (port:number) => {
    const [backendsStatus, setBackendsStatus] = React.useState<boolean>(false);
    const [backendsData, setBackendsData] = React.useState<IMinerBackend | null>(null);

    useInterval(() => 
        getDataApi(port)
            .then(value => {
                if (value) {
                    setBackendsData(value)
                    setBackendsStatus(true);
                } else {
                    setBackendsStatus(false);
                }
            })
            .catch((error) => {
                setBackendsStatus(false);
            }
    ), 10*1000);

    return {
        backendsStatus,
        backendsData
    }
}
