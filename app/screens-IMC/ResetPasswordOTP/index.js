import React, {useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  Image,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {BaseStyle, Images, useTheme} from '../../config';
import {
  Header,
  SafeAreaView,
  Icon,
  Button,
  TextInput,
  OtpInput,
} from '../../components';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {resetPassword} from '../../reducers/resetPasswordSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import ToastUtils from "../../config/toastUtils";

export default function ResetPasswordOTP({navigation, route}) {
  const {otpCode} = route.params;

  const {theme, colors} = useTheme();
  const {t} = useTranslation();

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(true);
  const [otpError, setOtpError] = useState('');

  const dispatch = useDispatch();
  const {loading, message, success, error} = useSelector(state => state.resetPassword);

  const handleResetPassword = async () => {
    if (otp !== otpCode) {
      setOtpError(t('otp_not_valid'));
    } else {
      setOtpError('');
    }

    if (!newPassword) {
      setNewPasswordError(t('required_password_err'));
      return false;
    } else if (newPassword.length < 6) {
      setNewPasswordError(t('password_length_err'));
      return false;
    } else {
      setNewPasswordError('');
    }

    if (!confirmPassword) {
      setConfirmPasswordError(t('confirm_password_err'));
      return false;
    } else if (confirmPassword.length < 6) {
      setConfirmPasswordError(t('confirm_password_length_err'));
      return false;
    } else if (confirmPassword !== newPassword) {
      setConfirmPasswordError(t('inmatch_password_err'));
      return false;
    } else {
      setConfirmPasswordError('');
    }

    try {
      const actionResult = await dispatch(
        resetPassword({otp, password: newPassword}),
      );
      const result = unwrapResult(actionResult);

      if (result?.code == 200) {
        ToastUtils.showSuccessToast(t('success'), t(result?.message));
        navigation.navigate('SignIn');
      }
    } catch (err) {
      ToastUtils.showErrorToast(t('error'), `${t(err?.message)}`);
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('reset_password')}
        renderLeft={() => (
          <Icon
            name="arrow-back"
            size={20}
            color={colors.primary}
            enableRTL={true}
          />
        )}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView style={[BaseStyle.safeAreaView, {backgroundColor: colors.background}]}>
        <View style={{flex: 1}}>
          <Image source={theme.dark ? Images.LoginBGDark : Images.LoginBG} style={styles.bottomImage} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            style={{flex: 1}}>
            <ScrollView
              contentContainerStyle={{flexGrow: 1}}
              keyboardShouldPersistTaps="handled">
              <Animated.Image source={Images.appLogo} style={styles.appLogo} />
              <View style={styles.container}>
                <View style={[styles.otpView, {backgroundColor: colors.card}]}>
                  <Text style={[styles.instructions, {color: colors.text}]}>{t('otp_code_title')}</Text>
                  <OtpInput onCodeFilled={code => setOtp(code)} />
                  {otpError && otpError?.length !== 0 && (
                    <Text style={styles.errormessage}>{otpError}</Text>
                  )}
                  <View style={styles.InputContainer}>
                    <Icon
                      name="lock"
                      size={20}
                      color="#000"
                      style={styles.leftIcon}
                    />
                    <TextInput
                      onChangeText={text => setNewPassword(text)}
                      placeholder={t('password')}
                      style={[styles.placeholderInput, {marginTop: 10, backgroundColor: colors.background}]}
                      secureTextEntry={passwordVisibility}
                      value={newPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setPasswordVisibility(!passwordVisibility)}
                      style={styles.eyeIconContainer}>
                      <Icon
                        name={passwordVisibility ? 'visibility-off' : 'visibility'}
                        size={20}
                        color={colors.text}
                      />
                    </TouchableOpacity>
                  </View>
                  {newPasswordError && newPasswordError?.length !== 0 && (
                    <Text style={styles.errormessage}>{newPasswordError}</Text>
                  )}
                  <View style={styles.InputContainer}>
                    <Icon
                      name="lock"
                      size={20}
                      color="#000"
                      style={styles.leftIcon}
                    />
                    <TextInput
                      onChangeText={text => setConfirmPassword(text)}
                      placeholder={t('confirm_password')}
                      style={[styles.placeholderInput, {marginTop: 10, backgroundColor: colors.background}]}
                      secureTextEntry={confirmPasswordVisibility}
                      value={confirmPassword}
                      autoCapitalize="none"
                      onSubmitEditing={() => handleResetPassword()}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setConfirmPasswordVisibility(!confirmPasswordVisibility)
                      }
                      style={styles.eyeIconContainer}>
                      <Icon
                        name={confirmPasswordVisibility ? 'visibility-off' : 'visibility'}
                        size={20}
                        color={colors.text}
                      />
                    </TouchableOpacity>
                  </View>
                  {confirmPasswordError &&
                    confirmPasswordError?.length !== 0 && (
                      <Text style={styles.errormessage}>
                        {confirmPasswordError}
                      </Text>
                    )}
                  <Button
                    style={styles.button}
                    full
                    loading={loading}
                    onPress={() => handleResetPassword()}>
                    {t('send')}
                  </Button>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </View>
  );
}
