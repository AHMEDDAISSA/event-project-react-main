import {StyleSheet} from 'react-native';
import * as Utils from '../../utils';
export default StyleSheet.create({
  content: {
    borderRadius: 5,
    borderWidth: 0.5,
    width: Utils.scaleWithPixel(200),
    overflow: 'hidden',
  },

  imageBanner: {
    width: '100%',
    height: Utils.scaleWithPixel(120),
  },
});
