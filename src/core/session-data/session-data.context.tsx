import React from "react";
import { IMinerSummary, useMinerHttpd } from "../hooks";
import { IMinerBackend, useBackendHttpd } from "../hooks";
import { useHashrateHistory } from "../hooks";
import { IMinerLog, StartMode, IXMRigLogEvent } from "./session-data.interface";
import { IPoolSummary, usePool } from "../hooks";
import { SettingsContext, SettingsStateDispatch } from "../settings";
import { NativeModules, NativeEventEmitter } from "react-native";
import { parseLogLine } from "../utils/parsers";

const { XMRigModule } = NativeModules;


type SessionDataContextType = {
  minerLog: IMinerLog[],
  hashrateHistoryRef: number[],
  poolRawHashrateHistoryRef: number[],
  poolPayoutHashrateHistoryRef: number[],
  working: StartMode,
  workingState: string,
  minerData: IMinerSummary | null,
  poolData: IPoolSummary | null,
  backendsData: IMinerBackend | null,
  setWorking: Function
}

//@ts-ignore
export const SessionDataContext:React.Context<SessionDataContextType> = React.createContext(); 

export const SessionDataContextProvider:React.FC = ({children}) =>  {

  const [settings, settingsDispatcher]:SettingsStateDispatch = React.useContext(SettingsContext);
  
  const [minerLog, setMinerLog] = React.useState<IMinerLog[]>([]);

  const hashrateHistory = useHashrateHistory([0,0]);
  const hashrateHistoryRef = React.useMemo(() => hashrateHistory.history, [hashrateHistory.history]);

  const poolRawHashrateHistory = useHashrateHistory([0,0]);
  const poolRawHashrateHistoryRef = React.useMemo(() => poolRawHashrateHistory.history, [poolRawHashrateHistory.history]);

  const poolPayoutHashrateHistory = useHashrateHistory([0,0]);
  const poolPayoutHashrateHistoryRef = React.useMemo(() => poolPayoutHashrateHistory.history, [poolPayoutHashrateHistory.history]);

  const [working, setWorking] = React.useState<StartMode>(StartMode.STOP);

  const [workingState, setWorkingState] = React.useState<string>("Not Working");

  const { minerStatus, minerData } = useMinerHttpd(50080);
  const poolData = usePool(settings.wallet?.address)

  const { backendsStatus, backendsData } = useBackendHttpd(50080);

  React.useEffect(() => {
    if (!isNaN(parseFloat(`${minerData?.hashrate.total[0]}`))) {
        hashrateHistory.add(parseFloat(`${minerData?.hashrate.total[0]}`));
    }
  }, [minerData])

  React.useEffect(() => {
    if (poolData?.hash) {
        poolRawHashrateHistory.add(poolData?.hash);
    }
    if (poolData?.hash2) {
        poolPayoutHashrateHistory.add(poolData?.hash2);
    }
  }, [poolData]);

  React.useEffect(() => {
    if (minerStatus) {
      setWorkingState("Minning");
    }
  }, [minerStatus]);

  React.useEffect(() => {
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

  React.useEffect(() => {
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

  return (
    <SessionDataContext.Provider value={{minerLog, hashrateHistoryRef, poolRawHashrateHistoryRef, poolPayoutHashrateHistoryRef, working, workingState, minerData, poolData, backendsData, setWorking}}>
      {children}
    </SessionDataContext.Provider>
  );
}