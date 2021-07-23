import React from 'react';
import { LazyLoader } from '../core/lazy-loader';

import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Icon, IconProps } from '@ui-kitten/components';
import { SettingsContext } from '../../core/settings';

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

const MinerIcon = (props:IconProps) => (
  <Icon {...props} name='cube'/>
);

const PoolIcon = (props:IconProps) => (
  <Icon {...props} name='activity'/>
);

const LogIcon = (props:IconProps) => (
  <Icon {...props} name='list'/>
);

const OtherIcon = (props:IconProps) => (
  <Icon {...props} name='info'/>
);

const BottomTabBar:React.FC<BottomTabBarProps & { tabs: {name: string, icon: any}[] }> = ({ navigation, state, tabs }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
      {tabs.map((tab:{name: string, icon: any}, tabIndex:number) => (
        <BottomNavigationTab title={tab.name} icon={tab.icon} key={`BottomTabBar-${tabIndex}`}/>
      ))}
  </BottomNavigation>
);
  
const AdvancedTabNavigator = () => (
  <Navigator tabBar={props => <BottomTabBar {...props} tabs={[
      {name: 'MINER', icon: MinerIcon}, 
      {name: 'POOL', icon: PoolIcon}, 
      {name: 'LOG', icon: LogIcon}, 
      {name: 'OTHER', icon: OtherIcon}
    ]} />}>
    <Screen name='Miner' component={LazyMinerScreen} />
    <Screen name='Pool' component={LazyPoolScreen}/>
    <Screen name='Log' component={LazyLogScreen}/>
    <Screen name='Other' component={LazyOtherScreen}/>
  </Navigator>
);

const TabNavigatorFactory = () => {
  const [settings] = React.useContext(SettingsContext);

  return <AdvancedTabNavigator />;
}
  
export const TabNavigator = () => {
  return (
    <TabNavigatorFactory />
  );
}