import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBar, Tab, Layout, Icon, IconProps } from '@ui-kitten/components';
import SplashScreen from 'react-native-splash-screen';
import { LazyLoader } from './lazy-loader';

const Settings = React.lazy(() => import('../settings/settings-view'));
const Miner = React.lazy(() => import('../miner/miner-view'));

const LazySettings = () => (<LazyLoader><Settings /></LazyLoader>)
const LazyMiner = () => (<LazyLoader><Miner /></LazyLoader>)

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
            <Screen name='Settings' component={LazySettings}/>
            <Screen name='Miner' component={LazyMiner} />
        </Navigator>
    );
};

export const AppNavigator = () => (
    <NavigationContainer>
        <TabNavigator/>
    </NavigationContainer>
);
