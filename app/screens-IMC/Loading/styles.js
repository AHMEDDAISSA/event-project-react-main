import {StyleSheet} from 'react-native';
import * as Utils from '../../utils';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    position: 'absolute',
    top: 220,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {width: 120, height: 120},
  RessayerBtn: {marginTop: 20, alignSelf: 'center', fontWeight: 'bold'},
  description: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    alignItems: 'center',
    fontWeight: 'bold',
  },
  bottomImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Utils.scaleWithPixel(200),
    resizeMode: 'cover',
  },
});
