import React from 'react';
import { render } from 'react-native-testing-library';

import {
    light,
    mapping,
} from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';

import WalletScreen, { WalletScreenProps } from './wallet.screen'
import { EvaIconsPack } from '@ui-kitten/eva-icons';


describe('@wallet-screen: component checks', () => {

    const TestWalletScreen= (props: Partial<WalletScreenProps>) => (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider mapping={mapping} theme={light}>
                <WalletScreen {...props} />
            </ApplicationProvider>
        </>
      );

    it('showWalletCardContent = true', () => {
        const tree = render(
            <TestWalletScreen showWalletCardContent={true} />,
        ).toJSON();

        expect(tree).toMatchSnapshot("showWalletCardContent = true");
    });

    it('showWalletCardContent = false', () => {
        const tree = render(
            <TestWalletScreen showWalletCardContent={true} />,
        ).toJSON();

        expect(tree).toMatchSnapshot("showWalletCardContent = false");
    });

});