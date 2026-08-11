import React, {useEffect, useMemo, useState} from 'react';
import {View, ScrollView, Animated, Linking, TouchableOpacity} from 'react-native';
import {BaseColor, Images, useTheme} from '../../config';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
} from '../../components';
import * as Utils from '../../utils';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {getExhibitorDetails, addInterest} from '../../services/homePageService';
import LottieView from 'lottie-react-native';
import ToastUtils from '../../config/toastUtils';
import {useSelector} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import useAndroidBack from '../../hooks/useAndroidBack';

export default function ExhibitorDetail({navigation, route}) {
  const {id, isExhibitor} = route.params;
  const deltaY = new Animated.Value(0);
  const {colors} = useTheme();
  const {t} = useTranslation();
  const {user, permissions} = useSelector(state => state.auth);

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

  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const marginTopBanner = heightImageBanner - heightHeader - 40;

  // State
  const [loading, setLoading] = useState(true);
  const [interested, setInterested] = useState(false);
  const [interestedLoading, setInterestedLoading] = useState(false);
  const [exhibitorDetails, setExhibitorDetails] = useState(undefined);
  const [imageError, setImageError] = useState(false);

  // Get Exhibitor details
  const fetchData = async () => {
    try {
      setLoading(true);
      const apiResponse = await getExhibitorDetails(id);

      if (apiResponse?.code === 200) {
        setLoading(false);
        setExhibitorDetails(apiResponse?.requestData);
        // To Style The button 'Interest' if the user is interested with the exhibitor
        if (!apiResponse?.requestData?.followers) {
          setInterested(false);
        } else {
          const followersArray = apiResponse?.requestData?.followers
            .split(',')
            .map(f => f.trim())
            .filter(f => f !== '');
          const contains = followersArray.includes(String(user?.id));
          if (contains) {
            setInterested(true);
          } else {
            setInterested(false);
          }
        }
      } else {
        console.error("Error fetching Exhibitor Details: ", apiResponse);
        setLoading(false);
        setExhibitorDetails(null);
        ToastUtils.showErrorToast(
          t('error'),
          t(apiResponse?.message || 'Something_went_wrong'),
        );
      }
    } catch (error) {
      console.error('Error fetching Exhibitor Details:', error);
      setExhibitorDetails(null);
      ToastUtils.showErrorToast(t('error'), t('Something_went_wrong'));
    }
  };

  const showInterest = async () => {
    if (interestedLoading) return;

    try {
      setInterestedLoading(true);
      const apiResponse = await addInterest(id);

      if (apiResponse?.code === 200) {
        setInterested(apiResponse?.requestData === true);
      } else if (apiResponse?.code === 403) {
        ToastUtils.showErrorToast(t('error'), t(apiResponse?.message));
      } else {
        ToastUtils.showErrorToast(
          t('error'),
          apiResponse?.message || t('Something_went_wrong'),
        );
      }
    } catch (error) {
      console.error('Error adding interest:', error);
      ToastUtils.showErrorToast(t('error'), t('Something_went_wrong'));
    } finally {
      setInterestedLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    const loadData = async () => {
      await fetchData();
    };
    loadData();
  }, []);

  // Screen components
  const userFullName = useMemo(
    () =>
      `${exhibitorDetails?.first_name || ''} ${
        exhibitorDetails?.last_name || ''
      }`.trim(),
    [exhibitorDetails?.first_name, exhibitorDetails?.last_name],
  );

  const renderInfoSection = (title, value, hasBorder = true) => {
    const isPhone = title === 'phone_number';
    const isEmail = title === 'email';
    const isWebsite = title === 'website';

    const handlePress = () => {
      if (!value) return;

      if (isPhone) {
        Linking.openURL(`tel:${value}`);
      } else if (isEmail) {
        Linking.openURL(`mailto:${value}`);
      } else if (isWebsite) {
        const url = value.startsWith('http')
          ? value
          : `https://${value}`;

        Linking.openURL(url);
      }
    };

    const isClickable = isPhone || isEmail || isWebsite;

    if (value) {
      return (
        <View style={[styles.infoSection, hasBorder && styles.infoSectionBorder]}>
          <Text headline semibold>
            {t(title)}
          </Text>
  
          {isClickable ? (
            <TouchableOpacity onPress={handlePress}>
              <Text
                body2
                style={[
                  styles.infoValue,
                  {
                    color: colors.primary,
                    textDecorationLine: 'underline',
                  },
                ]}>
                {value || t('not_available')}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text body2 style={styles.infoValue}>
              {value || t('not_available')}
            </Text>
          )}
        </View>
      );
    }
  };

  const renderSpeaker = (speaker, index) => (
    <View
      key={index}
      style={[styles.speakerCard, {backgroundColor: colors.card}]}>
      <Image
        source={{uri: speaker.imagePath}}
        style={styles.speakerImage}
        defaultSource={Images.noImage}
      />
      <View style={styles.speakerInfo}>
        <Text style={[styles.speakerName, {color: colors.text}]}>
          {speaker.name}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            color: colors.text,
            fontSize: 13,
            flex: 1,
          }}>
          {speaker.post}
        </Text>
      </View>
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <LottieView
          source={Images.loading}
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
        <Text>{t('loading')}</Text>
      </View>
    );
  }

  // Error state
  if (exhibitorDetails === null) {
    return (
      <View style={{ flex: 1 }}>
        {/* <Header
          title=""
          renderLeft={() => (
            <Icon name="arrow-back" size={20} color="black" enableRTL />
          )}
          onPressLeft={navigation.goBack}
        /> */}
        <SafeAreaView style={{ flex: 1 }} edges={['right', 'left', 'bottom']}>
          <View style={styles.centerContainer}>
            <Text>{t('error_fetching_data')}</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <Animated.Image
        source={
          imageError || !exhibitorDetails?.imagePath
            ? Images.noImage
            : {uri: exhibitorDetails.imagePath}
        }
        style={[
          styles.imgBanner,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(200),
                Utils.scaleWithPixel(200),
              ],
              outputRange: [heightImageBanner, heightHeader, heightHeader],
            }),
          },
        ]}
        onError={() => setImageError(true)}
      />
      <Header
        title=""
        renderLeft={() => {
          return (
            <View style={{
                backgroundColor: 'rgba(0,0,0,0.45)',
                width: 34,
                height: 34,
                borderRadius: 17,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
            <Icon
              name="arrow-back"
              size={20}
              color={BaseColor.whiteColor}
              enableRTL={true}
            />
          </View>
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView style={{flex: 1}} edges={['right', 'left', 'bottom']}>
        <ScrollView
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {y: deltaY},
              },
            },
          ])}
          onContentSizeChange={() => setHeightHeader(Utils.heightHeader())}
          scrollEventThrottle={8}
        >
          <View style={{paddingHorizontal: 20}}>
            <View
              style={[
                styles.contentBoxTop,
                {
                  marginTop: marginTopBanner,
                  backgroundColor: colors.card,
                  shadowColor: colors.border,
                  borderColor: colors.border,
                  minHeight: exhibitorDetails?.bio ? 100 : 60,
                },
              ]}>
              <Text title2 semibold style={{marginBottom: 5}}>
                {userFullName}
              </Text>
              <View style={styles.organizationRow}>
                <Text subhead bold style={{color: colors.primary, fontSize: 18}}>
                  {exhibitorDetails?.organization_name}
                </Text>

                {isExhibitor && (
                  <View style={[styles.exhibitorBadge, {backgroundColor: colors.primary}]}>
                    <Text whiteColor caption1>
                      {t('exhibitor')}
                    </Text>
                  </View>
                )}
              </View>
              {exhibitorDetails?.Event?.hall && exhibitorDetails?.Event?.stand && (
                <View style={styles.locationRow}>
                  <Icon name="location-on" size={14} color={colors.primary} />
                  <Text footnote style={styles.locationText}>
                    {`${t('hall_num')} ` +
                      exhibitorDetails?.Event?.hall +
                      ` - ${t('stand_num')} ` +
                      exhibitorDetails?.Event?.stand}
                  </Text>
                </View>
              )}
            </View>
            {renderInfoSection('bio', exhibitorDetails?.bio)}
            {renderInfoSection('phone_number', exhibitorDetails?.phone)}
            {renderInfoSection('email', exhibitorDetails?.email)}
            {renderInfoSection('website', exhibitorDetails?.website)}
            {renderInfoSection('sector', exhibitorDetails?.company_sector)}
            {renderInfoSection('job_title', exhibitorDetails?.job_title)}
            {renderInfoSection('job_function', exhibitorDetails?.job_function)}
            {renderInfoSection('company_name', exhibitorDetails?.organization_name, false)}

            {exhibitorDetails?.speakers?.length > 0 && (
              <View style={styles.speakersSection}>
                <Text style={[styles.sectionTitle, {color: colors.text}]}>
                  {t('speakers')}
                </Text>
                {exhibitorDetails?.speakers?.map(renderSpeaker)}
              </View>
            )}
          </View>
        </ScrollView>
        
        <View
          style={[
            styles.contentButtonBottom,
            {borderTopColor: colors.border, backgroundColor: colors.card},
          ]}
        >
          <Button
            onPress={showInterest}
            style={[
              styles.interestButton,
              {
                backgroundColor:
                  interested && !interestedLoading
                    ? colors.primary
                    : BaseColor.whiteColor,
                borderColor: colors.primary,
              },
            ]}
            outline={interestedLoading}
            loading={interestedLoading}
            disabled={interestedLoading}
          >
            {!interestedLoading && (
              <Icon
                name={interested ? 'thumb-up' : 'thumb-up-off-alt'}
                size={20}
                color={interested ? colors.white : colors.primary}
              />
            )}
          </Button>

          {permissions?.includes('send_virtuel_meeting_exhibitor') && (
            <Button
              onPress={() =>
                navigation.navigate(
                  'RequestAVMeeting', 
                  {exhibitor: exhibitorDetails, isExhibitor: true},
                )
              }
              style={styles.meetingButton}>
              <Icon
                name="laptop"
                size={20}
                color={BaseColor.whiteColor}
              />
            </Button>
          )}
          
          {permissions?.includes('send_meeting') && (
            <Button
              onPress={() =>
                navigation.navigate('RequestAmeeting', {
                  exhibitor: exhibitorDetails,
                })
              }
              style={styles.meetingButton}>
              <Icon
                name="calendar-month"
                size={20}
                color={BaseColor.whiteColor}
              />
            </Button>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};