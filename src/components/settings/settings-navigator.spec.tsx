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
    TabNavigator
} from './settings-navigator'
import { ViewProps } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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

    it('should render navigator', () => {
        const component = render(
            <TestTabNavigator/>,
        );

        const tabNavigator = component.UNSAFE_queryByType(Navigator);

        expect(tabNavigator).toBeTruthy();
    });

    it('Wallet', () => {
        const component = render(
            <TestTabNavigator/>,
        );
        
        const walletTab = component.UNSAFE_queryAllByType(BottomNavigationTab)[0];

        expect(walletTab?.props.title).toEqual('WALLET');
        expect(walletTab?.props.icon).toEqual(WalletIcon);
        expect(walletTab?.props.selected).toEqual(true);
    });

    it('Help', () => {
        const component = render(
            <TestTabNavigator/>,
        );
        
        const helpTab = component.UNSAFE_queryAllByType(BottomNavigationTab)[1];

        expect(helpTab?.props.title).toEqual('HELP');
        expect(helpTab?.props.icon).toEqual(HelpIcon);
        expect(helpTab?.props.selected).toEqual(false);
    });

    it('Appearance', () => {
        const component = render(
            <TestTabNavigator/>,
        );
        
        const appearanceTab = component.UNSAFE_queryAllByType(BottomNavigationTab)[2];

        expect(appearanceTab?.props.title).toEqual('APPERANCE');
        expect(appearanceTab?.props.icon).toEqual(AppearanceIcon);
        expect(appearanceTab?.props.selected).toEqual(false);
    });



});