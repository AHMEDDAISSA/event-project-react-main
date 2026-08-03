import React from 'react';
import {View} from 'react-native';
import styles from './styles';
import {Button} from '../index';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SharedModal(props) {
  const {visible, onClose, children, onAction, colors} = props;
  const insets = useSafeAreaInsets();

  return (
    <Modal
      isVisible={visible}
      onSwipeComplete={() => {
        onClose();
      }}
      swipeDirection={['down']}
      onBackdropPress={() => onClose()}
      avoidKeyboard
      style={styles.bottomModal}>
      <View
        style={[styles.content, {backgroundColor: colors.card}]}>
        <View style={styles.contentSwipeDown}>
          <View style={styles.lineSwipeDown} />
        </View>
        <View style={{paddingBottom: insets.bottom + 10}}>
          {children}
        </View>
      </View>
    </Modal>
  );
}
