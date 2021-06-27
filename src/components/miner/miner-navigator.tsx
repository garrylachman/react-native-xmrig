import React from 'react';
import { LazyLoader } from '../core/lazy-loader';

import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';
import { SettingsContext, ThemeModes } from '../../core/settings';

const { Navigator, Screen } = createBottomTabNavigator();

// Advanced Mode
const MinerScreen = React.lazy(() => import('./screens/advanced/miner.screen'));
const PoolScreen = React.lazy(() => import('./screens/advanced/pool.screen'));
const LogScreen = React.lazy(() => import('./screens/advanced/log.screen'));
const OtherScreen = React.lazy(() => import('./screens/advanced/other.screen'));

const LazyMinerScreen = () => (<LazyLoader><MinerScreen /></LazyLoader>)
const LazyPoolScreen = () => (<LazyLoader><PoolScreen /></LazyLoader>)
const LazyLogScreen = () => (<LazyLoader><LogScreen /></LazyLoader>)
const LazyOtherScreen = () => (<LazyLoader><OtherScreen /></LazyLoader>)

// Simple Mode
const SimpleMinerScreen = React.lazy(() => import('./screens/simple-young/simple-miner.screen'));
const LazySimpleMinerScreen = () => (<LazyLoader><SimpleMinerScreen /></LazyLoader>)



const BottomTabBar:React.FC<BottomTabBarProps & { tabs: string[] }> = ({ navigation, state, tabs }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
      {tabs.map((tabTitle:string, tabIndex:number) => (
        <BottomNavigationTab title={tabTitle} key={`BottomTabBar-${tabIndex}`}/>
      ))}
  </BottomNavigation>
);
  
const AdvancedTabNavigator = () => (
  <Navigator tabBar={props => <BottomTabBar {...props} tabs={['MINER', 'POOL', 'LOG', 'OTHER']} />}>
    <Screen name='Miner' component={LazyMinerScreen}/>
    <Screen name='Pool' component={LazyPoolScreen}/>
    <Screen name='Log' component={LazyLogScreen}/>
    <Screen name='Other' component={LazyOtherScreen}/>
  </Navigator>
);

const SimpleYoungTabNavigator = () => (
  <Navigator tabBar={props => <BottomTabBar {...props} tabs={['MINER']} />}>
    <Screen name='Miner' component={LazySimpleMinerScreen}/>
  </Navigator>
);

const TabNavigatorFactory = () => {
  const [settings] = React.useContext(SettingsContext);

  if (settings.theme_mode == ThemeModes.SIMPLE_YOUNG) {
      return <SimpleYoungTabNavigator />;
  }
  return <AdvancedTabNavigator />;
}
  
export const TabNavigator = () => (
  <TabNavigatorFactory />
)