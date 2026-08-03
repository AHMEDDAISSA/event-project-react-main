import React, {useRef, useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {BaseStyle, useTheme, Images} from '../../config';
import {Header, SafeAreaView, Icon, TextInput, Button, Text} from '../../components';
import styles from './styles';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import * as Utils from '../../utils';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import { resetPasswordOTP } from '../../reducers/resetPasswordSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import ToastUtils from "../../config/toastUtils";

export default function ResetPassword({navigation}) {
  const {t} = useTranslation();
  const {theme, colors} = useTheme();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [email, seteEmail] = useState('');
  const emailRef = useRef(null);
  const [emailValidError, setEmailValidError] = useState('');
  const dispatch = useDispatch();
  const { loading, message, success, error } = useSelector(state => state.resetPassword);

  const onReset = async () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (email == '') {
      setEmailValidError(t('email_err'));
    } else if (!emailPattern.test(email)) {
      setEmailValidError(t('invalid_email_err'));
    } else {
      setEmailValidError('');
      Keyboard.dismiss();
      try {
        const actionResult = await dispatch(resetPasswordOTP(email));
        const result = unwrapResult(actionResult);

        if (result?.code == 200) {
          const otpCode = result.requestData;
          console.log('result:', result);
          console.log('Received OTP:', otpCode);
          ToastUtils.showSuccessToast(t('success'), t(result?.message));
          navigation.navigate('ResetPasswordOTP', {otpCode});
        }else if(result?.code == 403){
          setEmailValidError(`${t(result?.message ?? '')}`);
        } else {
          ToastUtils.showErrorToast(t('error'), `${t(result?.message)}`);
        }
      } catch (err) {
        console.log('Failed to send OTP:', err);
        if(err?.code == 403){
          setEmailValidError(`${t(err?.message ?? '')}`);
        } else {
          ToastUtils.showErrorToast(t('error'), `${t(err?.message)}`);
        }
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1}}>
        <Header
          title={t('reset_password')}
          renderLeft={() => {
            return (
              <Icon
                name="arrow-back"
                size={20}
                color={colors.primary}
                enableRTL={true}
              />
            );
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />
        <SafeAreaView
          style={[BaseStyle.safeAreaView, {backgroundColor: colors.background}]}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={offsetKeyboard}
            style={{flex: 1}}>
            <Animated.Image
              source={Images.appLogo}
              style={[styles.imageBackground]}
            />
          </KeyboardAvoidingView>

          <View style={styles.centeredCard}>
            <View style={[styles.cardContainer, {backgroundColor: colors.card}]}>
              <View style={styles.InputContainer}>
                <MaterialIcons
                  name="email"
                  size={20}
                  color="#000"
                  style={styles.leftIcon}
                />
                <TextInput
                  innerRef={emailRef}
                  onChangeText={text => seteEmail(text)}
                  placeholder={t('email')}
                  style={[styles.placeholderInput, {marginTop: 10, backgroundColor: colors.background}]}
                  keyboardType={'email-address'}
                  value={email}
                  autoCapitalize="none"
                  autoCompleteType="email"
                  returnKeyType="next"
                  onSubmitEditing={() => onReset()}
                  blurOnSubmit={false}
                />
              </View>
              {emailValidError && emailValidError?.length !== 0 && (
                <Text style={styles.errormessage}>{emailValidError}</Text>
              )}
              <Button
                style={{marginTop: 20}}
                full
                loading={loading}
                onPress={() => {
                  onReset();
                }}>
                {t('continue')}
              </Button>
            </View>
          </View>
          <Image
            source={theme.dark ? Images.LoginBGDark : Images.LoginBG}
            style={{height: Utils.scaleWithPixel(200), width: '100%'}}
          />
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}
