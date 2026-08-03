import React, {useState, useEffect, useRef} from 'react';
import {
  View, 
  ScrollView, 
  Animated, 
  TouchableOpacity, 
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {BaseColor, FontWeight, Images, useTheme} from '../../config';
import {
  Header, 
  SafeAreaView, 
  Icon, 
  Text, 
  TextInput, 
  Button, 
  SharedModal,
  Image,
} from '../../components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {createMeeting} from '../../services/homePageService';
import {useSelector} from 'react-redux';
import ToastUtils from "../../config/toastUtils";
import NetInfo from '@react-native-community/netinfo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import useAndroidBack from '../../hooks/useAndroidBack';

export default function RequestAmeeting({navigation, route}) {
  const {exhibitor, isExhibitor} = route.params;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const {user, type} = useSelector(state => state.auth);
  
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

  const [eventData, setEventData] = useState({});
  const [location, setLocation] = useState('');
  const [locationList, setLocationList] = useState([]);
  const [locationsModal, setLocationsModal] = useState(false);

  useEffect(() => {
    if (type == 'visitor') {
      // Visitor to exhibitor
      // Get Event DATA from exhibitor 
      setEventData(exhibitor?.Event);
    }else if (type == 'exhibitor' && isExhibitor){
      // exhibitor to exhibitor 
      // => choose between location of exhibitor 1 or 2 
      // => get Event DATA from him -> exhibitor 2
      setEventData(exhibitor?.Event);
      // Store location of 2 exhibitors to choose one later
      const locations = [];
      if (exhibitor?.Event?.hall && exhibitor?.Event?.stand) {
        locations.push(`${t('hall_num')} ${exhibitor.Event.hall} - ${t('stand_num')} ${exhibitor.Event.stand}`);
      }
      if (user?.Event?.hall && user?.Event?.stand) {
        locations.push(`${t('hall_num')} ${user.Event.hall} - ${t('stand_num')} ${user.Event.stand}`);
      }
      console.log("locations Length: ", locations);
      
      setLocationList(locations);
      if (locations.length === 1) {
        setLocation(locations[0]);
      }
    }else if (type == 'exhibitor' && !isExhibitor){
      // exhibitor to visitor
      // Get Event DATA from me as exhibitor
      setEventData(user?.Event);
    }
  }, []);

  useEffect(()=>{
    if (type == 'visitor' || (type == 'exhibitor' && !isExhibitor)) {
      let location = '';
      
      if (eventData.hall && eventData.stand) {
        location = `${t('hall_num')} ` + eventData.hall + ` - ${t('stand_num')} `+ eventData.stand;
      } else if (eventData.hall) {
        location = `${t('hall_num')} ` + eventData.hall;
      } else if (eventData.stand) {
        location = `${t('stand_num')} ` + eventData.stand;
      }      
      setLocation(location);
    }
  });

  const [loading, setLoading] = useState(false);
  const speakersList = user?.speakers || [];
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
    const [speakerModalVisible, setSpeakerModalVisible] = useState(false);
  const [description, setDescription] = useState();
  const [timeSlots, setTimeSlots] = useState([]);
  const insets = useSafeAreaInsets();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const headerAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const sectionAnim = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(sectionAnim[0], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(sectionAnim[1], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(sectionAnim[2], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const generateTimeSlots = (startTime, endTime, intervalMinutes) => {
    const slots = [];

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const start = new Date(0, 0, 0, startHour, startMinute);
    const end = new Date(0, 0, 0, endHour, endMinute);

    let current = new Date(start);

    while (current < end) {
      const next = new Date(current.getTime() + intervalMinutes * 60000);

      if (next > end) break;

      const format = d => d.toTimeString().slice(0, 5);

      slots.push(`${format(current)} - ${format(next)}`);
      current = next;
    }

    return slots;
  };

  const sendRequestMeeting = async () => {
    if (!selectedDate) {
      ToastUtils.showErrorToast(
        `${t('error')}`,
        t('choose_date'),
      );
    } else if (!selectedTime) {
      ToastUtils.showErrorToast(
        `${t('error')}`,
        t('choose_time'),
      );
    } else {
      try {
        setLoading(true);
        var meetingType = 'visitor_to_exhibitor';
        if (type == 'visitor') {
          // Visitor to exhibitor
          meetingType = 'visitor_to_exhibitor';
        }else if (type == 'exhibitor' && isExhibitor){
          // exhibitor to exhibitor 
          meetingType = 'exhibitor_to_exhibitor';
        }else if (type == 'exhibitor' && !isExhibitor){
          // exhibitor to visitor
          meetingType = 'exhibitor_to_visitor';
        }
        const apiResponse = await createMeeting(
          exhibitor.id,
          selectedDate,
          selectedTime,
          selectedSpeaker,
          location,
          description,
          meetingType
        );
        console.log('Create meeting apiResponse', apiResponse);
  
        if (apiResponse?.code == 200) {
          setLoading(false);
          navigation.goBack();
          ToastUtils.showSuccessToast(
            `${t('success')}`,
            t('request_meeting_success'),
          );
        } else if(apiResponse.code == 403) {
          ToastUtils.showErrorToast(
            `${t('error')}`,
            `${t(apiResponse?.message)}`,
          );
        } else {
          setLoading(false);
          ToastUtils.showErrorToast(
            `${t('error')}`,
            t(apiResponse?.message ?? 'Something_went_wrong'),
          );
        }
      } catch (error) {
        console.error('Error createMeeting:', error);
        setLoading(false);
        ToastUtils.showErrorToast(
          `${t('error')}`,
          t('Something_went_wrong'),
        );
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      <Animated.View style={{transform: [{translateY: headerAnim}]}}>
        <Header
          title={t('request_a_meeting')}
          renderLeft={() => (
            <Icon
              name="arrow-back"
              size={20}
              color={colors.text}
              enableRTL={true}
            />
          )}
          onPressLeft={() => navigation.goBack()}
        />
      </Animated.View>
      <SafeAreaView style={{flex: 1}} edges={['right', 'left', 'bottom']}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={{paddingHorizontal: 20, paddingVertical: 20}}>
              {
                (type == 'exhibitor' && isExhibitor) 
                  ? locationList.length > 0 && (
                    <View
                      style={{
                        borderBottomColor: colors.border,
                        borderBottomWidth: 0.5,
                      }}>
                      <View style={styles.row}>
                        <Icon name="location-on" size={24} color={colors.primary} />
                        <Text semibold style={{paddingHorizontal: 10}}>
                          {t('location')}
                        </Text>
                      </View>
                      {
                        locationList.length == 1 
                          ? (
                            <Text
                              body2
                              numberOfLines={2}
                              style={{paddingHorizontal: 8, paddingVertical: 8}}>
                              {location}
                            </Text>
                          ) : (
                            <TouchableOpacity onPress={()=> setLocationsModal(true)} style={{width:'100%'}}>
                              <View style={[styles.dropdownBtn, {backgroundColor: colors.card}]}>
                                <Icon name="location-on" size={20} color={BaseColor.kashmir}/>
                                <Text 
                                  style={{
                                    paddingLeft: 18 , 
                                    color: location === '' ? 'grey' : colors.text,
                                    fontWeight: location === '' ? FontWeight.regular : FontWeight.semibold,
                                  }}>
                                  {location === '' ? t('location') : location}
                                </Text>
                                <Icon name="keyboard-arrow-down" size={18} color={BaseColor.kashmir} />
                              </View>
                            </TouchableOpacity>
                          ) 
                      }
                    </View>
                  )
                  : location && (
                    <Animated.View style={{opacity: sectionAnim[0]}}>
                      <View
                        style={{
                          borderBottomColor: colors.border,
                          borderBottomWidth: 0.5,
                        }}>
                        <View style={styles.row}>
                          <Icon name="location-on" size={24} color={colors.primary} />
                          <Text semibold style={{paddingHorizontal: 10}}>
                            {t('location')}
                          </Text>
                        </View>
                        <Text
                          body2
                          numberOfLines={2}
                          style={{paddingHorizontal: 8, paddingVertical: 8}}>
                          {location}
                        </Text>
                      </View>
                    </Animated.View>
                  )
              }

              <Animated.View style={{opacity: sectionAnim[1]}}>
                <View
                  style={{
                    paddingTop: 10,
                    borderBottomColor: colors.border,
                    borderBottomWidth: 0.5,
                  }}>
                  <View style={[styles.row, {paddingBottom: 8}]}>
                    <Icon name="calendar-month" size={24} color={colors.primary} />
                    <Text semibold style={{paddingHorizontal: 10}}>
                      {t('date')}
                    </Text>
                  </View>
                  {selectedDate ? (
                    <TouchableOpacity
                      activeOpacity={0.98}
                      onPress={() => {
                        setSelectedDate();
                        setSelectedTime();
                        setTimeSlots([]);
                      }}>
                      <View
                        style={[
                          styles.itemContainer,
                          {borderColor: colors.primary, backgroundColor: colors.card},
                        ]}>
                        <Text body2 semibold style={{color: colors.primary}}>
                          {selectedDate}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    eventData?.schedule?.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.98}
                        onPress={() => {
                          setSelectedDate(item.date);
                          const result = generateTimeSlots(
                            item.start_time,
                            item.end_time,
                            eventData.meeting_interval,
                          );
                          setTimeSlots(result);
                        }}>
                        <View
                          style={[
                            styles.itemContainer,
                            {
                              borderColor: selectedDate == item.date ? colors.primary : '#f5f5f5',
                              backgroundColor: colors.card
                            },
                          ]}>
                          <Text
                            body2
                            semibold={selectedDate == item.date}
                            style={{color: selectedDate == item.date ? colors.primary : colors.text}}>
                            {item.date}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              </Animated.View>
              <Animated.View style={{opacity: sectionAnim[2]}}>
                <View
                  style={{
                    paddingTop: 10,
                    borderBottomColor: colors.border,
                    borderBottomWidth: 0.5,
                  }}>
                  <View style={[styles.row, {paddingBottom: 8}]}>
                    <Icon
                      name="access-time"
                      size={24}
                      color={colors.primary}
                    />
                    <Text semibold style={{paddingHorizontal: 10}}>
                      {t('time')}
                    </Text>
                  </View>
                  {selectedTime ? (
                    <TouchableOpacity
                      activeOpacity={0.98}
                      onPress={() => {
                        setSelectedTime();
                      }}>
                      <View
                        style={[ styles.itemContainer, {borderColor: colors.primary, backgroundColor: colors.card}]}>
                        <Text body2 semibold style={{color: colors.primary}}>
                          {selectedTime || `${t('choose_time')}`}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : timeSlots?.length > 0 ? (
                    timeSlots?.map((item, index) => {
                      const reservationsList = eventData.reservation;
                      var isReserved = false;
                      if (type == 'visitor') {
                        // Visitor to exhibitor
                        isReserved = reservationsList[selectedDate]?.includes(item);
                      }else if (type == 'exhibitor' && isExhibitor){
                        // exhibitor to exhibitor
                        isReserved = reservationsList[selectedDate]?.includes(item);
                      }else if (type == 'exhibitor' && !isExhibitor){
                        // exhibitor to visitor
                        isReserved = false;
                      }
                      return (
                        <TouchableOpacity
                          key={index}
                          activeOpacity={0.98}
                          disabled={isReserved}
                          onPress={() => {
                            setSelectedTime(item);
                          }}>
                          <View
                            style={[
                              styles.itemContainer,
                              { 
                                borderColor: selectedTime == item ? colors.primary : '#f5f5f5',
                                backgroundColor: colors.card
                              },
                            ]}>
                            <Text
                              body2
                              semibold={selectedTime == item}
                              style={{
                                color: isReserved
                                  ? colors.disabled
                                  : selectedTime == item
                                      ? colors.primary
                                      : colors.text,
                              }}>
                              {item}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.98}
                      onPress={() => {
                        ToastUtils.showInfoToast(`${t('error')}`,`${t('choose_date')}`);
                      }}>
                      <View
                        style={[
                          styles.itemContainer, 
                          {borderColor: colors.card, backgroundColor: colors.card},
                        ]}
                      >
                        <Text body2 semibold>
                          {t('choose_time')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>

              {/* Speaker */}
              <Animated.View style={{opacity: sectionAnim[2]}}>
                <View
                  style={{
                    paddingTop: 10,
                    borderBottomColor: colors.border,
                    borderBottomWidth: 0.5,
                  }}>
                  <View style={[styles.row, {paddingBottom: 8}]}>
                    <Icon
                      name="assignment-ind"
                      size={24}
                      color={colors.primary}
                    />
                    <Text semibold style={{paddingHorizontal: 10}}>
                      {t('speaker')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.98}
                    onPress={()=>{
                      setSpeakerModalVisible(true);
                    }}>
                    <View
                      style={[ 
                        styles.itemContainer, 
                        {
                          borderColor: selectedSpeaker ? colors.primary : '#f5f5f5', 
                          backgroundColor: colors.card,
                        }
                      ]}
                    >
                      <Text 
                        body2 
                        semibold={!!selectedSpeaker} 
                        style={{color: selectedSpeaker ? colors.primary : colors.text}}
                      >
                        {selectedSpeaker?.name || `${t('choose_speaker')}`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </Animated.View>

              <View style={{paddingVertical: 10}}>
                <View style={styles.row}>
                  <Icon name="short-text" size={24} color={colors.primary} />
                  <Text semibold style={{paddingHorizontal: 10}}>
                    {t('detail')}
                  </Text>
                </View>
                <TextInput
                  style={{marginTop: 10, marginBottom: 30}}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={text => setDescription(text)}
                  placeholder={t('detail')}
                  value={description}
                />
              </View>
              {/* Submit Btn */}
              <Button onPress={() => sendRequestMeeting()} loading={loading}>
                {t('send')}
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* JOB Sector Modal */}
        <SharedModal visible={locationsModal} onClose={()=>setLocationsModal(false)} colors={colors}>
          <FlatList
            data={locationList}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.contentActionModalBottom, { borderBottomColor: colors.border }]}
                onPress={() => {
                  setLocation(item);
                  setLocationsModal(false);
                }}>
                {
                  item === location 
                  ? (<Text body2 semibold style={{color:colors.primary}}>{`${item}`}</Text>)
                  : (<Text body2 semibold>{`${item}`}</Text>)
                }
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          />
        </SharedModal>
      </SafeAreaView>

      <Modal
        visible={speakerModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSpeakerModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setSpeakerModalVisible(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            paddingHorizontal: 20,
          }}>
          
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: colors.background,
              borderRadius: 20,
              maxHeight: '70%',
              paddingVertical: 15,
            }}>
            
            <Text
              headline
              semibold
              style={{
                paddingHorizontal: 20,
                marginBottom: 15,
              }}>
              {t('choose_speaker')}
            </Text>

            <FlatList
              data={speakersList}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={{alignItems: 'center'}}>
                  <LottieView
                    source={Images.no_data}
                    autoPlay
                    loop
                    style={{width: 200, height: 200}}
                  />
                </View>
              }
              renderItem={({item}) => {
                const isSelected =
                  selectedSpeaker?.name === item.name;

                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedSpeaker(item);
                      setSpeakerModalVisible(false);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 20,
                      paddingVertical: 14,
                      backgroundColor: isSelected
                        ? `${colors.primary}15`
                        : 'transparent',
                    }}>
                    
                    {item?.imagePath ? (
                      <Image
                        source={{uri: item.imagePath}}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          marginRight: 15,
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          marginRight: 15,
                          backgroundColor: colors.border,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Icon
                          name="person"
                          size={24}
                          color={colors.text}
                        />
                      </View>
                    )}

                    <View style={{flex: 1}}>
                      <Text semibold>{item.name}</Text>

                      {!!item.post && (
                        <Text caption1 light>
                          {item.post}
                        </Text>
                      )}
                    </View>

                    {isSelected && (
                      <Icon
                        name="check-circle"
                        size={22}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
