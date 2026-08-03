import React, {useRef, useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ScrollView,
} from 'react-native';
import {BaseStyle, useTheme, Images, FontWeight} from '../../config';
import {Button, SafeAreaView, Text, TextInput} from '../../components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { login, loadData } from '../../reducers/authSlice';
import { getMessaging } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import ToastUtils from "../../config/toastUtils";

export default function SignIn({navigation}) {
  const {theme, colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);
  
  const [deviceToken, setDeviceToken] = useState('');
  const getFCMToken = async () => {
    const messaging = getMessaging(getApp());
    try {
      const fcmToken = await messaging.getToken();
      if (fcmToken) {
        setDeviceToken(fcmToken);
        console.log('FCM Token:', fcmToken);
      } else {
        console.log('Failed to get FCM token');
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  };

  useEffect(() => {
    getFCMToken();
  }, []);

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailValidError, setEmailValidError] = useState('');
  const [PasswordValidError, setPasswordValidError] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  const emailRef = useRef(null); 
  const passwordRef = useRef(null);

  const onLogin = () => {
    setLoading(true);
    setEmailValidError('');
    setPasswordValidError('');

    if (!email || !password) {
      setEmailValidError(t('email_err'));
      setPasswordValidError(t('required_password_err'));
      setLoading(false);
      return;
    }
    if (!emailPattern.test(email)) {
      setEmailValidError(t('invalid_email_err'));
      setLoading(false);
      return;
    }

    Keyboard.dismiss();

    dispatch(login({ email, password, deviceToken }))
      .unwrap()
      .then(() => {
        setLoading(false);
        dispatch(loadData());
        // navigation.navigate('Main');
        navigation.reset({
          index: 0,
          routes: [{name: 'Main'}],
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log("login err: ",err, { email, password, deviceToken });
        ToastUtils.showErrorToast(`${t('error')}`, `${t(err)}`);
      });
  };  

  const scrollViewRef = useRef(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    // Cleanup function to remove listeners when the component unmounts
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView
        style={[BaseStyle.safeAreaView]}
        edges={['right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          style={{flex: 1}}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            <Image source={Images.appLogo} style={[styles.appLogo]} />
            <Image source={theme.dark ? Images.LoginBGDark : Images.LoginBG} style={styles.bottomImage} />

            <View style={[styles.container, {backgroundColor: colors.card, marginBottom: isKeyboardVisible && '10%'}]}>
              <View style={styles.InputContainer}>
                <MaterialIcons
                  name="email"
                  size={20}
                  color="#000"
                  style={styles.leftIcon}
                />
                <TextInput
                  innerRef={emailRef}
                  onChangeText={text => setemail(text)}
                  placeholder={t('email')}
                  style={[styles.placeholderInput, {marginTop: 10, backgroundColor: colors.background}]}
                  keyboardType={"email-address"}
                  value={email}
                  autoCapitalize="none"
                  autoCompleteType="email"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  blurOnSubmit={false}
                />
              </View>

              {emailValidError.length !== 0 && (
                <Text style={styles.errormessage}>{emailValidError}</Text>
              )}

              <View style={styles.InputContainer}>
                <MaterialIcons
                  name="lock"
                  size={20}
                  color="#000"
                  style={styles.leftIcon}
                />
                <TextInput
                  innerRef={passwordRef}
                  style={[styles.placeholderInput, {marginTop: 10, backgroundColor: colors.background}]}
                  onChangeText={text => setPassword(text)}
                  secureTextEntry={passwordVisibility}
                  placeholder={t('password')}
                  value={password}
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => onLogin()}
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisibility(!passwordVisibility)}
                  style={styles.eyeIconContainer}>
                  <MaterialIcons
                    name={passwordVisibility ? 'visibility-off' : 'visibility'}
                    size={20}
                    color={colors.text}
                  />
                </TouchableOpacity>
              </View>

              {PasswordValidError.length !== 0 && (
                <Text style={styles.errormessage}>{PasswordValidError}</Text>
              )}

              <Button
                disabled={loading}
                style={{marginTop: 20}}
                full
                loading={loading}
                onPress={onLogin}>
                  <Text semibold style={{color: 'white'}}>{loading ? t('logging_in') : t('sign_in')}</Text>
              </Button>

              <TouchableOpacity
                onPress={() => navigation.navigate('ResetPassword')}>
                <Text body1 grayColor style={{marginTop: 25}}>
                  {t('reset_password')}
                </Text>
              </TouchableOpacity>

              {/* Register Button */}
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={{marginTop: 15}}>
                  {t('not_having_account')}
                  <Text
                    style={{
                      marginTop: 15,
                      color: colors.primary,
                      fontSize: 16,
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}>
                    {' '}{t('sign_up')}
                  </Text>
                </Text>
              </TouchableOpacity>

              {/* Separation */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 10
              }}>
                <View style={{flex: 1, height: 1, backgroundColor: '#e1e1e1'}} />
                <Text style={{width: 'auto', paddingHorizontal: 10, color: '#999'}}>
                  {t('or')}
                </Text>
                <View style={{flex: 1, height: 1, backgroundColor: '#e1e1e1'}} />
              </View>

              {/* Register Exhibitor Button */}
              <TouchableOpacity onPress={() => navigation.navigate('SignUpExhibitor')}>
                <Text 
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                    textAlign: 'center',
                    fontWeight: FontWeight.semibold,
                  }}
                >
                  {t('book_a_stand')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
