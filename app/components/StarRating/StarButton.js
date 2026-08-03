import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Image} from '../index';
import PropTypes from 'prop-types';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const propTypes = {
  buttonStyle: PropTypes.object,
  disabled: PropTypes.bool.isRequired,
  halfStarEnabled: PropTypes.bool.isRequired,
  rating: PropTypes.number.isRequired,
  reversed: PropTypes.bool.isRequired,
  starColor: PropTypes.string.isRequired,
  starIconName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
  ]).isRequired,
  starSize: PropTypes.number.isRequired,
  activeOpacity: PropTypes.number.isRequired,
  starStyle: PropTypes.object,
  onStarButtonPress: PropTypes.func.isRequired,
};

const defaultProps = {
  buttonStyle: {},
  starStyle: {},
};

function StarButton(props) {
  const {
    halfStarEnabled,
    starSize,
    rating,
    onStarButtonPress,
    reversed,
    starColor,
    starIconName,
    starStyle,
    activeOpacity,
    buttonStyle,
    disabled,
  } = props;

  const onButtonPress = event => {
    let addition = 0;
    if (halfStarEnabled) {
      const isHalfSelected = event.nativeEvent.locationX < starSize / 2;
      addition = isHalfSelected ? -0.5 : 0;
    }
    onStarButtonPress(rating + addition);
  };

  const renderIcon = () => {
    const newStarStyle = {
      transform: [{ scaleX: reversed ? -1 : 1 }],
      ...StyleSheet.flatten(starStyle),
    };

    if (typeof starIconName === 'string') {
      return (
        <MaterialIcons
          name={'star'}
          size={starSize}
          color={starColor}
          style={newStarStyle}
        />
      );
    } else {
      const iconStyles = [{ width: starSize, height: starSize, resizeMode: 'contain' }, newStarStyle];
      return <Image source={starIconName} style={iconStyles} />;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      disabled={disabled}
      style={buttonStyle}
      onPress={disabled ? () => {} : onButtonPress}>
      {renderIcon()}
    </TouchableOpacity>
  );
}

StarButton.propTypes = propTypes;
StarButton.defaultProps = defaultProps;

export default StarButton;
