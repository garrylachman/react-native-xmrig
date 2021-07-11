import React from 'react';
import { render } from 'react-native-testing-library';

import {
    light,
    mapping,
} from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';

import AppearanceScreen from './appearance.screen'
import { ViewProps } from 'react-native';
import { EvaIconsPack } from '@ui-kitten/eva-icons';


describe('@appearance-screen: component checks', () => {

    const TestAppearanceScreen= (props: Partial<ViewProps>) => (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider mapping={mapping} theme={light}>
                <AppearanceScreen />
            </ApplicationProvider>
        </>
      );

    it('Snapshot', () => {
        const tree = render(
            <TestAppearanceScreen/>,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });


});