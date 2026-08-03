import React, {useEffect, useRef, useState} from 'react';
import {View, Image, TouchableOpacity, Animated} from 'react-native';
import {BaseStyle, Images, useTheme} from '../../config';
import {Icon, SafeAreaView, Text} from '../../components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';
import useAndroidBack from '../../hooks/useAndroidBack';

export default function ConferenceDetails({navigation, route}) {
  const {t} = useTranslation();
  const {colors} = useTheme();

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

  const {conference, inConference, onGoBack} = route.params;
  useAndroidBack();

  // Header image animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [250, 150],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150, 200],
    outputRange: [1, 0.8, 0.6],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0, 200],
    outputRange: [1.5, 1, 0.8],
    extrapolate: 'clamp',
  });

  const [imageError, setImageError] = useState(false);

  return (
    <SafeAreaView
      style={[BaseStyle.safeAreaView]}
      edges={['right', 'left', 'bottom']}>
      {/* Fixed Back Button (outside ScrollView) */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" enableRTL={true} />
      </TouchableOpacity>

      <Animated.ScrollView
        style={[styles.container, {backgroundColor: colors.background}]}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}>
        {/* Animated Header Image */}
        <Animated.Image
          source={
            conference?.imagePath &&
            conference.imagePath !== 'null' &&
            !imageError
              ? {uri: conference.imagePath}
              : Images.noImage
          }
          style={[
            styles.headerImage,
            {
              height: headerHeight,
              opacity: headerOpacity,
              transform: [{scale: imageScale}],
            },
          ]}
          resizeMode="cover"
          onError={() => {
            setImageError(true);
          }}
        />

        {/* Main Content */}
        <View style={[styles.content, {backgroundColor: colors.card}]}>
          {/* Title and Type */}
          <Text style={[styles.typeText, {color: colors.text}]}>
            {conference.type}
          </Text>
          <Text style={[styles.title, {color: colors.text}]}>
            {conference.title}
          </Text>

          {/* Description */}
          <Text style={[styles.description, {color: colors.text}]}>
            {conference.description}
          </Text>

          {/* Date & Time */}
          <View
            style={[
              styles.detailSection,
              {backgroundColor: colors.background},
            ]}>
            <View style={styles.detailRow}>
              <Icon name="calendar-month" size={18} color={colors.text} />
              <Text style={[styles.detailText, {color: colors.text}]}>
                {conference.date}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="access-time" size={18} color={colors.text} />
              <Text style={[styles.detailText, {color: colors.text}]}>
                {conference.start_time} - {conference.end_time}
              </Text>
            </View>
          </View>

          {/* Location */}
          <View
            style={[
              styles.detailSection,
              {backgroundColor: colors.background},
            ]}>
            <View style={styles.detailRow}>
              <Icon name="location-on" size={18} color={colors.text} />
              <Text style={[styles.detailText, {color: colors.text}]}>
                {conference.location}
              </Text>
            </View>
          </View>

          {/* Speakers */}
          {conference.speakers.length > 0 && (
            <View style={styles.speakersSection}>
              <Text style={[styles.sectionTitle, {color: colors.text}]}>
                {t('speakers')}
              </Text>
              {conference.speakers.map((speaker, index) => (
                <View
                  key={index}
                  style={[
                    styles.speakerCard,
                    {backgroundColor: colors.background},
                  ]}>
                  <Image
                    source={{uri: speaker.imagePath}}
                    style={styles.speakerImage}
                  />
                  <View style={styles.speakerInfo}>
                    <Text style={[styles.speakerName, {color: colors.text}]}>
                      {speaker.name}
                    </Text>
                    <Text style={[styles.speakerWork, {color: colors.text}]}>
                      {speaker.post}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Add to Schedule Button */}
          <TouchableOpacity
            style={[
              styles.scheduleButton,
              inConference
                ? {backgroundColor: '#F44336'}
                : {backgroundColor: '#4CAF50'},
            ]}
            onPress={e => {
              navigation.goBack();
              if (onGoBack) onGoBack(conference.id);
            }}>
            <Icon
              name={inConference ? 'highlight-remove' : 'add-circle-outline'}
              size={18}
              color="white"
            />
            <Text style={styles.scheduleButtonText}>
              {inConference ? t('remove_from_schedule') : t('add_to_schedule')}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
