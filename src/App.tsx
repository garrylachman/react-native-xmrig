import React, { useContext, useEffect } from 'react';
import { NativeModules, SafeAreaView } from 'react-native';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ApplicationProvider, Layout, Text, Button, IconRegistry } from '@ui-kitten/components';
import { SettingsContextProvider, SettingsContext, ISettingsReducerAction } from './core/settings'
import { SettingsActionType } from './core/settings/settings.actions';
import { DialogContextProvider } from './components/dialogs/dialog.provider';
import { AppNavigator, AppHeader } from './components';
import SplashScreen from 'react-native-splash-screen';
import { SessionDataContextProvider } from './core/session-data/session-data.context';

const { XMRigModule } = NativeModules;

import { enableScreens } from 'react-native-screens';

enableScreens(false);

const App = () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <SettingsContextProvider>
        <SessionDataContextProvider>
          <DialogContextProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <AppHeader />
              <AppNavigator />
            </SafeAreaView>
          </DialogContextProvider>
        </SessionDataContextProvider>
      </SettingsContextProvider>
    </ApplicationProvider>
  </>
);

export default App;