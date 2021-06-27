import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Layout } from '@ui-kitten/components';
import { SettingsContext, SettingsStateDispatch } from '../../../core/settings';
import { ThemeCard, ThemeModeCard } from '../components';

const AppearanceScreen = () => {

    const [settings, settingsDispatcher]:SettingsStateDispatch = React.useContext(SettingsContext);

    return (
        <Layout style={styles.layout} level='2'>
            <View style={styles.cards}>
                <ThemeCard 
                    title="Theme"
                    icon="brush"
                    settings={settings} 
                    settingsDispatcher={settingsDispatcher}
                />
                <Divider style={{marginVertical: 10}} />
                <ThemeModeCard 
                    title="Theme Mode"
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

export default AppearanceScreen;