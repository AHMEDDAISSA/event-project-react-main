import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  Share,
  Platform,
  StatusBar,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';
import { useTheme } from '../../config';
import { Header, SafeAreaView, Icon, Text } from '../../components';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import useAndroidBack from '../../hooks/useAndroidBack';
import NetInfo from '@react-native-community/netinfo';

export default function MyQRCodeScreen({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user, type } = useSelector(state => state.auth);

  useAndroidBack();

  // Handle No Internet Connection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        navigation.navigate('NoInternetScreen');
      }
    });
    return () => unsubscribe();
  }, [navigation]);

  // Entrance animations
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Build QR data (same format as QRScannerScreen expects)
  const userType = type ?? 'visitor';
  const userId = user?.id;
  const qrValue = `imc-event:${userType}:${userId}`;

  // User display data
  const displayName =
    type === 'exhibitor'
      ? `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim()
      : user?.name ?? '';
  const displayCompany =
    type === 'exhibitor' ? user?.organization_name : user?.company_name;
  const hallStand =
    type === 'exhibitor' && user?.Event?.hall && user?.Event?.stand
      ? `${t('hall_num')} ${user.Event.hall}  ·  ${t('stand_num')} ${user.Event.stand}`
      : null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${displayName}\n${displayCompany ?? ''}\n\n${t('qr_share_message')}`,
        title: t('my_qr_code'),
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title={t('my_qr_code')}
        renderLeft={() => (
          <Icon name="arrow-back" size={20} color={colors.primary} enableRTL={true} />
        )}
        onPressLeft={() => navigation.goBack()}
        renderRight={() => (
          <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
            <Icon name="share" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
        <View style={styles.container}>
          {/* Subtitle */}
          <Animated.View
            style={[
              styles.subtitleRow,
              { opacity: opacityAnim, transform: [{ translateY: slideAnim }] },
            ]}>
            <Text body2 style={[styles.subtitle, { color: colors.text }]}>
              {t('qr_subtitle')}
            </Text>
          </Animated.View>

          {/* Card */}
          <Animated.View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}>
            {/* Decorative top strip */}
            <View style={[styles.cardTopStrip, { backgroundColor: colors.primary }]}>
              <Text
                style={styles.cardTopLabel}
                numberOfLines={1}>
                {t('event_passport')}
              </Text>
            </View>

            {/* QR Code */}
            <View style={styles.qrWrapper}>
              {userId ? (
                <QRCode
                  value={qrValue}
                  size={220}
                  backgroundColor="white"
                  color="#1a1a2e"
                  quietZone={12}
                />
              ) : (
                <View style={styles.qrPlaceholder}>
                  <Icon name="qr-code-2" size={100} color={colors.border} />
                </View>
              )}
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* User Info */}
            <View style={styles.infoBlock}>
              {/* Role badge */}
              <View style={[styles.roleBadge, { backgroundColor: `${colors.primary}18` }]}>
                <Icon
                  name={type === 'exhibitor' ? 'business' : 'person'}
                  size={13}
                  color={colors.primary}
                  style={{ marginRight: 5 }}
                />
                <Text
                  style={[styles.roleText, { color: colors.primary }]}
                  numberOfLines={1}>
                  {type === 'exhibitor' ? t('exhibitor_label') : t('visitor_label')}
                </Text>
              </View>

              <Text
                style={[styles.nameText, { color: colors.text }]}
                numberOfLines={1}>
                {displayName}
              </Text>

              {displayCompany ? (
                <Text
                  style={[styles.companyText, { color: colors.primary }]}
                  numberOfLines={1}>
                  {displayCompany}
                </Text>
              ) : null}

              {hallStand ? (
                <View style={styles.locationRow}>
                  <Icon name="location-on" size={13} color={colors.text} />
                  <Text
                    style={[styles.locationText, { color: colors.text }]}
                    numberOfLines={1}>
                    {hallStand}
                  </Text>
                </View>
              ) : null}
            </View>
          </Animated.View>


          <Animated.View style={{ opacity: opacityAnim, marginTop: 24 }}>
            <Text
              body2
              style={[styles.hintText, { color: colors.text }]}>
              {t('qr_hint')}
            </Text>
          </Animated.View>


          <Animated.View
            style={[styles.shareButtonWrapper, { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}>
            <TouchableOpacity
              style={[styles.shareButton, { backgroundColor: colors.primary }]}
              onPress={handleShare}
              activeOpacity={0.85}>
              <Icon name="share" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.shareButtonText}>{t('share_qr')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.scanButton, { borderColor: colors.primary }]}
              onPress={() => navigation.navigate('QRScannerScreen')}
              activeOpacity={0.85}>
              <Icon name="qr-code-scanner" size={20} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.scanButtonText, { color: colors.primary }]}>
                {t('scan_qr_code')}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}
