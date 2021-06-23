import React from 'react';
import { LazyLoader } from '../core/lazy-loader';

import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';

const { Navigator, Screen } = createBottomTabNavigator();



const MinerScreen = React.lazy(() => import('./screens/miner.screen'));
const PoolScreen = React.lazy(() => import('./screens/pool.screen'));
const LogScreen = React.lazy(() => import('./screens/log.screen'));
const OtherScreen = React.lazy(() => import('./screens/other.screen'));


const LazyMinerScreen= () => (<LazyLoader><MinerScreen /></LazyLoader>)
const LazyPoolScreen= () => (<LazyLoader><PoolScreen /></LazyLoader>)
const LazyLogScreen= () => (<LazyLoader><LogScreen /></LazyLoader>)
const LazyOtherScreen= () => (<LazyLoader><OtherScreen /></LazyLoader>)



const BottomTabBar:React.FC<BottomTabBarProps> = ({ navigation, state }) => (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab title='MINER'/>
      <BottomNavigationTab title='POOL'/>
      <BottomNavigationTab title='LOG'/>
      <BottomNavigationTab title='OTHER'/>
    </BottomNavigation>
  );
  
  export const TabNavigator = () => (
    <Navigator tabBar={props => <BottomTabBar {...props} />}>
      <Screen name='Miner' component={LazyMinerScreen}/>
      <Screen name='Pool' component={LazyPoolScreen}/>
      <Screen name='Log' component={LazyLogScreen}/>
      <Screen name='Other' component={LazyOtherScreen}/>
    </Navigator>
  );
  