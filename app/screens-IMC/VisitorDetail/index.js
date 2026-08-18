import React, {useEffect, useState} from 'react';
import {View, ScrollView, Animated, TouchableOpacity, Linking} from 'react-native';
import {BaseColor, Images, useTheme} from '../../config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
} from '../../components';
import * as Utils from '../../utils';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {getVisitorDetails, addInterestToVisitor} from '../../services/visitorService';
import LottieView from 'lottie-react-native';
import ToastUtils from '../../config/toastUtils';
import {useSelector, useDispatch} from 'react-redux';
import {saveContact, removeContact, optimisticSave, optimisticRemove} from '../../reducers/contactsSlice';
import NetInfo from '@react-native-community/netinfo';
import useAndroidBack from '../../hooks/useAndroidBack';

export default function VisitorDetail({navigation, route}) {
  const {id} = route.params;
  const deltaY = new Animated.Value(0);
  const {colors} = useTheme();
  const {t} = useTranslation();
  const {user, permissions} = useSelector(state => state.auth);
  const {savedIds, saving} = useSelector(state => state.contacts);
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
  
  useAndroidBack();

  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const marginTopBanner = heightImageBanner - heightHeader - 40;

  // State
  const [loading, setLoading] = useState(true);
  const [interested, setInterested] = useState(false);
  const [interestedLoading, setInterestedLoading] = useState(false);
  const [visitorDetails, setVisitorDetails] = useState(undefined);
  const [imageError, setImageError] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiResponse = await getVisitorDetails(id);
      
      if (apiResponse?.code === 200) {
        const details = apiResponse?.requestData;
        setVisitorDetails(details);
        // To Style The button 'Interest' if the user is interested with the visitor
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
        console.error("Error fetching Visitor Details:", apiResponse);
        setVisitorDetails(null);
        ToastUtils.showErrorToast(
          t('error'),
          t(apiResponse?.message || 'Something_went_wrong')
        );
      }
    } catch (error) {
      console.error('Error fetching Visitor Details:', error);
      setVisitorDetails(null);
      ToastUtils.showErrorToast(t('error'), t('Something_went_wrong'));
    } finally {
      setLoading(false);
    }
  };

  const showInterest = async () => {
    if (interestedLoading) return;
    
    try {
      setInterestedLoading(true);
      const apiResponse = await addInterestToVisitor(id);
      
      if (apiResponse?.code === 200) {
        setInterested(apiResponse?.requestData === true);
      } else if (apiResponse?.code === 403) {
        ToastUtils.showErrorToast(t('error'), t(apiResponse?.message));
      } else {
        ToastUtils.showErrorToast(
          t('error'),
          apiResponse?.message || t('Something_went_wrong')
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
    }
    loadData();
  }, []);

  // Render helpers
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
  if (visitorDetails === null) {
    return (
      <View style={styles.container}>
        <Header
          title=""
          renderLeft={() => (
            <Icon
              name="arrow-back"
              size={20}
              color="black"
              enableRTL
            />
          )}
          onPressLeft={navigation.goBack}
        />
        <SafeAreaView style={styles.flex1} edges={['right', 'left', 'bottom']}>
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
          imageError || !visitorDetails?.imagePath
            ? Images.noImage
            : {uri: visitorDetails.imagePath}
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
            <Icon
              name="arrow-back"
              size={20}
              color={imageError ? colors.primary : BaseColor.whiteColor}
              enableRTL={true}
            />
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
                  minHeight: visitorDetails?.bio ? 100 : 60,
                },
              ]}>
              <Text title2 semibold style={{marginBottom: 5}}>
                {visitorDetails?.name + ' ' + visitorDetails?.last_name}
              </Text>
              <View style={styles.organizationRow}>
                <Text subhead bold style={{color: colors.primary, fontSize: 18}}>
                  {visitorDetails?.company_name}
                </Text>
              </View>
            </View>
            {renderInfoSection('bio', visitorDetails?.bio)}
            {renderInfoSection('phone_number', visitorDetails?.phone)}
            {renderInfoSection('email', visitorDetails?.email)}
            {renderInfoSection('website', visitorDetails?.website)}
            {renderInfoSection('sector', visitorDetails?.company_sector)}
            {renderInfoSection('job_title', visitorDetails?.job_title)}
            {renderInfoSection('job_function', visitorDetails?.job_function)}
            {renderInfoSection('company_name', visitorDetails?.organization_name, false)}
          </View>
        </ScrollView>
        
        <View
          style={[
            styles.contentButtonBottom,
            {borderTopColor: colors.border, backgroundColor: colors.card},
          ]}
        >
          <View>
            <Button
              onPress={() => showInterest()}
              style={{
                backgroundColor: interested
                  ? interestedLoading
                    ? BaseColor.whiteColor
                    : colors.primary
                  : BaseColor.whiteColor,
                borderColor: colors.primary,
                borderWidth: 1,
              }}
              outline={interestedLoading ? true : false}
              loading={interestedLoading ? true : false}>
              {!interestedLoading && (
                <Icon
                  name={interested ? 'thumb-up' : 'thumb-up-off-alt'}
                  size={20}
                  color={interested ? BaseColor.whiteColor : colors.primary}
                />
              )}
            </Button>
          </View>

          {permissions?.includes('send_virtuel_meeting_exhibitor') && (
            <Button
              onPress={() => {
                navigation.navigate('RequestAVMeeting', {exhibitor: visitorDetails});
              }}>
              <Icon name="laptop" size={20} color={BaseColor.whiteColor} />
            </Button>
          )}

          <Button
            onPress={() => {
              navigation.navigate('RequestAmeeting', {
                exhibitor: visitorDetails,
              });
            }}>
            <Icon name="calendar-month" size={20} color={BaseColor.whiteColor} />
          </Button>

          {/* ── Save Contact Button ─────────────────────────────── */}
          {visitorDetails?.id !== user?.id && (
            <Button
              style={[
                {
                  backgroundColor: savedIds[`visitor_${id}`] ? '#10B981' : BaseColor.whiteColor,
                  borderColor: savedIds[`visitor_${id}`] ? '#10B981' : colors.primary,
                  borderWidth: 1,
                  minWidth: 50,
                },
              ]}
              loading={!!saving[`visitor_${id}`]}
              disabled={!!saving[`visitor_${id}`]}
              onPress={async () => {
                const contactType = 'visitor';
                const key = `${contactType}_${id}`;
                const isSaved = savedIds[key];
                if (isSaved) {
                  dispatch(optimisticRemove({contactId: id, contactType}));
                  const result = await dispatch(removeContact({contactId: id, contactType}));
                  if (removeContact.fulfilled.match(result)) {
                    ToastUtils.showSuccessToast(t('success'), t('contact_removed'));
                  } else {
                    ToastUtils.showErrorToast(t('error'), t('contact_remove_error'));
                  }
                } else {
                  dispatch(optimisticSave({contactId: id, contactType}));
                  const result = await dispatch(saveContact({contactId: id, contactType}));
                  if (saveContact.fulfilled.match(result)) {
                    ToastUtils.showSuccessToast(t('success'), t('contact_saved'));
                  } else {
                    ToastUtils.showErrorToast(t('error'), t('contact_save_error'));
                  }
                }
              }}>
              {!saving[`visitor_${id}`] && (
                <Icon
                  name={savedIds[`visitor_${id}`] ? 'bookmark' : 'bookmark-border'}
                  size={20}
                  color={savedIds[`visitor_${id}`] ? '#fff' : colors.primary}
                />
              )}
            </Button>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};