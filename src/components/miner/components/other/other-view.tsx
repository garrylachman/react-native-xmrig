import { Card, Text } from '@ui-kitten/components';
import React from 'react';
import {View, StyleSheet, ViewProps } from 'react-native';
import { IMinerSummary } from '../../../../core/hooks';

type OtherViewProps = ViewProps & {
    minerData: IMinerSummary | null;
}

export const OtherView = (props: OtherViewProps):React.ReactElement<OtherViewProps> => {
   
    return (
        <>
            <View style={styles.row}>
                <Card style={[styles.rowCard, {flex: 3, marginRight: 10}]}>
                    <Text category='label' >CPU</Text>
                    <Text >{props.minerData?.cpu.brand}</Text>
                </Card>
                <Card style={[styles.rowCard, {flex: 2}]}>
                    <Text category='label'>Arch</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1}>{props.minerData?.cpu.arch}</Text>
                </Card>
            </View>
            
            <View style={styles.row}>
                <Card style={[styles.rowCard, {flex: 1, marginRight: 10}]}>
                    <Text category='label' >AES</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1}>{props.minerData?.cpu.aes ? 'True' : 'False'}</Text>
                </Card>
                <Card style={[styles.rowCard, {flex: 1}]}>
                    <Text category='label'>AVX2</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1}>{props.minerData?.cpu.avx2 ? 'True' : 'False'}</Text>
                </Card>
            </View>

            <View style={styles.row}>
                <Card style={[styles.rowCard, {flex: 1, marginRight: 10}]}>
                    <Text category='label' >64 Bit</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1}>{props.minerData?.cpu['64_bit'] ? 'True' : 'False'}</Text>
                </Card>
                <Card style={[styles.rowCard, {flex: 1}]}>
                    <Text category='label'>MSR</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1}>{props.minerData?.cpu.msr}</Text>
                </Card>
            </View>

            <View style={styles.row}>
                <Card style={[styles.rowCard, {flex: 1, marginRight: 10}]}>
                    <Text category='label' >Backend</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1}>{props.minerData?.cpu.backend}</Text>
                </Card>
                <Card style={[styles.rowCard, {flex: 1}]}>
                    <Text category='label'>Assembly</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1}>{props.minerData?.cpu.assembly}</Text>
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
});