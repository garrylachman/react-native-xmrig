import { Card, Spinner, Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Shimmer from 'react-native-shimmer';

export const Benchmarking:React.FC<ViewProps> = () => (
    <View style={styles.component}>
        <Card status="warning">
            <View style={styles.container}>
                <Spinner status='warning' />
                <Shimmer style={styles.shimmer}>
                    <Text status="warning" category="p2">Benchmarking... The data will be available after benchmarking complete. This process may take several minutes.</Text>
                </Shimmer>
            </View>
        </Card>
    </View>
)

const styles = StyleSheet.create({
    component: {
        paddingVertical: 10
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    shimmer: {
        marginLeft: 15
    },
});