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
} from '../../components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {getVisitorsList, addInterestToVisitor} from '../../services/visitorService';
import LottieView from 'lottie-react-native';
import ToastUtils from "../../config/toastUtils";
import NetInfo from '@react-native-community/netinfo';
import useAndroidBack from '../../hooks/useAndroidBack';

export default function VisitorsScreen({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const {user} = useSelector(state => state.auth);

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

  const [visitors, setVisitors] = useState([]);
  const [likedVisitors, setLikedVisitors] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });

  useFocusEffect(
    useCallback(() => {
      fetchVisitors(pagination.current_page);
    }, []),
  );

  const fetchVisitors = async (page, search = searchText) => {
    setVisitors([]);
    setLoading(true);
    try {
      const response = await getVisitorsList(page, search);
      if (response.code == 200) {
        setLoading(false);
        // Process Visitors and check for followers containing 'userID'
        const processedVisitors = response.requestData.map(visitor => {
          return {
            ...visitor,
            followers:
            visitor.followers
                ?.split(',')
                .map(f => f.trim())
                .filter(f => f !== '') || '',
          };
        });

        setVisitors(processedVisitors);

        // Initialize liked state - true if followers contains 'userID'
        const initialLikes = processedVisitors.reduce((acc, visitor) => {
          acc[visitor.id] = visitor.followers.includes(String(user?.id));
          return acc;
        }, {});

        setLikedVisitors(prev => ({...prev, ...initialLikes}));

        setPagination({
          current_page: response.meta.current_page,
          last_page: response.meta.last_page,
          total: response.meta.total,
          per_page: response.meta.per_page,
        });
      } else {
        setVisitors([]);
      }
    } catch (error) {
      console.error('Error fetching Visitors:', error);
      setVisitors([]);
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
        textFirst={`${item.name} ${item.last_name}`}
        textSecond={item.email}
        textThird={item.company_name}
        style={{paddingHorizontal: 20, paddingVertical: 20}}
        onPress={() => navigation.navigate('VisitorDetail', {id: item.id})}
      />
      <View style={styles.contentContact}>
        <ActionButton
          icon={likedVisitors[item.id] ? 'thumb-up' : 'thumb-up-off-alt'}
          text={t('interested')}
          onPress={() => toggleLike(item.id)}
          backgroundColor={
            likedVisitors[item.id]
              ? colors.primary
              : BaseColor.whiteColor
          }
          borderColor={colors.primary}
          textColor={
            likedVisitors[item.id]
              ? BaseColor.whiteColor
              : colors.primary
          }
          iconColor={
            likedVisitors[item.id]
              ? BaseColor.whiteColor
              : colors.primary
          }
        />
        <ActionButton
          icon="laptop"
          text={t('virtual')}
          onPress={() =>
            navigation.navigate('RequestAVMeeting', {exhibitor: item})
          }
          backgroundColor={colors.primary}
          borderColor={colors.primary}
          textColor={BaseColor.whiteColor}
          iconColor={BaseColor.whiteColor}
        />
        <ActionButton
          icon="calendar-month"
          text={t('meeting')}
          onPress={() =>
            navigation.navigate('RequestAmeeting', {exhibitor: item})
          }
          backgroundColor={colors.primary}
          borderColor={colors.primary}
          textColor={BaseColor.whiteColor}
          iconColor={BaseColor.whiteColor}
        />
      </View>
    </View>
  );

  const toggleLike = visitorId => {
    const previousValue = likedVisitors[visitorId];
    setLikedVisitors(prev => ({
      ...prev,
      [visitorId]: !previousValue,
    }));
    
    const removedItem = visitors.find(item => item.id === visitorId);
    const index = visitors.findIndex(item => item.id === visitorId);
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
      setVisitors(prev => prev.filter(item => item.id !== visitorId));
      try {
        const apiResponse = await addInterestToVisitor(visitorId);
  
        if (apiResponse?.code !== 200) {
          // Revert with animation
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  
          setVisitors(prev => {
            const updated = [...prev];
            updated.splice(index, 0, removedItem);
            return updated;
          });
          setLikedVisitors(prev => ({
            ...prev,
            [visitorId]: previousValue,
          }));
          ToastUtils.showErrorToast(
            `${t('error')}`,
            t(apiResponse?.message ?? 'Something_went_wrong'),
          );
        } else {
          console.log("Liked Visitor");
        }
      } catch (error) {
        console.error("Error on show interest for visitor: ",error);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setVisitors(prev => {
          const updated = [...prev];
          updated.splice(index, 0, removedItem);
          return updated;
        });
        setLikedVisitors(prev => ({
          ...prev,
          [visitorId]: previousValue,
        }));
        ToastUtils.showErrorToast(
          `${t('error')}`,
          t('Something_went_wrong'),
        );
      }
    }, 400);
  };

  const handlePageChange = async page => {
    if (page > 0 && page <= pagination.last_page) {
      setPagination(prev => ({
        ...prev,
        current_page: page,
      }));
      await fetchVisitors(page);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1}}>
        <Header title={t('visitors')} />
        <SafeAreaView
          style={[BaseStyle.safeAreaView, {marginHorizontal: 20}]}
          edges={['right', 'left']}>
          <TextInput
            style={styles.searchText}
            placeholder={t('search')}
            value={searchText}
            onChangeText={text => setSearchText(text)}
            onSubmitEditing={() => fetchVisitors(1, searchText)}
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
          ) : visitors.length === 0 ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <LottieView
                source={Images.no_data}
                autoPlay
                loop
                style={{width: 200, height: 200}}
              />
              <Text>{t('nodata_visitors')}</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={visitors}
                extraData={likedVisitors}
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
