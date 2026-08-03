import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  imgBanner: {
    width: '100%',
    height: 250,
    position: 'absolute',
  },
  contentBoxTop: {
    padding: 10,
    minHeight: 70,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 0.5,
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1.0,
    elevation: 5,
    justifyContent: 'center',
  },
  contentBlockCall: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
});
