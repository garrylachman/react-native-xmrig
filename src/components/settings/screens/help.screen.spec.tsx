import React from 'react';
import { render } from 'react-native-testing-library';

import {
    light,
    mapping,
} from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';

import HelpScreen from './help.screen'
import { ViewProps } from 'react-native';
import { EvaIconsPack } from '@ui-kitten/eva-icons';


describe('@help-screen: component checks', () => {

    const TestHelpScreen= (props: Partial<ViewProps>) => (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider mapping={mapping} theme={light}>
                <HelpScreen />
            </ApplicationProvider>
        </>
      );

    it('Snapshot', () => {
        const tree = render(
            <TestHelpScreen/>,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });


});