import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';


export const AppHeader = () => {

    return (
        <View style={style.container}>
            <Text category='h1' adjustsFontSizeToFit numberOfLines={1}>React Native XMRig</Text>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 5
    }
});