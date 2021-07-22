import { Dispatch } from "react";
import { SettingsActionType } from "./settings.actions";

export enum ThemeModes {
    ADVANCED = "Advanced",
    SIMPLE_YOUNG = "Simple Young"
}

export enum Themes {
    LIGHT = "light",
    DARK = "dark"
}

export interface ISettingsWallet {
    address: string;
    timestamp: string;
}


export interface ISettings {
    wallet: ISettingsWallet | null;
    wallet_history: ISettingsWallet[];
    theme: Themes;
    theme_mode: ThemeModes;
    max_threads: number;
}

export interface ISettingsReducerAction {
    type: SettingsActionType;
    value?: ISettingsWallet | ISettings | string | number;
}

export interface ISettingsContext {
    state: ISettings;
    dispatch: Dispatch<ISettingsReducerAction>
}

export type ThemeType = Themes.LIGHT | Themes.DARK;