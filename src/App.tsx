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

const { XMRigModule } = NativeModules;


const HomeScreen = () => {

  const [settingsState, settingsDispatcher] = useContext(SettingsContext);

  useEffect(()=>{
    SplashScreen.hide();
  }, []);
  
  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text category='h1'>HOME</Text>
      <Button
        onPress={() => {
          settingsDispatcher({
            type: SettingsActionType.SET_WALLET,
            value: {
              address: '123',
              timestamp: '123'
            }
          });
          //XMRigModule.start('4AfypY3D9SygW8q843KXDG6dzjPY38X3sJQxug84tGyfBNWbKS6dTPD6qtER2cdtXz2GccHyA8cpSiRzFUSpN1Fm3nnaJtS');
        }}
      >Start</Button>
    </Layout>
  );
};

const app = () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <SettingsContextProvider>
        <DialogContextProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <AppHeader />
            <AppNavigator />
          </SafeAreaView>
        </DialogContextProvider>
      </SettingsContextProvider>
    </ApplicationProvider>
  </>
);

export default app;