import React from 'react';
import { LazyLoader, Lazy } from '../core/lazy-loader';

import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Icon, IconProps } from '@ui-kitten/components';

const { Navigator, Screen } = createBottomTabNavigator();

const WalletScreen = Lazy(() => import('./screens/wallet.screen'));
const RewardsScreen = Lazy(() => import('./screens/rewards.screen'));
const HelpScreen = Lazy(() => import('./screens/help.screen'));
const MinerSettingsScreen = Lazy(() => import('./screens/miner-settings.screen'));

const LazyWalletScreen = () => (<LazyLoader><WalletScreen /></LazyLoader>)
const LazyRewardsScreen = () => (<LazyLoader><RewardsScreen /></LazyLoader>)
const LazyHelpScreen = () => (<LazyLoader><HelpScreen /></LazyLoader>)
const LazyMinerSettingsScreen = () => (<LazyLoader><MinerSettingsScreen /></LazyLoader>)

const WalletIcon = (props:IconProps) => (
  <Icon {...props} name='credit-card'/>
);

const RewardsIcon = (props:IconProps) => (
  <Icon {...props} name='award'/>
);

const HelpIcon = (props:IconProps) => (
  <Icon {...props} name='question-mark-circle'/>
);

const MinerSettingsIcon = (props:IconProps) => (
  <Icon {...props} name='code'/>
);

const BottomTabBar:React.FC<BottomTabBarProps> = ({ navigation, state }) => (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab title='WALLET' icon={WalletIcon}/>
      <BottomNavigationTab title='SETTINGS' icon={MinerSettingsIcon}/>
      <BottomNavigationTab title='HELP' icon={HelpIcon}/>
      <BottomNavigationTab title='REWARDS' icon={RewardsIcon}/>
    </BottomNavigation>
  );
  
export const TabNavigator = () => (
  <Navigator tabBar={props => <BottomTabBar {...props} />}>
    <Screen name='Wallet' component={LazyWalletScreen}/>
    <Screen name='Settings' component={LazyMinerSettingsScreen}/>
    <Screen name='Help' component={LazyHelpScreen}/>
    <Screen name='Rewards' component={LazyRewardsScreen}/>
  </Navigator>
);
  