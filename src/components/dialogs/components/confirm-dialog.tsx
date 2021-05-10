import React, { FunctionComponent, useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Icon, Button, ButtonProps, IconProps } from '@ui-kitten/components';
import { Dialog } from '../dialog';
import { EvaStatus } from '@ui-kitten/components/devsupport';

export type ConfigDialogProps = {
    title: string;
    text: string;
    status: EvaStatus;
    onClick: (value:boolean) => void;
};


const OkIcon = (props:IconProps):React.ReactElement => (
    <Icon {...props} name='checkmark-outline'/>
);

const CancelIcon = (props:IconProps):React.ReactElement => (
    <Icon {...props} name='close-outline'/>
);

export const ConfirmDialogButton: React.FC<ButtonProps> = (props) => (
    <Button {...props}>{props.children}</Button>
);

export const ConfirmDialog: React.FC<ConfigDialogProps> = (props) => {

    const Buttons:React.ReactElement = useMemo(() => (
        <>
            <ConfirmDialogButton accessoryLeft={OkIcon} style={styles.buttton} onPress={() => props.onClick(true)}>OK</ConfirmDialogButton>
            <ConfirmDialogButton accessoryLeft={CancelIcon} style={styles.buttton} status='basic' onPress={() => props.onClick(false)}>CANCEL</ConfirmDialogButton>
        </>
    ), []);

    return useMemo( () => (
        <Dialog 
            buttons={Buttons}
            title={props.title}
            status={props.status}
            text={props.text}
            onBackdropPress={() => props.onClick(false)}
        />
    ), [props]);
};

const styles = StyleSheet.create({
    buttton: {
        marginHorizontal: 10
    }
});
  