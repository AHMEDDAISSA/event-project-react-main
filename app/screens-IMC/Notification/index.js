import React, {useEffect, useState} from 'react';
import {RefreshControl, FlatList, View, Text} from 'react-native';
import {BaseStyle, useTheme, Images} from '../../config';
import {useTranslation} from 'react-i18next';
import {Header, SafeAreaView, Icon, NotificationItem} from '../../components';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import { markNotifAsRead } from '../../services/userService';
import {checkAuth } from '../../reducers/authSlice';
import LottieView from 'lottie-react-native';
import NetInfo from '@react-native-community/netinfo';

export default function Notification({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();

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

  const [refreshing] = useState(false);
  const {notifications} = useSelector(state => state.auth);

  const markAsRead = async id => {
    try {
      const response = await markNotifAsRead(id);      
      if (response.code == 200) {
        dispatch(checkAuth());
      } else {
        console.log("markasread error", response);
      }
    } catch (error) {
      console.log("markasread error", error);
    } finally {
      //
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('notification')}
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
        <FlatList
          contentContainerStyle={{
            flexGrow: 1, 
            paddingHorizontal: 20, 
            paddingVertical: 10,
            justifyContent: notifications.length === 0 ? 'center' : 'flex-start', 
          }}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={() => {}}
            />
          }
          showsVerticalScrollIndicator={false} 
          persistentScrollbar={false}
          data={notifications}
          keyExtractor={(item, index) => item.id}
          renderItem={({item, index}) => (
            <NotificationItem
              is_read={item.is_read}
              title={item.title}
              note={item.note}
              notifDate={item.created_at}
              style={{marginBottom: 5}}
              onPress={()=>{markAsRead(item.id)}}
            />
          )}
          ListEmptyComponent={() => (
            <View
              style={{alignItems: 'center'}}>
              <LottieView
                source={Images.no_data}
                autoPlay
                loop
                style={{width: 200, height: 200}}
              />
              <Text style={{color: colors.text}}>{t('nodata_notifications')}</Text>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}
