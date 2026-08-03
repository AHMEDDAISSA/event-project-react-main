import {StyleSheet} from 'react-native';
import {BaseColor} from '../../config';

export default StyleSheet.create({
  organizationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },
  exhibitorBadge: {
    padding: 5,
    marginHorizontal: 10,
    backgroundColor: BaseColor.grayColor,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  locationRow: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginHorizontal: 5,
  },
  infoSection: {
    paddingVertical: 10,
  },
  infoSectionBorder: {
    borderBottomColor: BaseColor.dividerColor,
    borderBottomWidth: 0.4,
  },
  infoValue: {
    marginTop: 10,
  },
  speakersSection: {
    borderTopColor: BaseColor.dividerColor,
    borderTopWidth: 0.4,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  speakerCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  speakerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  speakerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  speakerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  interestButton: {
    borderWidth: 1,
    minWidth: 50,
  },
  meetingButton: {
    minWidth: 50,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingAnimation: {
    width: 200,
    height: 200,
  },
  imgBanner: {
    width: '100%',
    height: 250,
    position: 'absolute',
  },
  contentBoxTop: {
    padding: 10,
    minHeight: 60,
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
  contentButtonBottom: {
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
