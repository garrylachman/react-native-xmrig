import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Button, ListItem, ListItemProps, List, Divider } from '@ui-kitten/components';
import { SettingsActionType, ISettingsWallet } from '../../../../core/settings';
import { SettingsCard, SettingsCardProps } from './../settings.card';
import { DialogContext, DialogType, IDialogContext } from '../../../dialogs/dialog.provider';

type UseButtonProps = ListItemProps & {
    wallet: string
};

export const HistoryCard:React.FC<SettingsCardProps> = (
    {
        settings,
        settingsDispatcher,
        title,
        showContent,
        icon
    }
) => {
    const { showDialog } = React.useContext<IDialogContext>(DialogContext);
  
    const handleDialog = React.useCallback((value: boolean, wallet: string) => {
        if (value) {
            settingsDispatcher({
                type: SettingsActionType.SET_WALLET,
                value: {
                    address: wallet,
                    timestamp: new Date().toLocaleString()
                }
            })
        }
    }, []);

    const renderItemAccessory = (renderItemProps:UseButtonProps):React.ReactElement<UseButtonProps> => React.useMemo( () => (
        <Button 
            disabled={settings.wallet?.address==renderItemProps.wallet} 
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
    ), [settings.wallet]);
        
    const renderItem = React.useCallback(({ item, index }:{item: ISettingsWallet, index: number}):React.ReactElement => (
        <ListItem
            style={styles.listItem}
            title={evaProps => <Text {...evaProps} style={{marginLeft: 0}} category='c2'>{item.timestamp}</Text>}
            description={evaProps => <Text {...evaProps} style={{marginLeft: 0, marginRight: 10}} category='c2' appearance='hint'>{item.address}</Text>}
            accessoryRight={accessoryRightProps => renderItemAccessory({...accessoryRightProps, wallet: item.address})}
        />
    ), [settings]);

    const HistoryList = React.useCallback( ():React.ReactElement => (
        <List
            data={settings.wallet_history}
            renderItem={renderItem}
            ItemSeparatorComponent={Divider}
        />
    ), [settings]);

    return React.useMemo(() => (
        <>
            <SettingsCard {...{settings, settingsDispatcher, title, showContent, icon}} style={styles.card} status='primary'>
                <Text appearance='hint'>Your wallets history, you can change your current wallet by clicking "use".</Text>
                <HistoryList />
                
            </SettingsCard>
        </>
    ), [settings]);
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