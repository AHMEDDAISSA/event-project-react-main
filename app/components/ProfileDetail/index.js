import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Image, Icon, Text} from '../index';
import styles from './styles';
import PropTypes from 'prop-types';
import {BaseColor, Images, useTheme} from '../../config';

export default function ProfileDetail(props) {
  const {colors} = useTheme();
  const [imageError, setImageError] = useState(false);
  const {
    style,
    image,
    styleLeft,
    styleThumb,
    styleRight,
    onPress,
    textFirst,
    point,
    textSecond,
    textThird,
    icon,
    isExhibitor
  } = props;
  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <View style={[styles.contentLeft, styleLeft]}>
        <View>
          {imageError ? (
            <Image 
              source={Images.noImage} 
              style={[
                styles.thumb, 
                styleThumb, 
                { borderColor: colors.border }
              ]}
            />
          ) : (
            <Image 
              source={image} 
              style={[
                styles.thumb, 
                styleThumb,
                { borderColor: colors.border }
              ]} 
              onError={() => setImageError(true)}
            />
          )}
          {/* <View style={[styles.point, {backgroundColor: colors.primaryLight}]}>
            <Text overline whiteColor semibold>
              {point}
            </Text>
          </View> */}
        </View>
        <View style={{alignItems: 'flex-start'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text headline semibold numberOfLines={1}>
              {textFirst}
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
          <Text
            body2
            style={{
              marginTop: 3,
              paddingRight: 10,
            }}
            numberOfLines={1}>
            {textSecond}
          </Text>
          {textThird && (
            <Text footnote grayColor numberOfLines={1}>
              {textThird}
            </Text>
          )}
        </View>
      </View>
      {icon && (
        <View style={[styles.contentRight, styleRight]}>
          <Icon
            name="chevron-right"
            size={18}
            color={BaseColor.grayColor}
            enableRTL={true}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

ProfileDetail.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.oneOfType([
    PropTypes.number, // for local image require()
    PropTypes.shape({ uri: PropTypes.string }), // for remote images
  ]),
  textFirst: PropTypes.string,
  point: PropTypes.string,
  textSecond: PropTypes.string,
  textThird: PropTypes.string,
  styleLeft: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleThumb: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleRight: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  icon: PropTypes.bool,
  onPress: PropTypes.func,
};

ProfileDetail.defaultProps = {
  image: '',
  textFirst: '',
  textSecond: '',
  icon: true,
  point: '',
  style: {},
  styleLeft: {},
  styleThumb: {},
  styleRight: {},
  onPress: () => {},
};
