import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, Image, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme, Images } from '../../config';
import {
  SafeAreaView,
  Icon,
  Text,
  Card,
  HotelItem,
  ConferenceCard,
} from '../../components';
import styles from './styles';
import * as Utils from '../../utils';
import { useTranslation } from 'react-i18next';
import { HotelData } from '../../data';
import { useDispatch, useSelector } from 'react-redux';
import { getRecommandedForYou, getExhibitors } from '../../services/homePageService';
import {
  getConferencesList,
  addRemoveToSchedule,
  getSponsorsList,
} from '../../services/conferenceService';
import { checkAuth } from '../../reducers/authSlice';
import ToastUtils from "../../config/toastUtils";
import NetInfo from '@react-native-community/netinfo';

export default function HomeScreenSimple({ navigation }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  // Handle No Internet Connection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        navigation.navigate('NoInternetScreen');
      }
    });
    return () => unsubscribe();
  }, [navigation]);

  // Redux selectors
  const appData = useSelector(state => state.auth.appData);
  const { type, permissions } = useSelector(state => state.auth);

  // Local state
  const [loading, setLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [recommandedData, setRecommandedData] = useState([]);
  const [conferenceData, setConferenceData] = useState([]);
  const [sponsorsData, setSponsorsData] = useState([]);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());

  // Animation refs
  const deltaY = useRef(new Animated.Value(0)).current;

  // Computed values
  const imagePath = appData?.requestData?.event?.imagePath;
  const image = appData?.requestData?.event?.image;
  const imageUrl = imagePath && image ? `${imagePath}` : '';
  const eventName = appData?.requestData?.event?.name || '';
  const isExhibitor = type === 'exhibitor';

  const heightImageBanner = Utils.scaleWithPixel(140);
  const marginTopBanner = heightImageBanner - heightHeader;

  // Create data for main FlatList to replace ScrollView
  const mainListData = useMemo(() => {
    const items = [];
    
    // Header with navigation icons and event name
    items.push({ type: 'header' });
    
    // Recommended/Exhibitors
    if (recommandedData.length > 0) {
      items.push({ 
        type: 'recommanded', 
        title: isExhibitor ? t('other_exhibitors') : t('recommanded_for_you'),
        data: recommandedData 
      });
    }
    
    // Conferences
    if (permissions?.includes('conferences') && conferenceData.length > 0) {
      items.push({ 
        type: 'conferences', 
        title: t('conferences'),
        subtitle: t('let_find_event'),
        data: conferenceData 
      });
    }
    
    // Promotion
    items.push({ type: 'promotion' });
    
    // Sponsors
    if (sponsorsData.length > 1) {
      items.push({ 
        type: 'sponsors', 
        title: t('sponsors'),
        data: sponsorsData 
      });
    }
    
    // Hotels
    items.push({ 
      type: 'hotels', 
      title: t('partner_hotels'),
      data: HotelData 
    });
    
    return items;
  }, [marginTopBanner, navigationIcons, recommandedData, isExhibitor, t, permissions, conferenceData, sponsorsData, HotelData]);

  // Memoized components for better performance
  const MemoizedCard = React.memo(Card);
  const MemoizedConferenceCard = React.memo(ConferenceCard);
  const MemoizedHotelItem = React.memo(HotelItem);
  // Render item for main FlatList
  const renderMainListItem = useCallback(({ item, index }) => {
    switch (item.type) {
      case 'header':
        return (
          <View style={{ paddingHorizontal: 20 }}>
            <View style={[styles.searchForm, {
              backgroundColor: colors.card,
              borderColor: colors.border,
              marginTop: 100,
            }]}>
              {eventName && (
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                  <Text title1 semibold>{eventName}</Text>
                </View>
              )}
              <FlatList
                data={navigationIcons}
                numColumns={3}
                keyExtractor={(item, index) => `icon-${index}`}
                renderItem={renderNavigationIcon}
                scrollEnabled={false}
              />
            </View>
          </View>
        );
        
      case 'recommanded':
        return (
          <View>
            <Text title3 semibold style={styles.titleView}>
              {item.title}
            </Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={item.data}
              keyExtractor={(item) => `recommanded-${item.id}`}
              renderItem={renderRecommandedCard}
              contentContainerStyle={{ paddingRight: 10 }}
              removeClippedSubviews={true}
              maxToRenderPerBatch={5}
              initialNumToRender={3}
              windowSize={5}
            />
          </View>
        );
        
      case 'conferences':
        return (
          <View>
            <View style={styles.titleView}>
              <Text title3 semibold>{item.title}</Text>
              <Text body2 grayColor>{item.subtitle}</Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={item.data}
              keyExtractor={(item) => `conference-${item.id}`}
              renderItem={renderConferenceCard}
              contentContainerStyle={{ paddingRight: 10 }}
              removeClippedSubviews={true}
              maxToRenderPerBatch={5}
              initialNumToRender={3}
              windowSize={5}
            />
          </View>
        );
        
      case 'sponsors':
        return (
          <View>
            <View style={styles.titleView}>
              <Text title3 semibold>{item.title}</Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={item.data}
              keyExtractor={(item) => `sponsor-${item.id}`}
              renderItem={renderSponsorCard}
              removeClippedSubviews={true}
              maxToRenderPerBatch={5}
              initialNumToRender={3}
              windowSize={5}
            />
          </View>
        );
        
      case 'promotion':
        return (
          <View style={styles.titleView}>
            <Text title3 semibold>{t('promotion')}</Text>
            <Text body2 grayColor>{t('let_find_promotion')}</Text>
            <Image source={Images.banner1} style={styles.promotionBanner} />
            <View style={[styles.line, { backgroundColor: colors.border }]} />
          </View>
        );
        
      case 'hotels':
        return (
          <View style={{marginTop: 15}}>
            <Text title3 semibold style={[styles.titleView, { paddingTop: 0 }]}>
              {item.title}
            </Text>
            <FlatList
              numColumns={2}
              data={item.data}
              keyExtractor={(item) => `hotel-${item.id}`}
              renderItem={renderHotelCard}
              scrollEnabled={false}
              columnWrapperStyle={{ paddingLeft: 5, paddingRight: 20 }}
              removeClippedSubviews={true}
              maxToRenderPerBatch={4}
              initialNumToRender={4}
              windowSize={4}
            />
          </View>
        );
        
      default:
        return null;
    }
  }, [eventName, colors, navigationIcons, renderNavigationIcon, renderRecommandedCard, renderConferenceCard, renderSponsorCard, renderHotelCard, t]);
  
  // Get item layout for better performance
  const getItemLayout = useCallback((data, index) => ({
    length: data[index].height || 200, // Estimate height
    offset: 0, // Will be calculated by FlatList
    index,
  }), []);
  
  // Navigation icons
  const navigationIcons = useMemo(() => {
    if (isExhibitor) {
      return [
        { icon: 'people', name: t('exhibitors'), route: 'Exhibitors' },
        { icon: 'sentiment-very-satisfied', name: t('intersted_in_you'), route: 'InterestedInYou' },
        { icon: 'check-circle', name: t('my_interests'), route: 'InterestsScreen' },
        { icon: 'handshake', name: t('my_connections'), route: 'MyConnections' },
        { icon: 'people-outline', name: t('visitors'), route: 'Visitors' },
        { icon: 'menu', name: t('more'), route: 'Profile' },
      ];
    }
    return [
      { icon: 'thumb-up', name: t('recommanded_for_you'), route: 'RecommandedForYou' },
      { icon: 'sentiment-very-satisfied', name: t('intersted_in_you'), route: 'InterestedInYou' },
      { icon: 'check-circle', name: t('my_interests'), route: 'InterestsScreen' },
      { icon: 'handshake', name: t('my_connections'), route: 'MyConnections' },
      { icon: 'calendar-month', name: t('my_schedule'), route: 'MySchedule' },
      { icon: 'menu', name: t('more'), route: 'Profile' },
    ];
  }, [isExhibitor, t]);

  // Load specific data sections
  const loadRecommandedData = async () => {
    try {
      const response = isExhibitor 
        ? await getExhibitors()
        : await getRecommandedForYou();
      
      if (response?.code === 200) {
        setRecommandedData(response?.requestData ?? []);
      }
    } catch (error) {
      console.error('Error loading recommended data:', error);
    }
  };

  const loadConferencesData = async () => {
    if (!permissions?.includes('conferences')) return;
    
    try {
      const response = await getConferencesList();
      if (response?.code === 200) {
        setConferenceData(response?.requestData ?? []);
      }
    } catch (error) {
      console.error('Error loading conferences data:', error);
    }
  };

  const loadSponsorsData = async () => {
    try {
      const response = await getSponsorsList();
      if (response?.code === 200) {
        setSponsorsData(response?.requestData ?? []);
      }
    } catch (error) {
      console.error('Error loading sponsors data:', error);
    }
  };

  // Load all data function
  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadRecommandedData(),
        loadConferencesData(),
        loadSponsorsData()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load specific sections function
  const loadSpecificData = async (sections = {}) => {
    const { recommanded = false, conferences = false, sponsors = false } = sections;
    
    try {
      const promises = [];
      
      if (recommanded) promises.push(loadRecommandedData());
      if (conferences) promises.push(loadConferencesData());
      if (sponsors) promises.push(loadSponsorsData());
      
      if (promises.length > 0) {
        await Promise.all(promises);
      }
    } catch (error) {
      console.error('Error loading specific data:', error);
    }
  };

  // Effects
  useEffect(() => {
    dispatch(checkAuth());
    // Load all data on first mount
    loadData();
    setIsFirstLoad(false);
  }, []);

  // Focus effect to update data when screen is entered
  useFocusEffect(
    useCallback(() => {
      // Only refresh specific parts on subsequent loads (not first load)
      if (!isFirstLoad) {
        loadSpecificData({ recommanded: true, conferences: true, sponsors: true });
      }
    }, [isFirstLoad])
  );

  // Handlers
  const handleAddToSchedule = async (conferenceId) => {
    try {
      const response = await addRemoveToSchedule(conferenceId);
      if (response.code === 200) {
        setConferenceData(prev => prev.filter(item => item.id !== conferenceId));
        ToastUtils.showSuccessToast(t('success'), t('added_to_schedule'));
      } else {
        ToastUtils.showErrorToast(t('error'), t(response?.message ?? 'add_to_schedule_problem'));
      }
    } catch (error) {
      console.error('Error adding to schedule:', error);
      ToastUtils.showErrorToast(t('error'), t('add_to_schedule_problem'));
    }
  };

  const navigateTo = (route) => {
    navigation.navigate(route);
  };

  const navigateToExhibitor = (id) => {
    navigation.navigate('ExhibitorDetail', { id });
  };

  // Render functions
  const renderNavigationIcon = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.itemDiscover}
      onPress={() => navigateTo(item.route)}>
      <View style={[styles.iconContent, { backgroundColor: colors.background }]}>
        <Icon name={item.icon} size={18} color={colors.primary} solid />
      </View>
      <Text footnote style={{textAlign: 'center'}}>{item.name}</Text>
    </TouchableOpacity>
  ), [colors.background, colors.primary, navigateTo]);

  const renderRecommandedCard = useCallback(({ item }) => (
    <MemoizedCard
      style={[styles.promotionItem, { marginLeft: 15, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 0.5 }]}
      image={{ uri: item.imagePath }}
      onPress={() => navigateToExhibitor(item.id)}>
      <View style={styles.textBackground}>
        <Text subhead whiteColor>
          {item?.organization_name ?? ''}
        </Text>
        <Text title2 whiteColor semibold>
          {`${item?.first_name ?? ''} ${item?.last_name ?? ''}`.trim()}
        </Text>
      </View>
    </MemoizedCard>
  ), [colors.card, colors.border, navigateToExhibitor, t]);

  const renderConferenceCard = useCallback(({ item }) => (
    <MemoizedConferenceCard
      image={item.imagePath}
      title={item.title}
      date={item.date}
      time={`${item.start_time} - ${item.end_time}`}
      location={item.location}
      onPress={() => navigation.navigate('ConferenceDetails', {
        conference: item,
        onGoBack: handleAddToSchedule,
      })}
      style={{ marginLeft: 15, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 0.5 }}
    />
  ), [colors.card, colors.border, navigation, handleAddToSchedule]);

  const renderSponsorCard = useCallback(({ item }) => (
    <MemoizedCard
      style={[styles.sponsorItem, { backgroundColor: colors.card, borderColor: colors.border }]}
      image={{ uri: item.logoPath }}
      onPress={() => navigation.navigate('SponsorDetail', {item: item})}
    >
      <View style={styles.textBackground}>
        <Text headline whiteColor semibold>
          {item.name}
        </Text>
      </View>
    </MemoizedCard>
  ), [colors.card]);

  const renderHotelCard = useCallback(({ item }) => (
    <MemoizedHotelItem
      grid
      image={item.image}
      name={item.name}
      location={item.location}
      price={item.price}
      available={item.available}
      rate={item.rate}
      rateStatus={item.rateStatus}
      numReviews={item.numReviews}
      services={item.services}
      style={{ marginLeft: 15, marginBottom: 15 }}
      onPress={() => navigation.navigate('HotelDetail')}
    />
  ), [navigation]);

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>{t('loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
      {/* Header Image */}
      {imageUrl && (
        <Animated.Image
          source={{ uri: imageUrl }}
          style={[
            styles.imageBackground,
            {
              transform: [
                {
                  translateY: deltaY.interpolate({
                    inputRange: [0, Utils.scaleWithPixel(100)],
                    outputRange: [0, -Utils.scaleWithPixel(50)],
                    extrapolate: 'clamp',
                  }),
                },
              ],
              opacity: deltaY.interpolate({
                inputRange: [0, Utils.scaleWithPixel(100)],
                outputRange: [1, 0.1],
                extrapolate: 'clamp',
              }),
            },
          ]}
          resizeMode="cover"
        />
      )}

      <Animated.FlatList
        data={mainListData}
        renderItem={renderMainListItem}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: deltaY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={1}
        onContentSizeChange={() => setHeightHeader(Utils.heightHeader())}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={5}
        windowSize={10}
        getItemLayout={getItemLayout}
        style={{ zIndex: 2 }}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </SafeAreaView>
  );
}
