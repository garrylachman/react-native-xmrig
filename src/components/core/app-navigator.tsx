import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBar, Tab, Layout, Icon, IconProps } from '@ui-kitten/components';
import { SettingsView } from '../settings/settings-view';
import { MinerView } from '../miner/miner-view';
import SplashScreen from 'react-native-splash-screen';

const { Navigator, Screen } = createMaterialTopTabNavigator();

const SettingsIcon = (props:IconProps) => (
    <Icon {...props} name='settings-2-outline'/>
);

const MinerIcon = (props:IconProps) => (
    <Icon {...props} name='browser-outline'/>
);

const TopTabBar = ({ navigation, state }:any) => (
    <TabBar
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index])}>
        <Tab title='Settings' icon={SettingsIcon}/>
        <Tab title='Miner' icon={MinerIcon}/>
    </TabBar>
);

const TabNavigator = () => {

    useEffect(()=>{
        SplashScreen.hide();
      }, []);

    return (
        <Navigator tabBar={(props:any) => <TopTabBar {...props} />}>
            <Screen name='Settings' component={SettingsView}/>
            <Screen name='Miner' component={MinerView} />
        </Navigator>
    );
};

export const AppNavigator = () => (
    <NavigationContainer>
        <TabNavigator/>
    </NavigationContainer>
);