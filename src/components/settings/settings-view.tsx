import React, { useState, useContext, useCallback, useMemo, useEffect } from 'react';
import {  StyleSheet, ViewProps, View, Keyboard } from 'react-native';
import { Layout, Text, Icon, IconProps, Button, Modal, Divider } from '@ui-kitten/components';
import { SettingsContext, SettingsStateDispatch } from '../../core/settings';
import { WalletCard, HistoryCard } from './components'


export const SettingsView:React.FC<ViewProps> = () => {

    const [settings, settingsDispatcher]:SettingsStateDispatch = useContext(SettingsContext);
    const [showWalletCardContent, setShowWalletCardContent] = useState<boolean>(true);

    return useMemo( () => (
        <Layout style={styles.layout} level='2'>
            <View style={styles.cards}>
                <WalletCard 
                    showContent={showWalletCardContent} 
                    title="Wallet"
                    icon="credit-card"
                    settings={settings} 
                    settingsDispatcher={settingsDispatcher}
                    onPressIn={() => setShowWalletCardContent(true)}
                />
                <Divider style={{marginVertical: 10}} />
                <HistoryCard 
                    showContent={true} 
                    title="History" 
                    icon="hard-drive"
                    settings={settings} 
                    settingsDispatcher={settingsDispatcher}
                    onPressIn={() => setShowWalletCardContent(false)}
                />
            </View>
        </Layout>
    ), [settings, showWalletCardContent])
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