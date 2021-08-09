import React from 'react';
import { NativeModules, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider, Layout, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { ColumnProps, Table } from 'react-native-awesome-table';
import { CellContentProps } from 'react-native-awesome-table/src/components/Table';
import { VictoryBar, VictoryChart, VictoryLine, VictoryTheme } from 'victory-native';
import { useInterval } from '../../../core/hooks';

const { XMRigModule } = NativeModules;


type DataRow = {
	start_date: string,
    end_date: string,
    mining_in_minutes: number,
    algo: string,
	avg_hashrate: number
};

const _customCell = ({data, rowIndex, columnIndex}:CellContentProps) => (
    <Text style={{fontSize: 12, color: 'black'}}>{data}</Text>
)

const columns:ColumnProps[] = [
	{ 'dataKey': 'start_date', title: 'From', flex: 2, getCell: _customCell },
	{ 'dataKey': 'end_date', title: 'To', flex: 2, getCell: _customCell  },
	{ 'dataKey': 'mining_in_minutes', title: 'Time', flex: 1, getCell: _customCell  },
	{ 'dataKey': 'algo', title: 'Algo', flex: 2, getCell: _customCell  },
    { 'dataKey': 'avg_hashrate', title: 'Hashrate', flex: 1, getCell: _customCell  }
]


const HistoryScreen = () => {
    const [nativeData, setNativeData] = React.useState<DataRow[]>([]);

    const styles = useStyleSheet(style);

    React.useEffect(() => {
        XMRigModule.getMinerHistoryBySessionAndAlgo()
            .then((res: any) => setNativeData(res))
            .catch(() => {});
    }, [])

    useInterval(() => {
        XMRigModule.getMinerHistoryBySessionAndAlgo()
            .then((res: any) => setNativeData(res))
            .catch(() => {});
    }, 60*1000)

    const data = React.useMemo(() => {
        if (nativeData)   {
            return nativeData.map((row: any, index: number) => ({
                ...row,
                avg_hashrate: row.avg_hashrate.toFixed(1)
            }))
        }
        return [];
    }, [nativeData]);

    const hashrateChart = React.useMemo(() => {
        if (nativeData)   {
            return nativeData.map((row: any, index: number) => ({
                x: new Date(row.start_date),
                y: parseFloat(row.avg_hashrate.toFixed(1)),
            }))
        }
        return [];
    }, [nativeData]);

    const miningTimeChart = React.useMemo(() => {
        if (nativeData)   {
            return nativeData.map((row: any, index: number) => ({
                x: new Date(row.start_date),
                y: parseFloat(row.mining_in_minutes),
            }))
        }
        return [];
    }, [nativeData]);

    
    return (
        <Layout style={styles.layout} level='2'>
            <ScrollView>
                <View style={styles.cards}>
                    <Text category="h6">Mining Sessions History</Text>
                </View>
                <Text category="h6"> Hashrate / Session</Text>
                <VictoryChart height={200} theme={VictoryTheme.material} padding={{ top: 10, bottom: 40, left: 40, right: 40 }}>
                <VictoryBar  
                    data={hashrateChart} 
                    
                    style={{data: { fill: 'rgba(134, 65, 244)'}}}
                    alignment="start"
                />
                </VictoryChart>

                <Text category="h6">Minutes Mining / Session</Text>
                <VictoryChart height={200} theme={VictoryTheme.material} padding={{ top: 10, bottom: 40, left: 40, right: 40 }}>
                <VictoryLine  
                    data={miningTimeChart} 
                    
                    style={{data: { stroke: 'rgba(134, 65, 244)'}}}
                    
                />
                </VictoryChart>

                <Text category="h6">History by Session/Algo</Text>
                <Table 
                    columns={columns}
                    data={data}
                    showHeader={true}
                    stickyHeader={false}
                    isLoading={data.length == 0}
                    loadingText="   Waiting for data..."
                    headerRowTextStyle={styles.headerRow}
                    rowStyle={styles.tableRow}
                    flexAutoAdjustment={false}
                />
            </ScrollView>
        </Layout>
    )
}


const style = StyleService.create({
    layout: {
        flex: 1,
        padding: 15
    },
    cards: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingBottom: 10
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10
    },
    rowCard: {
        borderRadius: 10
    },
    headerRow: {
        color: 'text-basic-color'
    },
    tableRow: {
        backgroundColor: 'color-primary-100',
        borderRadius: 5,
        marginBottom: 5,
        borderColor: 'color-basic-focus-border',
        borderWidth: 1,
        fontSize: 1
    }
});

export default HistoryScreen;