import React from 'react';
import { ViewProps, StyleSheet, View } from 'react-native';
import { Text, Input, Icon, IconProps, Button } from '@ui-kitten/components';
import { SettingsActionType } from '../../../../core/settings';
import { SettingsCard, SettingsCardProps } from './../settings.card';
import { EvaStatus } from '@ui-kitten/components/devsupport';
import { DialogContext, DialogType, IDialogContext } from '../../../dialogs/dialog.provider';
import { validateWalletAddress } from '../../../../core/utils';

const SaveIcon = (props:IconProps):React.ReactElement<IconProps> => (
    <Icon {...props} name='checkmark-outline'/>
);

export const WalletCard:React.FC<ViewProps & SettingsCardProps> = (
    {
        settings,
        settingsDispatcher,
        title,
        showContent,
        icon,
        onPressIn
    }
) => {
    const { showDialog } = React.useContext<IDialogContext>(DialogContext);
    const [walletInputValue, setWalletInputValue] = React.useState(settings.wallet?.address);
    const isWalletInputValid:boolean = React.useMemo<boolean>(() => validateWalletAddress(walletInputValue), [walletInputValue]);
    const cardStatusColor:EvaStatus = React.useMemo<EvaStatus>(() => {
        if (!showContent) { return 'basic'; }
        if (isWalletInputValid) { return 'success'; }
        return 'danger';
    }, [isWalletInputValid, showContent]);
    
    React.useEffect(() => {
        setWalletInputValue(settings.wallet?.address);
    }, [settings.wallet]);

    const RenderCaption = React.useCallback(():React.ReactElement => (
        <View style={styles.captionContainer}>
            {!isWalletInputValid &&
                <Text status='danger' category='c1'>Error: XMR address is not valid</Text>
            }
            {isWalletInputValid &&
                <Text status='success' category='c1'>Valid XMR address</Text>
            }
        </View>
    ), [isWalletInputValid]);

    const handleDialog = React.useCallback((value: boolean, wallet:string) => {
        if (value) {
            settingsDispatcher({
                type: SettingsActionType.SET_WALLET,
                value: {
                    address: `${wallet}`,
                    timestamp: new Date().toLocaleString()
                }
            })
        }
    }, []);

    return React.useMemo(() => (
        <>
            <SettingsCard {...{settings, settingsDispatcher, title, showContent, icon, onPressIn}} status={cardStatusColor}>
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
    ), [settings, showContent, walletInputValue]);
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