import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center'},
  itemContainer: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 20,
    // backgroundColor: '#f5f5f5',
    shadowColor: '#ccc',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 50,
  },
  dropdownBtn: {
    marginTop: 10,
    paddingRight: 10,
    height: 46,
    borderRadius: 5,
    paddingHorizontal: 6,
    width: '100%',
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
});
