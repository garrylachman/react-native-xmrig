import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Layout } from '@ui-kitten/components';
import { SettingsContext } from '../../../core/settings';
import { ThemeCard, ThreadsCard } from '../components';

const MinerSettingsScreen = () => {

    const {settings, settingsDispatcher} = React.useContext(SettingsContext);

    return (
        <Layout style={styles.layout} level='2'>
            <View style={styles.cards}>
                <ThreadsCard 
                    title="Threads"
                    icon="flash"
                    settings={settings} 
                    settingsDispatcher={settingsDispatcher}
                />
                <Divider style={{marginVertical: 10}} />
                <ThemeCard 
                    title="Theme"
                    icon="brush"
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