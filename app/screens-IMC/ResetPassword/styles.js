import {StyleSheet} from 'react-native';
import {BaseColor} from '../../config';
import * as Utils from '../../utils';

export default StyleSheet.create({
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    marginTop: 65,
    padding: 10,
    width: '100%',
  },
  errormessage: {
    color: '#FF0000',
    marginTop: 5,
  },
  centeredCard: {
    marginTop: 60,
    position: 'absolute',
    top: '15%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: {width: 1.5, height: 1.5},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  InputContainer: {
    position: 'relative',
  },
  leftIcon: {
    position: 'absolute',
    top: '55%',
    left: '5%',
    transform: [{translateY: -10}],
    zIndex: 1,
    color: BaseColor.kashmir,
  },
  placeholderInput: {
    paddingLeft: 40,
  },
  imageBackground: {
    height: Utils.scaleWithPixel(80),
    width: Utils.scaleWithPixel(90),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 30,
  },
  dialog: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
});
