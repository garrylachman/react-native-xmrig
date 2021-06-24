import React, { useCallback, useMemo, useContext } from 'react';
import { NativeModules, StyleSheet } from 'react-native';
import { Text, Button, ListItem, ListItemProps, List, Divider } from '@ui-kitten/components';
import {  SettingsActionType, ISettingsWallet } from '../../../../core/settings';
import { SettingsCard, SettingsCardProps } from './../settings.card';
import { DialogContext, DialogType, IDialogContext } from '../../../dialogs/dialog.provider';

const { XMRigModule } = NativeModules;


type UseButtonProps = ListItemProps & {
    wallet: string
};

export const HistoryCard:React.FC<SettingsCardProps> = (props:SettingsCardProps) => {
    const { showDialog } = useContext<IDialogContext>(DialogContext);
  
    const handleDialog = useCallback((value: boolean, wallet: string) => {
        if (value) {
            props.settingsDispatcher({
                type: SettingsActionType.SET_WALLET,
                value: {
                    address: wallet,
                    timestamp: new Date().toLocaleString()
                }
            })
        }
    }, []);

    const renderItemAccessory = (renderItemProps:UseButtonProps):React.ReactElement<UseButtonProps> => useMemo( () => (
        <Button 
            disabled={props.settings.wallet?.address==renderItemProps.wallet} 
            size='tiny' 
            appearance='outline' 
            onPress={() => {
                showDialog({
                    type: DialogType.CONFIRM,
                    title: 'Change Wallet Address?',
                    message: `${renderItemProps.wallet}`,
                    status: 'warning',
                    onClick: (value:boolean) => handleDialog(value, renderItemProps.wallet)
                })
            }}
            >USE</Button>
    ), [props.settings.wallet]);
        
    const renderItem = useCallback(({ item, index }:{item: ISettingsWallet, index: number}):React.ReactElement => (
        <ListItem
            style={styles.listItem}
            title={evaProps => <Text {...evaProps} style={{marginLeft: 0}} category='c2'>{item.timestamp}</Text>}
            description={evaProps => <Text {...evaProps} style={{marginLeft: 0, marginRight: 10}} category='c2' appearance='hint'>{item.address}</Text>}
            accessoryRight={accessoryRightProps => renderItemAccessory({...accessoryRightProps, wallet: item.address})}
        />
    ), [props.settings]);

    const HistoryList = useCallback( ():React.ReactElement => (
        <List
            data={props.settings.wallet_history}
            renderItem={renderItem}
            ItemSeparatorComponent={Divider}
        />
    ), [props.settings]);

    return useMemo(() => (
        <>
            <SettingsCard {...props} style={styles.card} status='primary'>
                <Text appearance='hint'>Your wallets history, you can change your current wallet by clicking "use".</Text>
                <HistoryList />
                
            </SettingsCard>
        </>
    ), [props.settings]);
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        marginBottom: 0,
    },
    listItem: {
        marginLeft:0, 
        paddingLeft: 0, 
        marginRight:0, 
        paddingRight: 0
    }
});