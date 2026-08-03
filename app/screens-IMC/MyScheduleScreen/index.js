import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import {BaseStyle, useTheme, Images} from '../../config';
import {ConferenceItem, Header, Icon, SafeAreaView, Text} from '../../components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import LottieView from 'lottie-react-native';
import {useFocusEffect} from '@react-navigation/native';
import {
  getMySchedulesList,
  addRemoveToSchedule,
} from '../../services/conferenceService';
import ToastUtils from "../../config/toastUtils";
import NetInfo from '@react-native-community/netinfo';
import useAndroidBack from '../../hooks/useAndroidBack';

export default function MyScheduleScreen({navigation}) {
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

  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchMySchedules(1, true);
    }, []),
  );

  const fetchMySchedules = async (pageNumber, reset = false) => {
    if (reset) {
      setRefreshing(true);
      setPage(1);
    } else {
      setConferences([]);
      setLoading(true);
    }
    try {
      const response = await getMySchedulesList(pageNumber);
      
      if (response.code == 200) {
        if (reset) {
          setConferences(response.requestData);
        } else {
          setConferences(prev => [...prev, ...response.requestData]);
        }
        if (
          response.requestData.length === 0 ||
          response.requestData.length < response?.meta?.per_page
        ) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        if (reset) {
          setConferences([]);
        }
      }
    } catch (error) {
      console.error('Error fetching Conferences:', error);
      if (reset) {
        setConferences([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMySchedules(nextPage);
    }
  };

  const handleRefresh = () => {
    fetchMySchedules(1, true);
  };

  const handleCardPress = conference => {
    navigation.navigate('ConferenceDetails', {
      conference: conference,
      inConference: true,
      onGoBack: () => handleRemoveToSchedule(conference.id),
    });
  };

  const handleRemoveToSchedule = async conferenceId => {
    try {
      const response = await addRemoveToSchedule(conferenceId);
      if (response.code == 200) {
        console.log('removed: ', conferenceId, response);
        // 1. Find the item index
        const itemIndex = conferences.findIndex(
          item => item.id === conferenceId,
        );
        if (itemIndex === -1) return;
        // 2. Create animated value for this item
        const slideAnim = new Animated.Value(0);
        // 3. Temporarily mark the item as animating
        setConferences(prev =>
          prev.map((item, idx) =>
            idx === itemIndex ? {...item, slideAnim} : item,
          ),
        );
        // 4. Start the slide animation
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start(async () => {
          // 5. After animation completes, remove the item
          setConferences(prev => prev.filter(item => item.id !== conferenceId));
        });
        ToastUtils.showSuccessToast(
          `${t('success')}`,
          t('removed_from_schedule'),
        );
      } else if(response.code == 403) {
        ToastUtils.showErrorToast(
          `${t('error')}`,
          `${t(response?.message)}`,
        );
      } else {
        console.log('error remove from schedule', conferenceId, response);
        // Show Toast Error
        ToastUtils.showErrorToast(
          `${t('error')}`,
          t(response?.message ?? 'remove_from_schedule_problem'),
        );
      }
    } catch (error) {
      console.error('Error removeing from schedule:', conferenceId, error);
      // Optional: Revert the animation if API fails
      ToastUtils.showErrorToast(
        `${t('error')}`,
        t('remove_from_schedule_problem'),
      );
    }
  };

  const speakerLength = 3;
  const renderConferenceItem = ({item}) => {
    // Slide animation style
    const slideStyle = item.slideAnim
      ? {
          transform: [
            {
              translateX: item.slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 500], // Slide from 0 to 500 pixels right
              }),
            },
          ],
          opacity: item.slideAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 0.7, 0], // Fade out as it slides
          }),
        }
      : {};
    return (
      <ConferenceItem
        item={item}
        slideStyle={slideStyle}
        colors={colors}
        handleCardPress={handleCardPress}
        handleRemoveToSchedule={handleRemoveToSchedule}
        speakerLength={speakerLength}
      />
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1}}>
        <Header
          title={t('my_schedule')}
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
          edges={['right', 'left']}>
          {loading && page === 1 ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <LottieView
                source={Images.loading}
                autoPlay
                loop
                style={{width: 200, height: 200}}
              />
              <Text>{t('loading')}</Text>
            </View>
          ) : conferences.length > 0 ? (
            <FlatList
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
              data={conferences}
              renderItem={renderConferenceItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{paddingBottom: 20}}
              showsVerticalScrollIndicator={false}
              style={{width: '100%'}}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                loading && page > 1 ? (
                  <View style={{padding: 10}}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                ) : null
              }
            />
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <LottieView
                source={Images.no_data}
                autoPlay
                loop
                style={{width: 200, height: 200}}
              />
              <Text>{t('nodata_schedules')}</Text>
            </View>
          )}
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}
