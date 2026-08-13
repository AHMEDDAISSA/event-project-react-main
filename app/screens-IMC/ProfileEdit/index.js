import React, {useState, useEffect, useCallback} from 'react';
import {View,ScrollView,KeyboardAvoidingView,Platform,TouchableOpacity,FlatList,ActivityIndicator,Animated,PermissionsAndroid,Linkin} from 'react-native';
import {BaseStyle, BaseColor, useTheme, FontWeight, Images} from '../../config';
import {Image,Header,SafeAreaView,Icon,Text,Button,TextInput,SharedModal,MatIcon,} from '../../components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import { updateUserInfo } from '../../services/userService';
import {checkAuth} from '../../reducers/authSlice';
import {Dialog, ALERT_TYPE} from 'react-native-alert-notification';
import {ApiPaths} from '../../services/apiPaths';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import ToastUtils from "../../config/toastUtils";
import NetInfo from '@react-native-community/netinfo';

export default function ProfileEdit({navigation}) {
  const {theme ,colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({ios: 0, android: 20});

  // Handle No Internet Connection
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

  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  // Get Connected User DATA
  const {user, type} = useSelector(state => state.auth);
  // Get Register DATA to Fill dropdown lists 
  const {data} = useSelector(state => state.registerData);
  // Initialize And Set List of DATA for Dropdowns
  const [visitorTypes] = useState(data?.requestData?.profile_visitor ?? []);
  const [categories] = useState(data?.requestData?.category ?? []);
  const [jobFunctionList, setJobFunctionList] = useState([]);
  const [jobTitleList, setJobTitleList] = useState([]);
  // Initialize And Set Inputs DATA
  const [bio, setBio] = useState(user?.bio);
  const [visitoProfile, setVisitoProfile] = useState({id: user?.visitor_profile,name: ''});
  const [firstName, setFirstName] = useState(
    type == 'exhibitor' ? user?.first_name : user?.name || ''
  );
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [contactNumber, setContactNumber] = useState(user?.phone || '');
  const [sector, setSector] = useState({id: user?.company_sector || '', name: ''});
  const [jobTitle, setJobTitle] = useState({id: user?.job_title || '', name: ''});
  const [jobFunction, setJobFunction] = useState({id: user?.job_function || '', name: ''});
  const [companyName, setCompanyName] = useState(
    type == 'exhibitor' ? user?.organization_name : user?.company_name || ''
  );
  const [companyAddress, setCompanyAddress] = useState(user?.address || '');
  const [website, setWebsite] = useState(user?.website || '');
  const imageURL = user?.imagePath || '';
  // Initialize Modals atributes to show and Hide them
  const [visitorTypeModal, setVisitorTypeModal] = useState(false);
  const [sectorModal, setSectorModal] = useState(false);
  const [jobTitleModal, setJobTitleModal] = useState(false);
  const [jobFunctionModal, setJobFunctionModal] = useState(false);
  
  const [loading, setLoading] = useState(false);
  // Auto-load name based on ID for dropdowns
  useEffect(() => {
    // Get Selected Visitor Profile Type
    if (visitoProfile.id && visitorTypes.length > 0) {
      const matched = visitorTypes.find(item => item.id == visitoProfile.id);
      if (matched) {
        setVisitoProfile(prev => ({
          ...prev,
          name: matched.name,
        }));
      }
    }
    // Get Selected Sector
    if (sector.id && categories.length > 0) {
      const matched = categories.find(item => item.id == sector.id);
      setJobFunctionList(matched?.job_function_categories ?? []);
      setJobTitleList(matched?.job_title_categories ?? []);
      if (matched) {
        setSector(prev => ({
          ...prev,
          name: matched.name,
        }));
      }
    }
    // Get Selected Job Title
    if (jobTitle.id && jobTitleList.length > 0) {
      const matched = jobTitleList.find(item => item.id == jobTitle.id);
      if (matched) {
        setJobTitle(prev => ({
          ...prev,
          name: matched.name,
        }));
      }
    }
    // Get Selected Job Function
    if (jobFunction.id && jobFunctionList.length > 0) {
      const matched = jobFunctionList.find(item => item.id == jobFunction.id);

      if (matched) {
        setJobFunction(prev => ({
          ...prev,
          name: matched.name,
        }));
      }
    }
  }, [
    visitoProfile.id,
    visitorTypes,
    sector.id,
    categories,
    jobTitle.id,
    jobTitleList,
    jobFunction.id,
    jobFunctionList,
  ]);
  // Shared Component to Render label of inputs
  const renderLabel = (icon, text) => {
    return (
      <View
        style={styles.label}>
        <Icon name={icon} size={24} solid style={{color: colors.text}} />
        <View style={styles.contentTitle}>
          <Text headline semibold>
            {text}
          </Text>
        </View>
      </View>
    );
  };

  const DropdownButton = ({label, onPress, value, placeholder}) => (
    <>
      {renderLabel(label.icon, t(label.text))}
      <TouchableOpacity onPress={onPress} style={{width: '100%'}}>
        <View style={[styles.dropdownBtn, {backgroundColor: colors.card}]}>
          <Text
            numberOfLines={1}
            style={{
              paddingLeft: 18,
              width: '80%',
              color: value.id === '' ? 'grey' : 'black',
              fontWeight: value.id === '' ? FontWeight.regular : FontWeight.semibold,
              color: colors.text
            }}>
            {value.id === '' ? t(placeholder) : value.name}
          </Text>
          <Icon name="keyboard-arrow-down" size={18} color={BaseColor.kashmir} />
        </View>
      </TouchableOpacity>
    </>
  );

  const alertDialog = (type, title, message, btnText, method) => {
    Dialog.show({
      dialogStyle: BaseStyle.dialog,
      type: type,
      title: title,
      textBody: message,
      button: btnText,
      autoClose: false,
      onPressButton: async () => {
        method();
        Dialog.hide();
      },
      closeOnOverlayTap: true,
    });
  };

  const validateInputs = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const urlPattern = /^(https?:\/\/)?([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(:[0-9]+)?(\/[a-z0-9-._~%!$&'()*+,;=:@/?]*)?$/i;
    const newErrors = {};
    
    if (type == 'visitor') {
      if (!visitoProfile.id) newErrors.visitoProfile = t('visitor_profile_err');
    }
    if (!firstName?.trim()) newErrors.firstName = t('first_name_err');
    if (!lastName?.trim()) newErrors.lastName = t('last_name_err');
    if (!email?.trim()) {
      newErrors.email = t('email_err');
    } else if (!emailPattern.test(email)) {
      newErrors.email = t('invalid_email_err');
    }
    if (!contactNumber?.trim()) newErrors.contactNumber = t('number_err');
    if (!sector.id) newErrors.sector = t('job_sector_err');
    if (!jobTitle.id) newErrors.jobTitle = t('job_title_err');
    if (!jobFunction.id) newErrors.jobFunction = t('job_function_err');
    if (!companyName?.trim()) newErrors.companyName = t('company_name_err');
    if (type == 'visitor') {
      if (!companyAddress?.trim()) newErrors.companyAddress = t('company_address_err');
    }
    if (!website?.trim()) {
      newErrors.website = t('company_website_err');
    }else if (!urlPattern.test(website)) {
      newErrors.website = t('invalid_url_err');
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const isValid = validateInputs();
    if (!isValid) return;

    setLoading(true);

    try {
      const payload = {
        first_name: firstName, // Used for exhibitor
        name: firstName,
        last_name: lastName,
        email: email,
        address: companyAddress,
        phone: contactNumber,
        visitor_profile: visitoProfile.id,
        organization_name: companyName, // Used for exhibitor
        company_name: companyName,
        company_sector: sector.id,
        job_title: jobTitle.id,
        job_function: jobFunction.id,
        website: website,
        bio: bio,
      };
      
      const updatedUser = await updateUserInfo(payload);
      console.log('User updated successfully');
      // To Update User DATA in the State
      dispatch(checkAuth());
      navigation.goBack();
    } catch (error) {
      console.log('Update failed:', error);
      // Handle The Error Response: Map list of Validation that returned from API
      // And Show them in an ALERT Dialog
      const message = error?.message ?? 'Something went wrong'; 
      const validationErrorList = error?.validationError ?? []; 
      let validationMessages = '';
      if (validationErrorList) {
        // Combine validation error messages into a string
        for (const field in validationErrorList) {
          validationMessages += `\n${field}: ${validationErrorList[field].join(', ')}`;
        }
      }
      alertDialog(
        ALERT_TYPE.DANGER,
        t('error'),
        `${message}\n${validationMessages}`,
        t('OK'),
        () => {},
      );
    } finally {
      setLoading(false);
    }
  };

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [displayImage, setDisplayImage] = useState(imageURL);
  const [imageError, setImageError] = useState(false);
  const [choosePictureModal, setChoosePictureModal] = useState(false);

  useEffect(() => {
    if (user?.imagePath) {
      setDisplayImage(user.imagePath);
      setImageError(false);
    }
  }, [user?.imagePath]);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        handleCameraLaunch();
      } else {
        Dialog.show({
          dialogStyle: {
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
          },
          type: ALERT_TYPE.WARNING,
          title: t('camera_authorisation_title'),
          textBody: t('camera_authorisation_txt'),
          autoClose: false,
          button: t('camera_authorisation_btn'),
          onPressButton: () => {
            Linking.openSettings();
            Dialog.hide();
          },
          closeOnOverlayTap: true,
        });
      }
      setChoosePictureModal(false);
    } catch (error) {
      console.error('Error requesting camera permission: ', error);
      setChoosePictureModal(false);
    }
  };
  
  const handleCameraLaunch = async () => {
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
        setDisplayImage(image.path);
        setChoosePictureModal(false);
        await handleUpload(base64ImageString);
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
    // try {
    //   const image = await ImagePicker.openCamera({
    //     cropping: true,
    //     width: 800,
    //     height: 600,
    //     includeBase64: true,
    //     mediaType: 'photo',
    //     compressImageQuality: 0.8,
    //     useFrontCamera: false,
    //     cropperToolbarTitle: 'Crop Image',
    //     showCropGuidelines: true,
    //     showCropFrame: true,
    //     freeStyleCropEnabled: false,
    //     includeExif: false,
    //   });

    //   if (image) {
    //     const base64ImageString = `data:${image.mime};base64,${image.data}`;
    //     setDisplayImage(image.path);
    //     setChoosePictureModal(false);
    //     await handleUpload(base64ImageString);
    //   }
    // } catch (error) {
    //   if (error.code !== 'E_PICKER_CANCELLED') {
    //     console.error('Error capturing image:', error);
    //     setDisplayImage(imageURL);
    //   }
    // } finally {
    //   setChoosePictureModal(false);
    // }
  };

  const pickImage = async () => {
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
        setDisplayImage(image.path);
        setChoosePictureModal(false);
        await handleUpload(base64ImageString);
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
    // try {
    //   const image = await ImagePicker.openPicker({
    //     cropping: true,
    //     width: 800,
    //     height: 600,
    //     includeBase64: true,
    //     mediaType: 'photo',
    //     compressImageQuality: 0.8,
    //     multiple: false,
    //     cropperToolbarTitle: 'Crop Image',
    //     showCropGuidelines: true,
    //     showCropFrame: true,
    //     freeStyleCropEnabled: false,
    //     includeExif: false,
    //   });

    //   if (image) {
    //     const base64ImageString = `data:${image.mime};base64,${image.data}`;
    //     setDisplayImage(image.path);
    //     setChoosePictureModal(false);
    //     await handleUpload(base64ImageString);
    //   }
    // } catch (err) {
    //   if (err.code !== 'E_PICKER_CANCELLED') {
    //     console.error('Error picking image:', err);
    //     setDisplayImage(imageURL);
    //   }
    // } finally {
    //   setChoosePictureModal(false);
    // }
  };

  const handleUpload = async (base64String) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const payload = {image: base64String};

      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        ApiPaths.baseURL + ApiPaths.ChangeProfileImage + ApiPaths.apiKey, 
        payload, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        }
      );
      if (response.data.code == 200) {
        dispatch(checkAuth());
        ToastUtils.showSuccessToast(
          `${t('success')}`,
          `${t(response?.data?.message)}`,
        );
      } else if(response.data.code == 403) {
        ToastUtils.showErrorToast(
          `${t('error')}`,
          `${t(response?.data?.message)}`,
        );
      } else {
        ToastUtils.showErrorToast(
          `${t('error')}`,
          `${t(response?.data?.message)}`,
        );
      }

    } catch (error) {
      console.error('Upload failed:', error);
      setDisplayImage(imageURL);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('edit_profile')}
        renderLeft={() => {
          return (
            <Icon name="arrow-back" size={20} color={colors.primary} enableRTL={true} />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>
          <ScrollView contentContainerStyle={styles.contain}>
            <View>
              <TouchableOpacity 
                onPress={() => setChoosePictureModal(true)}
                activeOpacity={0.7}
                disabled={isUploading}
              >
                <View style={[styles.container, { borderColor: colors.card }]}>
                  <Image 
                    source={imageError ? Images.noImage : { uri: displayImage }} 
                    style={styles.image}
                    resizeMode="cover"
                    onError={() => setImageError(true)}
                  />
                  
                  {isUploading && (
                    <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                      <ActivityIndicator size="large" color={'white'} />
                      <Text style={[styles.progressText, { color: 'white' }]}>
                        {uploadProgress}%
                      </Text>
                    </View>
                  )}

                  {!isUploading && (
                    <View style={styles.editIndicator}>
                      <Text style={styles.editText}>Edit</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {renderLabel('short-text', t('bio'))}
            <TextInput
              multiline={true}
              numberOfLines={4}
              onChangeText={text => setBio(text)}
              placeholder={t('bio')}
              value={bio}
            />

            {
              type == 'visitor' && (
                <>
                  <DropdownButton
                    label={{ icon: 'person', text: t('visitor_profile') }}
                    onPress={() => setVisitorTypeModal(true)}
                    value={visitoProfile}
                    placeholder={t('visitor_profile')}
                  />
                  {errors.visitoProfile && (
                    <Text style={styles.errormessage}>{errors.visitoProfile}</Text>
                  )}
                </>
              )
            }

            {renderLabel('short-text', t('firstname'))}
            <TextInput
              onChangeText={text => setFirstName(text)}
              placeholder={t('firstname')}
              value={firstName}
            />
            {errors.firstName && (
              <Text style={styles.errormessage}>{errors.firstName}</Text>
            )}

            {renderLabel('short-text', t('lastname'))}
            <TextInput
              onChangeText={text => setLastName(text)}
              placeholder={t('lastname')}
              value={lastName}
            />
            {errors.lastName && (
              <Text style={styles.errormessage}>{errors.lastName}</Text>
            )}

            {renderLabel('email', t('email'))}
            <TextInput
              onChangeText={text => setEmail(text)}
              placeholder={t('email')}
              keyboardType="email-address"
              value={email}
            />
            {errors.email && (
              <Text style={styles.errormessage}>{errors.email}</Text>
            )}

            {renderLabel('phone', t('contact_number'))}
            <TextInput
              onChangeText={text => setContactNumber(text)}
              placeholder={t('contact_number')}
              value={contactNumber}
              keyboardType="phone-pad"
            />
            {errors.contactNumber && (
              <Text style={styles.errormessage}>{errors.contactNumber}</Text>
            )}

            <DropdownButton
              label={{ icon: 'dashboard', text: t('sector') }}
              onPress={() => setSectorModal(true)}
              value={sector}
              placeholder={t('sector')}
            />
            {errors.sector && (
              <Text style={styles.errormessage}>{errors.sector}</Text>
            )}

            <DropdownButton
              label={{ icon: 'cases', text: t('job_title') }}
              onPress={() => setJobTitleModal(true)}
              value={jobTitle}
              placeholder={t('job_title')}
            />
            {errors.jobTitle && (
              <Text style={styles.errormessage}>{errors.jobTitle}</Text>
            )}

            <DropdownButton
              label={{ icon: 'account-tree', text: t('job_function') }}
              onPress={() => setJobFunctionModal(true)}
              value={jobFunction}
              placeholder={t('job_function')}
            />
            {errors.jobFunction && (
              <Text style={styles.errormessage}>{errors.jobFunction}</Text>
            )}

            {renderLabel('apartment', t('company_name'))}
            <TextInput
              onChangeText={text => setCompanyName(text)}
              placeholder={t('company_name')}
              value={companyName}
            />
            {errors.companyName && (
              <Text style={styles.errormessage}>{errors.companyName}</Text>
            )}

            {
              type == 'visitor' && (
                <>
                  {renderLabel('location-pin', t('company_address'))}
                  <TextInput
                    onChangeText={text => setCompanyAddress(text)}
                    placeholder={t('company_address')}
                    value={companyAddress}
                  />
                  {errors.companyAddress && (
                    <Text style={styles.errormessage}>{errors.companyAddress}</Text>
                  )}
                </>
              )
            }

            {renderLabel('web', t('website'))}
            <TextInput
              onChangeText={text => setWebsite(text)}
              placeholder={t('website')}
              value={website}
            />
            {errors.website && (
              <Text style={styles.errormessage}>{errors.website}</Text>
            )}
          </ScrollView>

          <SharedModal
            visible={visitorTypeModal}
            onClose={() => setVisitorTypeModal(false)}
            colors={colors}>
            <FlatList
              data={visitorTypes}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.contentActionModalBottom,
                    {borderBottomColor: colors.border},
                  ]}
                  onPress={() => {
                    setVisitoProfile({id: item.id, name: item.name});
                    setVisitorTypeModal(false);
                  }}>
                  {item.name === visitoProfile.name ? (
                    <Text
                      body2
                      semibold
                      style={{color: colors.primary}}>{`${item.name}`}</Text>
                  ) : (
                    <Text body2 semibold>{`${item.name}`}</Text>
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={{paddingBottom: 20}}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={() => (
                <Text style={{padding: 20}}>
                  {t('no_visitor_profile_data')}
                </Text>
              )}
            />
          </SharedModal>

          <SharedModal
            visible={sectorModal}
            onClose={() => setSectorModal(false)}
            colors={colors}>
            <FlatList
              data={categories}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.contentActionModalBottom,
                    {borderBottomColor: colors.border},
                  ]}
                  onPress={() => {
                    // Reset Job Title And Job Function
                    setJobTitle({id: '', name: ''});
                    setJobFunction({id: '', name: ''});
                    // Fill In DATA for selected Sector
                    setSector({id: item.id, name: item.name});
                    setJobFunctionList(item.job_function_categories ?? []);
                    setJobTitleList(item.job_title_categories ?? []);
                    setSectorModal(false);
                  }}>
                  {item.name === sector.name ? (
                    <Text
                      body2
                      semibold
                      style={{color: colors.primary}}>{`${item.name}`}</Text>
                  ) : (
                    <Text body2 semibold>{`${item.name}`}</Text>
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={{paddingBottom: 20}}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={() => (
                <Text style={{padding: 20}}>{t('no_job_sector_data')}</Text>
              )}
            />
          </SharedModal>

          <SharedModal
            visible={jobTitleModal}
            onClose={() => setJobTitleModal(false)}
            colors={colors}>
            <FlatList
              data={jobTitleList}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.contentActionModalBottom,
                    {borderBottomColor: colors.border},
                  ]}
                  onPress={() => {
                    setJobTitle({id: item.id, name: item.name});
                    setJobTitleModal(false);
                  }}>
                  {item.name === jobTitle.name ? (
                    <Text
                      body2
                      semibold
                      style={{color: colors.primary}}>{`${item.name}`}</Text>
                  ) : (
                    <Text body2 semibold>{`${item.name}`}</Text>
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={{paddingBottom: 20}}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={() => (
                <Text style={{padding: 20}}>
                  {sector?.id == ''
                    ? t('choose_job_sector')
                    : t('no_job_title_data')}
                </Text>
              )}
            />
          </SharedModal>

          <SharedModal
            visible={jobFunctionModal}
            onClose={() => setJobFunctionModal(false)}
            colors={colors}>
            <FlatList
              data={jobFunctionList}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.contentActionModalBottom,
                    {borderBottomColor: colors.border},
                  ]}
                  onPress={() => {
                    setJobFunction({id: item.id, name: item.name});
                    setJobFunctionModal(false);
                  }}>
                  {item.name === jobFunction.name ? (
                    <Text
                      body2
                      semibold
                      style={{color: colors.primary}}>{`${item.name}`}</Text>
                  ) : (
                    <Text body2 semibold>{`${item.name}`}</Text>
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={{paddingBottom: 20}}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={() => (
                <Text style={{padding: 20}}>
                  {sector?.id == ''
                    ? t('choose_job_sector')
                    : t('no_job_function_data')}
                </Text>
              )}
            />
          </SharedModal>

          <SharedModal visible={choosePictureModal} onClose={()=>setChoosePictureModal(false)} colors={colors}>
            <Animated.View style={styles.pickerContainer}>
              <View style={styles.pickerRow}>
                {/* Camera */}
                <TouchableOpacity
                  style={styles.pickerOption}
                  onPress={requestCameraPermission}>
                  <View
                    style={[
                      styles.pickerIconWrapper,
                      {backgroundColor: '#FC5C65'},
                    ]}>
                    <MatIcon name="camera-alt" size={24} color="white" />
                  </View>
                  <Text style={styles.pickerLabel}>Caméra</Text>
                </TouchableOpacity>

                {/* Gallery */}
                <TouchableOpacity style={styles.pickerOption} onPress={pickImage}>
                  <View
                    style={[
                      styles.pickerIconWrapper,
                      {backgroundColor: '#45AAF2'},
                    ]}>
                    <MatIcon name="photo-library" size={24} color="white" />
                  </View>
                  <Text style={styles.pickerLabel}>Galerie</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </SharedModal>

          <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
            <Button
              loading={loading}
              full
              onPress={handleSubmit}>
              {t('confirm')}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
