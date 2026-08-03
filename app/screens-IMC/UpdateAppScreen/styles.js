import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingBottom: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomIconContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },

  iconWrapper: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 100,
    marginBottom: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#212121',
  },

  message: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },

  button: {
    zIndex: 999,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginBottom: 40,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  appIcon: {
    width: 100,
  },

  updateIcon: {
    width: 80,
    height: 80,
    opacity: 0.8,
  },
});
