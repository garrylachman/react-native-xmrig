// IMiningService.aidl
package com.reactnativexmrig;

// Declare any non-default types here with import statements

interface IMiningService {
    /**
     * Demonstrates some basic types that you can use as parameters
     * and return values in AIDL.
     */
    void startMiner(String wallet, boolean forceNew, int threads, int devFee);
    void stopMiner();
}