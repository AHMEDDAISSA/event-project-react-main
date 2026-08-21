import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTheme } from '../../config';
import { useTranslation } from 'react-i18next';
import { Header, SafeAreaView, Icon, Text, Button } from '../../components';
import { useDispatch } from 'react-redux';
import { saveContact, optimisticSave } from '../../reducers/contactsSlice';
import ToastUtils from '../../config/toastUtils';

export default function QRScannerScreen({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const scannedRef = useRef(false);
  // Request camera permission on mount
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    // Camera permissions are still loading.
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text>{t('loading') || 'Loading...'}</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={[styles.container, { backgroundColor: colors.background, padding: 20 }]}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          {t('camera_permission_required') || 'We need your permission to show the camera'}
        </Text>
        <Button full onPress={requestPermission}>
          <Text style={{ color: 'white' }}>{t('grant_permission') || 'Grant Permission'}</Text>
        </Button>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    if (scannedRef.current) return;   
    scannedRef.current = true;
    setScanned(true);

    if (data && data.startsWith('imc-event:')) {
      const parts = data.split(':');
      if (parts.length === 3) {
        const userType = parts[1];
        const userId = parseInt(parts[2], 10);

        if (!isNaN(userId)) {
          const promptSave = (contactType, targetId) => {
            Alert.alert(
              t('save_contact_prompt_title'),
              t('save_contact_prompt_desc'),
              [
                {
                  text: t('save'),
                  onPress: () => {
                    dispatch(optimisticSave({ contactId: targetId, contactType }));
                    dispatch(saveContact({ contactId: targetId, contactType }))
                      .then(result => {
                        if (saveContact.fulfilled.match(result)) {
                          ToastUtils.showSuccessToast(t('success'), t('contact_saved'));
                        }
                      });
                    goToDetail(contactType, targetId);
                  },
                },
                {
                  text: t('skip'),
                  style: 'cancel',
                  onPress: () => {
                    goToDetail(contactType, targetId);
                  },
                },
              ],
              { cancelable: true },
            );
          };

          const goToDetail = (contactType, targetId) => {
            if (contactType === 'exhibitor') {
              navigation.replace('ExhibitorDetail', { id: targetId, isExhibitor: true });
            } else {
              navigation.replace('VisitorDetail', { id: targetId });
            }
          };

          if (userType === 'exhibitor' || userType === 'visitor') {
            promptSave(userType, userId);
            return;
          }
        }
      }
    }

    
    Alert.alert(
      t('invalid_qr_code') || 'Invalid QR Code',
      t('invalid_qr_code_desc') || 'This QR Code is not recognized by the IMC Events app.',
      [{
        text: 'OK',
        onPress: () => {
          scannedRef.current = false; 
          setScanned(false);
        },
      }]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title={t('scan_qr_code') || 'Scan QR Code'}
        renderLeft={() => (
          <Icon name="arrow-back" size={20} color={colors.primary} enableRTL={true} />
        )}
        onPressLeft={() => navigation.goBack()}
      />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />

        {/* Overlay frame for scanner helper UI */}
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer} />
          <View style={styles.middleContainer}>
            <View style={styles.unfocusedContainer} />
            <View style={[styles.focusedContainer, { borderColor: colors.primary }]} />
            <View style={styles.unfocusedContainer} />
          </View>
          <View style={styles.unfocusedContainer}>
            <Text style={styles.helperText}>
              {t('scan_helper_text')}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleContainer: {
    flexDirection: 'row',
    height: 250,
  },
  focusedContainer: {
    width: 250,
    height: 250,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  helperText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
});
