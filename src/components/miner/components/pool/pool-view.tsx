import { Card, Text } from '@ui-kitten/components';
import React from 'react';
import {View, StyleSheet, ViewProps, LayoutChangeEvent} from 'react-native';
import Sparkline from 'react-native-sparkline';
import { IMinerSummary } from '../../../core/use-miner-httpd-hook';
import { IPoolSummary } from '../../../core/use-pool-hook';
import { formatHashrate, IMOPoolStats, IXMRigStats } from '../../miner-view';

type PoolViewProps = ViewProps & {
    minerData: IMinerSummary | null;
    poolRawHashrateHistory: { history: number[]};
    poolPayoutHashrateHistory: { history: number[] };
    poolData: IPoolSummary
    fullWidth: number;

}

export const PoolView = (props: PoolViewProps):React.ReactElement<PoolViewProps> => {


    return (
        <>
            <View style={styles.row}>
                <Card style={[styles.rowCard, {flex: 1, marginRight: 10}]}>
                    <Text category='label'>Raw Hashrate</Text>
                    <Text category='h4' style={{paddingBottom: 5}}>{formatHashrate(props.poolData?.hash)[0]} <Text category='s2'>{formatHashrate(props.poolData?.hash)[1]}/s</Text></Text>
                    <Sparkline height={50} width={props.fullWidth*0.48} padding={0} data={props.poolRawHashrateHistory.history} style={{left: -25}}>
                        <Sparkline.Line color='#8641F4' strokeWidth={2} />
                        <Sparkline.Band color='rgba(134, 65, 244)' opacity={0.1} />
                    </Sparkline>
                </Card>
                <Card style={[styles.rowCard, {flex: 1}]} >
                    <Text category='label'>Pay Hashrate</Text>
                    <Text category='h4' style={{paddingBottom: 5}}>{formatHashrate(props.poolData?.hash2)[0]} <Text category='s2'>{formatHashrate(props.poolData?.hash2)[1]}/s</Text></Text>
                    <Sparkline height={50} width={props.fullWidth*0.48} padding={0} data={props.poolPayoutHashrateHistory.history} style={{left: -25}}>
                        <Sparkline.Line color='#8641F4' strokeWidth={2} />
                        <Sparkline.Band color='rgba(134, 65, 244)' opacity={0.1} />
                    </Sparkline>
                </Card>
            </View>
            <View style={styles.row}>
                <Card style={[styles.rowCard, {flex: 1, marginRight: 10}]}>
                    <Text category='label'>Shares</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1}>{props.poolData?.validShares}</Text>
                </Card>
                <Card style={[styles.rowCard, {flex: 1}]}>
                    <Text category='label'>Total Hashes</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1}>{formatHashrate(props.poolData?.totalHashes)[0]} <Text category='s2'>{formatHashrate(props.poolData?.totalHashes)[1]}</Text></Text>
                </Card>
            </View>
            <View style={styles.row}>
                <Card style={[styles.rowCard, {flex: 1, marginRight: 10}]}>
                    <Text category='label'>Total Due</Text>
                    <Text  adjustsFontSizeToFit numberOfLines={1}>{props.poolData?.amtDue}</Text>
                </Card>
                <Card style={[styles.rowCard, {flex: 1, marginRight: 10}]}>
                <Text category='label'>Paid</Text>
                    <Text  adjustsFontSizeToFit numberOfLines={1}>{props.poolData?.amtPaid}</Text>
                </Card>
                <Card style={[styles.rowCard, {flex: 1}]}>
                    <Text category='label'>TXs</Text>
                    <Text  adjustsFontSizeToFit numberOfLines={1}>{props.poolData?.txnCount}</Text>
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
    }
});