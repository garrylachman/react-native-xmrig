import React from 'react';
import { ViewProps } from 'react-native';
import { TabNavigator } from './settings-navigator';

export const SettingsView:React.FC<ViewProps> = () => {
    return (
        <>
            <TabNavigator />
        </>
    )
}

export default SettingsView;