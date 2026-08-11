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
  ProfileDetail,
  TextInput,
  Pagination,
  ActionButton,
  IcebreakerCard,
} from '../../components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {getRecommendedForYouList} from '../../services/exhibitorService';
import {addInterest} from '../../services/homePageService';
import LottieView from 'lottie-react-native';
import ToastUtils from "../../config/toastUtils";
import NetInfo from '@react-native-community/netinfo';
import useAndroidBack from '../../hooks/useAndroidBack';


export default function RecommandedScreen({navigation}) {
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

  // en ajoutant des val de tests
  const [exhibitors, setExhibitors] = useState([
    //  
  ]);
  // ────────────────────────────────────────────────────────────────────────────
  const [likedExhibitors, setLikedExhibitors] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });

  useFocusEffect(
    useCallback(() => {
      fetchRecommandations(pagination.current_page);
    }, []),
  );

  const fetchRecommandations = async (page, searchText) => {
    setExhibitors([]);
    setLoading(true);
    try {
      const response = await getRecommendedForYouList(page, searchText);
      if (response.code == 200) {
        setLoading(false);
        // Process exhibitors and check for followers containing 'userID'
        const processedExhibitors = response.requestData.map(exhibitor => {
          return {
            ...exhibitor,
            followers:
              exhibitor.followers
                ?.split(',')
                .map(f => f.trim())
                .filter(f => f !== '') || '',
          };
        });

        setExhibitors(processedExhibitors);

        // Initialize liked state - true if followers contains 'userID'
        const initialLikes = processedExhibitors.reduce((acc, exhibitor) => {
          acc[exhibitor.id] = exhibitor.followers.includes(String(user?.id));
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
      console.error('Error fetching interests:', error);
      setExhibitors([]);
    } finally {
      setLoading(false);
    }
  };

  const removeExhibitorFromList = (exhibitorId) => {
    LayoutAnimation.configureNext({
      duration: 400,
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
    setExhibitors(prev => prev.filter(item => item.id !== exhibitorId));
  };

  const renderItem = ({item}) => (
    <IcebreakerCard
      image={item.imagePath ? {uri: item.imagePath} : Images.profile2}
      onPressProfile={() => {
        if (item.type === 'visitor') {
          navigation.navigate('VisitorDetail', {id: item.id});
        } else {
          navigation.navigate('ExhibitorDetail', {id: item.id});
        }
      }}
      name={`${item.first_name || ''} ${item.last_name || ''}`.trim()}
      company={item.organization_name}
      role={item.type ?? 'exhibitor'}
      score={item.ai_score ?? 0}
      justification={item.ai_justification}
      icebreaker={item.ai_icebreaker}
      onBookSlot={() =>
        navigation.navigate('RequestAmeeting', {
          exhibitor: item,
          fromRecommended: true,
        })
      }
    />
  );

  const showInterest = async exhibitorId => {
    try {
      const apiResponse = await addInterest(exhibitorId);

      if (apiResponse?.code == 200) {
        fetchRecommandations(pagination.current_page);
      } else if(apiResponse.code == 403) {
        ToastUtils.showErrorToast(
          `${t('error')}`,
          `${t(apiResponse?.message)}`,
        );
      } else {
        ToastUtils.showErrorToast(
          `${t('error')}`,
          t(apiResponse?.message ?? 'Something_went_wrong'),
        );
      }
    } catch (error) {
      console.error('Error add Interest data:', error);
      fetchRecommandations(pagination.current_page);
      ToastUtils.showErrorToast(
        `${t('error')}`,
        t('Something_went_wrong'),
      );
    }
  };

  const toggleLike = exhibitorId => {
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
          );
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
    await fetchRecommandations(page);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1}}>
        <Header title={t('recommanded_for_you')} />
        <SafeAreaView
          style={[BaseStyle.safeAreaView, {marginHorizontal: 20}]}
          edges={['right', 'left']}>
          <TextInput
            style={styles.searchText}
            placeholder={t('search')}
            value={searchText}
            onChangeText={text => setSearchText(text)}
            onSubmitEditing={() => fetchRecommandations(1, searchText)}
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
              <Text>{t('nodata_recommandation')}</Text>
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
