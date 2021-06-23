import { Button, Divider } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { SessionDataContext } from '../../../core/session-data/session-data.context';
import { StartMode } from '../../../core/session-data/session-data.interface';


export const MinerControl:React.FC<ViewProps> = () => {

    const { working, setWorking } = React.useContext(SessionDataContext);

    const handleStart = React.useCallback(() => setWorking(StartMode.START), []);
    const handleStop = React.useCallback(() => setWorking(StartMode.START), []);
    const handleBench = React.useCallback(() => setWorking(StartMode.START), []);
    const isStartButtonDisabled = React.useMemo(() => working != StartMode.STOP, [working]);

    return (
        <View style={styles.container}>
            <Button style={styles.button} disabled={isStartButtonDisabled} onPress={handleStart}>Start</Button>
            <Button status={'warning'} style={styles.button} disabled={isStartButtonDisabled} onPress={handleStop}>Re-Benchmark</Button>
            <Button status={'danger'} style={styles.button} disabled={!isStartButtonDisabled} onPress={handleBench}>Stop</Button>
        </View>   
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        marginHorizontal: 15
    },
    button: {
        flexGrow: 0.25
    }
});