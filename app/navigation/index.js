import React, { useEffect, createRef } from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BaseSetting, useTheme} from '../config';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {useSelector} from 'react-redux';

import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  requestPermission,
  getToken,
  onMessage,
  setBackgroundMessageHandler,
  onNotificationOpenedApp,
  getInitialNotification,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';

// import PushNotification from 'react-native-push-notification';

/* Main Stack Navigator */
import Main from '../navigation/main';
/* Modal Screen only affect iOS */
import Loading from '../screens-IMC/Loading';
// import Filter from '../screens/Filter';
// import FlightFilter from '../screens/FlightFilter';
// import BusFilter from '../screens/BusFilter';
// import Search from '../screens/Search';
// import SearchHistory from '../screens/SearchHistory';
import PreviewImage from '../screens/PreviewImage';
// import SelectBus from '../screens/SelectBus';
// import SelectCruise from '../screens/SelectCruise';
// import CruiseFilter from '../screens/CruiseFilter';
// import EventFilter from '../screens/EventFilter';
import SelectDarkOption from '../screens/SelectDarkOption';
import SelectFontOption from '../screens/SelectFontOption';
import SignIn from '../screens-IMC/SignIn';
import ResetPassword from '../screens-IMC/ResetPassword';
import ResetPasswordOTP from '../screens-IMC/ResetPasswordOTP';
import SignUp from '../screens-IMC/SignUp';
import SignUpExhibitor from '../screens-IMC/SignUpExhibitor';
import UpdateAppScreen from '../screens-IMC/UpdateAppScreen';
import NoInternetScreen from '../screens-IMC/NoInternetScreen';
import Home from '../screens-IMC/HomeScreen';
import ExhibitorDetail from '../screens-IMC/ExhibitorDetail';
import useAppVersionCheck from '../utils/useAppVersionCheck';

const RootStack = createNativeStackNavigator();
export const navigationRef = createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function getCurrentRouteName() {
  return navigationRef.current?.getCurrentRoute()?.name;
}

export default function Navigator() {
  const language = useSelector(state => state.application.language);
  const {theme, colors} = useTheme();
  const isDarkMode = useColorScheme() === 'dark';

  // Check app update when come back from background or when start app
  useAppVersionCheck();

  /**
   * Handle Firebase Notification
   */
  const handleNotification = async (remoteMessage) => {
    if (remoteMessage) {
      console.log('handleNotification DATA: ', remoteMessage?.data);
    }
  };

  useEffect(() => {
    const app = getApp();
    const messaging = getMessaging(app);

    // Initialize package to show notification
    const requestUserPermission = async () => {
      const authStatus = await requestPermission(messaging);
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        getFCMToken();
      }
    };

    const getFCMToken = async () => {
      try {
        const fcmToken = await getToken(messaging);
        if (fcmToken) {
          console.log('FCM Token:', fcmToken);
        } else {
          console.log('Failed to get FCM token');
        }
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    };

    const unsubscribeForeground = onMessage(messaging, async remoteMessage => {
      console.log('Foreground remoteMessage:', remoteMessage);
      
      handleNotification(remoteMessage);
    });

    setBackgroundMessageHandler(messaging, async remoteMessage => {
      console.log('Background remoteMessage:', remoteMessage);
      handleNotification(remoteMessage);
    });

    const unsubscribeOpened = onNotificationOpenedApp(
      messaging,
      remoteMessage => {
        if (remoteMessage) {
          handleNotification(remoteMessage);
        }
      },
    );

    getInitialNotification(messaging).then(remoteMessage => {
      if (remoteMessage) {
        handleNotification(remoteMessage);
      }
    });

    requestUserPermission();

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, []);

  /**
   * init language
   */
  useEffect(() => {
    i18n.use(initReactI18next).init({
      resources: BaseSetting.resourcesLanguage,
      lng: BaseSetting.defaultLanguage,
      fallbackLng: BaseSetting.defaultLanguage,
      compatibilityJSON: 'v3',
    });
  }, []);

  /**
   * when reducer language change
   */
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  /**
   * when theme change
   */
  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
    StatusBar.setBackgroundColor(isDarkMode ? '#000000' : '#FFFFFF', true);
  }, [colors.primary, isDarkMode]);

  return (
    <NavigationContainer ref={navigationRef} theme={theme}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Loading">
        <RootStack.Screen
          name="Loading"
          component={Loading}
          options={{gestureEnabled: false}}
        />
        {/* SignIn AND SignUp */}
        <RootStack.Screen name="SignIn" component={SignIn} />
        <RootStack.Screen name="ResetPassword" component={ResetPassword} />
        <RootStack.Screen name="ResetPasswordOTP" component={ResetPasswordOTP} />
        <RootStack.Screen name="SignUp" component={SignUp} />
        <RootStack.Screen name="SignUpExhibitor" component={SignUpExhibitor} />

        <RootStack.Screen name="Main" component={Main} />
        {/* <RootStack.Screen name="Filter" component={Filter} /> */}
        {/* <RootStack.Screen name="FlightFilter" component={FlightFilter} /> */}
        {/* <RootStack.Screen name="BusFilter" component={BusFilter} /> */}
        {/* <RootStack.Screen name="Search" component={Search} /> */}
        {/* <RootStack.Screen name="SearchHistory" component={SearchHistory} /> */}
        <RootStack.Screen name="PreviewImage" component={PreviewImage} />
        <RootStack.Screen name="NoInternetScreen" component={NoInternetScreen} />
        {/* <RootStack.Screen name="SelectBus" component={SelectBus} /> */}
        {/* <RootStack.Screen name="SelectCruise" component={SelectCruise} /> */}
        {/* <RootStack.Screen name="CruiseFilter" component={CruiseFilter} /> */}
        {/* <RootStack.Screen name="EventFilter" component={EventFilter} /> */}
        <RootStack.Screen name="Home" component={Home} />
        <RootStack.Screen name="ExhibitorDetail" component={ExhibitorDetail} />
        <RootStack.Screen
          name="SelectDarkOption"
          component={SelectDarkOption}
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
            cardStyle: {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
            gestureEnabled: false,
          }}
        />
        <RootStack.Screen
          name="SelectFontOption"
          component={SelectFontOption}
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
            cardStyle: {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
          }}
        />
        <RootStack.Screen name="UpdateAppScreen" component={UpdateAppScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
