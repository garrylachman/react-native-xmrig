import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider, Layout, Text } from '@ui-kitten/components';
import { SettingsContext, SettingsStateDispatch } from '../../../core/settings';
import { ThemeCard, ThemeModeCard } from '../components';
import { rewardCheckpoints } from '../../../core/utils';

import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Circle } from 'react-native-svg';

const RewardsScreen = () => {

    const [settings, settingsDispatcher]:SettingsStateDispatch = React.useContext(SettingsContext);
    const [width, setWidth] = React.useState<number>(0);

    return (
        <Layout style={styles.layout} level='2'>
            <ScrollView>
                <View style={styles.cards}>
                    <Text category="h6">Unlock Dev Fee Rewards</Text>
                    <Text category="p2">Each checkpoint will lower the dev fee by 1%. You don't have to do anything, just mine.</Text>
                </View>
                <View style={{flexDirection: 'row', flexWrap: "wrap", justifyContent: "space-between", paddingTop: 10}} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
                    {rewardCheckpoints.sort((a, b) => a > b ? 0 : -1).map((value, index) => (
                        <Card status={settings.total_mining >= value ? "success" : "basic"} appearance="outline" key={`key-${index}`} style={{width: "48%", flexDirection: 'column', marginVertical: 7, borderRadius: 10, padding: 0}}>
                            <Text category="s1" style={{textAlign: 'center'}}>{20-(index+1)}% fee</Text>
                            <AnimatedCircularProgress
                                size={(width*0.48)-50}
                                width={25}
                                fill={Math.min((settings.total_mining/value)*100, 100)}
                                tintColor="#00e0ff"
                                backgroundColor="#3d5875"
                                arcSweepAngle={180}
                                lineCap="round"
                                style={{height: 100, top: -25}}
                            >
                                {
                                (fill) => (
                                    <Text category="label">
                                        <>
                                            {fill >= 100 && "Completed"}
                                            {fill < 100 && fill.toFixed(1) + "%" }
                                        </>
                                    </Text>
                                )
                            }
                            </AnimatedCircularProgress>
                        </Card>
                    ))}
                </View>
            </ScrollView>
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

export default RewardsScreen;