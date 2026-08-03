import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal
} from 'react-native';
import {BaseStyle, useTheme, BaseColor, FontWeight, Images} from '../../config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  ConnectionItem,
  SharedModal,
  Image,
  Button,
  Pagination,
} from '../../components';
import {TabView, TabBar} from 'react-native-tab-view';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import {
  getMeetingSent,
  getMeetingReceived,
  getMeetingConfirmed,
  cancelMeeting,
  acceptMeeting,
  refuseMeeting,
} from '../../services/myConnectionsService';
import LottieView from 'lottie-react-native';
import {useSelector} from 'react-redux';
import ToastUtils from "../../config/toastUtils";
import NetInfo from '@react-native-community/netinfo';
import useAndroidBack from '../../hooks/useAndroidBack';

export default function MyConnectionsScreen({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {permissions} = useSelector(state => state.auth);

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

  const [index, setIndex] = useState(0);
  const [routes] = useState(() => {
    const dynamicRoutes = [
      permissions?.includes('send_meeting') && { key: 'sent', title: t('sent') },
      permissions?.includes('receive_meeting') && { key: 'received', title: t('received') },
      { key: 'confirmed', title: t('confirmed') },
    ].filter(Boolean);

    return dynamicRoutes;
  });
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const handleIndexChange = index => {
    setIndex(index);
    setRefetchTrigger(prev => prev + 1);
  };

  const renderTabBar = props => {
    const {routes} = props.navigationState;
    const screenWidth = Dimensions.get('window').width;
    const tabWidth = screenWidth / routes.length;

    return (
      <TabBar
        {...props}
        scrollEnabled
        indicatorStyle={[styles.indicator, {backgroundColor: colors.primary}]}
        style={[styles.tabbar, {backgroundColor: colors.background}]}
        tabStyle={[styles.tab, {width: tabWidth}]}
        inactiveColor={BaseColor.grayColor}
        activeColor={colors.text}
        renderLabel={({route, focused, color}) => (
          <View style={{flex: 1, alignItems: 'center', width: '100%'}}>
            <Text
              headline
              style={{
                color,
                fontWeight: focused ? FontWeight.bold : FontWeight.regular,
              }}>
              {route.title}
            </Text>
          </View>
        )}
      />
    );
  };

  const renderScene = ({route, jumpTo}) => {
    const isFocused = index === routes.findIndex(r => r.key === route.key);
    switch (route.key) {
      case 'sent':
        return (
          <SentMeetingsTab
            jumpTo={jumpTo}
            navigation={navigation}
            refetchTrigger={refetchTrigger}
            isFocused={isFocused}
          />
        );
      case 'received':
        return (
          <ReceivedMeetingsTab
            jumpTo={jumpTo}
            navigation={navigation}
            refetchTrigger={refetchTrigger}
            isFocused={isFocused}
          />
        );
      case 'confirmed':
        return (
          <ConfirmedMeetingsTab
            jumpTo={jumpTo}
            navigation={navigation}
            refetchTrigger={refetchTrigger}
            isFocused={isFocused}
          />
        );
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('meeting')}
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
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <TabView
          lazy
          navigationState={{index, routes}}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={handleIndexChange}
        />
      </SafeAreaView>
    </View>
  );
}

// *****
// This method will return list of sended Meetings
// *****
function SentMeetingsTab({navigation, jumpTo, refetchTrigger, isFocused}) {
  const {t} = useTranslation();
  const {user, type} = useSelector(state => state.auth);
  const {colors} = useTheme();
  const [meetingSent, setMeetingSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meetingSentModal, setMeetingSentModal] = useState(false);
  const [meetingItemData, setMeetingItemData] = useState();
  const [status, setStatus] = useState('');
  const [statusModal, setStatusModal] = useState(false);
  const [receiverImageError, setReceiverImageError] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });

  useEffect(() => {
    if (isFocused) {
      setStatus('');
      fetchMeetingSent(pagination.current_page);
    }
  }, [refetchTrigger]);

  const [loadingCancel, setLoadingCancel] = useState(false);
  const cancelMeetingMethod = async id => {
    setLoadingCancel(true);
    try {
      const response = await cancelMeeting(id);
      if (response.code == 200) {
        setLoadingCancel(false);
        setMeetingSentModal(false);
        ToastUtils.showSuccessToast(
          `${t('success')}`, 
          t('cancel_meeting_success'),
        );
      } else if(response.code == 403) {
        ToastUtils.showErrorToast(
          `${t('error')}`,
          `${t(response?.message)}`,
        );
      } else {
        console.log('error cancel', response);
        setLoadingCancel(false);
        setMeetingSentModal(false);
        ToastUtils.showErrorToast(
          `${t('error')}`,
          t('cancel_meeting_error'),
        );
      }
    } catch (error) {
      setLoadingCancel(false);
      ToastUtils.showErrorToast(
        `${t('error')}`,
        t('cancel_meeting_error'),
      );
    } finally {
      fetchMeetingSent(pagination.current_page);
    }
  };

  const fetchMeetingSent = async (page, status) => {
    setMeetingSent([]);
    setLoading(true);
    try {
      const response = await getMeetingSent(page, status);
      if (response.code == 200) {
        setLoading(false);
        setMeetingSent(response.requestData);
        setPagination({
          current_page: response.meta.current_page,
          last_page: response.meta.last_page,
          total: response.meta.total,
          per_page: response.meta.per_page,
        });
        
      } else {
        setMeetingSent([]);
      }
    } catch (error) {
      console.error('Error fetching Meeting sent:', error);
      setMeetingSent([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = item => {
    return (
      <ConnectionItem
        nameLabel={t('to')}
        name={item.receiver.name}
        image={item.receiver.image}
        email={item.receiver.email}
        place={item.meeting_place}
        date={item.meeting_date}
        time={item.meeting_time} 
        showButtons={false}
        onPress={() => {
          setMeetingItemData(item);
          setMeetingSentModal(true);
        }}
        status={item.status}
        isExhibitor={
          type == 'exhibitor' 
          ? item.receiver.type == 'exhibitor' ? true : false 
          : false
        }
      />
    );
  };

  const handlePageChange = async page => {
    if (page > 0 && page <= pagination.total) {
      setPagination(prev => ({
        ...prev,
        current_page: page,
      }));
    }
    await fetchMeetingSent(page);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setStatusModal(true)}
        style={{marginHorizontal: 20}}>
        <View style={[styles.dropdownBtn, {backgroundColor: colors.card}]}>
          <Icon name="list" size={20} color={BaseColor.kashmir} />
          <Text
            style={{
              paddingLeft: 18,
              color: status === '' ? 'grey' : colors.text,
              fontWeight: status === '' ? FontWeight.regular : FontWeight.semibold,
            }}>
            {status === '' ? t('choose_status') : status}
          </Text>
          <Icon
            name="keyboard-arrow-down"
            size={18}
            color={BaseColor.kashmir}
          />
        </View>
      </TouchableOpacity>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            source={Images.loading}
            autoPlay
            loop
            style={{width: 200, height: 200}}
          />
          <Text>{t('loading')}</Text>
        </View>
      ) : meetingSent.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            source={Images.no_data}
            autoPlay
            loop
            style={{width: 200, height: 200}}
          />
          <Text>{t('nodata_sended_connections')}</Text>
        </View>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={loading}
              onRefresh={() => fetchMeetingSent(pagination.current_page)}
            />
          }
          data={meetingSent}
          renderItem={({item}) => renderItem(item)}
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
      )}
      {/* Details Modal */}
      <SharedModal
        visible={meetingSentModal}
        onClose={() => setMeetingSentModal(false)}
        colors={colors}>
        <View style={{width: '100%', marginVertical: 10, alignItems: 'center'}}>
          <Text body1 bold>
            {t('connection_details')}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Icon name="send" size={14} color={colors.text}/>
          <Text caption2 style={{paddingHorizontal: 5}}>
            {t('to')}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={[styles.container, {width: 50, height: 50}]}>
            <Image
              source={
                !receiverImageError && meetingItemData?.receiver?.image 
                  ? {uri: meetingItemData?.receiver?.image} 
                  : Images.noImage
              }
              style={styles.image}
              resizeMode="cover"
              onError={() => setReceiverImageError(true)}
            />
          </View>
          <View>
            <Text body1 semibold>
              {meetingItemData?.receiver?.name}
            </Text>
            <Text subhead>{meetingItemData?.receiver?.email}</Text>
          </View>
        </View>

        {meetingItemData?.meeting_place && (
          <>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              <Icon name="location-on" size={14} color={colors.text}/>
              <Text caption2 style={{paddingHorizontal: 5}}>
                {t('location')}
              </Text>
            </View>
            <Text body3 semibold>
              {meetingItemData?.meeting_place}
            </Text>
          </>
        )}

        <View style={{flexDirection: 'row', paddingTop: 10}}>
          <Icon name="calendar-month" size={14} color={colors.text}/>
          <Text caption2 style={{paddingHorizontal: 5}}>
            {t('date')}
          </Text>
        </View>
        <Text body3 semibold>
          {meetingItemData?.meeting_date}
        </Text>

        <View style={{flexDirection: 'row', paddingTop: 10}}>
          <Icon name="access-time" size={14} color={colors.text}/>
          <Text caption2 style={{paddingHorizontal: 5}}>
            {t('time')}
          </Text>
        </View>
        <Text body3 semibold>
          {meetingItemData?.meeting_time}
        </Text>

        {meetingItemData?.speaker && (
          <>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              <Icon name="assignment-ind" size={14} color={colors.text}/>
              <Text caption2 style={{paddingHorizontal: 5}}>
                {t('speaker')}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={[styles.container, {width: 30, height: 30, marginHorizontal: 5}]}>
                <Image
                  source={
                    meetingItemData?.speaker?.imagePath 
                      ? {uri: meetingItemData?.speaker?.imagePath} 
                      : Images.noImage
                  }
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
              <View>
                <Text body2 semibold>
                  {meetingItemData?.speaker?.name}
                </Text>
                <Text footnote>{meetingItemData?.speaker?.post}</Text>
              </View>
            </View>
          </>
        )}

        <View style={{flexDirection: 'row', paddingTop: 10}}>
          <Icon name="short-text" size={14} color={colors.text}/>
          <Text caption2 style={{paddingHorizontal: 5}}>
            {t('message')}
          </Text>
        </View>
        <Text body3 semibold style={{paddingBottom: 35}}>
          {meetingItemData?.personal_message}
        </Text>
        {
          (meetingItemData?.status !== 'refused' && meetingItemData?.status !== 'canceled') && (
            <View>
              <Button
                full
                loading={loadingCancel}
                onPress={() => cancelMeetingMethod(meetingItemData?.id)}
                style={{backgroundColor: '#B22222'}}>
                <Text semibold style={{color: 'white'}}>
                  {t('cancel')}
                </Text>
              </Button>
            </View>
          )
        }        
      </SharedModal>
      {/* List of status */}
      <SharedModal visible={statusModal} onClose={()=>setStatusModal(false)} colors={colors}>
        <FlatList
          data={['all', 'in_hold', 'refused']}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.contentActionModalBottom, { borderBottomColor: colors.border }]}
              onPress={() => {
                setStatus(item);
                setStatusModal(false);
                fetchMeetingSent(1, item);
              }}>
              {
                item === status 
                ? (<Text body2 semibold style={{color:colors.primary}}>{`${t(item)}`}</Text>)
                : (<Text body2 semibold>{`${t(item)}`}</Text>)
              }
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        />
      </SharedModal>
      {/* Loading Modal */}
      <Modal transparent={true} animationType="fade" visible={loadingCancel}>
        <View style={[styles.absolute, styles.androidBackground]} />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            source={Images.loading}
            autoPlay
            loop
            style={{width: 200, height: 200}}
          />
          <Text whiteColor>{t('loading')}</Text>
        </View>
      </Modal>
    </>
  );
}

