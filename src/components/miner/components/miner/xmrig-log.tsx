import { Card, Text } from '@ui-kitten/components';
import React from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';
import { IMinerLog } from '../../miner-view';

type LogViewProps = ViewProps & {
    data: IMinerLog[]
}

export const XMRigLogView = (props: LogViewProps):React.ReactElement<LogViewProps> => {
    return (
        <>
            <View style={styles.row}>
                <Card style={[styles.rowCard, {flex: 1}]}>
                    {props.data.map((value, index) => (
                        <View key={`key-${index}`} style={{flexDirection: 'row', alignItems: 'flex-start', left: -10}}>
                            {value.ts && <Text category='c2' style={styles.ts}>{value.ts}</Text>}
                            {value.module && <Text category='c2' style={styles.module}>{value.module}</Text>}
                            <Text category='c2' style={styles.message}>{value.message}</Text>
                        </View>
                    ))}
                </Card>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    ts: {
        backgroundColor: 'rgba(134, 65, 244, 0.1)',
        marginRight: 5,
        borderRadius: 5,
    },
    module: {
        marginRight: 5,
        fontWeight: "bold"
    },
    message: {
        fontWeight: "100"
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10
    },
    rowCard: {
        borderRadius: 10
    },
});