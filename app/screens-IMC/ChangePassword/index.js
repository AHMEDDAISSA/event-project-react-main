import React, {useEffect, useState} from 'react';
import {View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity} from 'react-native';
import {BaseStyle, useTheme} from '../../config';
import {useTranslation} from 'react-i18next';
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '../../components';
import styles from './styles';
import resetPasswordService from '../../services/resetPasswordService';
import ToastUtils from "../../config/toastUtils";
import NetInfo from '@react-native-community/netinfo';

export default function ChangePassword({navigation}) {
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  // Handle No Internet Connection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        navigation.navigate('NoInternetScreen');
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    rePassword: '',
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const {colors} = useTheme();

  const validateInputs = () => {
    let valid = true;
    const newErrors = {
      oldPassword: '',
      newPassword: '',
      rePassword: '',
    };

    if (!oldPassword) {
      newErrors.oldPassword = t('old_password_required');
      valid = false;
    } else if (oldPassword.length < 6) {
      newErrors.oldPassword = t('password_length_err');
      valid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = t('required_password_err');
      valid = false;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = t('password_length_err');
      valid = false;
    }

    if (!rePassword) {
      newErrors.rePassword = t('confirm_password_err');
      valid = false;
    } else if (newPassword !== rePassword) {
      newErrors.rePassword = t('inmatch_password_err');
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      setLoading(true);
      try {
        const payload = {
          old_password: oldPassword,
          password: newPassword
        };
        
        const updatedPassword = await resetPasswordService.changePassword(payload);
        if (updatedPassword?.code == 200) {
          ToastUtils.showSuccessToast(
            `${t('success')}`,
            `${t(updatedPassword?.message ?? 'msg-success-password_update')}`,
          );
          navigation.goBack();
        } else if (updatedPassword?.code == 403) {
          ToastUtils.showErrorToast(
            `${t('error')}`,
            `${t(updatedPassword?.message)}`,
          );
        } else{
          ToastUtils.showErrorToast(
            `${t('error')}`,
            t('Something_went_wrong'),
          );
        }
      } catch (error) {
        console.log('Update failed:', error);
        const message = error?.message ?? 'Something_went_wrong'; 
        ToastUtils.showErrorToast(
          `${t('error')}`,
          `${t(message)}`,
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('change_password')}
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
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1, justifyContent: 'center'}}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center',
              padding: 20,
            }}>
            {/* Old Password Field */}
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('old_password')}
              </Text>
            </View>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                onChangeText={text => {
                  setOldPassword(text);
                  setErrors({...errors, oldPassword: ''});
                }}
                secureTextEntry={!showOldPassword}
                placeholder={t('old_password')}
                value={oldPassword}
                icon={
                  <TouchableOpacity
                    style={[styles.eyeIcon, {backgroundColor: colors.card}]}
                    onPress={() => setShowOldPassword(!showOldPassword)}>
                    <Icon
                      name={showOldPassword ? 'visibility-off' : 'visibility'}
                      size={20}
                      color={colors.text}
                    />
                  </TouchableOpacity>
                }
              />
            </View>
            {errors.oldPassword ? (
              <Text style={{color: 'red', fontSize: 12}}>
                {errors.oldPassword}
              </Text>
            ) : null}

            {/* New Password Field */}
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('password')}
              </Text>
            </View>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                onChangeText={text => {
                  setNewPassword(text);
                  setErrors({...errors, newPassword: ''});
                }}
                secureTextEntry={!showNewPassword}
                placeholder={t('password')}
                value={newPassword}
                icon={
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Icon
                      name={showNewPassword ? 'visibility-off' : 'visibility'}
                      size={20}
                      color={colors.text}
                    />
                  </TouchableOpacity>
                }
              />
            </View>
            {errors.newPassword ? (
              <Text style={{color: 'red', fontSize: 12}}>
                {errors.newPassword}
              </Text>
            ) : null}

            {/* Confirm Password Field */}
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('password_confirm')}
              </Text>
            </View>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                onChangeText={text => {
                  setRePassword(text);
                  setErrors({...errors, rePassword: ''});
                }}
                secureTextEntry={!showRePassword}
                placeholder={t('password_confirm')}
                value={rePassword}
                icon={
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowRePassword(!showRePassword)}>
                    <Icon
                      name={showRePassword ? 'visibility-off' : 'visibility'}
                      size={20}
                      color={colors.text}
                    />
                  </TouchableOpacity>
                }
              />
            </View>
            {errors.rePassword ? (
              <Text style={{color: 'red', fontSize: 12}}>
                {errors.rePassword}
              </Text>
            ) : null}

            <View style={{paddingVertical: 15}}>
              <Button
                loading={loading}
                full
                onPress={handleSubmit}>
                {t('confirm')}
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
