import React from 'react';
import {StyleSheet, Image as RNImage} from 'react-native';
import PropTypes from 'prop-types';

export default function Image(props) {
  const {style, resizeMode, ...rest} = props;
  
  return (
    <RNImage
      style={StyleSheet.flatten([style && style])}
      {...rest}
      resizeMode={resizeMode || 'cover'}
    />
  );
}

Image.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  resizeMode: PropTypes.oneOf(['cover', 'contain', 'stretch', 'repeat', 'center']),
};

Image.defaultProps = {
  style: {},
  resizeMode: 'cover',
};