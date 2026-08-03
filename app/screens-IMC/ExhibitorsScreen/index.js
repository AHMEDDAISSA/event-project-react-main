import {
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {BaseColor, BaseStyle, useTheme, Images} from '../../config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Tag,
  ProfileDetail,
  TextInput,
  Pagination,
  ActionButton,
} from '../../components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {getExhibitorsList} from '../../services/exhibitorService';
import {addInterest} from '../../services/homePageService';
import LottieView from 'lottie-react-native';
import ToastUtils from "../../config/toastUtils";
import NetInfo from '@react-native-community/netinfo';
import useAndroidBack from '../../hooks/useAndroidBack';

export default function ExhibitorsScreen({navigation}) {
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

  const [exhibitors, setExhibitors] = useState([]);
  const [likedExhibitors, setLikedExhibitors] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });
  
  useAndroidBack();

  useFocusEffect(
    useCallback(() => {
      fetchExhibitors(pagination.current_page);
    }, []),
  );

  const fetchExhibitors = async (page, searchText) => {
    setExhibitors([]);
    setLoading(true);
    try {
      const response = await getExhibitorsList(page, searchText);
      if (response.code == 200) {
        setLoading(false);
        // Process exhibitors and check for followers containing 'userID'
        const processedExhibitors = response.requestData.map(exhibitor => {
          return {
            ...exhibitor,
            exhibitor_followers:
              exhibitor.exhibitor_followers
                ?.split(',')
                .map(f => f.trim())
                .filter(f => f !== '') || '',
          };
        });

        setExhibitors(processedExhibitors);

        // Initialize liked state - true if followers contains 'userID'
        const initialLikes = processedExhibitors.reduce((acc, exhibitor) => {
          acc[exhibitor.id] = exhibitor.exhibitor_followers.includes(String(user?.id));
          return acc;
        }, {});

        setLikedExhibitors(prev => ({...prev, ...initialLikes}));

        setPagination({
          current_page: response.meta.current_page,
          last_page: response.meta.last_page,
          total: response.meta.total,
          per_page: response.meta.per_page,
        });
      } else {
        setExhibitors([]);
      }
    } catch (error) {
      console.error('Error fetching exhibitors:', error);
      setExhibitors([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => (
    <View
      style={[
        styles.card,
        {backgroundColor: colors.card, borderColor: colors.border},
      ]}>
      <ProfileDetail
        image={{uri: item.imagePath || Images.profile2}}
        textFirst={`${item.first_name} ${item.last_name}`}
        textSecond={item.email}
        textThird={item.organization_name}
        style={{paddingHorizontal: 20, paddingVertical: 20}}
        onPress={() => navigation.navigate('ExhibitorDetail', {id: item.id})}
      />
      <View style={styles.contentContact}>
        <ActionButton
          icon={likedExhibitors[item.id] ? 'thumb-up' : 'thumb-up-off-alt'}
          text={t('interested')}
          onPress={() => toggleLike(item.id)}
          backgroundColor={
            likedExhibitors[item.id]
              ? colors.primary
              : BaseColor.whiteColor
          }
          borderColor={colors.primary}
          textColor={
            likedExhibitors[item.id]
              ? BaseColor.whiteColor
              : colors.primary
          }
          iconColor={
            likedExhibitors[item.id]
              ? BaseColor.whiteColor
              : colors.primary
          }
        />
        {permissions?.includes('send_virtuel_meeting_exhibitor') && (
          <ActionButton
            icon="laptop"
            text={t('virtual')}
            onPress={() =>
              navigation.navigate('RequestAVMeeting', {exhibitor: item, isExhibitor: true})
            }
            backgroundColor={colors.primary}
            borderColor={colors.primary}
            textColor={BaseColor.whiteColor}
            iconColor={BaseColor.whiteColor}
          />
        )}
        {permissions?.includes('send_meeting') && (
          <ActionButton
            icon="calendar-month"
            text={t('meeting')}
            onPress={() =>
              navigation.navigate('RequestAmeeting', {exhibitor: item, isExhibitor: true})
            }
            backgroundColor={colors.primary}
            borderColor={colors.primary}
            textColor={BaseColor.whiteColor}
            iconColor={BaseColor.whiteColor}
          />
        )}
      </View>
    </View>
  );

  const toggleLike = async exhibitorId => {
    const previousValue = likedExhibitors[exhibitorId];
    setLikedExhibitors(prev => ({
      ...prev,
      [exhibitorId]: !previousValue,
    }));
    
    const removedItem = exhibitors.find(item => item.id === exhibitorId);
    const index = exhibitors.findIndex(item => item.id === exhibitorId);
    setTimeout(async () => {
      // Animation of remove item
      LayoutAnimation.configureNext({
        duration: 600,
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
        },
        delete: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
      });
  
      // Optimistically remove
      setExhibitors(prev => prev.filter(item => item.id !== exhibitorId));
      try {
        const apiResponse = await addInterest(exhibitorId);
  
        if (apiResponse?.code !== 200) {
          // Revert with animation
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  
          setExhibitors(prev => {
            const updated = [...prev];
            updated.splice(index, 0, removedItem);
            return updated;
          });
          setLikedExhibitors(prev => ({
            ...prev,
            [exhibitorId]: previousValue,
          }));
          ToastUtils.showErrorToast(
            `${t('error')}`,
            t(apiResponse?.message ?? 'Something_went_wrong'),
          )
        } else {
          console.log("Liked Exhibitor");
        }
      } catch (error) {
        console.error("Error on show interest for exhibitor: ",error);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExhibitors(prev => {
          const updated = [...prev];
          updated.splice(index, 0, removedItem);
          return updated;
        });
        setLikedExhibitors(prev => ({
          ...prev,
          [exhibitorId]: previousValue,
        }));
        ToastUtils.showErrorToast(
          `${t('error')}`,
          t('Something_went_wrong'),
        );
      }
    }, 400);
  };

  const handlePageChange = async page => {
    if (page > 0 && page <= pagination.total) {
      setPagination(prev => ({
        ...prev,
        current_page: page,
      }));
    }
    await fetchExhibitors(page);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1}}>
        <Header title={t('exhibitors')} />
        <SafeAreaView
          style={[BaseStyle.safeAreaView, {marginHorizontal: 20}]}
          edges={['right', 'left']}>
          <TextInput
            style={styles.searchText}
            placeholder={t('search')}
            value={searchText}
            onChangeText={text => setSearchText(text)}
            onSubmitEditing={() => fetchExhibitors(1, searchText)}
            leftIcon={
              <Icon
                name="person-search"
                size={20}
                color={colors.primary}
                style={{marginRight: 10}}
              />
            }
          /> 
          {loading ? (
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
          ) : exhibitors.length === 0 ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <LottieView
                source={Images.no_data}
                autoPlay
                loop
                style={{width: 200, height: 200}}
              />
              <Text>{t('nodata_exhibitors')}</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={exhibitors}
                extraData={likedExhibitors}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
                style={{flex: 1}}
                ListFooterComponent={
                  <Pagination 
                    pagination={pagination}
                    onPageChange={handlePageChange}
                  />
                }
                ListFooterComponentStyle={{flex: 1, justifyContent: 'flex-end'}}
                showsVerticalScrollIndicator={false}
                persistentScrollbar={false}
              />
            </>
          )}
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}
