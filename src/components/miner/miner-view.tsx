import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import {  StyleSheet, ViewProps, View, ScrollView, LayoutChangeEvent, NativeModules, NativeEventEmitter } from 'react-native';
import { Layout, Text, Card, Button, Divider, Tab, TabView } from '@ui-kitten/components';
import Sparkline from 'react-native-sparkline'
import { SettingsContext, SettingsStateDispatch } from '../../core/settings';
import { PoolView } from './components/pool/pool-view';
import { XMRigLogView } from './components/miner/xmrig-log'
import { useMinerHttpd } from '../core/use-miner-httpd-hook';
import { usePool } from '../core/use-pool-hook'
import { OtherView } from './components/other/other-view';
import { XMRigView } from './components/miner/xmrig-view';

const { XMRigModule } = NativeModules;

enum StartMode {
    START,
    REBANCH,
    STOP
}

export interface IXMRigLogEvent {
    log: string[];
}

export interface IMinerLog {
    ts?: string;
    module?: string;
    message: string;
}

const parseLogLineRegex = /^\[[0-9-]+\s([0-9]+\:[0-9]+\:[0-9]+).*\]\s+([a-z]+)\s+(.*)$/mi;
const parseLogLine = (line:string):IMinerLog => {
    let m;
    if ((m = parseLogLineRegex.exec(line)) !== null) {
        // The result can be accessed through the `m`-variable.
        if (m.length > 0)   {
            return {
                ts: m[1],
                module: m[2],
                message: m[3]
            }
        }
    }
    return {
        message: line
    }
}


export const formatHashrate = (hr:number|string|null|undefined, fixed: number = 2):[number, string] => {
    if (!hr || isNaN(hr as any)) {
        return [0, ""];
    }
    const fHr = parseFloat(`${hr}`);
    if (hr >= 1000000000000)    {
        return [parseFloat((fHr/1000000000000).toFixed(fixed)), "TH"]
    }
    if (hr >= 1000000000)    {
        return [parseFloat((fHr/1000000000).toFixed(fixed)), "GH"]
    }
    if (hr >= 1000000)    {
        return [parseFloat((fHr/1000000).toFixed(fixed)), "MH"]
    }
    if (hr >= 1000)    {
        return [parseFloat((fHr/1000).toFixed(fixed)), "kH"]
    }
    return [parseFloat(fHr.toFixed(fixed)), "H"];
}

const useHashrateHistory = (initial:number[]) => {
    const [history, setHistory] = useState<number[]>(initial);
    const add = useCallback((value:number) => setHistory(h => [...h, value].slice(-50)), []);
    return {history, add}
}

