import React from 'react';
import { render } from 'react-native-testing-library';

import {
    light,
    mapping,
} from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';

import { ThemeModeCard } from './theme-mode-card';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ISettings, ISettingsWallet, ThemeModes, Themes } from '../../../../core/settings';
import { SettingsCardProps } from '../settings.card';


describe('@theme-mode-card: component checks', () => {

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

    const TestThemeModeCard= (props: Partial<SettingsCardProps>) => (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider mapping={mapping} theme={light}>
                <ThemeModeCard
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

    it('advanced mode', () => {
        const tree = render(
            <TestThemeModeCard settings={{...settings, theme_mode: ThemeModes.ADVANCED}} />,
        ).toJSON();

        expect(tree).toMatchSnapshot("advanced mode");
    });

    it('simple young mode', () => {
        const tree = render(
            <TestThemeModeCard settings={{...settings, theme_mode: ThemeModes.SIMPLE_YOUNG}} />,
        ).toJSON();

        expect(tree).toMatchSnapshot("simple young mode");
    });

});