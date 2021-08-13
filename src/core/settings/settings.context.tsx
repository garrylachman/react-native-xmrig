import React, { createContext, Context, useReducer, Dispatch, useEffect, useState, EffectCallback } from "react";
import { NativeModules } from "react-native";
import { getCheckpointByMin } from "../utils";
import { SettingsActionType } from "./settings.actions";
import { ISettings, ISettingsReducerAction, ThemeModes, Themes } from "./settings.interface";
import { SettingsReducer } from "./settings.reducer";
import { SettingsStorageInit, SettingsStorageSave } from "./settings.storage";
import uuid from 'react-native-uuid';
import { useInterval } from "../hooks";

const { XMRigModule } = NativeModules;


const initialState: ISettings = {
    ready: false,
    wallet: null,
    wallet_history: [],
    theme: Themes.DARK,
    theme_mode: ThemeModes.ADVANCED,
    max_threads: 2,
    total_mining: 0,
    dev_fee: 20,
    uuid: uuid.v4().toString()
};

type SettingsContextProps = {
  settings: ISettings,
  totalMining: number,
  settingsDispatcher: Dispatch<ISettingsReducerAction>,
}

export const SettingsContext:Context<SettingsContextProps> = createContext<SettingsContextProps>({settings: initialState, settingsDispatcher: ():void => {}, totalMining: 0});

export const SettingsContextProvider:React.FC = ({children}) =>  {
    const [settings, settingsDispatcher] = useReducer(SettingsReducer, initialState);
    const [asyncLoaderState, setAsyncLoaderState] = useState<boolean>(false);
    const [nativeTotalMining, setNativeTotalMining] = useState<number>(0);
    const totalMining = React.useMemo(() => settings.total_mining + nativeTotalMining, [settings.total_mining, nativeTotalMining])

    useInterval(() => {
      XMRigModule.totalMiningMinutes()
        .then((value: number) => setNativeTotalMining(value))
        .catch(() => {})
    }, 60*1000);

    useEffect(() => {
      console.log("settings effect - SettingsStorageInit");
      SettingsStorageInit(initialState)
        .then((value:ISettings) => {
          settingsDispatcher({
            type: SettingsActionType.SET,
            value: {
              ...initialState, 
              ...value,
              ready: true
            }
          })
          setAsyncLoaderState(true);
        })
        .catch((e) => console.log(e));
      
      XMRigModule.totalMiningMinutes()
        .then((value: number) => setNativeTotalMining(value))
        .catch(() => {})
    }, []);

    useEffect(() => {
      console.log("state changed", settings, "asyncLoaderState: ", asyncLoaderState);
      if (asyncLoaderState) {
        SettingsStorageSave(settings);
      }
    }, [settings]);

    useEffect(() => {
      console.log("total_mining: ", settings.total_mining, "nativeTotalMining: " + nativeTotalMining);

      const newFee = 20 - getCheckpointByMin(totalMining);
      if (settings.ready && settings.dev_fee != newFee) {
        settingsDispatcher({
          type: SettingsActionType.SET_DEV_FEE,
          value: newFee
        })
      }
    }, [totalMining])

    return (
        <SettingsContext.Provider value={{settings, settingsDispatcher, totalMining}}>
          {children}
        </SettingsContext.Provider>
      );
}