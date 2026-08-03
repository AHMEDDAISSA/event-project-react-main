import React, {useEffect, useState} from 'react';
import {View, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {BaseStyle, useTheme} from '../../config';
import {Header, SafeAreaView, Icon, Text, TextInput, Button} from '../../components';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import NetInfo from '@react-native-community/netinfo';
import useAndroidBack from '../../hooks/useAndroidBack';

export default function RepresentativesScreen({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

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

  useAndroidBack();

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('meet_our_representatives')}
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
        style={[
          BaseStyle.safeAreaView,
          {justifyContent: 'center', alignItems: 'center'},
        ]}
        edges={['right', 'left', 'bottom']}>
        <Text title2 bold>
          {' '}
          Meet our Representatives Page{' '}
        </Text>
      </SafeAreaView>
    </View>
  );
}
