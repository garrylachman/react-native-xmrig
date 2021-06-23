import React, { useState, useCallback, useMemo, useEffect, useContext } from 'react';
import { NativeModules, StyleSheet, View } from 'react-native';
import { Text, Input, Icon, IconProps, Button } from '@ui-kitten/components';
import { SettingsActionType } from '../../../../core/settings';
import { SettingsCard, SettingsCardProps } from './../settings.card';
import { EvaStatus } from '@ui-kitten/components/devsupport';
import { DialogContext, DialogType, IDialogContext } from '../../../dialogs/dialog.provider';

const { XMRigModule } = NativeModules;


const validateWalletAddress = (addr?:string):boolean => addr != null && /[48][0-9AB][1-9A-HJ-NP-Za-km-z]{93}/.test(addr);

const SaveIcon = (props:IconProps):React.ReactElement<IconProps> => (
    <Icon {...props} name='checkmark-outline'/>
);

export const WalletCard:React.FC<SettingsCardProps> = (props:SettingsCardProps) => {
    const { showDialog } = useContext<IDialogContext>(DialogContext);
    const [walletInputValue, setWalletInputValue] = useState(props.settings.wallet?.address);
    const isWalletInputValid:boolean = useMemo<boolean>(() => validateWalletAddress(walletInputValue), [walletInputValue]);
    const cardStatusColor:EvaStatus = useMemo<EvaStatus>(() => {
        if (!props.showContent) { return 'basic'; }
        if (isWalletInputValid) { return 'success'; }
        return 'danger';
    }, [isWalletInputValid, props.showContent]);
    
    useEffect(() => {
        //setWalletInputValue(props.settings.wallet?.address);
    }, [props.settings.wallet]);

    const RenderCaption = useCallback(():React.ReactElement => (
        <View style={styles.captionContainer}>
            {!isWalletInputValid &&
                <Text status='danger' category='c1'>Error: XMR address is not valid</Text>
            }
            {isWalletInputValid &&
                <Text status='success' category='c1'>Valid XMR address</Text>
            }
        </View>
    ), [isWalletInputValid]);

    const handleDialog = useCallback((value: boolean, wallet:string) => {
        if (value) {
            console.log("walletInputValue", wallet)
            props.settingsDispatcher({
                type: SettingsActionType.SET_WALLET,
                value: {
                    address: `${wallet}`,
                    timestamp: new Date().toLocaleString()
                }
            })
            XMRigModule.UpdateLastWalletAddress(wallet);
        }
    }, []);

    return useMemo(() => (
        <>
            <SettingsCard {...props} status={cardStatusColor}>
                <Input
                    style={styles.input}
                    value={walletInputValue}
                    label="XMR Address"
                    placeholder="46gPyHjLPPM8HaayVyvCDcF2A8sq8b476VrwKMukrKg21obm1AKEwzoN3u4ooc55FKdNeF5B8vcs4ixbeCyuydr2A2sdsQi"
                    caption={RenderCaption}
                    onChangeText={value => setWalletInputValue(value)}
                    status={isWalletInputValid ? 'success' : 'danger' }
                />
                <Button 
                    style={styles.button} 
                    status='primary' 
                    size='small' 
                    accessoryLeft={SaveIcon} 
                    disabled={!isWalletInputValid}
                    onPress={() => {
                        console.log("before show", walletInputValue)
                        showDialog({
                            type: DialogType.CONFIRM,
                            title: 'Is Address Correct?',
                            message: `${walletInputValue}`,
                            status: 'warning',
                            onClick: (value: boolean) => handleDialog(value, `${walletInputValue}`)
                        })
                    }}
                >Save</Button>
            </SettingsCard>
        </>
    ), [props.settings, props.showContent, walletInputValue]);
}

const styles = StyleSheet.create({
    input: {
        overflow: 'hidden'
    },
    captionContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5
    },
    button: {
        margin: 2
    }
});