import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '../../config';

export default StyleSheet.create({
  contentTitle: {
    alignItems: 'flex-start',
    width: '100%',
    height: 32,
    justifyContent: 'center',
  },
  contain: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: '#e0e0e0',
    borderRadius: 5,
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    padding: 8,
  },
  contentTitle: {
    paddingTop: 15,
    paddingBottom: 5,
  },
});
