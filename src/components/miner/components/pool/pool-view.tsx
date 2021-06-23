import { Card, Text } from '@ui-kitten/components';
import React from 'react';
import {View, StyleSheet, ViewProps, LayoutChangeEvent} from 'react-native';
import { IMinerSummary } from '../../../../core/hooks/use-miner-httpd.hook';
import { IPoolSummary } from '../../../../core/hooks/use-pool.hook';
import { formatHashrate } from '../../../../core/utils/formatters';
import { VictoryArea } from "victory-native";

type PoolViewProps = ViewProps & {
    minerData: IMinerSummary | null;
    poolRawHashrateHistory: number[];
    poolPayoutHashrateHistory: number[];
    poolData: IPoolSummary | null
    fullWidth: number;

}

export const PoolView = (props: PoolViewProps):React.ReactElement<PoolViewProps> => {


    return (
        <>
            <View style={styles.row}>
                <Card style={[styles.rowCard, {flex: 1, marginRight: 10}]}>
                    <Text category='label'>Raw Hashrate</Text>
                    <Text category='h4' style={{paddingBottom: 5}}>{formatHashrate(props.poolData?.hash)[0]} <Text category='s2'>{formatHashrate(props.poolData?.hash)[1]}/s</Text></Text>
                    <View style={{left: -25, bottom: -20}}>
                        <VictoryArea width={props.fullWidth*0.48}  padding={0} height={70} data={props.poolRawHashrateHistory} style={{data: { fill: 'rgba(134, 65, 244)'}}} interpolation="natural" standalone={true} />
                    </View>
                </Card>
                <Card style={[styles.rowCard, {flex: 1}]} >
                    <Text category='label'>Pay Hashrate</Text>
                    <Text category='h4' style={{paddingBottom: 5}}>{formatHashrate(props.poolData?.hash2)[0]} <Text category='s2'>{formatHashrate(props.poolData?.hash2)[1]}/s</Text></Text>
                    <View style={{left: -25, bottom: -20}}>
                        <VictoryArea width={props.fullWidth*0.48}  padding={0} height={70} data={props.poolPayoutHashrateHistory} style={{data: { fill: 'rgba(134, 65, 244)'}}} interpolation="natural" standalone={true} />
                    </View>
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