import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
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
});
