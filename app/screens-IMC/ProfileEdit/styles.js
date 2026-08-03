import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '../../config';

export default StyleSheet.create({
  contentTitle: {
    alignItems: 'flex-start',
    width: '100%',
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  contain: {
    alignItems: 'center',
    padding: 20,
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10,
    width: '100%',
    color: BaseColor.grayColor,
  },
  thumb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
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
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  errormessage: {
    color: '#FF0000',
    marginTop: 5,
  },
  container: {
    width: 150,
    height: 150,
    borderRadius: 200,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 10,
    position: 'relative',
    borderWidth: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  editIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 4,
  },
  editText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
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
