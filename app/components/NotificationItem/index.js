import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Image, Text} from '../index';
import styles from './styles';
import {useTheme} from '../../config';
export default function NotificationItem(props) {
  const {colors} = useTheme();
  const {
    style,
    is_read,
    title,
    note,
    notifDate,
    onPress,
  } = props;
  // To format the date 
  const date = new Date(notifDate);
  const formattedDate = date.toLocaleDateString('en-GB');
  return (
    <TouchableOpacity
      style={[
        styles.contain,
        {borderBottomWidth: 1, borderBottomColor: colors.border},
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.9}> 
      <View style={styles.content}>
        <View style={styles.left}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text headline semibold>
              {title}
            </Text>
            {is_read === 0 && (
              <View style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: 'red',
                marginLeft: 6,
              }} />
            )}
          </View>
          <Text
            note
            // numberOfLines={3}
            footnote
            grayColor
            style={{
              paddingTop: 5,
            }}>
            {note}
          </Text>
        </View>
        <View style={styles.right}>
          <Text caption2 grayColor numberOfLines={1}>
            {formattedDate.replace(/\//g, '-')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
