import React from 'react';
import { ViewProps } from 'react-native';
import { TabNavigator } from './miner-navigator';
import { MinerControl } from './components/miner-control.component'

export const MinerView:React.FC<ViewProps> = () => {
    return (
        <>
            <MinerControl />
            <TabNavigator />
        </>
    )
}

export default MinerView;
