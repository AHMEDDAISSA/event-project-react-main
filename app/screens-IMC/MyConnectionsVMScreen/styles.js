import {StyleSheet} from 'react-native';
import {BaseColor} from '../../config';

export default StyleSheet.create({
  tabbar: {
    height: 40,
  },
  tab: {
    flex: 1,
  },
  indicator: {
    height: 1,
  },
  label: {
    fontWeight: '400',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 2,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  activePageButton: {
    backgroundColor: '#007bff',
  },
  pageText: {
    color: '#333',
  },
  activePageText: {
    color: '#fff',
  },
  container: {
    borderRadius: 60,
    overflow: 'hidden',
    alignSelf: 'center',
    marginVertical: 8,
    marginHorizontal: 15,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderWidth: 0.5,
    borderColor: BaseColor.grayColor,
    backgroundColor: BaseColor.grayColor,
    borderRadius: 60,
  },
  dropdownBtn: {
    marginTop: 10,
    height: 46,
    borderRadius: 5,
    paddingHorizontal: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  contentActionModalBottom: {
    flexDirection: 'row',
    paddingVertical: 15,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  androidBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});
