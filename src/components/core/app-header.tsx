import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import Shimmer from 'react-native-shimmer';


export const AppHeader = () => {

    return (
        <Layout style={style.container} level="4">
            <Shimmer pauseDuration={10*1000}>
                <Text category='h1' adjustsFontSizeToFit numberOfLines={1}>React Native XMRig</Text>
            </Shimmer>
        </Layout>
    );
}

const style = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 5
    }
});