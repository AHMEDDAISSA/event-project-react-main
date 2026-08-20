import {LayoutAnimation,UIManager,Platform} from 'react-native';
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import React, {useState, useCallback, useEffect, useRef} from 'react';
import {View,FlatList,TouchableWithoutFeedback,Keyboard} from 'react-native';
import {BaseColor, BaseStyle, useTheme, Images} from '../../config';
import {Header,SafeAreaView,Icon,Text,ProfileDetail,TextInput,Pagination,ActionButton} from '../../components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {getMyInterstedList} from '../../services/exhibitorService';
import {addInterest} from '../../services/homePageService';
import {addInterestToVisitor} from '../../services/visitorService';
import LottieView from 'lottie-react-native';
import ToastUtils from "../../config/toastUtils";
import NetInfo from '@react-native-community/netinfo';
import useAndroidBack from '../../hooks/useAndroidBack';

export default function InterestsScreen({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const {user, type, permissions} = useSelector(state => state.auth);


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
  const [likedVisitors, setLikedVisitors] = useState({});
  const [likedExhibitors, setLikedExhibitors] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 4,
  });

  const isMounted = useRef(false);

  //observer le text search
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const timeoutId = setTimeout(() => {
      fetchInterests(1, searchText);
    }, 500); 
    return () => clearTimeout(timeoutId); 
  }, [searchText]);
  
  useAndroidBack();

  useFocusEffect(
    useCallback(() => {
      fetchInterests(1, searchText, true);
    }, []),
  );

  const fetchInterests = async (clientPage, search = searchText, shouldReset = false) => {
    const serverPage = Math.ceil((clientPage * 4) / 10);
    if (serverPage === 1 || shouldReset) {
      setExhibitors([]);
    }
    setLoading(true);
    try {
      const response = await getMyInterstedList(serverPage, search, 10);
      if (response.code == 200) {
        setLoading(false);
        if (type == 'exhibitor') {
          // Process exhibitors and check for followers containing 'userID'
          const processedExhibitors = response.requestData.map(exhibitor => {
            return {
              ...exhibitor,
              followers: exhibitor.followers
                  ?.split(',')
                  .map(f => f.trim())
                  .filter(f => f !== '') || '',
              exhibitor_followers: exhibitor.exhibitor_followers
                  ?.split(',')
                  .map(f => f.trim())
                  .filter(f => f !== '') || '',
            };
          });

          if (serverPage === 1 || shouldReset) {
            setExhibitors(processedExhibitors);
          } else {
            setExhibitors(prev => {
              const existingIds = new Set(prev.map(item => item.id));
              const uniqueNew = processedExhibitors.filter(item => !existingIds.has(item.id));
              return [...prev, ...uniqueNew];
            });
          }

          // Initialize liked state - true if followers contains 'userID'
          const initialLikesVisitors = processedExhibitors.reduce((acc, visitor) => {
            acc[visitor.id] = visitor.followers.includes(String(user?.id));
            return acc;
          }, {});

          const initialLikesExhibitors = processedExhibitors.reduce((acc, exhibitor) => {
            acc[exhibitor.id] = exhibitor.exhibitor_followers.includes(String(user?.id));
            return acc;
          }, {});

          setLikedVisitors(prev => ({...prev, ...initialLikesVisitors}));
          setLikedExhibitors(prev => ({...prev, ...initialLikesExhibitors}));
        }else{
          // Process exhibitors and check for followers containing 'userID'
          const processedExhibitors = response.requestData.map(exhibitor => {
            return {
              ...exhibitor,
              followers: exhibitor.followers
                  ?.split(',')
                  .map(f => f.trim())
                  .filter(f => f !== '') || '',
            };
          });

          if (serverPage === 1 || shouldReset) {
            setExhibitors(processedExhibitors);
          } else {
            setExhibitors(prev => {
              const existingIds = new Set(prev.map(item => item.id));
              const uniqueNew = processedExhibitors.filter(item => !existingIds.has(item.id));
              return [...prev, ...uniqueNew];
            });
          }

          // Initialize liked state - true if followers contains 'userID'
          const initialLikesExhibitors = processedExhibitors.reduce((acc, exhibitor) => {
            acc[exhibitor.id] = exhibitor.followers.includes(String(user?.id));
            return acc;
          }, {});

          setLikedExhibitors(prev => ({...prev, ...initialLikesExhibitors}));
        }
        

        const totalItems = response.meta.total;
        setPagination({
          current_page: clientPage,
          last_page: Math.ceil(totalItems / 4),
          total: totalItems,
          per_page: 4,
        });
      } else {
        if (serverPage === 1 || shouldReset) {
          setExhibitors([]);
        }
      }
    } catch (error) {
      console.error('Error fetching interests:', error);
      if (serverPage === 1 || shouldReset) {
        setExhibitors([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    if (type == 'exhibitor') {
      return item.type == 'exhibitor' 
        ? renderItemExhibitor({ item }) 
        : renderItemVisitor({ item });
    }else{
      return renderItemExhibitor({ item });
    }
  };

  const renderItemVisitor = ({item}) => (
    <View
      style={[
        styles.card,
        {backgroundColor: colors.card, borderColor: colors.border},
      ]}>
      <ProfileDetail
        image={{uri: item.imagePath || Images.profile2}}
        textFirst={`${item.name} ${item.last_name}`}
        textSecond={item.email}
        textThird={item.organization_name}
        style={{paddingHorizontal: 20, paddingVertical: 20}}
        onPress={() => navigation.navigate('VisitorDetail', {id: item.id})}
      />
      <View style={styles.contentContact}>
        <ActionButton
          icon={likedVisitors[item.id] ? 'thumb-up' : 'thumb-up-off-alt'}
          text={t('not_interested')}
          onPress={() => toggleLike(item.id, item.type)}
          backgroundColor="#4F46E5"
          borderColor="#4F46E5"
          borderBottomColor="#3730A3"
          textColor="#FFFFFF"
          iconColor="#FFFFFF"
        />

        {permissions?.includes('send_virtuel_meeting_exhibitor') && (
          <ActionButton
            icon="laptop"
            text={t('virtual')}
            onPress={() =>
              navigation.navigate('RequestAVMeeting', {exhibitor: item})
            }
            backgroundColor="#4F46E5"
            borderColor="#4F46E5"
            borderBottomColor="#3730A3"
            textColor="#FFFFFF"
            iconColor="#FFFFFF"
          />
        )}

        {permissions?.includes('send_meeting') && (
          <ActionButton
            icon="calendar-month"
            text={t('meeting')}
            onPress={() =>
              navigation.navigate('RequestAmeeting', {exhibitor: item})
            }
            backgroundColor="#4F46E5"
            borderColor="#4F46E5"
            borderBottomColor="#3730A3"
            textColor="#FFFFFF"
            iconColor="#FFFFFF"
          />
        )}
      </View>
    </View>
  );

  const renderItemExhibitor = ({item}) => (
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
        style={{paddingHorizontal: 20, paddingTop: 35, paddingBottom: 20, flex: 1}}
        onPress={() => navigation.navigate('ExhibitorDetail', {
          id: item.id, 
          isExhibitor: type == 'exhibitor' 
                        ? item.type == 'exhibitor' ? true : false 
                        : false
        })}
        isExhibitor={
          type == 'exhibitor' 
          ? item.type == 'exhibitor' ? true : false 
          : false
        }
      />
      <View style={styles.contentContact}>
        <ActionButton
          icon={likedExhibitors[item.id] ? 'thumb-up' : 'thumb-up-off-alt'}
          text={t('not_interested')}
          onPress={() => toggleLike(item.id, item.type)}
          backgroundColor="#4F46E5"
          borderColor="#4F46E5"
          borderBottomColor="#3730A3"
          textColor="#FFFFFF"
          iconColor="#FFFFFF"
        />

        {permissions?.includes('send_virtuel_meeting_exhibitor') && (
          <ActionButton
            icon="laptop"
            text={t('virtual')}
            onPress={() =>
              navigation.navigate('RequestAVMeeting', {exhibitor: item, isExhibitor: item.type == 'exhibitor'})
            }
            backgroundColor="#4F46E5"
            borderColor="#4F46E5"
            borderBottomColor="#3730A3"
            textColor="#FFFFFF"
            iconColor="#FFFFFF"
          />
        )}

        {permissions?.includes('send_meeting') && (
          <ActionButton
            icon="calendar-month"
            text={t('meeting')}
            onPress={() =>
              navigation.navigate('RequestAmeeting', {exhibitor: item, isExhibitor: item.type == 'exhibitor'})
            }
            backgroundColor="#4F46E5"
            borderColor="#4F46E5"
            borderBottomColor="#3730A3"
            textColor="#FFFFFF"
            iconColor="#FFFFFF"
          />
        )}
      </View>
    </View>
  );

  const showInterestVisitor = async (visitorId, previousValue, removedItem, index) => {
    try {
      const apiResponse = await addInterestToVisitor(visitorId);
      
      if (apiResponse?.code !== 200) {
        // Revert with animation
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        setExhibitors(prev => {
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
        console.log("Liked visitor");
      }
    } catch (error) {
      console.error("Error on show interest for exhibitor: ",error);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExhibitors(prev => {
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
  };
  
  const showInterestExhibitor = async (exhibitorId, previousValue, removedItem, index) => {
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
        console.log("Liked exhibitor");
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
  };
  
  const toggleLike = async (id, type) => {
    if (type == 'exhibitor') {
      const previousValue = likedExhibitors[id];
      setLikedExhibitors(prev => ({
        ...prev,
        [id]: !previousValue,
      }));
      
      const removedItem = exhibitors.find(item => item.id === id);
      const index = exhibitors.findIndex(item => item.id === id);
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
      setExhibitors(prev => prev.filter(item => item.id !== id));
      await showInterestExhibitor(id, previousValue, removedItem, index);
    }else{
      const previousValue = likedVisitors[id];
      setLikedVisitors(prev => ({
        ...prev,
        [id]: !previousValue,
      }));
      
      const removedItem = exhibitors.find(item => item.id === id);
      const index = exhibitors.findIndex(item => item.id === id);
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
      setExhibitors(prev => prev.filter(item => item.id !== id));
      await showInterestVisitor(id, previousValue, removedItem, index);
    }
  };

  const handlePageChange = async page => {
    if (page > 0 && page <= pagination.last_page) {
      const serverPageNeeded = Math.ceil((page * 4) / 10);
      const requiredItemsCount = page * 4;
      
      if (exhibitors.length < requiredItemsCount && serverPageNeeded <= Math.ceil(pagination.total / 10)) {
        await fetchInterests(page, searchText, false);
      } else {
        setPagination(prev => ({
          ...prev,
          current_page: page,
        }));
      }
    }
  };

  const startIndex = (pagination.current_page - 1) * 4;
  const displayedExhibitors = exhibitors.slice(startIndex, startIndex + 4);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1}}>
        <Header 
          title={t('my_interests')} 
          renderLeft={() => {
            if (type == 'exhibitor') {
              return (
                <Icon
                  name="arrow-back"
                  size={20}
                  color={colors.primary}
                  enableRTL={true}
                />
              );
            }
          }}
          onPressLeft={() => {
            if (type == 'exhibitor') {
              navigation.goBack();
            }
          }}
        />
        <SafeAreaView
          style={[BaseStyle.safeAreaView, {marginHorizontal: 20}]}
          edges={['right', 'left']}>
          <TextInput
            style={styles.searchText}
            placeholder={t('search')}
            value={searchText}
            onChangeText={text => setSearchText(text)}
            onSubmitEditing={() => fetchInterests(1, searchText)}
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
              <Text>{t('nodata_interests')}</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={displayedExhibitors}
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
