import React from 'react';
import { render } from 'react-native-testing-library';

import {
    light,
    mapping,
} from '@eva-design/eva';
import { ApplicationProvider, BottomNavigationTab, Icon, IconRegistry, Text } from '@ui-kitten/components';

import {
    AppearanceIcon,
    WalletIcon,
    HelpIcon,
    LazyAppearanceScreen,
    LazyHelpScreen,
    LazyWalletScreen,
    TabNavigator
} from './settings-navigator'
import { View, ViewProps } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScreenContainer } from 'react-native-screens';

const { Navigator, Screen } = createBottomTabNavigator();


describe('@settings-navigator: component checks', () => {

    const TestTabNavigator = (props: Partial<ViewProps>) => (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider mapping={mapping} theme={light}>
                <NavigationContainer>
                    <TabNavigator />
                </NavigationContainer>
            </ApplicationProvider>
        </>
      );

    it('Snapshot', () => {
        const tree = render(
            <TestTabNavigator/>,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

});