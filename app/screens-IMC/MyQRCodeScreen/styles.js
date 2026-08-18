import {StyleSheet, Platform} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  subtitleRow: {
    marginBottom: 20,
    alignItems: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  cardTopStrip: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  cardTopLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  qrWrapper: {
    alignItems: 'center',
    paddingVertical: 28,
    backgroundColor: '#fff',
  },
  qrPlaceholder: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  infoBlock: {
    padding: 20,
    alignItems: 'center',
    gap: 6,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  companyText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.9,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    opacity: 0.7,
  },
  hintText: {
    textAlign: 'center',
    opacity: 0.5,
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  shareButtonWrapper: {
    width: '100%',
    maxWidth: 340,
    marginTop: 16,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  shareBtn: {
    padding: 4,
  },
});
