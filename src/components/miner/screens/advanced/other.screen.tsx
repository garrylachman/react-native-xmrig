import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SessionDataContext } from '../../../../core/session-data/session-data.context';
import { Layout, Text } from '@ui-kitten/components';
import { StartMode } from '../../../../core/session-data/session-data.interface';
import { OtherView } from '../../components/other/other-view';
import { BackendsView } from '../../components/other/backends-view';
import { Benchmarking } from '../../components/benchmarking.component';

const OtherScreen = () => {
    
    const {workingState, working, minerData, backendsData} = React.useContext(SessionDataContext);

    return (
        <Layout level="2">
            <ScrollView nestedScrollEnabled={true} style={working == StartMode.STOP ? [styles.layout, styles.hidden] : styles.layout}>
                <View style={styles.section}>
                    <Text category='h5' style={styles.sectionTitle}>Other</Text>
                    <Text category='label' style={styles.sectionSubTitle}>Technical</Text>
                </View>
                {workingState == "Benchmarking" && 
                    <Benchmarking />
                }
                <OtherView minerData={minerData} />
                <View style={styles.section}>
                    <Text category='h5' style={styles.sectionTitle}>Threads</Text>
                </View>
                <BackendsView backendsData={backendsData} />
            </ScrollView>
        </Layout>
    )
}

const styles = StyleSheet.create({
    layout: {
        marginHorizontal: 15,
        marginBottom: 10,
        height: '100%'
    },
    hidden: {
        opacity: 1
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

export default OtherScreen;