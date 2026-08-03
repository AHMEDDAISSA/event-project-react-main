import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  contain: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
    paddingRight: 10,
  },
  right: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
