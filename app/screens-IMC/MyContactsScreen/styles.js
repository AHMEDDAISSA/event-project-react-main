import {StyleSheet, Platform} from 'react-native';

export default StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.07,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 2,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  companyText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emailText: {
    fontSize: 12,
    opacity: 0.55,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
    opacity: 0.5,
  },
  savedAtText: {
    fontSize: 10,
    opacity: 0.35,
    marginTop: 3,
  },
  actions: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  removeBtn: {
    padding: 4,
  },
});
