import React from 'react';
import { LazyLoader } from '../core/lazy-loader';

import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';

const { Navigator, Screen } = createBottomTabNavigator();



const WalletScreen = React.lazy(() => import('./screens/wallet.screen'));
const AppearanceScreen = React.lazy(() => import('./screens/appearance.screen'));

const LazyWalletScreen = () => (<LazyLoader><WalletScreen /></LazyLoader>)
const LazyAppearanceScreen = () => (<LazyLoader><AppearanceScreen /></LazyLoader>)


const BottomTabBar:React.FC<BottomTabBarProps> = ({ navigation, state }) => (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab title='WALLET'/>
      <BottomNavigationTab title='APPERANCE'/>
    </BottomNavigation>
  );
  
  export const TabNavigator = () => (
    <Navigator tabBar={props => <BottomTabBar {...props} />}>
      <Screen name='Wallet' component={LazyWalletScreen}/>
      <Screen name='Appearance' component={LazyAppearanceScreen}/>
    </Navigator>
  );
  