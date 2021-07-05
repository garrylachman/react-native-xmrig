import React, { useContext, useEffect } from 'react';
import { NativeModules, SafeAreaView } from 'react-native';

import LogRocket from '@logrocket/react-native';
LogRocket.init('6pfxkm/react-native-xmrig')

import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ApplicationProvider,  IconRegistry } from '@ui-kitten/components';
import { SettingsContextProvider, SettingsContext, SettingsStateDispatch, ThemeType } from './core/settings'
import { DialogContextProvider } from './components/dialogs/dialog.provider';
import { AppNavigator, AppHeader } from './components';
import SplashScreen from 'react-native-splash-screen';
import { SessionDataContextProvider } from './core/session-data/session-data.context';

const { XMRigModule } = NativeModules;

import { enableScreens } from 'react-native-screens';

enableScreens(false);


const AppWithSettings:React.FC = () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <SettingsContextProvider>
      <App />
    </SettingsContextProvider>
  </>
);

const App = () => {
  const [settings, settingsDispatcher]:SettingsStateDispatch = React.useContext(SettingsContext);
  const theme = React.useMemo(() => settings.theme ? eva[settings.theme as ThemeType] : eva.dark, [settings.theme]);

  return (
    <ApplicationProvider {...eva} theme={theme}>
      <SessionDataContextProvider>
        <DialogContextProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <AppHeader />
            <AppNavigator />
          </SafeAreaView>
        </DialogContextProvider>
      </SessionDataContextProvider>
    </ApplicationProvider>
  )
}

export default AppWithSettings;