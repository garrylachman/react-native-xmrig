import React from 'react';
import { NativeModules, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider, Layout, StyleService, Text, useStyleSheet, Select, SelectItem, IndexPath  } from '@ui-kitten/components';
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
    <Text style={{
        fontSize: columnIndex == 4 ? 13 : 11,
        fontWeight:  columnIndex == 4 ? "bold" : "normal",
        color: 'black', 
        borderRightWidth: columnIndex == 4 ? 0 : 1, 
        flex: 1, 
        textAlignVertical: 'center', 
        textAlign: 'center'
    }}>{data}</Text>
)

const columns:ColumnProps[] = [
	{ 'dataKey': 'start_date', title: 'From', flex: 2, getCell: _customCell },
	{ 'dataKey': 'end_date', title: 'To', flex: 2, getCell: _customCell  },
	{ 'dataKey': 'mining_in_minutes', title: 'Time', flex: 1, getCell: _customCell  },
	{ 'dataKey': 'algo', title: 'Algo', flex: 2, getCell: _customCell  },
    { 'dataKey': 'avg_hashrate', title: 'Hashrate', flex: 2, getCell: _customCell  }
]

const daysSelect:number[] = [1, 2, 7, 14, 21, 30, 60, 120]


const HistoryScreen = () => {
    const [nativeData, setNativeData] = React.useState<DataRow[]>([]);
    const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(6));
    const selectedDays = React.useMemo(() => daysSelect[selectedIndex.row], [selectedIndex]);

    const styles = useStyleSheet(style);

    const refresh = () => XMRigModule.getMinerHistoryBySessionAndAlgo(selectedDays)
        .then((res: any) => setNativeData(res))
        .catch(() => {});

    React.useEffect(() => refresh(), [])
    React.useEffect(() => refresh(), [selectedDays])
    useInterval(() => refresh(), 60*1000)

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
                    <Text style={{flex: 2}} category="h6">Mining Sessions History</Text>
                    <Select
                        style={{flex: 1}}
                        selectedIndex={selectedIndex}
                        value={`${selectedDays} days`}
                        onSelect={index => setSelectedIndex(index)}>
                        {daysSelect.map(day => (
                            <SelectItem title={`${day} days`} />
                        ))}
                    </Select>
                </View>
                <Text category="h6"> Hashrate / Session</Text>
                <VictoryChart domainPadding={20} height={200} theme={VictoryTheme.material} padding={{ top: 10, bottom: 40, left: 40, right: 40 }}>
                <VictoryBar  
                    data={hashrateChart} 
                    style={{data: { fill: 'rgba(134, 65, 244)'}}}
                    alignment="start"
                />
                </VictoryChart>

                <Text category="h6">Minutes Mining / Session</Text>
                <VictoryChart domainPadding={20}  height={200} theme={VictoryTheme.material} padding={{ top: 10, bottom: 40, left: 40, right: 40 }}>
                <VictoryBar  
                    data={miningTimeChart} 
                    
                    style={{data: { fill: 'rgba(134, 65, 244)'}}}
                    alignment="start"
                />
                </VictoryChart>

                <Text category="h6">History by Session/Algo</Text>
                <Table 
                    columns={columns}
                    data={data}
                    showHeader={true}
                    stickyHeader={true}
                    isLoading={data.length == 0}
                    loadingText="   Waiting for data..."
                    headerRowTextStyle={styles.headerRow}
                    rowStyle={styles.tableRow}
                    flexAutoAdjustment={true}
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
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingBottom: 10,
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10
    },
    rowCard: {
        borderRadius: 10,
    },
    headerRow: {
        color: 'text-basic-color',
        fontSize: 9,
        textAlign: 'center'
    },
    tableRow: {
        backgroundColor: 'color-primary-100',
        borderRadius: 5,
        marginBottom: 5,
        borderWidth: 0,
    }
});

export default HistoryScreen;