// *****
// This method will return list of received Meetings
// *****
function ReceivedMeetingsTab({navigation, jumpTo, refetchTrigger, isFocused}) {
  const {t} = useTranslation();
  const {user, type} = useSelector(state => state.auth);
  const {colors} = useTheme();
  const [meetingReceived, setMeetingReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meetingReceivedModal, setMeetingReceivedModal] = useState(false);
  const [meetingItemData, setMeetingItemData] = useState();
  const [status, setStatus] = useState('');
  const [statusModal, setStatusModal] = useState(false);
  const [senderImageError, setSenderImageError] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });

  useEffect(() => {
    if (isFocused) {
      setStatus('');
      fetchMeetingReceived(pagination.current_page);
    }
  }, [refetchTrigger]);

  const [loadingAccept, setLoadingAccept] = useState(false);
  const acceptMeetingMethod = async id => {
    setLoadingAccept(true);
    try {
      const response = await acceptMeeting(id);
      if (response.code == 200) {
        setLoadingAccept(false);
        ToastUtils.showSuccessToast(
          `${t('success')}`,
          t('accept_meeting_success'),
        );
      } else if(response.code == 403) {
        ToastUtils.showErrorToast(
          `${t('error')}`,
          `${t(response?.message)}`,
        );
      } else {
        console.log('error cancel', response);
        setLoadingAccept(false);
        ToastUtils.showErrorToast(
          `${t('error')}`,
          t(response?.message ?? 'accept_meeting_error'),
        );
      }
    } catch (error) {
      setLoadingAccept(false);
      ToastUtils.showErrorToast(
        `${t('error')}`,
        t('accept_meeting_error'),
      );
    } finally {
      fetchMeetingReceived(pagination.current_page);
    }
  };

  const [loadingRefuse, setLoadingRefuse] = useState(false);
  const refuseMeetingMethod = async id => {
    setLoadingRefuse(true);
    try {
      const responseRefuse = await refuseMeeting(id);
      if (responseRefuse.code == 200) {
        setLoadingRefuse(false);
        ToastUtils.showSuccessToast(
          `${t('success')}`,
          t('refuse_meeting_success'),
        );
      } else if(responseRefuse.code == 403) {
        ToastUtils.showErrorToast(
          `${t('error')}`,
          `${t(responseRefuse?.message)}`,
        );
      } else {
        console.log('error refuse', responseRefuse);
        setLoadingRefuse(false);
        ToastUtils.showErrorToast(
          `${t('error')}`,
          t(responseRefuse?.message ?? 'refuse_meeting_error'),
        );
      }
    } catch (error) {
      console.log('error', error);
      setLoadingRefuse(false);
      ToastUtils.showErrorToast(
        `${t('error')}`,
        t('refuse_meeting_error'),
      );
    } finally {
      fetchMeetingReceived(pagination.current_page);
    }
  };

  const fetchMeetingReceived = async (page, status) => {
    setMeetingReceived([]);
    setLoading(true);
    try {
      const response = await getMeetingReceived(page, status);
      if (response.code == 200) {
        setLoading(false);

        setMeetingReceived(response.requestData);

        setPagination({
          current_page: response.meta.current_page,
          last_page: response.meta.last_page,
          total: response.meta.total,
          per_page: response.meta.per_page,
        });
      } else {
        setMeetingReceived([]);
      }
    } catch (error) {
      console.error('Error fetching MeetingReceived:', error);
      setMeetingReceived([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = item => {
    return (
      <ConnectionItem
        nameLabel={t('from')}
        name={item.sender.name}
        image={item.sender.image}
        email={item.sender.email}
        place={item.meeting_place}
        date={item.meeting_date}
        time={item.meeting_time}
        showButtons={item.status == 'in_hold' ? true : false}
        onPress={() => {
          setMeetingReceivedModal(true);
          setMeetingItemData(item);
        }}
        onPressRefuse={() => refuseMeetingMethod(item.id)}
        onPressAccept={() => acceptMeetingMethod(item.id)}
        status={item.status}
        isExhibitor={
          type == 'exhibitor' 
          ? item.sender.type == 'exhibitor' ? true : false 
          : false
        }
      />
    );
  };

  const handlePageChange = async page => {
    if (page > 0 && page <= pagination.total) {
      setPagination(prev => ({
        ...prev,
        current_page: page,
      }));
    }
    await fetchMeetingReceived(page);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setStatusModal(true)}
        style={{marginHorizontal: 20}}>
        <View style={[styles.dropdownBtn, {backgroundColor: colors.card}]}>
          <Icon name="list" size={20} color={BaseColor.kashmir} />
          <Text
            style={{
              paddingLeft: 18,
              color: status === '' ? 'grey' : colors.text,
              fontWeight: status === '' ? FontWeight.regular : FontWeight.semibold,
            }}>
            {status === '' ? t('choose_status') : status}
          </Text>
          <Icon
            name="keyboard-arrow-down"
            size={18}
            color={BaseColor.kashmir}
          />
        </View>
      </TouchableOpacity>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            source={Images.loading}
            autoPlay
            loop
            style={{width: 200, height: 200}}
          />
          <Text>{t('loading')}</Text>
        </View>
      ) : meetingReceived.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            source={Images.no_data}
            autoPlay
            loop
            style={{width: 200, height: 200}}
          />
          <Text>{t('nodata_received_connections')}</Text>
        </View>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={loading}
              onRefresh={() => fetchMeetingReceived(pagination.current_page)}
            />
          }
          data={meetingReceived}
          renderItem={({item}) => renderItem(item)}
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
      )}
      {/* Meeting details */}
      <SharedModal
        visible={meetingReceivedModal}
        onClose={() => setMeetingReceivedModal(false)}
        colors={colors}>
        <View style={{width: '100%', marginVertical: 10, alignItems: 'center'}}>
          <Text body1 bold>
            {t('connection_details')}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Icon name="send" size={14} color={colors.text}/>
          <Text caption2 style={{paddingHorizontal: 5}}>
            {t('from')}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={[styles.container, {width: 50, height: 50}]}>
            <Image
              source={
                !senderImageError && meetingItemData?.sender?.image 
                  ? {uri: meetingItemData?.sender?.image} 
                  : Images.noImage
              }
              style={styles.image}
              resizeMode="cover"
              onError={() => setSenderImageError(true)}
            />
          </View>
          <View>
            <Text body1 semibold>
              {meetingItemData?.sender?.name}
            </Text>
            <Text subhead>{meetingItemData?.sender?.email}</Text>
          </View>
        </View>

        {meetingItemData?.meeting_place && (
          <>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              <Icon name="location-on" size={14} color={colors.text}/>
              <Text caption2 style={{paddingHorizontal: 5}}>
                {t('location')}
              </Text>
            </View>
            <Text body3 semibold>
              {meetingItemData?.meeting_place}
            </Text>
          </>
        )}

        <View style={{flexDirection: 'row', paddingTop: 10}}>
          <Icon name="calendar-month" size={14} color={colors.text}/>
          <Text caption2 style={{paddingHorizontal: 5}}>
            {t('date')}
          </Text>
        </View>
        <Text body3 semibold>
          {meetingItemData?.meeting_date}
        </Text>

        <View style={{flexDirection: 'row', paddingTop: 10}}>
          <Icon name="access-time" size={14} color={colors.text}/>
          <Text caption2 style={{paddingHorizontal: 5}}>
            {t('time')}
          </Text>
        </View>
        <Text body3 semibold>
          {meetingItemData?.meeting_time}
        </Text>

        {meetingItemData?.speaker && (
          <>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              <Icon name="assignment-ind" size={14} color={colors.text}/>
              <Text caption2 style={{paddingHorizontal: 5}}>
                {t('speaker')}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={[styles.container, {width: 30, height: 30, marginHorizontal: 5}]}>
                <Image
                  source={
                    meetingItemData?.speaker?.imagePath 
                      ? {uri: meetingItemData?.speaker?.imagePath} 
                      : Images.noImage
                  }
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
              <View>
                <Text body2 semibold>
                  {meetingItemData?.speaker?.name}
                </Text>
                <Text footnote>{meetingItemData?.speaker?.post}</Text>
              </View>
            </View>
          </>
        )}

        <View style={{flexDirection: 'row', paddingTop: 10}}>
          <Icon name="short-text" size={14} color={colors.text}/>
          <Text caption2 style={{paddingHorizontal: 5}}>
            {t('message')}
          </Text>
        </View>
        <Text body3 semibold style={{paddingBottom: 35}}>
          {meetingItemData?.personal_message}
        </Text>
      </SharedModal>
      {/* List of status modal */}
      <SharedModal visible={statusModal} onClose={()=>setStatusModal(false)} colors={colors}>
        <FlatList
          data={['all', 'in_hold', 'refused']}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.contentActionModalBottom, { borderBottomColor: colors.border }]}
              onPress={() => {
                setStatus(item);
                setStatusModal(false);
                fetchMeetingReceived(1, item);
              }}>
              {
                item === status 
                ? (<Text body2 semibold style={{color:colors.primary}}>{`${t(item)}`}</Text>)
                : (<Text body2 semibold>{`${t(item)}`}</Text>)
              }
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        />
      </SharedModal>
      {/* Loading Modal */}
      <Modal transparent={true} animationType="fade" visible={loadingRefuse || loadingAccept}>
        <View style={[styles.absolute, styles.androidBackground]} />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            source={Images.loading}
            autoPlay
            loop
            style={{width: 200, height: 200}}
          />
          <Text whiteColor>{t('loading')}</Text>
        </View>
      </Modal>
    </>
  );
}