export const MinerView:React.FC<ViewProps> = () => {

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [minerLog, setMinerLog] = useState<IMinerLog[]>([]);

    const [settings, settingsDispatcher]:SettingsStateDispatch = useContext(SettingsContext);

    const hashrateHistory = useHashrateHistory([0,0]);

    const poolRawHashrateHistory = useHashrateHistory([0,0]);
    const poolPayoutHashrateHistory = useHashrateHistory([0,0]);

    const [working, setWorking] = useState<StartMode>(StartMode.STOP);
    const [sparklineWidth, setSparklineWidth] = useState<number>(0);

    const { status, data } = useMinerHttpd(50080);
    const poolData = usePool(settings.wallet?.address)

    const [workingState, setWorkingState] = useState<string>("Not Working");

    useEffect(() => {
        if (!isNaN(parseFloat(`${data?.hashrate.total[0]}`))) {
            hashrateHistory.add(parseFloat(`${data?.hashrate.total[0]}`));
        }
    }, [data])

    useEffect(() => {
        if (poolData?.hash) {
            poolRawHashrateHistory.add(poolData?.hash);
        }
        if (poolData?.hash2) {
            poolPayoutHashrateHistory.add(poolData?.hash2);
        }
    }, [poolData]);

    useEffect(() => {
        if (status) {
            setWorkingState("Minning");
        }
    }, [status])

    useEffect(() => {
        console.log("working", working);
        switch(working) {
            case StartMode.START:
                setWorkingState("Benchmarking");
                XMRigModule.start(settings.wallet?.address);
                break;
            case StartMode.REBANCH:
                setWorkingState("Benchmarking");
                XMRigModule.rebench(settings.wallet?.address);
                break;
            case StartMode.STOP:
                setWorkingState("Stopped");
                XMRigModule.stop();
                break;
        }
    }, [working]);

    useEffect(() => {
        const MinerEmitter = new NativeEventEmitter(XMRigModule);

        MinerEmitter.addListener('onLog', (data:IXMRigLogEvent) => {
            console.log(data);
            setMinerLog(old => [...data.log.reverse().map(value => parseLogLine(value)), ...old])
        });

        return () => {
            MinerEmitter.removeAllListeners('onLog');
            XMRigModule.stop();
        }
    }, [])

    const RenderMiner = () => (  
        <ScrollView nestedScrollEnabled={true} scrollEnabled={working != StartMode.STOP} style={working == StartMode.STOP ? {opacity: 0.3} : {height: '100%'}}>
            <View style={styles.section} onLayout={(event:LayoutChangeEvent) => setSparklineWidth(event.nativeEvent.layout.width)}>
                <Text category='h5' style={styles.sectionTitle}>Miner Statistics</Text>
                <Text category='label' style={styles.sectionSubTitle}>XMRig</Text>
            </View>
            <XMRigView workingState={workingState} fullWidth={sparklineWidth} minerData={data} hashrateHistory={hashrateHistory} />
        </ScrollView>    
    );

    const RenderPool = () => (
        <ScrollView nestedScrollEnabled={true} scrollEnabled={working != StartMode.STOP} style={working == StartMode.STOP ? {opacity: 0.3} : {height: '100%'}}>
            <View style={styles.section}>
                <Text category='h5' style={styles.sectionTitle}>Pool Statistics</Text>
                <Text category='label' style={styles.sectionSubTitle}>MoneroOcean</Text>
            </View>
            <PoolView fullWidth={sparklineWidth} minerData={data} poolData={poolData} poolPayoutHashrateHistory={poolPayoutHashrateHistory} poolRawHashrateHistory={poolRawHashrateHistory} />
        </ScrollView>   
    );

    const RenderOther = () => (
        <ScrollView nestedScrollEnabled={true} scrollEnabled={working != StartMode.STOP} style={working == StartMode.STOP ? {opacity: 0.3} : {height: '100%'}}>
            <View style={styles.section}>
                <Text category='h5' style={styles.sectionTitle}>Other</Text>
                <Text category='label' style={styles.sectionSubTitle}>Technical</Text>
            </View>
            <OtherView minerData={data} />
        </ScrollView>   
    );

    const RenderLog = () => (
        <ScrollView nestedScrollEnabled={true} scrollEnabled={working != StartMode.STOP} style={working == StartMode.STOP ? {opacity: 0.3} : {height: '100%'}}>
            <View style={styles.section}>
                <Text category='h5' style={styles.sectionTitle}>Miner Log</Text>
                <Text category='label' style={styles.sectionSubTitle}>STDOUT</Text>
            </View>
            <XMRigLogView data={minerLog} />
        </ScrollView>   
    );



    return (
        <>
            {settings.wallet &&
                 <Layout style={styles.layout} level='2'>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Button style={{flexGrow: 0.25}} disabled={working != StartMode.STOP} onPress={() => setWorking(StartMode.START)}>Start</Button>
                        <Button status={'warning'} style={{flexGrow: 0.25}} disabled={working != StartMode.STOP} onPress={() => setWorking(StartMode.REBANCH)}>Re-Benchmark</Button>
                        <Button status={'danger'} style={{flexGrow: 0.25}} disabled={working == StartMode.STOP} onPress={() => setWorking(StartMode.STOP)}>Stop</Button>
                    </View>
                    <Divider style={{marginVertical: 15}} />
                    
                    <TabView 
                        selectedIndex={selectedIndex}
                        onSelect={index => setSelectedIndex(index)}
                    >
                        <Tab title='Miner' style={styles.minerTab}>
                            <RenderMiner />
                        </Tab>
                        <Tab title='Pool' style={styles.minerTab}>
                            <RenderPool />
                        </Tab>
                        <Tab title='Log' style={styles.minerTab}>
                            <RenderLog />
                        </Tab>
                        <Tab title='Other' style={styles.minerTab}>
                            <RenderOther />
                        </Tab>
                    </TabView>
                </Layout>
            }
            {!settings.wallet && 
                <Text category='h2' style={{padding: 20, justifyContent: 'space-between', textAlign: 'center'}}>Please set a wallet address first</Text>
            }
        </>
    );
}

const styles = StyleSheet.create({
    minerTab: {
        marginVertical: 10
    },
    section: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingTop: 10
    },
    sectionTitle: {
        flexDirection:'column'
    },
    sectionSubTitle: {
        backgroundColor: 'rgba(134, 65, 244, 0.1)', flexDirection:'column', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 5
    },
    layout: {
        flex: 1,
        padding: 15
    },
    card: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        flexBasis: 100,
        flexShrink: 1,
        borderRadius: 10
    },
    cardTitle: {
        flexDirection: 'row',
    },
    cardValue: {
        flexDirection: 'row',
        fontSize: 20
    },
    cards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    hashrate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexShrink: 1,
        width: 'auto'
    },
    hashrateBox: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 0,
        margin: 0,
        padding: 0,
        width: 'auto',
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 99999999,
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
});