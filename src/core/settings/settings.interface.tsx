import { Dispatch } from "react";
import { SettingsActionType } from "./settings.actions";

export interface ISettingsWallet {
    address: string;
    timestamp: string;
}

export interface ISettings {
    wallet: ISettingsWallet | null;
    wallet_history: ISettingsWallet[];
}

export interface ISettingsReducerAction {
    type: SettingsActionType;
    value?: ISettingsWallet | ISettings;
}

export interface ISettingsContext {
    state: ISettings;
    dispatch: Dispatch<ISettingsReducerAction>
}