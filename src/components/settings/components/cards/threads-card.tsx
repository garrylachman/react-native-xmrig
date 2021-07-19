import React from 'react';
import { NativeModules, StyleSheet, View } from 'react-native';
import { Icon, IconProps, Text } from '@ui-kitten/components';
import { SettingsCard, SettingsCardProps } from '../settings.card';
import { SettingsActionType } from '../../../../core/settings';
import Slider from "react-native-slider";

const { XMRigModule } = NativeModules;

export const ThreadsCard:React.FC<SettingsCardProps> = ({settings, settingsDispatcher,  ...props}) => {

    const [sliderValue, setSliderValue] = React.useState<number>(settings.max_threads);
    const [deviceCores, setDeviceCores] = React.useState<number>(2);
    
    React.useEffect(() => {
        XMRigModule.availableProcessors()
            .then((cores:number) => setDeviceCores(cores))
            .catch(() => setDeviceCores(2))
    }, []);
    
    React.useEffect(() => {
        settingsDispatcher({
            type: SettingsActionType.SET_THREADS,
            value: sliderValue
        })
    }, [sliderValue]);
    
    return (
        <>
            <SettingsCard {...props} settings={settings} settingsDispatcher={settingsDispatcher} status="primary">
                <Text category="p2">Using <Text category="p1">{sliderValue}</Text> threads of available <Text category="p1">{deviceCores}</Text> cores.</Text>
                <View style={styles.sliderContainer}>
                    <Text style={styles.sliderLeftMarker} status="success">1</Text>
                        <Slider
                        style={styles.slider}
                        value={sliderValue}
                        onValueChange={setSliderValue}
                        maximumValue={deviceCores}
                        minimumValue={1}
                        step={1}
                        trackStyle={styles.sliderTrack}
                        thumbTintColor={(deviceCores/sliderValue) > 1.25 ? "green" : "red"}
                        thumbStyle={styles.sliderThumb}
                    />
                    <Text style={styles.sliderRightMarker} status="danger">{deviceCores}</Text>
                </View>
                <Text status="warning" category="label">Please restart the miner for these changes to take effect.</Text>
            </SettingsCard>
        </>
    );
}

const styles = StyleSheet.create({
    sliderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sliderLeftMarker: {
        flexDirection: 'column',
        flexShrink: 1,
        paddingRight: 10
    },
    sliderRightMarker: {
        flexDirection: 'column',
        flexShrink: 1,
        paddingLeft: 10
    },
    slider: {
        flexDirection: 'column',
        flexGrow: 1
    },
    sliderTrack: {
        height: 10
    },
    sliderThumb: {
        height: 25,
        width: 25
    }
});