import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';
import {Image} from '../index';
import {Images, useTheme} from '../../config';

export default function Card(props) {
  const {colors} = useTheme();

  const {style, children, styleContent, image, onPress} = props;

  const [imageSource, setImageSource] = useState(Images.noImage);

  useEffect(() => {
    const isValidRemoteImage =
      image &&
      typeof image === 'object' &&
      image.uri &&
      image.uri !== 'null' &&
      image.uri !== '';

    const isLocalImage = typeof image === 'number';

    if (isValidRemoteImage || isLocalImage) {
      setImageSource(image);
    } else {
      setImageSource(Images.noImage);
    }
  }, [image]);

  return (
    <TouchableOpacity
      style={[styles.card, {borderColor: colors.border}, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      
      <Image
        source={imageSource}
        style={styles.imageBanner}
        onError={() => {
          setImageSource(Images.noImage);
        }}
      />

      <View style={[styles.content, styleContent]}>
        {children}
      </View>
    </TouchableOpacity>
  );
}

Card.propTypes = {
  image: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleContent: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  onPress: PropTypes.func,
};

Card.defaultProps = {
  image: Images.noImage,
  style: {},
  styleContent: {},
  onPress: () => {},
};
