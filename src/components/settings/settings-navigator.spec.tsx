import React from 'react';
import { render } from 'react-native-testing-library';

import {
    light,
    mapping,
} from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';

import {
    TabNavigator
} from './settings-navigator'
import { ViewProps } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { EvaIconsPack } from '@ui-kitten/eva-icons';


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