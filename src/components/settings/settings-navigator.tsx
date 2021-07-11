import React from 'react';
import { LazyLoader, Lazy } from '../core/lazy-loader';

import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Icon, IconProps } from '@ui-kitten/components';

const { Navigator, Screen } = createBottomTabNavigator();

const WalletScreen = Lazy(() => import('./screens/wallet.screen'));
const AppearanceScreen = Lazy(() => import('./screens/appearance.screen'));
const HelpScreen = Lazy(() => import('./screens/help.screen'));

export const LazyWalletScreen = () => (<LazyLoader><WalletScreen /></LazyLoader>)
export const LazyAppearanceScreen = () => (<LazyLoader><AppearanceScreen /></LazyLoader>)
export const LazyHelpScreen = () => (<LazyLoader><HelpScreen /></LazyLoader>)

export const WalletIcon = (props:IconProps) => (
  <Icon {...props} name='credit-card'/>
);

export const AppearanceIcon = (props:IconProps) => (
  <Icon {...props} name='brush'/>
);

export const HelpIcon = (props:IconProps) => (
  <Icon {...props} name='question-mark-circle'/>
);

const BottomTabBar:React.FC<BottomTabBarProps> = ({ navigation, state }) => (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab title='WALLET' icon={WalletIcon}/>
      <BottomNavigationTab title='HELP' icon={HelpIcon}/>
      <BottomNavigationTab title='APPERANCE' icon={AppearanceIcon}/>
    </BottomNavigation>
  );
  
export const TabNavigator = () => (
  <Navigator tabBar={props => <BottomTabBar {...props} />}>
    <Screen name='Wallet' component={LazyWalletScreen}/>
    <Screen name='Help' component={LazyHelpScreen}/>
    <Screen name='Appearance' component={LazyAppearanceScreen}/>
  </Navigator>
);
  