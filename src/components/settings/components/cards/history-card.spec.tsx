import React from 'react';
import { render } from 'react-native-testing-library';

import {
    light,
    mapping,
} from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';

import { HistoryCard } from './history-card';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ISettings, ISettingsWallet, ThemeModes, Themes } from '../../../../core/settings';
import { SettingsCardProps } from '../settings.card';


describe('@history-card: component checks', () => {

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

    const TestHistoryCard= (props: Partial<SettingsCardProps>) => (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider mapping={mapping} theme={light}>
                <HistoryCard
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

    it('valid wallet & wallet history', () => {
        const tree = render(
            <TestHistoryCard />,
        ).toJSON();

        expect(tree).toMatchSnapshot("valid");
    });

    it('title change', () => {
        const tree = render(
            <TestHistoryCard title="title2" />,
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
            <TestHistoryCard settings={noWalletSettings} />,
        ).toJSON();

        expect(tree).toMatchSnapshot("no wallet");
    });

    it('showContent false', () => {
        const tree = render(
            <TestHistoryCard showContent={false} />,
        ).toJSON();

        expect(tree).toMatchSnapshot("showContent false");
    });


});