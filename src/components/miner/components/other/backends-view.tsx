import { StyleService, useStyleSheet } from '@ui-kitten/components';
import React from 'react';
import {View, ViewProps } from 'react-native';
import { IMinerBackend } from '../../../../core/hooks';
import { Table, ColumnProps} from 'react-native-awesome-table';

type OtherViewProps = ViewProps & {
    backendsData: IMinerBackend | null;
}

type DataRow = {
	id: number,
    intensity: number,
    affinity: number,
    av: number,
	hashrate: string
};

const columns:ColumnProps[] = [
	{ 'dataKey': 'id', title: 'ID', flex: 1 },
	{ 'dataKey': 'intensity', title: 'Intensity', flex: 2 },
	{ 'dataKey': 'affinity', title: 'Affinity', flex: 2 },
	{ 'dataKey': 'av', title: 'AV', flex: 1 },
    { 'dataKey': 'hashrate', title: 'Hashrate', flex: 3 }
]

export const BackendsView:React.FC<OtherViewProps> = ({backendsData}) => {
    const styles = useStyleSheet(style);

    const data = React.useMemo(() => {
        if (backendsData)   {
            return backendsData.threads.map((thread, index) => ({
                id: index,
                intensity: thread.intensity,
                affinity: thread.affinity,
                av: thread.av,
                hashrate: `${thread.hashrate[0]} H/s`
            }))
        }
        return [];
    }, [backendsData]);

    return (
        <>
            <View style={styles.row}>
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
            </View>
        </>
    )
}



const style = StyleService.create({
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
        borderWidth: 1
    }
});