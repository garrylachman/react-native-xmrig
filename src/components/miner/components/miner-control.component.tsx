import { Button, Divider, Icon, IconProps, Layout, LayoutProps } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { SessionDataContext } from '../../../core/session-data/session-data.context';
import { StartMode } from '../../../core/session-data/session-data.interface';
import { SettingsContext, ThemeModes } from '../../../core/settings';
import Shimmer from 'react-native-shimmer';

type MinerControlProps = {
    isStartButtonDisabled: boolean;
    handleStart: () => {};
    handleStop: () => {};
    handleBench: () => {};
}

const StartIcon = (props:IconProps) => (
    <Icon {...props} style={[props.style, styles.buttonIcon]} name='play-circle'/>
  );

const StopIcon = (props:IconProps) => (
    <Icon {...props} style={[props.style, styles.buttonIcon]} name='stop-circle'/>
);

const AdvancedMode:React.FC<MinerControlProps> = (
    {isStartButtonDisabled, handleStart, handleStop, handleBench, ...props}
) => (
    <>
        <Button style={styles.button} disabled={isStartButtonDisabled} onPress={handleStart}>Start</Button>
        <Button status={'warning'} style={styles.button} disabled={isStartButtonDisabled} onPress={handleStop}>Re-Benchmark</Button>
        <Button status={'danger'} style={styles.button} disabled={!isStartButtonDisabled} onPress={handleBench}>Stop</Button>
    </>
)

const SimpleYoungdMode:React.FC<MinerControlProps> = (
    {isStartButtonDisabled, handleStart, handleStop, ...props}
) => (
    <>
        <Shimmer direction="right" pauseDuration={2500} intensity={0.2} opacity={0.8} tilt={45} animating={false}>
            <Button status="success" style={[styles.buttonSimpleYoung, {right:-10}]} accessoryLeft={StartIcon} onPress={handleStart} size="giant"></Button>
        </Shimmer>
        <Button status="danger"  accessoryLeft={StopIcon} style={[styles.buttonSimpleYoung, {left:-10}]}  onPress={handleStop} size="giant"></Button>
    </>
)

const MinerControlFactory:React.FC<MinerControlProps> = (props) => {
    const [settings] = React.useContext(SettingsContext);

    if (settings.theme_mode == ThemeModes.SIMPLE_YOUNG) {
        return (<View style={styles.containerSimpleYoung}><SimpleYoungdMode {...props} /></View>)
    }
    return (<View style={styles.containerAdvanced}><AdvancedMode {...props} /></View>)
}

export const MinerControl:React.FC<ViewProps> = () => {

    const { working, setWorking } = React.useContext(SessionDataContext);

    const handleStart = React.useCallback(() => setWorking(StartMode.START), []);
    const handleStop = React.useCallback(() => setWorking(StartMode.STOP), []);
    const handleBench = React.useCallback(() => setWorking(StartMode.REBANCH), []);
    const isStartButtonDisabled = React.useMemo(() => working != StartMode.STOP, [working]);

    return (
        <Layout style={styles.container} level="2">
            <MinerControlFactory
                isStartButtonDisabled={isStartButtonDisabled}
                handleStart={handleStart}
                handleBench={handleBench}
                handleStop={handleStop}
            />
        </Layout>   
    )
}

const styles = StyleSheet.create({
    container: {
        
    },
    containerAdvanced: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    containerSimpleYoung: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 15,
        top: -30
    },
    button: {
        flexGrow: 0.25
    },
    buttonSimpleYoung: {
        flexGrow: 0.25,
        borderRadius: 100,
        width: 100,
        minWidth: 100,
        maxWidth: 100,
        height: 100,
        minHeight: 100, 
        maxHeight: 100
    },
    buttonIcon: {
        width: 38,
        height: 38
    }
});