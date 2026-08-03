import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '../../config';
import * as Utils from '../../utils';

export default StyleSheet.create({
  container: {
    // flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: {width: 1.5, height: 1.5},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    // backgroundColor: 'white',
    marginHorizontal: 30,
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    width: '100%',
  },
  appLogo: {
    height: Utils.scaleWithPixel(80),
    width: Utils.scaleWithPixel(90),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  bottomImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Utils.scaleWithPixel(200),
    resizeMode: 'cover',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: '#ededed',
    marginBottom: 20,
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  radio: {
    flexDirection: 'row',
  },
  img: {
    height: 20,
    width: 20,
    marginHorizontal: 5,
  },
  radioBtnContainer: {
    flexDirection: 'column',
  },
  radioBtnTxt: {
    width: '90%',
  },
  btn: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  inputContainer: {
    position: 'relative',
  },
  leftIcon: {
    position: 'absolute',
    top: '55%',
    left: '2%',
    transform: [{translateY: -10}],
    zIndex: 1,
    color: BaseColor.kashmir,
  },
  placeholderInput: {
    paddingLeft: 40,
    paddingRight: 40,
  },
  eyeIconContainer: {
    position: 'absolute',
    top: '50%',
    right: 10,
    transform: [{translateY: -7}],
    zIndex: 2,
  },
  errormessage: {
    color: '#FF0000',
    marginTop: 5,
  },
  signupBtn: {borderRadius: 40, height: 42},
  // Modal Style
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  contentFilterBottom: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 20,
  },
  contentSwipeDown: {
    paddingTop: 10,
    alignItems: 'center',
  },
  lineSwipeDown: {
    width: 30,
    height: 2.5,
    backgroundColor: BaseColor.dividerColor,
  },
  contentActionModalBottom: {
    flexDirection: 'row',
    paddingVertical: 15,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
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
  phoneCodeBtn: {
    marginTop: 10,
    paddingRight: 10,
    height: 46,
    borderRadius: 5,
    paddingHorizontal: 6,
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchCountry: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  uploadContainer: {
    alignItems: 'center',
    marginVertical: 0,
  },
  uploadButton: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
  uploadImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  uploadPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  uploadText: {
    marginTop: 8,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 15,
  },
  pickerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerOption: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  pickerIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerLabel: {
    marginTop: 10,
    fontSize: 14,
    color: 'black',
  },
});
