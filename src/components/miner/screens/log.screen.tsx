import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SessionDataContext } from '../../../core/session-data/session-data.context';
import { Text } from '@ui-kitten/components';
import { StartMode } from '../../../core/session-data/session-data.interface';
import { XMRigLogView } from '../components/miner/xmrig-log';

const LogScreen = () => {
    
    const {working, minerLog} = React.useContext(SessionDataContext);

    return (
        <ScrollView nestedScrollEnabled={true} style={working == StartMode.STOP ? [styles.layout, styles.hidden] : styles.layout}>
            <View style={styles.section}>
                <Text category='h5' style={styles.sectionTitle}>Miner Log</Text>
                <Text category='label' style={styles.sectionSubTitle}>STDOUT</Text>
            </View>
            <XMRigLogView data={minerLog} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    layout: {
        marginHorizontal: 15,
        marginBottom: 10,
        height: '100%',
    },
    hidden: {
        opacity: 0.3
    },
    section: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingTop: 0
    },
    sectionTitle: {
        flexDirection:'column'
    },
    sectionSubTitle: {
        backgroundColor: 'rgba(134, 65, 244, 0.1)', flexDirection:'column', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 5
    }
});

export default LogScreen;