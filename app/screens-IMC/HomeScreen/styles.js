import {StyleSheet} from 'react-native';
import {BaseColor} from '../../config';
import * as Utils from '../../utils';

export default StyleSheet.create({
  promotionItem: {
    width: Utils.scaleWithPixel(200),
    height: Utils.scaleWithPixel(250),
    marginVertical: 10
  },
  itemDiscover: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 10,
  },
  iconContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  imageBackground: {
    height: 140,
    width: '100%',
    position: 'absolute',
    backgroundColor: 'white'
  },
  searchForm: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    width: '100%',
    marginVertical: 10,
  },
  contentCartPromotion: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  btnPromotion: {
    height: 25,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  promotionBanner: {
    height: Utils.scaleWithPixel(100),
    width: '100%',
    marginTop: 10,
  },
  line: {
    height: 1,
    marginTop: 10,
  },
  sponsorItem: {
    width: Utils.scaleWithPixel(135),
    height: Utils.scaleWithPixel(160),
    marginVertical: 10,
    borderRadius: 8,
    marginLeft: 15,
    borderWidth: 0.5,
  },
  titleView: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  textBackground: {
    backgroundColor: 'rgba(50, 50, 50, 0.45)',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
});
