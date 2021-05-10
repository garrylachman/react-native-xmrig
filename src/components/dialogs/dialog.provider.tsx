import { EvaStatus } from "@ui-kitten/components/devsupport";
import React, { createContext, Context, useState, useCallback } from "react";
import { Keyboard } from "react-native";
import { ConfigDialogProps, ConfirmDialog } from "./components/confirm-dialog";

export enum DialogType {
    CONFIRM
};

export interface IDialogOptions {
    type: DialogType
    message: string
    title: string
    status: EvaStatus
    onClick: (value:boolean) => void
};

export interface IDialogContext {
    showDialog: (options: IDialogOptions) => void
};

type DialogProps = ConfigDialogProps | null;
type ConfigDialogClickParams = Parameters<ConfigDialogProps["onClick"]>
type HandleClickPayloadParams = ConfigDialogClickParams | []

export const DialogContext:Context<IDialogContext> = createContext<IDialogContext>({
    showDialog: (options: IDialogOptions) => null
});


export const DialogContextProvider:React.FC = ({children}) =>  {
    const [dialog, setDialog] = useState<IDialogOptions | null>(null);

    const showDialog = useCallback((options: IDialogOptions) => {
        Keyboard.dismiss();
        setDialog({
            ...options   
        })
    }, [setDialog]);

    const handleClick = useCallback((target:CallableFunction, payload:HandleClickPayloadParams) => {
        target(...payload);
        setDialog(null);
    }, []);

    const DialogFactory = (options: IDialogOptions):React.ReactElement<DialogProps> => {
        if (options.type == DialogType.CONFIRM) {
            return (
                <ConfirmDialog
                    title={options.title}
                    text={options.message}
                    status={options.status}
                    onClick={(...args) => handleClick(options.onClick, args)}
                />
            );
        }
        return (<></>);
    };

    return (
        <DialogContext.Provider value={{showDialog}}>
            {dialog && <DialogFactory {...dialog} />}
            {children}
        </DialogContext.Provider>
    );
}