import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Layout } from '@ui-kitten/components';
import { SettingsContext, SettingsStateDispatch } from '../../../core/settings';
import { HistoryCard, WalletCard } from '../components';

export type WalletScreenProps = {
    showWalletCardContent?:boolean
}

const WalletScreen:React.FC<WalletScreenProps> = ({
    showWalletCardContent = true
}) => {

    const [settings, settingsDispatcher]:SettingsStateDispatch = React.useContext(SettingsContext);
    const [showWalletCardContentState, setShowWalletCardContentState] = React.useState<boolean>(showWalletCardContent);

    return (
        <Layout style={styles.layout} level='2'>
            <View style={styles.cards}>
                <WalletCard 
                    showContent={showWalletCardContentState} 
                    title="Wallet"
                    icon="credit-card"
                    settings={settings} 
                    settingsDispatcher={settingsDispatcher}
                    onPressIn={() => setShowWalletCardContentState(true)}
                />
                <Divider style={{marginVertical: 10}} />
                <HistoryCard 
                    showContent={true} 
                    title="History" 
                    icon="hard-drive"
                    settings={settings} 
                    settingsDispatcher={settingsDispatcher}
                    onPressIn={() => setShowWalletCardContentState(false)}
                />
            </View>
        </Layout>
    )
}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
        padding: 15
    },
    cards: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    }
});

export default WalletScreen;