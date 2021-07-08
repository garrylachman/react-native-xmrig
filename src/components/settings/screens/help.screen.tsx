import React from 'react';
import { StyleSheet, Linking, View } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';

const HelpScreen = () => {


    return (
        <Layout style={styles.layout} level='2'>
            <View style={styles.cards}>
                <Text category='h2'>Help</Text>
                <Text category='h5' style={styles.title}>How to create a wallet?</Text>
                <Text category="p1">
                    Before you start mining you must have a Monero wallet. You can create a wallet for free using one of the wallet website/applications.
                </Text>
                <Text category='h6' style={styles.title}>Create wallet using Application</Text>
                <Text category="p1">
                    You can use one of these application from Google Play:
                </Text>
                <Text category="c1">* MyMonero: Send money privately</Text>
                <Text category="c1">* Monero Wallet. Buy & Exchange XMR coins</Text>
                <Text category="c1">* Cake Wallet</Text>
                <Text category="c1">* Exodus: Crypto Bitcoin Wallet</Text>
                <Text category="c1">* Edge - Bitcoin, Ethereum, Monero, Ripple Wallet</Text>
                <Text category='h6' style={styles.title}>Create wallet using Website</Text>
                <Text category="c1" style={styles.link} onPress={() => Linking.openURL('https://wallet.mymonero.com/')}>* https://wallet.mymonero.com/</Text>
                <Text category="c1" style={styles.link} onPress={() => Linking.openURL('https://www.xmrwallet.com/')}>* https://www.xmrwallet.com/</Text>
                <Text category="c1" style={styles.link} onPress={() => Linking.openURL('https://guarda.co/app/')}>* https://guarda.co/app/</Text>
                <Text category="c1" style={styles.link} onPress={() => Linking.openURL('https://app.freewallet.org/')}>* https://app.freewallet.org/</Text>
                <Text category="c1" style={styles.link} onPress={() => Linking.openURL('https://www.cryptonator.com/about/xmr')}>* https://www.cryptonator.com/about/xmr</Text>
            </View>
        </Layout>
    )
}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
        padding: 15
    },
    title: {
        paddingVertical: 5,
    },
    link: {
        color: 'blue'
    },
    cards: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    }
});

export default HelpScreen;