import { Card, Text } from '@ui-kitten/components';
import React from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';
import { IMinerSummary } from '../../../../core/hooks';
import { formatHashrate } from '../../../../core/utils/formatters';
import { VictoryArea } from "victory-native";


type PoolViewProps = ViewProps & {
    hashrateHistory: number[];
    fullWidth: number;
    minerData: IMinerSummary | null;
    workingState: string;
}

export const XMRigView = (props: PoolViewProps):React.ReactElement<PoolViewProps> => {
  
    const RenderHashrateChartVictory = () => (
        <View style={{left: -25, bottom: -20}}>
          <VictoryArea  width={props.fullWidth}  padding={0} height={70} data={props.hashrateHistory} style={{data: { fill: 'rgba(134, 65, 244)'}}} interpolation="natural" standalone={true} />
        </View>
    )


    return (
        <>
            <View style={styles.row}>
                <Card style={[styles.rowCard, {flex: 3, marginRight: 10}]}>
                    <Text category='label'>Mode</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1}>{props.workingState}</Text>
                </Card>
                <Card style={[styles.rowCard, {flex: 2}]}>
                    <Text category='label'>Algo</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1}>{props.minerData?.algo}</Text>
                </Card>
            </View>
            <View style={styles.row}>
                <Card style={[styles.rowCard, {flex:1}]} >
                    <Text category='label'>Hashrate</Text>
                    <View style={[styles.row, {paddingBottom: 5}]}>
                        <View style={[styles.rowCard, styles.hashrateCounter]}>
                            <Text category='h6' adjustsFontSizeToFit numberOfLines={1}>{formatHashrate(props.minerData?.hashrate.total[0])[0]}</Text>
                            <Text style={styles.hashrateBadge}>{formatHashrate(props.minerData?.hashrate.total[0])[1]}/s (10s)</Text>
                        </View>
                        <View  style={[styles.rowCard, styles.hashrateCounter]}>
                            <Text category='h6' adjustsFontSizeToFit numberOfLines={1}>{formatHashrate(props.minerData?.hashrate.total[1])[0]}</Text>
                            <Text style={styles.hashrateBadge}>{formatHashrate(props.minerData?.hashrate.total[1])[1]}/s (60s)</Text>
                        </View>
                        <View  style={[styles.rowCard, styles.hashrateCounter]}>
                            <Text category='h6' adjustsFontSizeToFit numberOfLines={1}>{formatHashrate(props.minerData?.hashrate.total[2])[0]}</Text>
                            <Text style={styles.hashrateBadge}>{formatHashrate(props.minerData?.hashrate.total[1])[1]}/s (15m)</Text>
                        </View>
                        <View  style={[styles.rowCard, styles.hashrateCounter, {paddingRight: 0}]}>
                            <Text category='h6' adjustsFontSizeToFit numberOfLines={1}>{formatHashrate(props.minerData?.hashrate.highest)[0]}</Text>
                            <Text style={styles.hashrateBadge}>{formatHashrate(props.minerData?.hashrate.highest)[1]}/s (max)</Text>
                        </View>
                    </View>
                    <RenderHashrateChartVictory />
                </Card>
            </View>
            <View style={styles.row}>
                <Card style={[styles.rowCard, {flex: 1, marginRight: 10}]}>
                    <Text category='label'>Accepted</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1}>{props.minerData?.results.shares_good}</Text>
                </Card>
                <Card style={[styles.rowCard, {flex: 1, marginRight: 10}]}>
                    <Text category='label'>Difficult</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1}>{props.minerData?.results.diff_current}</Text>
                </Card>
                <Card style={[styles.rowCard, {flex: 1}]}>
                    <Text category='label'>Avg Time</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1}>{props.minerData?.results.avg_time}</Text>
                </Card>
            </View>
            <View style={[styles.row, {marginBottom: 0}]}>
                <Card style={[styles.rowCard, {flex: 8, marginRight: 10}]}>
                    <Text category='label'>Threads</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1}>{props.minerData?.cpu.threads}</Text>
                </Card>
                <Card style={[styles.rowCard, {flex: 9, marginRight: 10}]}>
                    <Text category='label'>Free Mem</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1}>{props.minerData?.resources.memory.free}</Text>
                </Card>
                <Card style={[styles.rowCard, {flex: 9}]}>
                    <Text category='label'>Res. Mem</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1}>{props.minerData?.resources.memory.resident_set_memory}</Text>
                </Card>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginBottom: 10
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