// *****
// This method will return list of Confirmed Meetings
// *****
function ConfirmedMeetingsTab({navigation, jumpTo, refetchTrigger, isFocused}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [meetingConfirmed, setMeetingConfirmed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meetingConfirmedModal, setMeetingConfirmedModal] = useState(false);
  const [meetingItemData, setMeetingItemData] = useState();
  const [date, setDate] = useState('');
  const [dateModal, setDateModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });

  const {user, type} = useSelector(state => state.auth);
  const appData = useSelector(state => state.auth.appData);

  const getDatesBetween = (startTime, endTime) => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const dates = [];
  
    // Loop from start date to end date
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = currentDate.getFullYear();
      dates.push(`${day}-${month}-${year}`); // Format as DD-MM-YYYY
      currentDate.setDate(currentDate.getDate() + 1); // Move to next day
    }
  
    return dates;
  };

  const dateList = getDatesBetween(appData.requestData.event.start_time, appData.requestData.event?.end_time);
  

  useEffect(() => {
    if (isFocused) {
      setDate('');
      fetchMeetingConfirmed(pagination.current_page);
    }
  }, [refetchTrigger]);

  const fetchMeetingConfirmed = async (page, date) => {
    setMeetingConfirmed([]);
    setLoading(true);
    try {
      const response = await getMeetingConfirmed(page, date);
      if (response.code == 200) {
        setLoading(false);
        setMeetingConfirmed(response.requestData);
        setPagination({
          current_page: response.meta.current_page,
          last_page: response.meta.last_page,
          total: response.meta.total,
          per_page: response.meta.per_page,
        });
      } else {
        setMeetingConfirmed([]);
      }
    } catch (error) {
      console.error('Error fetching interests:', error);
      setMeetingConfirmed([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = item => {
    const isReceiver =
      user.id == item?.sender_id && item?.sender_type == 'AppModelsAppUser';
    return (
      <ConnectionItem
        nameLabel={isReceiver ? t('to') : t('from')}
        name={isReceiver ? item.receiver.name : item.sender.name}
        image={isReceiver ? item.receiver.image : item.sender.image}
        email={isReceiver ? item.receiver.email : item.sender.email}
        place={item.meeting_place}
        date={item.meeting_date}
        time={item.meeting_time}
        showButtons={false}
        onPress={() => {
          setMeetingItemData(item);
          setMeetingConfirmedModal(true);
        }}
        status={item.status}
        isExhibitor={
          type == 'exhibitor' 
            ? isReceiver 
              ? item.receiver.type == 'exhibitor' ? true : false 
              : item.sender.type == 'exhibitor' ? true : false 
            : false
        }
      />
    );
  };

  const handlePageChange = async page => {
    if (page > 0 && page <= pagination.total) {
      setPagination(prev => ({
        ...prev,
        current_page: page,
      }));
    }
    await fetchMeetingConfirmed(page);
  };

  const received = user.id == meetingItemData?.sender_id && meetingItemData?.sender_type == 'AppModelsAppUser';

  return (
    <>
      <TouchableOpacity
        onPress={() => setDateModal(true)}
        style={{width: '100%', paddingHorizontal: 20}}>
        <View style={[styles.dropdownBtn, {backgroundColor: colors.card}]}>
          <Icon name="calendar-month" size={20} color={BaseColor.kashmir} />
          <Text
            style={{
              paddingLeft: 18,
              color: date === '' ? 'grey' : colors.text,
              fontWeight: date === '' ? FontWeight.regular : FontWeight.semibold,
            }}>
            {date === '' ? t('choose_date') : date}
          </Text>
          <Icon
            name="keyboard-arrow-down"
            size={18}
            color={BaseColor.kashmir}
          />
        </View>
      </TouchableOpacity>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            source={Images.loading}
            autoPlay
            loop
            style={{width: 200, height: 200}}
          />
          <Text>{t('loading')}</Text>
        </View>
      ) : meetingConfirmed.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            source={Images.no_data}
            autoPlay
            loop
            style={{width: 200, height: 200}}
          />
          <Text>{t('nodata_confirmed_connections')}</Text>
        </View>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={loading}
              onRefresh={() => fetchMeetingConfirmed(pagination.current_page)}
            />
          }
          data={meetingConfirmed}
          renderItem={({item}) => renderItem(item)}
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
      )}
      {/* Meeting Details Modal */}
      <SharedModal
        visible={meetingConfirmedModal}
        onClose={() => setMeetingConfirmedModal(false)}
        colors={colors}>
        <View style={{width: '100%', marginVertical: 10, alignItems: 'center'}}>
          <Text body1 bold>
            {t('connection_details')}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Icon name="send" size={14} color={colors.text}/>
          <Text caption2 style={{paddingHorizontal: 5}}>
            {received ? t('to') : t('from')}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={[styles.container, {width: 50, height: 50}]}>
            <Image
              source={
                received
                  ? !imageError && meetingItemData?.receiver?.image 
                    ? {uri: meetingItemData?.receiver?.image} 
                    : Images.noImage
                  : !imageError && meetingItemData?.sender?.image 
                    ? {uri: meetingItemData?.sender?.image} 
                    : Images.noImage
              }
              style={styles.image}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          </View>
          <View>
            <Text body1 semibold>
              {received
                ? meetingItemData?.receiver?.name
                : meetingItemData?.sender?.name}
            </Text>
            <Text subhead>
              {received
                ? meetingItemData?.receiver?.email
                : meetingItemData?.sender?.email}
            </Text>
          </View>
        </View>

        {meetingItemData?.meeting_place && (
          <>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              <Icon name="location-on" size={14} color={colors.text}/>
              <Text caption2 style={{paddingHorizontal: 5}}>
                {t('location')}
              </Text>
            </View>
            <Text body3 semibold>
              {meetingItemData?.meeting_place}
            </Text>
          </>
        )}

        <View style={{flexDirection: 'row', paddingTop: 10}}>
          <Icon name="calendar-month" size={14} color={colors.text}/>
          <Text caption2 style={{paddingHorizontal: 5}}>
            {t('date')}
          </Text>
        </View>
        <Text body3 semibold>
          {meetingItemData?.meeting_date}
        </Text>

        <View style={{flexDirection: 'row', paddingTop: 10}}>
          <Icon name="access-time" size={14} color={colors.text}/>
          <Text caption2 style={{paddingHorizontal: 5}}>
            {t('time')}
          </Text>
        </View>
        <Text body3 semibold>
          {meetingItemData?.meeting_time}
        </Text>

        {meetingItemData?.speaker && (
          <>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              <Icon name="assignment-ind" size={14} color={colors.text}/>
              <Text caption2 style={{paddingHorizontal: 5}}>
                {t('speaker')}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={[styles.container, {width: 30, height: 30, marginHorizontal: 5}]}>
                <Image
                  source={
                    meetingItemData?.speaker?.imagePath 
                      ? {uri: meetingItemData?.speaker?.imagePath} 
                      : Images.noImage
                  }
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
              <View>
                <Text body2 semibold>
                  {meetingItemData?.speaker?.name}
                </Text>
                <Text footnote>{meetingItemData?.speaker?.post}</Text>
              </View>
            </View>
          </>
        )}

        <View style={{flexDirection: 'row', paddingTop: 10}}>
          <Icon name="short-text" size={14} color={colors.text}/>
          <Text caption2 style={{paddingHorizontal: 5}}>
            {t('message')}
          </Text>
        </View>
        <Text body3 semibold style={{paddingBottom: 35}}>
          {meetingItemData?.personal_message}
        </Text>
      </SharedModal>
      {/* List of dates modal */}
      <SharedModal visible={dateModal} onClose={()=>setDateModal(false)} colors={colors}>
        <FlatList
          data={dateList}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.contentActionModalBottom, { borderBottomColor: colors.border }]}
              onPress={() => {
                setDate(item);
                setDateModal(false);
                fetchMeetingConfirmed(1, item);
              }}>
              {
                item === date 
                ? (<Text body2 semibold style={{color:colors.primary}}>{`${t(item)}`}</Text>)
                : (<Text body2 semibold>{`${t(item)}`}</Text>)
              }
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        />
      </SharedModal>
    </>
  );
}
