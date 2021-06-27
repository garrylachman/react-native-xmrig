import { Card, Text } from '@ui-kitten/components';
import React from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';
import { IMinerSummary } from '../../../../core/hooks';
import { formatHashrate } from '../../../../core/utils/formatters';
import { VictoryArea } from "victory-native";
import Shimmer from "react-native-shimmer";
import CyberButton from '../../../../components/core/glitch';

type PoolViewProps = ViewProps & {
    hashrateHistory: number[];
    fullWidth: number;
    minerData: IMinerSummary | null;
    workingState: string;
}

export const XMRigSimpleView = (props: PoolViewProps):React.ReactElement<PoolViewProps> => {
  
    return (
        <>           
            <View style={[styles.row, {justifyContent: 'space-between'}]}>
                <CyberButton mainColor={'#FF3D71'} labelTextStyle={{fontSize: 10}} style={{flexDirection: 'column', alignItems: 'flex-start', width: '45%'}} repeatDelay={5000} label={props.workingState} />
                <CyberButton mainColor={'#FF3D71'}  style={{flexDirection: 'column', alignItems: 'flex-end', width: '45%'}} repeatDelay={15000} glitchDuration={3000} label={props.minerData?.algo || "ALGO"} />
            </View>
            <View style={[styles.row, {justifyContent: 'space-between'}]}>
                <CyberButton mainColor={'#FF3D71'} style={{flexDirection: 'column', alignItems: 'flex-start', width: '45%'}} repeatDelay={20000} label={`${formatHashrate(props.minerData?.hashrate.total[0])[0]} ${formatHashrate(props.minerData?.hashrate.total[0])[1]}/s (10s)`} />
                <CyberButton mainColor={'#FF3D71'} style={{flexDirection: 'column', alignItems: 'flex-start', width: '45%'}} repeatDelay={20000} label={`${formatHashrate(props.minerData?.hashrate.total[1])[0]} ${formatHashrate(props.minerData?.hashrate.total[1])[1]}/s (60s)`} />
            </View>
            <View style={[styles.row, {justifyContent: 'space-between'}]}>
                <CyberButton mainColor={'#FF3D71'} style={{flexDirection: 'column', alignItems: 'flex-start', width: '45%'}} repeatDelay={20000} label={`${formatHashrate(props.minerData?.hashrate.total[2])[0]} ${formatHashrate(props.minerData?.hashrate.total[2])[1]}/s (15m)`} />
                <CyberButton mainColor={'#FF3D71'} style={{flexDirection: 'column', alignItems: 'flex-start', width: '45%'}} repeatDelay={20000} label={`${formatHashrate(props.minerData?.hashrate.highest)[0]} ${formatHashrate(props.minerData?.hashrate.highest)[1]}/s (max)`} />
            </View>
            <View style={styles.row}>
                <VictoryArea padding={0} height={100} data={props.hashrateHistory} style={{data: { fill: 'rgba(134, 65, 244)'}}} interpolation="natural" standalone={true} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: 10
    },
    rowCard: {
        borderRadius: 10
    },
    hashrateCounter: {
        flex: 1,
        paddingRight: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    hashrateBadge: {
        backgroundColor: 'rgba(134, 65, 244, 0.1)',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 5,
        fontSize: 10
    }
});