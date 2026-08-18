import React, {useState, useEffect} from 'react';
import {View, ScrollView, TouchableOpacity, Modal} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {BaseStyle, useTheme, BaseSetting} from '../../config';

import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  ProfileDetail,
} from '../../components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {logout} from '../../reducers/authSlice';
import { fetchRegisterDataThunk } from '../../reducers/registerDataSlice'; 
import NetInfo from '@react-native-community/netinfo';

export default function Profile({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [loading, setLoading] = useState(false);
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

  const {user, type, permissions} = useSelector(state => state.auth);
  const imageUrl = user?.imagePath || '';

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const onLogOut = () => {
    setLoading(true);
    dispatch(logout()).then(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      });
    });
  };

  useEffect(() => { 
    dispatch(fetchRegisterDataThunk());
  }, []);

  const hasConnectionPermission = (permissions) => {
    const requiredPermissions = [
      'receive_virtuel_meeting',
      'send_virtuel_meeting',
      'receive_meeting',
      'send_meeting'
    ];
    
    return permissions?.some(permission => 
      requiredPermissions?.includes(permission)
    );
  };

  const hasMeetingPermission = (permissions) => permissions?.includes('send_meeting') || permissions?.includes('receive_meeting');

  const hasVirtualMeetingPermission = (permissions) => permissions?.includes('send_virtuel_meeting') || permissions?.includes('receive_virtuel_meeting');

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('profile')}
        renderRight={() => {
          return <Icon name="notifications" size={24} color={colors.primary} />;
        }}
        onPressRight={() => {
          navigation.navigate('Notification');
        }}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['left', 'right']}>
        <ScrollView>
          <View style={styles.contain}>
            <ProfileDetail
              image={{uri: imageUrl}}
              textFirst={type == 'exhibitor' ? user?.first_name : user?.name  || ''}
              textSecond={user?.email || ''}
              textThird={type == 'exhibitor' ? user?.organization_name : user?.company_name || ''}
              onPress={() => navigation.navigate('ProfileEdit')}
              centered={true}
            />

            {/* ── My QR Code ────────────────────────────────────── */}
            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => navigation.navigate('MyQRCodeScreen')}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name="qr-code-2"
                  size={18}
                  color={colors.primary}
                  style={{marginRight: 5}}
                  enableRTL={true}
                />
                <Text body1>{t('my_qr_code')}</Text>
              </View>
              <Icon
                name="chevron-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>

            {/* ── My Contacts ───────────────────────────────────── */}
            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => navigation.navigate('MyContactsScreen')}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name="bookmark"
                  size={18}
                  color={colors.primary}
                  style={{marginRight: 5}}
                  enableRTL={true}
                />
                <Text body1>{t('my_contacts')}</Text>
              </View>
              <Icon
                name="chevron-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            {
              type == 'exhibitor' && (
                <TouchableOpacity
                  style={[
                    styles.profileItem,
                    {
                      borderBottomColor: colors.border,
                      borderBottomWidth: 1,
                    },
                  ]}
                  onPress={() => {
                    navigation.navigate('MySpeakersScreen');
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      name="assignment-ind"
                      size={18}
                      color={colors.primary}
                      style={{marginRight: 5}}
                      enableRTL={true}
                    />
                    <Text body1>{t('my_speakers')}</Text>
                  </View>
                  <Icon
                    name="chevron-right"
                    size={18}
                    color={colors.primary}
                    style={{marginLeft: 5}}
                    enableRTL={true}
                  />
                </TouchableOpacity>
              )
            }
            {
              type == 'exhibitor' && (
                <TouchableOpacity
                  style={[
                    styles.profileItem,
                    {
                      borderBottomColor: colors.border,
                      borderBottomWidth: 1,
                    },
                  ]}
                  onPress={() => {
                    navigation.navigate('InterestsScreen');
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      name="check-circle"
                      size={18}
                      color={colors.primary}
                      style={{marginRight: 5}}
                      enableRTL={true}
                    />
                    <Text body1>{t('my_interests')}</Text>
                  </View>
                  <Icon
                    name="chevron-right"
                    size={18}
                    color={colors.primary}
                    style={{marginLeft: 5}}
                    enableRTL={true}
                  />
                </TouchableOpacity>
              )
            }
            <TouchableOpacity
              style={[
                styles.profileItem,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: 1,
                },
              ]}
              onPress={() => {
                navigation.navigate('InterestedInYou');
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name="sentiment-very-satisfied"
                  size={18}
                  color={colors.primary}
                  style={{marginRight: 5}}
                  enableRTL={true}
                />
                <Text body1>{t('intersted_in_you')}</Text>
              </View>
              <Icon
                name="chevron-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            {hasConnectionPermission(permissions) && (
              <TouchableOpacity
                style={[
                  styles.profileItem,
                  { borderBottomColor: colors.border, borderBottomWidth: 1 },
                ]}
                onPress={() => setIsMenuVisible(!isMenuVisible)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    name="handshake"
                    size={18}
                    color={colors.primary}
                    style={{ marginRight: 5 }}
                    enableRTL={true}
                  />
                  <Text body1>{t('my_connections')}</Text>
                </View>
                <Icon
                  name={isMenuVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                  size={18}
                  color={colors.primary}
                  style={{ marginLeft: 5 }}
                  enableRTL={true}
                />
              </TouchableOpacity>
            )}

            {/* Dropdown Menu (Conditional Rendering) */}
            {isMenuVisible && (
              <View style={styles.dropdownMenu}>
                {hasMeetingPermission(permissions) && (
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      {
                        borderBottomColor: colors.border,
                        borderBottomWidth: 1,
                      },
                    ]}
                    onPress={() => {
                      setIsMenuVisible(false);
                      navigation.navigate('MyConnections');
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon
                        name="handshake"
                        size={18}
                        color={colors.primary}
                        style={{ marginRight: 5 }}
                        enableRTL={true}
                      />
                      <Text>{t('meeting')}</Text>
                    </View>                  
                  </TouchableOpacity>
                )}
                {hasVirtualMeetingPermission(permissions) && (
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      {
                        borderBottomColor: colors.border,
                        borderBottomWidth: 1,
                      },
                    ]}
                    onPress={() => {
                      setIsMenuVisible(false);
                      navigation.navigate('MyConnectionsVM');
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon
                        name="laptop"
                        size={18}
                        color={colors.primary}
                        style={{ marginRight: 5 }}
                        enableRTL={true}
                      />
                      <Text>{t('virtual_meeting')}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}
            {permissions?.includes('conferences') && (
              <TouchableOpacity
                style={[
                  styles.profileItem,
                  {
                    borderBottomColor: colors.border,
                    borderBottomWidth: 1,
                  },
                ]}
                onPress={() => {
                  navigation.navigate('MySchedule');
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="calendar-month"
                    size={18}
                    color={colors.primary}
                    style={{marginRight: 5}}
                    enableRTL={true}
                  />
                  <Text body1>{t('my_schedule')}</Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={18}
                  color={colors.primary}
                  style={{marginLeft: 5}}
                  enableRTL={true}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.profileItem,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: 1,
                },
              ]}
              onPress={() => {
                navigation.navigate('ChangePassword');
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name="lock-outline"
                  size={18}
                  color={colors.primary}
                  style={{marginRight: 5}}
                  enableRTL={true}
                />
                <Text body1>{t('change_password')}</Text>
              </View>
              <Icon
                name="chevron-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileItem,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: 1,
                },
              ]}
              onPress={() => {
                navigation.navigate('Setting');
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name="settings"
                  size={18}
                  color={colors.primary}
                  style={{marginRight: 5}}
                  enableRTL={true}
                />
                <Text body1>{t('setting')}</Text>
              </View>
              <Icon
                name="chevron-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
          <Button full loading={loading} onPress={onLogOut} style={{backgroundColor: colors.danger}}>
            <Text semibold style={{color: 'white'}}>{t('sign_out')}</Text>
          </Button>
        </View>
        <View style={styles.appVersion}>
          <Text semibold>{t('app_version')}{'  '}</Text>
          <Text bold>{BaseSetting.appVersion}</Text>
        </View>

      </SafeAreaView>
    </View>
  );
}
