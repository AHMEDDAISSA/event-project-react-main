import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from './styles';
import {Image, Text} from '../index';
import {Images, useTheme} from '../../config';

export default function ConferenceCard(props) {
  const {colors} = useTheme();
  const {style, title, location, time, date, image, onPress} = props;

  const [imageSource, setImageSource] = useState(Images.noImage);

  useEffect(() => {
    const isValidImage =
      image &&
      typeof image === 'string' &&
      image.trim() !== '' &&
      image !== 'null';

    if (isValidImage) {
      setImageSource({uri: image});
    } else {
      setImageSource(Images.noImage);
    }
  }, [image]);

  const getMonthAbbreviation = dateString => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    // Option 1: Using toLocaleString (may vary by locale)
    // return date.toLocaleString('default', { month: 'short' });

    // Option 2: Using a fixed array (consistent across all devices)
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[date.getMonth()];
  };

  const getDay = dateString => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    return date.getDate(); // Returns the day of the month (1-31)
  };

  return (
    <TouchableOpacity
      style={[styles.content, {borderColor: colors.border}, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <Image
        source={imageSource}
        style={styles.imageBanner}
        resizeMode="cover"
        onError={() => {
          setImageSource(Images.noImage);
        }}
      />
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
        }}>
        <View style={{alignItems: 'center', marginRight: 10}}>
          <Text body2 primaryColor semibold>
            {getMonthAbbreviation(date)}
          </Text>
          <Text body1 grayColor semibold>
            {getDay(date)}
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'flex-start'}}>
          <Text body2 semibold numberOfLines={1} style={{flex: 1}}>
            {title}
          </Text>
          <Text overline grayColor style={{marginVertical: 5}}>
            {time}
          </Text>
          <Text overline grayColor>
            {location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
