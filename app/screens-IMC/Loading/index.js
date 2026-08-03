import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View, PermissionsAndroid} from 'react-native';
import {Images, useTheme} from '../../config';
import {Image, Text, Button} from '../../components';
import styles from './styles';
import NetInfo from '@react-native-community/netinfo';
import {checkAuth, loadData} from '../../reducers/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import {ApplicationActions} from '../../actions';
import {
  getMessaging,
  requestPermission,
  registerDeviceForRemoteMessages,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import VersionCheck from 'react-native-version-check';

export default function Loading({navigation}) {
  const {theme, colors} = useTheme();
  const [loadingText, setLoadingText] = useState('Chargement en cours...');
  const [currentStep, setCurrentStep] = useState(1); 
  const [Description, setDescription] = useState();
  const [appConfigData, setAppConfigData] = useState();
  const [Loader, setLoader] = useState(true);  

  const dispatch = useDispatch();
  const { loading, error, appData, success, token } = useSelector(state => state.auth);

  const messaging = getMessaging(getApp());
  async function requestUserPermission() {    
    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(() => {
    requestUserPermission();
  }, []);

  useEffect(() => {
    dispatch(loadData())
      .unwrap()
      .then((v) => {
        console.log("Value of load DATA", v);
        setAppConfigData(v?.requestData);
      })
      .catch(err => {
        console.log('Load data error:', err);
      });
  }, [dispatch, success]);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  

  // Reset states to recheck permissions 
  const reloadSteps = () => {
    setLoader(true);
    setLoadingText('Chargement en cours...');
    setCurrentStep(1); 
    setDescription('');
    onProcess();
  };

  // Time-consuming task
  const performTimeConsumingTask = async () => {
    return new Promise(resolve =>
      setTimeout(() => {resolve('done');}, 700),
    );
  };

  // Check for updates
  const _handleUpdates = async () => {
    try {
      // Check internet connection
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        setLoader(false);
        setDescription('Veuillez vérifier votre connexion Internet.');
        setLoadingText('Problème de connexion.');
        return;
      }

      // Check if update is needed (SAFE version comparison)
      const updateNeeded = await VersionCheck.needUpdate();

      console.log('Update check result:', updateNeeded);

      if (updateNeeded?.isNeeded) {
        setLoader(false);
        setDescription(
          "Mise à jour nécessaire. Veuillez mettre à jour l'application.",
        );
        setLoadingText('Mise à jour requise');
        navigation.replace('UpdateAppScreen', {storeURL: updateNeeded.storeUrl});
      }

      // No update needed → continue app
      setLoader(true);
      setDescription();
      setCurrentStep(4);

    } catch (error) {
      console.error('Erreur lors de la vérification des mises à jour :', error);

      setLoader(false);
      setDescription('Une erreur est survenue. Veuillez réessayer.');
      setLoadingText('Erreur');
    }
  };

  // Check If App Is connected to internet
  const _handleConnectivityChange = async state => {
    try { 
      if (!state.isConnected) {
        setLoader(false);
        setDescription('Veuillez vérifier votre connexion Internet.');
        setLoadingText('Problème de connexion.');

        throw new Error('Pas de connexion. Vérifiez votre connexion Internet.');
      } else {
        setLoader(true);
        setDescription();
      }
    } catch (error) {
      setLoader(false);
      setDescription('Veuillez vérifier votre connexion Internet.');

      throw new Error('Failed to check connectivity.');
    }
  };

  // Check notification permissions
  const _handleNotificationPermissions = async () => {
    console.log('Checking notification permissions');
    await registerDeviceForRemoteMessages(messaging);
    console.log('Device registered successfully.');
    // const token = await messaging().getToken();
    // console.log('FCM Token generated:', token);
    console.log('Requesting notification permissions...');
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    console.log("granted Notification", granted);
    
    setCurrentStep(5);
  };

  const _handleAppConfigData = async () => {
    setLoadingText('Application configuration...');
    console.log("Application configuration DATA: ", appConfigData);
    if (appConfigData != null) {
      dispatch(ApplicationActions.onChangeTheme(appConfigData?.theme ?? 'blue'));
    }
    setCurrentStep(3);
  };

  // Check if user is logged In
  const _isLoggedIn = async () => {
    try {
      console.log('Check if user is LoggedIn.');
      if (!token) {
        navigation.replace('SignIn');
      }else{
        navigation.replace('Main');
      }
    } catch (error) {
      throw new Error('Failed in FirstStep.');
    }
  };

  const onProcess = async () => {
    switch (currentStep) {
      case 1:
        setLoadingText('Vérification de la connectivité Internet ...');
        await performTimeConsumingTask();
        const isConnected = await NetInfo.fetch();
        await _handleConnectivityChange(isConnected);
        console.log('isConnected', isConnected);
        if (isConnected) {
          setCurrentStep(2);
        }
        break;
      case 2:
        console.log("appConfigData Case 2");
        await performTimeConsumingTask();
        _handleAppConfigData();
        break;
      case 3:
        setLoadingText('Vérification des mises à jour ...');
        await performTimeConsumingTask();
        await _handleUpdates();
        break;
      case 4:
        setLoadingText('Vérification des notifications ...');
        await performTimeConsumingTask();
        await _handleNotificationPermissions();
        break;
      case 5:
        await performTimeConsumingTask();
        await _isLoggedIn();
        break;
    }
  };

  useEffect(() => {
    onProcess();
  }, [currentStep]);

  return (
    <View style={[styles.container]}>
      <Image source={theme.dark ? Images.LoginBGDark : Images.LoginBG} style={styles.bottomImage} />      
      <Image source={Images.appLogo} style={styles.logo} resizeMode="contain" />
      <View style={styles.content}>
        {Loader && (
          <ActivityIndicator
            size="large"
            color={theme.dark ? 'white' : 'black'}
            style={{marginTop: 20}}
          />
        )}
        <View style={{marginTop: 50, alignItems: 'center', width: '80%'}}>
          <Text style={styles.title}>{loadingText}</Text>
        </View>
        {Description && (
          <View style={{alignItems: 'center', width: '80%'}}>
            <Text style={styles.description}>{Description}</Text>
            <Button style={styles.RessayerBtn} onPress={reloadSteps}>
              Réessayer
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}
