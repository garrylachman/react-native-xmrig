import { Dispatch } from "react";
import { SettingsActionType } from "./settings.actions";

export enum ThemeModes {
    ADVANCED = "Advanced",
    SIMPLE_YOUNG = "Simple Young"
}

export interface ISettingsWallet {
    address: string;
    timestamp: string;
}

export interface ISettings {
    wallet: ISettingsWallet | null;
    wallet_history: ISettingsWallet[];
    theme: string | null,
    theme_mode: ThemeModes
}

export interface ISettingsReducerAction {
    type: SettingsActionType;
    value?: ISettingsWallet | ISettings | string;
}

export interface ISettingsContext {
    state: ISettings;
    dispatch: Dispatch<ISettingsReducerAction>
}

export type ThemeType = "dark" | "light";