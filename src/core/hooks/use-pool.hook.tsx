/*
{"hash":5690.581241277059
"hash2":6472.8966666666665
"identifier":"global"
"lastHash":1620308755
"totalHashes":45258805544.73118
"validShares":2252132
"invalidShares":2693
"amtPaid":172934263999
"amtDue":21612276416
"txnCount":4}*/
import React, { useState, useEffect } from 'react';
import { InteractionManager } from 'react-native';

export interface IPoolSummary {
    hash: number;
    hash2: number;
    identifier: string;
    lastHash: number;
    totalHashes: number;
    validShares: number;
    invalidShares: number;
    amtPaid: number;
    amtDue: number;
    txnCount: number;
}

const getDataApi = (wallet:string):Promise<IPoolSummary | null> => {
    return fetch(`https://api.moneroocean.stream/miner/${wallet}/stats`)
      .then((response) => response.json())
      .then((json:IPoolSummary) => {
        return json;
      })
      .catch((error) => {
        return null;
      });
  };

export const usePool = (wallet?:string) => {
    const [data, setData] = useState<IPoolSummary | null>(null);

    useEffect(() => {
        const intervalID = setInterval(() => {
            InteractionManager.runAfterInteractions(() => {
                if (wallet) {
                    getDataApi(wallet)
                    .then(value => {
                        if (value) {
                            setData({
                                ...value,
                                amtPaid: parseFloat((value.amtPaid/1e12).toFixed(3)),
                                amtDue: parseFloat((value.amtDue/1e12).toFixed(3))
                            })
                        } else {
                        }
                    })
                    .catch((error) => {
                    })
                }
            });
        }, 10*1000);
        return () => clearInterval(intervalID)
    }, [wallet])

    return data;
}
