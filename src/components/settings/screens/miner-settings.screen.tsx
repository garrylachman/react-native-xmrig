import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Layout } from '@ui-kitten/components';
import { SettingsContext, SettingsStateDispatch } from '../../../core/settings';
import { ThreadsCard } from '../components';

const MinerSettingsScreen = () => {

    const [settings, settingsDispatcher]:SettingsStateDispatch = React.useContext(SettingsContext);

    return (
        <Layout style={styles.layout} level='2'>
            <View style={styles.cards}>
                <ThreadsCard 
                    title="Threads"
                    icon="flash"
                    settings={settings} 
                    settingsDispatcher={settingsDispatcher}
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
        justifyContent: 'flex-start',
    }
});

export default MinerSettingsScreen;