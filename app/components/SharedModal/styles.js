import { Dimensions, StyleSheet } from 'react-native';
import { BaseColor } from '../../config';

const height = Dimensions.get('window').height;

export default StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    width: '100%',
    maxHeight: height * 0.55,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 20,
  },
  contentSwipeDown: {
    paddingTop: 10,
    alignItems: 'center',
  },
  lineSwipeDown: {
    width: 30,
    height: 2.5,
    backgroundColor: BaseColor.dividerColor,
  },
  contentActionModalBottom: {
    flexDirection: 'row',
    paddingVertical: 15,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
});
