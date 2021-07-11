import React from 'react';
import { render } from 'react-native-testing-library';

import {
    light,
    mapping,
} from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';

import { WalletCard } from './wallet-card';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ISettings, ISettingsWallet, ThemeModes, Themes } from '../../../../core/settings';
import { SettingsCardProps } from '../settings.card';


describe('@wallet-card: component checks', () => {

    const wallet:ISettingsWallet = {
        address: '46gPyHjLPPM8HaayVyvCDcF2A8sq8b476VrwKMukrKg21obm1AKEwzoN3u4ooc55FKdNeF5B8vcs4ixbeCyuydr2A2sdsQi',
        timestamp: '123'
    }
    const settings:ISettings = {
        wallet: {...wallet},
        wallet_history: [
            {...wallet}
        ],
        theme: Themes.DARK,
        theme_mode: ThemeModes.ADVANCED
    }

    const TestWalletCard= (props: Partial<SettingsCardProps>) => (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider mapping={mapping} theme={light}>
                <WalletCard
                    settings={settings}
                    settingsDispatcher={(value) => {}}
                    title="title"
                    showContent={true}
                    icon="checkmark-outline"
                    {...props}
                />
            </ApplicationProvider>
        </>
      );

    it('valid wallet', () => {
        const tree = render(
            <TestWalletCard/>,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('title change', () => {
        const tree = render(
            <TestWalletCard title="title2" />,
        ).toJSON();

        expect(tree).toMatchSnapshot("title change");
    });

    it('no wallet', () => {
        const noWalletSettings:ISettings = {
            ...settings,
            wallet: null,
            wallet_history: []
        }
        const tree = render(
            <TestWalletCard settings={noWalletSettings} />,
        ).toJSON();

        expect(tree).toMatchSnapshot("no wallet");
    });

    it('invalid wallet address', () => {
        const noWalletSettings:ISettings = {
            ...settings,
            wallet: {
                address: '123',
                timestamp: '123'
            },
            wallet_history: []
        }
        const tree = render(
            <TestWalletCard settings={noWalletSettings} />,
        ).toJSON();

        expect(tree).toMatchSnapshot("invalid wallet address");
    });

    it('showContent false', () => {
        const tree = render(
            <TestWalletCard showContent={false} />,
        ).toJSON();

        expect(tree).toMatchSnapshot("showContent false");
    });


});