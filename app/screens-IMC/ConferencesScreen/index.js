import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  RefreshControl,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import {BaseStyle, useTheme, Images} from '../../config';
import {Header, SafeAreaView, Text, ConferenceItem} from '../../components';
import {useTranslation} from 'react-i18next';
import LottieView from 'lottie-react-native';
import {useFocusEffect} from '@react-navigation/native';
import {
  getConferencesList,
  addRemoveToSchedule,
} from '../../services/conferenceService';
import ToastUtils from "../../config/toastUtils";
import NetInfo from '@react-native-community/netinfo';
import useAndroidBack from '../../hooks/useAndroidBack';

export default function ConferencesScreen({navigation}) {
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

  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  useAndroidBack();

  useFocusEffect(
    useCallback(() => {
      fetchConferences(1, true);
    }, []),
  );

  const fetchConferences = async (pageNumber, reset = false) => {
    if (reset) {
      setRefreshing(true);
      setPage(1);
    } else {
      setConferences([]);
      setLoading(true);
    }
    try {
      const response = await getConferencesList(pageNumber);
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
      fetchConferences(nextPage);
    }
  };

  const handleRefresh = () => {
    fetchConferences(1, true);
  };

  const handleCardPress = conference => {
    navigation.navigate('ConferenceDetails', {
      conference: conference,
      onGoBack: () => handleAddToSchedule(conference.id),
    });
  };

  const handleAddToSchedule = async conferenceId => {
    try {
      const response = await addRemoveToSchedule(conferenceId);
      if (response.code == 200) {
        console.log('added: ', conferenceId, response);
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
          t('added_to_schedule'),
        );
      } else if(response.code == 403) {
        ToastUtils.showErrorToast(
          `${t('error')}`,
          `${t(response?.message)}`,
        );
      } else {
        console.log('error add to schedule', conferenceId, response);
        // Show Toast Error
        ToastUtils.showErrorToast(
          `${t('error')}`,
          t(response?.message ?? 'add_to_schedule_problem'),
        );
      }
    } catch (error) {
      console.error('Error adding to schedule:', conferenceId, error);
      ToastUtils.showErrorToast(
        `${t('error')}`,
        t('add_to_schedule_problem'),
      );
    }
  };

  const speakerLength = 3;
  const renderConferenceItem = ({item}) => {
    const slideStyle = item.slideAnim
      ? {
          transform: [
            {
              translateX: item.slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 500],
              }),
            },
          ],
          opacity: item.slideAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 0.7, 0],
          }),
        }
      : {};
    return (
      <ConferenceItem
        item={item}
        slideStyle={slideStyle}
        colors={colors}
        handleCardPress={handleCardPress}
        handleAddToSchedule={handleAddToSchedule}
        speakerLength={speakerLength}
      />
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1}}>
        <Header title={t('conferences')} />
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
              <Text>{t('nodata_conferences')}</Text>
            </View>
          )}
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}
