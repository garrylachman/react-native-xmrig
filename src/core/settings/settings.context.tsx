import React, { createContext, Context, useReducer, Dispatch, useEffect, useState, EffectCallback } from "react";
import { SettingsActionType } from "./settings.actions";
import { ISettings, ISettingsReducerAction, ThemeModes } from "./settings.interface";
import { SettingsReducer } from "./settings.reducer";
import { SettingsStorageInit, SettingsStorageSave } from "./settings.storage";

const initialState: ISettings = {
    wallet: null,
    wallet_history: [],
    theme: null,
    theme_mode: ThemeModes.ADVANCED
};

export type SettingsStateDispatch = [state: ISettings, dispatch: Dispatch<ISettingsReducerAction>]


export const SettingsContext:Context<SettingsStateDispatch> = createContext<SettingsStateDispatch>([initialState, () => {}]);


export const SettingsContextProvider:React.FC = ({children}) =>  {
    const [state, dispatch]:SettingsStateDispatch = useReducer(SettingsReducer, initialState);
    const [asyncLoaderState, setAsyncLoaderState] = useState<boolean>(false);

    useEffect(() => {
      console.log("settings effect - SettingsStorageInit");
      SettingsStorageInit(initialState)
        .then((value:ISettings) => {
          dispatch({
            type: SettingsActionType.SET,
            value: {...initialState, ...value}
          })
          setAsyncLoaderState(true);
        })
        .catch((e) => console.log(e));
    }, []);

    useEffect(() => {
      console.log("state changed", state, "asyncLoaderState: ", asyncLoaderState);
      if (asyncLoaderState) {
        SettingsStorageSave(state);
      }
    }, [state]);

    return (
        <SettingsContext.Provider value={[state, dispatch]}>
          {children}
        </SettingsContext.Provider>
      );
}