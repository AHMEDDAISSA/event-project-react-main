import React from 'react';
import {persistor, store} from './store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Navigator from './navigation';
import {AlertNotificationRoot} from 'react-native-alert-notification';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../app/config';
import {LogBox} from 'react-native';
import {useFonts} from 'expo-font';
import {FontAssets} from './config';

console.disableYellowBox = true;
LogBox.ignoreAllLogs();

// const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = useFonts(FontAssets);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AlertNotificationRoot>
          <Navigator />
          <Toast config={toastConfig} position="top" />
        </AlertNotificationRoot>
      </PersistGate>
    </Provider>
  );
}
