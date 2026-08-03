import React from 'react';
import {View, TouchableOpacity, Linking} from 'react-native';
import {Text, Icon, Tag, Image} from '../index';
import styles from './styles';
import {FontWeight, Images, useTheme} from '../../config';
import {useTranslation} from 'react-i18next';

export default function ConnectionItem(props) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {
    style,
    nameLabel,
    name,
    image,
    email,
    place,
    time,
    date,
    showButtons,
    onPress,
    onPressRefuse,
    onPressAccept,
    status,
    isExhibitor,
    isVirtualMeeting,
    url
  } = props;

  const [imageError, setImageError] = React.useState(false);
  
  return (
    <View style={[styles.contain, {borderColor: colors.border}, style]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}>
        <View
          style={[
            styles.nameContent,
            {
              borderBottomColor: colors.card,
              backgroundColor: colors.primaryLight,
            },
          ]}>
          <View style={{flexDirection: 'row'}}>
            <Icon name="calendar-month" size={18} style={{color: 'white'}} />
            <Text whiteColor semibold style={{paddingHorizontal: 4}}>
              {date}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Icon name="access-time" size={18} style={{color: 'white'}} />
            <Text whiteColor semibold style={{paddingHorizontal: 4}}>
              {time}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.mainContent,
            {
              backgroundColor: colors.card,
              borderBottomRightRadius: showButtons ? 0 : 8,
              borderBottomLeftRadius: showButtons ? 0 : 8,
            },
          ]}>
          <View style={{flex: 1, alignItems: 'flex-start'}}>
            <View style={styles.row}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="send" size={14} color={colors.text}/>
                <Text caption2 style={{paddingHorizontal: 5}}>
                  {nameLabel}
                </Text>
              </View>
              <Text
                semibold
                style={[
                  styles.status,
                  {
                    backgroundColor:
                      status == 'in_hold'
                        ? '#FFB302'
                        : status == 'confirmed'
                        ? '#64D9FF'
                        : status == 'refused' ? '#B22222' : null,
                  },
                ]}>
                {status == 'in_hold'
                  ? t('pending')
                  : status == 'confirmed'
                  ? t('confirmed')
                  : status == 'refused' ? t('refused') : ''}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={[styles.container, {width: 50, height: 50}]}>
                <Image
                  source={imageError || !image ? Images.noImage : {uri: image}}
                  style={[styles.image, {backgroundColor: colors.card, borderColor: colors.border}]}
                  resizeMode="cover"
                  onError={() => setImageError(true)}
                />
              </View>
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text body1 semibold>
                    {name}
                  </Text>
                  {
                    isExhibitor && (
                      <Icon
                        name={'star'}
                        size={18}
                        style={{ paddingHorizontal: 8 }}
                        color={'#FFD700'}
                        enableRTL={true}
                      />
                    )
                  }
                </View>
                <Text subhead>{email}</Text>
              </View>
            </View>
          </View>
          { (!isVirtualMeeting && place) && (
            <View style={{flex: 1, alignItems: 'flex-start'}}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="location-on" size={14} color={colors.text}/>
                <Text caption2 style={{paddingHorizontal: 5}}>
                  {t('location')}
                </Text>
              </View>
              <Text body3 semibold>
                {place}
              </Text>
            </View>
          )}
          {
            (isVirtualMeeting && status == 'confirmed' ) && (
              <TouchableOpacity
                style={[
                  styles.joinButton,
                  {backgroundColor: '#4CAF50'},
                ]}
                onPress={()=>{
                  Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
                }}>
                <Icon
                  name={'link'}
                  size={18}
                  color="white"
                />
                <Text style={styles.joinButtonText}>
                  {t('join')}
                </Text>
              </TouchableOpacity>
            )
          }
        </View>
        {showButtons && (
          <View style={[styles.validContent, {backgroundColor: colors.card}]}>
            <Tag
              primary
              onPress={onPressRefuse}
              style={{backgroundColor: '#B22222', width: 100, height: 38}}
              textStyle={{color: 'white', fontWeight: FontWeight.semibold}}>
              {t('refuse')}
            </Tag>
            <Tag
              primary
              onPress={onPressAccept}
              style={{backgroundColor: '#228B22', width: 100}}
              textStyle={{color: 'white', fontWeight: FontWeight.semibold}}>
              {t('accept')}
            </Tag>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
