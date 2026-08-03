import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { BaseStyle, useTheme, Images } from '../../config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  ProfileDetail,
  TextInput,
  Button,
  Image,
} from '../../components';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateSpeakers } from '../../services/userService';
import LottieView from 'lottie-react-native';
import ToastUtils from '../../config/toastUtils';
import NetInfo from '@react-native-community/netinfo';
import Modal from 'react-native-modal';
import * as ImagePicker from "expo-image-picker";
import { checkAuth } from '../../reducers/authSlice';
import useAndroidBack from '../../hooks/useAndroidBack';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

export default function MySpeakersScreen({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        navigation.navigate('NoInternetScreen');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);
  
  useAndroidBack();

  const generateLocalId = () => {
    return `${Date.now()}_${Math.random()}`;
  };

  // Main List
  const [speakers, setSpeakers] = useState(
    (user?.speakers || []).map(item => ({
      ...item,
      localId: item?.localId || generateLocalId(),
    })),
  );
  
  const [searchText, setSearchText] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  // Form Fields
  const [speakerName, setSpeakerName] = useState('');
  const [speakerPost, setSpeakerPost] = useState('');
  const [speakerImage, setSpeakerImage] = useState('');

  const filteredSpeakers = useMemo(() => {
    if (!searchText?.trim()) {
      return speakers;
    }

    return speakers.filter(item => {
      const value = searchText.toLowerCase();

      return (
        item?.name?.toLowerCase()?.includes(value) ||
        item?.post?.toLowerCase()?.includes(value)
      );
    });
  }, [searchText, speakers]);

  const handlePickFromGallery = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Dialog.show({
          dialogStyle: {
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
          },
          type: ALERT_TYPE.WARNING,
          title: "Autorisation de Galerie refusée",
          textBody:
            "L'accès à la galerie est nécessaire pour sélectionner une photo. Veuillez autoriser l'accès dans les paramètres de l'application.",
          autoClose: false,
          button: "Paramètres",
          onPressButton: () => {
            Linking.openSettings();
            Dialog.hide();
          },
          closeOnOverlayTap: true,
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        base64: true,
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled) {
        // Handle single image
        const image = result.assets[0];
        const base64ImageString = `data:${image.mimeType || "image/jpeg"};base64,${image.base64}`;
        setSpeakerImage(base64ImageString);
        console.log(
          "Image selected:",
          base64ImageString.substring(0, 50) + "...",
        );
      } else {
        console.log("User cancelled image selection");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleOpenCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        allowsEditing: false,
        quality: 0.8,
        cameraType: ImagePicker.CameraType.back,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        const base64ImageString = `data:${image.mimeType || "image/jpeg"};base64,${image.base64}`;
        setSpeakerImage(base64ImageString);  
        console.log(
          "Image captured:",
          base64ImageString.substring(0, 50) + "...",
        );
      } else {
        console.log("User cancelled camera");
      }
    } catch (error) {
      console.log('Camera Error', error);
    }
  };

  const handleAddSpeaker = () => {
    setEditingItem(null);

    setSpeakerName('');
    setSpeakerPost('');
    setSpeakerImage('');

    setModalVisible(true);
  };

  const handleEditSpeaker = item => {
    setEditingItem(item);

    setSpeakerName(item?.name || '');
    setSpeakerPost(item?.post || '');
    setSpeakerImage(item?.imagePath || '');

    setModalVisible(true);
  };

  const handleSaveSpeaker = () => {
    if (!speakerName?.trim()) {
      return;
    }

    if (editingItem) {
      // UPDATE
      const updatedList = speakers.map(item => {
        if (item?.localId === editingItem?.localId) {
          return {
            ...item,
            name: speakerName,
            post: speakerPost,
            imagePath: speakerImage,
          };
        }

        return item;
      });

      setSpeakers(updatedList);
    } else {
      // CREATE
      const newSpeaker = {
        localId: generateLocalId(),
        name: speakerName,
        post: speakerPost,
        imagePath: speakerImage,
      };

      setSpeakers(prev => [newSpeaker, ...prev]);
    }

    // RESET
    setEditingItem(null);
    setSpeakerName('');
    setSpeakerPost('');
    setSpeakerImage('');

    setModalVisible(false);
  };

  const handleDeleteSpeaker = localId => {
    const updatedList = speakers.filter(item => item?.localId !== localId);

    setSpeakers(updatedList);
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);

      const payload = {
        speakers: speakers.map(item => ({
          name: item?.name || '',
          post: item?.post || '',
          image: item?.imagePath || '',
        })),
      };

      console.log('JSON PAYLOAD => ', JSON.stringify(payload, null, 2));

      const response = await updateSpeakers(payload);

      if (response.code == 200) {
        dispatch(checkAuth());

        ToastUtils.showSuccessToast(
          `${t('success')}`,
          `${t('speakers_updated_successfully')}`,
        );
        navigation.goBack();
      } else {
        console.error('Update Speakers Err:', response);
        ToastUtils.showErrorToast(`${t('error')}`, t('Something_went_wrong'));
      }
    } catch (error) {
      console.log('Catching Update Speakers Err:', error);

      ToastUtils.showErrorToast(`${t('error')}`, t('Something_went_wrong'));
    } finally {
      setSubmitLoading(false);
    }
  };

  /**
   * RENDER ITEM
   */
  const renderItem = ({ item }) => {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <ProfileDetail
          image={
            item?.imagePath
              ? { uri: item.imagePath }
              : Images.user
          }
          textFirst={item?.name}
          textSecond={item?.post}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}
        />

        {/* ACTIONS */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => handleEditSpeaker(item)}
          >
            <Icon name="edit" size={18} color={'white'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: 'red',
              },
            ]}
            onPress={() => handleDeleteSpeaker(item?.localId)}
          >
            <Icon name="delete" size={18} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1 }}>
        <Header
          title={t('my_speakers')}
          renderLeft={() => {
            return (
              <Icon
                name="arrow-back"
                size={20}
                color={colors.primary}
                enableRTL={true}
              />
            );
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />

        <SafeAreaView
          style={[
            BaseStyle.safeAreaView,
            {
              marginHorizontal: 20,
            },
          ]}
          edges={['right', 'left']}
        >
          {/* SEARCH */}
          <TextInput
            style={styles.searchText}
            placeholder={t('search')}
            value={searchText}
            onChangeText={text => setSearchText(text)}
            leftIcon={
              <Icon
                name="person-search"
                size={20}
                color={colors.primary}
                style={{ marginRight: 10 }}
              />
            }
          />

          {/* ADD BUTTON */}
          <TouchableOpacity
            style={[
              styles.addButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={handleAddSpeaker}
          >
            <Icon name="add" size={20} color={'white'} />

            <Text body2 whiteColor style={{ marginLeft: 10 }}>
              {t('add_speaker')}
            </Text>
          </TouchableOpacity>

          {/* CONTENT */}
          {filteredSpeakers.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <LottieView
                source={Images.no_data}
                autoPlay
                loop
                style={{
                  width: 200,
                  height: 200,
                }}
              />

              <Text>{t('nodata_speakers')}</Text>
            </View>
          ) : (
            <FlatList
              data={filteredSpeakers}
              renderItem={renderItem}
              keyExtractor={item => item?.localId?.toString()}
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: 30,
              }}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            />
          )}

          <Button
            full
            loading={submitLoading}
            style={{
              marginVertical: 20,
            }}
            onPress={handleSubmit}
          >
            {t('save')}
          </Button>
        </SafeAreaView>

        <Modal
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: colors.card,
                },
              ]}
            >
              <Text headline semibold>
                {editingItem ? t('edit_speaker') : t('add_speaker')}
              </Text>

              <TextInput
                placeholder={t('speaker_name')}
                value={speakerName}
                onChangeText={setSpeakerName}
                style={{
                  marginTop: 20,
                  borderWidth: 0.5,
                  borderColor: colors.border,
                }}
              />

              <TextInput
                placeholder={t('speaker_post')}
                value={speakerPost}
                onChangeText={setSpeakerPost}
                style={{
                  marginTop: 15,
                  borderWidth: 0.5,
                  borderColor: colors.border,
                }}
              />

              {/* IMAGE PREVIEW */}
              <TouchableOpacity activeOpacity={0.8} style={styles.imagePicker}>
                <Image
                  source={speakerImage ? { uri: speakerImage } : Images.user}
                  style={styles.imagePreview}
                />
              </TouchableOpacity>

              {/* IMAGE ACTIONS */}
              <View style={styles.imageActions}>
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={handlePickFromGallery}
                >
                  <Icon name="photo-library" size={20} color={'white'} />

                  <Text body2 whiteColor style={{ marginLeft: 8 }}>
                    {t('gallery')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.imageButton,
                    {
                      marginLeft: 10,
                    },
                  ]}
                  onPress={handleOpenCamera}
                >
                  <Icon name="photo-camera" size={20} color={'white'} />

                  <Text body2 whiteColor style={{ marginLeft: 8 }}>
                    {t('camera')}
                  </Text>
                </TouchableOpacity>
              </View>

              <Button
                full
                style={{ marginTop: 20 }}
                onPress={handleSaveSpeaker}
              >
                {editingItem ? t('update') : t('create')}
              </Button>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}
