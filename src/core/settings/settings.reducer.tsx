import { Reducer } from 'react';
import { SettingsActionType } from './settings.actions';
import { ISettings, ISettingsReducerAction, ISettingsWallet, ThemeModes, ThemeType } from './settings.interface';

export const SettingsReducer:Reducer<ISettings, ISettingsReducerAction> = (prevState: ISettings, action: ISettingsReducerAction) => {
    console.log("reducer", action);
    switch (action.type) {
        case SettingsActionType.SET:
            return {
                ...action.value as ISettings
            } as ISettings;
        case SettingsActionType.SET_WALLET:
            return {
                wallet: action.value as ISettingsWallet,
                wallet_history: [action.value, ...prevState.wallet_history] as ISettingsWallet[]
            } as ISettings;
        case SettingsActionType.SET_THEME:
            return {
                ...prevState,
                theme: action.value as ThemeType
            } as ISettings;
        case SettingsActionType.SET_THEME_MODE:
            return {
                ...prevState,
                theme_mode: action.value as ThemeModes
            } as ISettings;
        case SettingsActionType.SET_THREADS:
            console.log("set thread to ", action.value)
            return {
                ...prevState,
                max_threads: action.value as number
            } as ISettings;
        case SettingsActionType.RESET_HISTORY:
            return {
                ...prevState,
                wallet_history: []
            } as ISettings;
        case SettingsActionType.ADD_MINING_MIN:
            return {
                ...prevState,
                total_mining: prevState.total_mining + (action.value as number)
            }
        case SettingsActionType.SET_DEV_FEE:
            return {
                ...prevState,
                dev_fee: action.value as number
            }
    }
    return prevState;
};