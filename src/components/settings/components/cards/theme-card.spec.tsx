import React from 'react';
import { render } from 'react-native-testing-library';

import {
    light,
    mapping,
} from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';

import { ThemeCard } from './theme-card';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ISettings, ISettingsWallet, ThemeModes, Themes } from '../../../../core/settings';
import { SettingsCardProps } from '../settings.card';


describe('@theme-card: component checks', () => {

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

    const TestThemeCard= (props: Partial<SettingsCardProps>) => (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider mapping={mapping} theme={light}>
                <ThemeCard
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

    it('dark theme', () => {
        const tree = render(
            <TestThemeCard settings={{...settings, theme: Themes.DARK}} />,
        ).toJSON();

        expect(tree).toMatchSnapshot("dark theme");
    });

    it('light theme', () => {
        const tree = render(
            <TestThemeCard settings={{...settings, theme: Themes.LIGHT}} />,
        ).toJSON();

        expect(tree).toMatchSnapshot("light theme");
    });

});