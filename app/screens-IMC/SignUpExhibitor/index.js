import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  PermissionsAndroid,
  Animated,
} from 'react-native';
import {BaseStyle, BaseColor, useTheme, Images, FontWeight} from '../../config';
import {
  Header,
  SafeAreaView,
  Icon,
  MatIcon,
  Button,
  TextInput,
  Text,
  SharedModal,
} from '../../components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchRegisterDataThunk,
  resetRegisterState,
  registerNewExhibitor
} from '../../reducers/registerDataSlice';
import {useFocusEffect} from '@react-navigation/native';
import {Dialog, ALERT_TYPE} from 'react-native-alert-notification';
import LottieView from 'lottie-react-native';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from "expo-image-picker";
import ToastUtils from "../../config/toastUtils";

export default function SignUpExhibitor({navigation}) {
  const dispatch = useDispatch();
  const registerExhibitorDataState = useSelector(state => state.registerData);
  const {
    data,
    loading,
    error,
    registerExhibitorLoading,
    registerExhibitorError,
    registerExhibitorSuccess,
    registerExhibitorResponse,
  } = registerExhibitorDataState || {};

  useFocusEffect(
    useCallback(() => {
      dispatch(resetRegisterState());
      dispatch(fetchRegisterDataThunk());
    }, [dispatch]),
  );

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    // Cleanup function to remove listeners when the component unmounts
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Initialize Data of Bottom modals
  const [countryCodes, setCountryCodes] = useState([]);
  const [countryCode, setCountryCode] = useState({iso: '', phonecode: '00'});
  const [categories, setCategories] = useState([]);
  const [jobFunctionList, setJobFunctionList] = useState([]);
  const [jobTitleList, setJobTitleList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  // Filter List of countries to get easy the coutry code
  const filteredCountries = useMemo(
    () =>
      countryCodes.filter(
        item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.phonecode.toString().includes(searchQuery),
      ),
    [searchQuery, countryCodes],
  );

  useEffect(() => {
    if (data?.requestData) {
      setCountryCodes(data?.requestData?.Country);
      setCategories(data?.requestData?.category);
    }
  }, [data?.requestData]);

  const {theme, colors} = useTheme();
  const {t} = useTranslation();
  const [step, setStep] = useState(1);
  // Ref for the ScrollView : used to scroll screen to top when clicking on input
  const scrollViewRef = useRef(null);
  // This Refs used for inputs of SignUp
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const contactNumberRef = useRef(null);
  const companyNameRef = useRef(null);
  const companyAddressRef = useRef(null);
  const websiteRef = useRef(null);
  const squareMetersRef = useRef(null);
  const notesRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  // To Store Form Data
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '',
    contactNumber: '',
    jobTitle: '',
    jobTitleText: '',
    jobFunction: '',
    jobFunctionText: '',
    sector: '',
    sectorText: '',
    companyName: '',
    companyAddress: '',
    website: '',
    squareMeters: '',
    notes: '',
    approveConditions: false,
    isTextExpanded: false,
    image: '',
    password: '',
    confirmPassword: '',
  });
  // Error Messages after Validation
  const [firstNameValidError, setFirstNameValidError] = useState('');
  const [lastNameValidError, setLastNameValidError] = useState('');
  const [emailValidError, setEmailValidError] = useState('');
  const [contactNumberValidError, setContactNumberValidError] = useState('');
  const [countryCodeValidError, setCountryCodeValidError] = useState('');
  const [jobTitleValidError, setJobTitleValidError] = useState('');
  const [jobFunctionValidError, setJobFunctionValidError] = useState('');
  const [sectorValidError, setSectorValidError] = useState('');
  const [companyNameValidError, setCompanyNameValidError] = useState('');
  const [companyAddressValidError, setCompanyAddressValidError] = useState('');
  const [websiteValidError, setWebsiteValidError] = useState('');
  const [squareMetersValidError, setSquareMetersValidError] = useState('');
  const [approveConditionsValidError, setApproveConditionsValidError] = useState('');
  const [imgValidError, setImgValidError] = useState('');
  const [passwordValidError, setPasswordValidError] = useState('');
  const [confirmPasswordValidError, setConfirmPasswordValidError] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =useState(true);
  // Handle Input Changes
  const handleInputChange = (field, value) => {
    setForm(prevState => ({...prevState, [field]: value}));
  };

  const isValidWebsite = url => {
    const urlPattern = /^(https?:\/\/)?([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(:[0-9]+)?(\/[a-z0-9-._~%!$&'()*+,;=:@/?]*)?$/i;

    // Extra validation for "www."
    if (url.startsWith('www.')) {
      const withoutWww = url.slice(4);

      // Must still contain another dot after "www."
      if (!withoutWww.includes('.')) {
        return false;
      }
    }

    return urlPattern.test(url);
  };

  // Validate Inputs
  const validateStep = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,6}$/;

    const validateField = (field, errorSetter, errorMessage) => {
      // Check for whitespace-only content
      if (typeof form[field] === 'string' && form[field].trim() === '') {
        errorSetter(errorMessage);
        return false;
      }
      if (!form[field]) {
        errorSetter(errorMessage);
        return false;
      }
      errorSetter('');
      return true;
    };

    if (step === 1) {
      // Validate fields for step 1
      const step1Fields = [
        {
          field: 'firstName',
          errorSetter: setFirstNameValidError,
          errorMessage: t('first_name_err'),
        },
        {
          field: 'lastName',
          errorSetter: setLastNameValidError,
          errorMessage: t('last_name_err'),
        },
        {
          field: 'email',
          errorSetter: setEmailValidError,
          errorMessage: t('email_err'),
        },
        {
          field: 'contactNumber',
          errorSetter: setContactNumberValidError,
          errorMessage: t('number_err'),
        },
        {
          field: 'countryCode',
          errorSetter: setCountryCodeValidError,
          errorMessage: t('country_code_err'),
        },
      ];

      for (const {field, errorSetter, errorMessage} of step1Fields) {
        if (!validateField(field, errorSetter, errorMessage)) return false;
      }

      // Email validation pattern
      if (form.email && !emailPattern.test(form.email)) {
        setEmailValidError(t('invalid_email_err'));
        return false;
      }
      // Contact number length validation - at least 8 digits
      if (form.contactNumber) {
        // Remove any non-digit characters before counting
        const digitsOnly = form.contactNumber.replace(/\D/g, '');
        
        if (digitsOnly.length < 8) {
          setContactNumberValidError(t('contact_number_err'));
          return false;
        }
      }
    }

    if (step === 2) {
      // Validate fields for step 2
      const step2Fields = [
        {
          field: 'sector',
          errorSetter: setSectorValidError,
          errorMessage: t('job_sector_err'),
        },
        {
          field: 'jobTitle',
          errorSetter: setJobTitleValidError,
          errorMessage: t('job_title_err'),
        },
        {
          field: 'jobFunction',
          errorSetter: setJobFunctionValidError,
          errorMessage: t('job_function_err'),
        },
        {
          field: 'companyName',
          errorSetter: setCompanyNameValidError,
          errorMessage: t('company_name_err'),
        },
        {
          field: 'companyAddress',
          errorSetter: setCompanyAddressValidError,
          errorMessage: t('company_address_err'),
        },
        {
          field: 'website',
          errorSetter: setWebsiteValidError,
          errorMessage: t('company_website_err'),
        },
      ];

      for (const {field, errorSetter, errorMessage} of step2Fields) {
        if (!validateField(field, errorSetter, errorMessage)) return false;
      }

      // Email validation pattern
      if (form.website && !isValidWebsite(form.website)) {
        setWebsiteValidError(t('invalid_url_err'));
        return false;
      }
    }

    if (step === 3) {
      // Validate fields for step 3
      const step3Fields = [
        {
          field: 'squareMeters',
          errorSetter: setSquareMetersValidError,
          errorMessage: t('squareMeters_err'),
        },
        {
          field: 'approveConditions',
          errorSetter: setApproveConditionsValidError,
          errorMessage: t('approveConditions_err'),
        },
      ];

      for (const {field, errorSetter, errorMessage} of step3Fields) {
        if (!validateField(field, errorSetter, errorMessage)) return false;
      }
    }

    if (step === 4) {
      // Validate fields for step 3
      const step4Fields = [
        {field: 'image', errorSetter: setImgValidError, errorMessage: t('image_err')}
      ];

      for (const {field, errorSetter, errorMessage} of step4Fields) {
        if (!validateField(field, errorSetter, errorMessage)) return false;
      }
    }

    return true;
  };
  // If Inputs are valid go to next Step using this method
  const nextStep = () => {
    if (validateStep()) {
      setStep(prevStep => prevStep + 1);
    }
  };
  // Refturn to previous method
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const validatePassword = (password) => {
    if (!password) return t('required_password_err');
    if (password.length < 8) return t('password_min_length_err'); // At least 8 chars
    // Define criteria
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    // Count how many criteria are met
    const criteriaMet = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    // Medium: at least 3 out of 4 criteria
    if (criteriaMet < 3) {
      return t('password_medium_err');
    }
    
    return '';
  };
  // Handle SignUp
  const onSignUp = () => {
    Keyboard.dismiss();
    if (step === 5) {
      // Validate Password
      const passwordError = validatePassword(form.password);
      setPasswordValidError(passwordError);
      if (passwordError) return false;
      
      // Confirm password validation
      if (!form.confirmPassword) {
        setConfirmPasswordValidError(t('confirm_password_err'));
        return false;
      } else if (form.confirmPassword !== form.password) {
        setConfirmPasswordValidError(t('inmatch_password_err'));
        return false;
      } else {
        setConfirmPasswordValidError('');
      }
      // API Logic for SignUp
      dispatch(
        registerNewExhibitor({
          name: form.firstName,
          last_name: form.lastName,
          organization_name: form.companyName,
          company_adress: form.companyAddress,
          company_sector: form.sector,
          job_title: form.jobTitle,
          job_function: form.jobFunction,
          square_metres: form.squareMeters,
          comments: form.notes,
          Countrycode: form.countryCode,
          phone: form.contactNumber,
          website: form.website,
          email: form.email,
          image: form.image,
          password: form.password,
        }),
      );
    }
  };

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

  useEffect(() => {
    if (registerExhibitorSuccess) {
      // navigate to SignIn Page
      navigation.navigate('SignIn');
      // Show Success Alert Dialog
      ToastUtils.showSuccessToast(
        `${t('success')}`,
        `${t(registerExhibitorResponse.message)}`,
      );

      dispatch(resetRegisterState());
    }
  }, [registerExhibitorSuccess, registerExhibitorResponse]);

  useEffect(() => {
    if (registerExhibitorError) {
      const {message, validationError} = registerExhibitorError;
      // Get Inputs Validation errors to show them in Dialog
      let validationMessages = '';
      if (validationError) {
        // Combine validation error messages into a string
        for (const field in validationError) {
          validationMessages += `\n${field}: ${validationError[field].map(err => t(err)).join(', ')}`;
        }
      }
      // Show Error Alert Dialog
      alertDialog(
        ALERT_TYPE.DANGER,
        t('error'),
        `${t(message)}\n${validationMessages}`,
        t('OK'),
        () => {},
      );
    }
  }, [registerExhibitorError]);

  const InputFieldIcon = ({icon}) => (
    <Icon
      name={icon}
      size={20}
      color={BaseColor.kashmir}
      style={styles.leftIcon}
    />
  );

  const StepIndicator = ({step, colors}) => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4, 5].map(s => (
        <Icon
          key={s}
          name={
            s === 1
              ? 'person'
              : s === 2
              ? 'apartment'
              : s === 3
              ? 'list-alt'
              : s === 4
              ? 'camera-alt'
              : 'lock'
          }
          size={24}
          color={step === s ? colors.primary : colors.border}
          style={{marginRight: s === 5 ? 0 : 30}}
        />
      ))}
    </View>
  );

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
        handleInputChange('image', base64ImageString);
        console.log(
          "Image captured:",
          base64ImageString.substring(0, 50) + "...",
        );
      } else {
        console.log("User cancelled camera");
      }
    } catch (error) {
      console.log('Camera Error', error);
    } finally {
      setChoosePictureModal(false);
    }
    // try {
    //   const image = await ImagePicker.openCamera({
    //     cropping: true,
    //     width: 800,
    //     height: 600,
    //     includeBase64: true,
    //     mediaType: 'photo',
    //     cropping: true,
    //     compressImageQuality: 0.8,
    //     useFrontCamera: false,
    //     includeExif: false,
    //     cropperToolbarTitle: 'Crop Image',
    //     showCropGuidelines: true,
    //     showCropFrame: true,
    //     freeStyleCropEnabled: false,
    //   });

    //   if (image) {
    //     const base64ImageString = `data:${image.mime};base64,${image.data}`;
    //     handleInputChange('image', base64ImageString);
    //   }
    // } catch (error) {
    //   if (error.code !== 'E_PICKER_CANCELLED') {
    //     console.error('Error capturing image:', error);
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
        handleInputChange('image', base64ImageString);
        console.log(
          "Image selected:",
          base64ImageString.substring(0, 50) + "...",
        );
      } else {
        console.log("User cancelled image selection");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    } finally {
      setChoosePictureModal(false);
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
    //     includeExif: false,
    //     cropperToolbarTitle: 'Crop Image',
    //     showCropGuidelines: true,
    //     showCropFrame: true,
    //     freeStyleCropEnabled: false,
    //     cropperCircleOverlay: false,
    //     loadingLabelText: 'Processing image...',
    //   });

    //   if (image) {
    //     const base64ImageString = `data:${image.mime};base64,${image.data}`;
    //     handleInputChange('image', base64ImageString);
    //   }
    // } catch (err) {
    //   if (err.code !== 'E_PICKER_CANCELLED') {
    //     console.error('Error picking image:', err);
    //   }
    // } finally {
    //   setChoosePictureModal(false);
    // }
  };

  // Modal
  const [coutryCodeModal, setCoutryCodeModal] = useState(false);
  const [sectorModal, setSectorModal] = useState(false);
  const [jobTitleModal, setJobTitleModal] = useState(false);
  const [jobFunctionModal, setJobFunctionModal] = useState(false);
  const [showConditionsDialog, setShowConditionsDialog] = useState(false);
  const [choosePictureModal, setChoosePictureModal] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1}}>
        <Header
          title={t('book_a_stand')}
          renderLeft={() => (
            <Icon
              name="arrow-back"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          )}
          onPressLeft={() => {
            navigation.goBack();
            dispatch(resetRegisterState());
          }}
        />
        <SafeAreaView style={BaseStyle.safeAreaView}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={{flexGrow: 1}}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({animated: true})
              }>
              <Image source={theme.dark ? Images.LoginBGDark : Images.LoginBG} style={styles.bottomImage} />
              <Image source={Images.appLogo} style={styles.appLogo} />
              {loading ? (
                <View
                  style={{
                    flex: 0.6,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <LottieView
                    source={Images.loading}
                    autoPlay
                    loop
                    style={{width: 200, height: 200}}
                  />
                </View>
              ) : error ? (
                <View
                  style={{
                    flex: 0.6,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text semibold>{t('Something_went_wrong_try_again')}</Text>
                  <Text bold>{t('thank_you')}</Text>
                </View>
              ) : (
                <View style={[styles.container, {backgroundColor: colors.card, marginBottom: isKeyboardVisible && '40%'}]}>
                  {/* Stepper */}
                  <StepIndicator step={step} colors={colors} />
                  <View style={styles.lineStyle} />

                  {/* 1st Step: User info */}
                  {step === 1 && (
                    <>
                      <View style={styles.inputContainer}>
                        <InputFieldIcon icon={'short-text'} />
                        <TextInput
                          innerRef={firstNameRef}
                          onChangeText={text =>
                            handleInputChange('firstName', text)
                          }
                          placeholder={t('firstname')}
                          style={[styles.placeholderInput, {marginTop: 10, backgroundColor: colors.background}]}
                          value={form.firstName}
                          returnKeyType="next"
                          onSubmitEditing={() => lastNameRef.current?.focus()}
                          blurOnSubmit={false}
                        />
                      </View>
                      {firstNameValidError.length !== 0 && (
                        <Text style={styles.errormessage}>
                          {firstNameValidError}
                        </Text>
                      )}

                      <View style={styles.inputContainer}>
                        <InputFieldIcon icon={'short-text'} />
                        <TextInput
                          innerRef={lastNameRef}
                          onChangeText={text =>
                            handleInputChange('lastName', text)
                          }
                          placeholder={t('lastname')}
                          style={[styles.placeholderInput, {marginTop: 10, backgroundColor: colors.background}]}
                          value={form.lastName}
                          returnKeyType="next"
                          onSubmitEditing={() => emailRef.current?.focus()}
                          blurOnSubmit={false}
                        />
                      </View>
                      {lastNameValidError.length !== 0 && (
                        <Text style={styles.errormessage}>
                          {lastNameValidError}
                        </Text>
                      )}

                      <View style={styles.inputContainer}>
                        <InputFieldIcon icon={'email'} />
                        <TextInput
                          innerRef={emailRef}
                          onChangeText={text =>
                            handleInputChange('email', text)
                          }
                          placeholder={t('email')}
                          keyboardType="email-address"
                          style={[styles.placeholderInput, {marginTop: 10, backgroundColor: colors.background}]}
                          value={form.email}
                          returnKeyType="next"
                          onSubmitEditing={() =>
                            contactNumberRef.current?.focus()
                          }
                          blurOnSubmit={false}
                        />
                      </View>
                      {emailValidError.length !== 0 && (
                        <Text style={styles.errormessage}>
                          {emailValidError}
                        </Text>
                      )}

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}>
                        {/* <InputFieldIcon icon={'phone'} /> */}
                        <TouchableOpacity
                          onPress={() => {
                            Keyboard.dismiss();
                            setCoutryCodeModal(true);
                          }}
                          style={{width: '25%'}}>
                          <View
                            style={[
                              styles.phoneCodeBtn,
                              {backgroundColor: colors.background},
                            ]}>
                            <Icon
                              name="phone"
                              size={20}
                              color={BaseColor.kashmir}
                            />
                            <Text>{'+' + countryCode.phonecode}</Text>
                          </View>
                        </TouchableOpacity>
                        <TextInput
                          innerRef={contactNumberRef}
                          onChangeText={text =>
                            handleInputChange('contactNumber', text)
                          }
                          placeholder={t('contact_number')}
                          keyboardType="phone-pad"
                          style={[
                            styles.placeholderInput,
                            {marginTop: 10, width: '70%', backgroundColor: colors.background},
                          ]}
                          value={form.contactNumber}
                          returnKeyType="next"
                          onSubmitEditing={() => nextStep()}
                          blurOnSubmit={false}
                        />
                      </View>
                      {countryCodeValidError.length !== 0 && (
                        <Text style={styles.errormessage}>
                          {countryCodeValidError}
                        </Text>
                      )}
                      {contactNumberValidError.length !== 0 && (
                        <Text style={styles.errormessage}>
                          {contactNumberValidError}
                        </Text>
                      )}
                    </>
                  )}

                  {/* 2nd Step: Company Info */}
                  {step === 2 && (
                    <>
                      <TouchableOpacity
                        onPress={() => setSectorModal(true)}
                        style={{width: '100%'}}>
                        <View
                          style={[
                            styles.dropdownBtn,
                            {backgroundColor: colors.background},
                          ]}>
                          <Icon
                            name="dashboard"
                            size={20}
                            color={BaseColor.kashmir}
                          />
                          <Text
                            style={{
                              paddingLeft: 18,
                              width: '80%',
                              color: form.sector === '' ? 'grey' : colors.text,
                              fontWeight: form.sector === '' ? FontWeight.regular : FontWeight.semibold,
                              textAlign: 'center',
                              justifyContent: 'center',
                            }}
                            numberOfLines={1}
                          >
                            {form.sector === '' ? t('sector') : form.sectorText}
                          </Text>
                          <Icon
                            name="keyboard-arrow-down"
                            size={18}
                            color={BaseColor.kashmir}
                          />
                        </View>
                      </TouchableOpacity>
                      {sectorValidError.length !== 0 && (
                        <Text style={styles.errormessage}>
                          {sectorValidError}
                        </Text>
                      )}

                      <TouchableOpacity
                        onPress={() => setJobTitleModal(true)}
                        style={{width: '100%'}}>
                        <View
                          style={[
                            styles.dropdownBtn,
                            {backgroundColor: colors.background},
                          ]}>
                          <Icon
                            name="cases"
                            size={20}
                            color={BaseColor.kashmir}
                          />
                          <Text
                            style={{
                              paddingLeft: 18,
                              width: '80%',
                              color: form.jobTitle === '' ? 'grey' : colors.text,
                              fontWeight: form.jobTitle === '' ? FontWeight.regular : FontWeight.semibold,
                              textAlign: 'center',
                              justifyContent: 'center',
                            }}
                            numberOfLines={1}
                          >
                            {form.jobTitle === ''
                              ? t('job_title')
                              : form.jobTitleText}
                          </Text>
                          <Icon
                            name="keyboard-arrow-down"
                            size={18}
                            color={BaseColor.kashmir}
                          />
                        </View>
                      </TouchableOpacity>
                      {jobTitleValidError.length !== 0 && (
                        <Text style={styles.errormessage}>
                          {jobTitleValidError}
                        </Text>
                      )}

                      <TouchableOpacity
                        onPress={() => setJobFunctionModal(true)}
                        style={{width: '100%'}}>
                        <View
                          style={[
                            styles.dropdownBtn,
                            {backgroundColor: colors.background},
                          ]}>
                          <Icon
                            name="account-tree"
                            size={20}
                            color={BaseColor.kashmir}
                          />
                          <Text
                            style={{
                              paddingLeft: 18,
                              width: '80%',
                              color: form.jobFunction === '' ? 'grey' : colors.text,
                              fontWeight: form.jobFunction === '' ? FontWeight.regular : FontWeight.semibold,
                              textAlign: 'center',
                              justifyContent: 'center',
                            }}
                            numberOfLines={1}
                          >
                            {form.jobFunction === ''
                              ? t('job_function')
                              : form.jobFunctionText}
                          </Text>
                          <Icon
                            name="keyboard-arrow-down"
                            size={18}
                            color={BaseColor.kashmir}
                          />
                        </View>
                      </TouchableOpacity>
                      {jobFunctionValidError.length !== 0 && (
                        <Text style={styles.errormessage}>
                          {jobFunctionValidError}
                        </Text>
                      )}

                      <View style={styles.inputContainer}>
                        <InputFieldIcon icon={'apartment'} />
                        <TextInput
                          innerRef={companyNameRef}
                          onChangeText={text =>
                            handleInputChange('companyName', text)
                          }
                          placeholder={t('company_name')}
                          style={[styles.placeholderInput, {marginTop: 10, backgroundColor: colors.background}]}
                          value={form.companyName}
                          returnKeyType="next"
                          onSubmitEditing={() =>
                            companyAddressRef.current?.focus()
                          }
                          blurOnSubmit={false}
                        />
                      </View>
                      {companyNameValidError.length !== 0 && (
                        <Text style={styles.errormessage}>
                          {companyNameValidError}
                        </Text>
                      )}

                      <View style={styles.inputContainer}>
                        <InputFieldIcon icon={'location-pin'} />
                        <TextInput
                          innerRef={companyAddressRef}
                          onChangeText={text =>
                            handleInputChange('companyAddress', text)
                          }
                          placeholder={t('company_address')}
                          style={[styles.placeholderInput, {marginTop: 10, backgroundColor: colors.background}]}
                          value={form.companyAddress}
                          returnKeyType="next"
                          onSubmitEditing={() => websiteRef.current?.focus()}
                          blurOnSubmit={false}
                        />
                      </View>
                      {companyAddressValidError.length !== 0 && (
                        <Text style={styles.errormessage}>
                          {companyAddressValidError}
                        </Text>
                      )}

                      <View style={styles.inputContainer}>
                        <InputFieldIcon icon={'web'} />
                        <TextInput
                          innerRef={websiteRef}
                          onChangeText={text =>
                            handleInputChange('website', text)
                          }
                          placeholder={t('website')}
                          style={[styles.placeholderInput, {marginTop: 10, backgroundColor: colors.background}]}
                          value={form.website}
                          returnKeyType="next"
                          onSubmitEditing={() => nextStep()}
                          blurOnSubmit={false}
                          autoCapitalize="none"
                        />
                      </View>
                      {websiteValidError.length !== 0 && (
                        <Text style={styles.errormessage}>
                          {websiteValidError}
                        </Text>
                      )}
                    </>
                  )}

                  {/* 3rd Step: Square meters */}
                  {step === 3 && (
                    <>
                      <View style={styles.inputContainer}>
                        <InputFieldIcon icon={'texture'} />
                        <TextInput
                          innerRef={squareMetersRef}
                          style={[styles.placeholderInput, {marginTop: 10, backgroundColor: colors.background}]}
                          keyboardType={'numeric'}
                          onChangeText={text =>
                            handleInputChange('squareMeters', text)
                          }
                          placeholder={t('square_meters')}
                          value={form.squareMeters}
                          returnKeyType="next"
                          onSubmitEditing={() => notesRef.current?.focus()}
                          blurOnSubmit={false}
                        />
                      </View>
                      {squareMetersValidError.length !== 0 && (
                        <Text style={styles.errormessage}>
                          {squareMetersValidError}
                        </Text>
                      )}
                      <View style={styles.inputContainer}>
                        <InputFieldIcon icon={'short-text'} />
                        <TextInput
                          innerRef={notesRef}
                          style={[styles.placeholderInput, {marginTop: 10, backgroundColor: colors.background}]}
                          onChangeText={text =>
                            handleInputChange('notes', text)
                          }
                          placeholder={t('notes_comments')}
                          value={form.notes}
                          multiline={true}
                          returnKeyType="next"
                          onSubmitEditing={() => nextStep()}
                          blurOnSubmit={false}
                        />
                      </View>
                      <View style={styles.checkboxWrapper}>
                        <Checkbox
                          value={form.approveConditions}
                          onValueChange={(value) => {
                            handleInputChange('approveConditions', value)
                          }}
                          style={{alignSelf: 'center'}}
                          color={form.approveConditions ? colors.primary : undefined}
                        />
                        <View
                          style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            flex: 1,
                            alignContent: 'center'
                          }}>
                          <Text style={styles.conditionsText}>
                            {t('read_approve')}
                          </Text>
                          <TouchableOpacity
                            onPress={() => setShowConditionsDialog(true)}>
                            <Text
                              style={[
                                styles.readMoreText,
                                {color: colors.primary},
                              ]}>
                              {t('terms')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {approveConditionsValidError.length !== 0 && (
                        <Text style={styles.errormessage}>
                          {approveConditionsValidError}
                        </Text>
                      )}
                    </>
                  )}

                  {/* 4th Step: Image */}
                  {step === 4 && (
                    <View style={styles.uploadContainer}>
                    <TouchableOpacity
                      onPress={() => setChoosePictureModal(true)}
                      style={styles.uploadButton}>
                      {form.image ? (
                        <Image source={{uri: form.image}} style={styles.uploadImage} />
                      ) : (
                        <View
                          style={[
                            styles.uploadPlaceholder,
                            {
                              backgroundColor: colors.card,
                              borderColor: colors.border,
                            },
                          ]}>
                          <Icon name="camera" size={32} color={colors.primary} />
                          <Text style={[styles.uploadText, {color: colors.primary}]}>
                            Ajouter mon image
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    {imgValidError?.length > 0 && (
                      <Text style={styles.errorText}>{imgValidError}</Text>
                    )}
                  </View>
                  )}

                  {/* 5th Step: Password */}
                  {step === 5 && (
                    <>
                      <View style={styles.inputContainer}>
                        <InputFieldIcon icon={'lock'} />
                        <TextInput
                          innerRef={passwordRef}
                          style={[styles.placeholderInput, {marginTop: 10, backgroundColor: colors.background}]}
                          onChangeText={text =>
                            handleInputChange('password', text)
                          }
                          secureTextEntry={passwordVisibility}
                          placeholder={t('password')}
                          value={form.password}
                          returnKeyType="next"
                          onSubmitEditing={() =>
                            confirmPasswordRef.current?.focus()
                          }
                          blurOnSubmit={false}
                        />
                        <TouchableOpacity
                          onPress={() =>
                            setPasswordVisibility(!passwordVisibility)
                          }
                          style={styles.eyeIconContainer}>
                          <Icon
                            name={passwordVisibility ? 'visibility-off' : 'visibility'}
                            size={20}
                            color={colors.text}
                          />
                        </TouchableOpacity>
                      </View>
                      {passwordValidError.length !== 0 && (
                        <Text style={styles.errormessage}>
                          {passwordValidError}
                        </Text>
                      )}

                      <View style={styles.inputContainer}>
                        <InputFieldIcon icon={'lock'} />
                        <TextInput
                          innerRef={confirmPasswordRef}
                          style={[styles.placeholderInput, {marginTop: 10, backgroundColor: colors.background}]}
                          onChangeText={text =>
                            handleInputChange('confirmPassword', text)
                          }
                          secureTextEntry={confirmPasswordVisibility}
                          placeholder={t('confirm_password')}
                          value={form.confirmPassword}
                          onSubmitEditing={() => onSignUp()}
                          blurOnSubmit={false}
                        />
                        <TouchableOpacity
                          onPress={() =>
                            setConfirmPasswordVisibility(
                              !confirmPasswordVisibility,
                            )
                          }
                          style={styles.eyeIconContainer}>
                          <Icon
                            name={confirmPasswordVisibility ? 'visibility-off' : 'visibility'}
                            size={20}
                            color={colors.text}
                          />
                        </TouchableOpacity>
                      </View>
                      {confirmPasswordValidError.length !== 0 && (
                        <Text style={styles.errormessage}>
                          {confirmPasswordValidError}
                        </Text>
                      )}
                    </>
                  )}

                  {/* Navigation Buttons */}
                  <View
                    style={[
                      styles.buttonContainer,
                      {
                        justifyContent:
                          step === 1 ? 'flex-end' : 'space-between',
                      },
                    ]}>
                    {step > 1 && (
                      <TouchableOpacity onPress={prevStep} disabled={registerExhibitorLoading} >
                        <Icon
                          name="arrow-circle-left"
                          size={40}
                          color={colors.primary}
                          style={{opacity: registerExhibitorLoading ? 0.5 : 1}}
                        />
                      </TouchableOpacity>
                    )}
                    {step < 5 ? (
                      <TouchableOpacity onPress={nextStep}>
                        <Icon
                          name="arrow-circle-right"
                          size={40}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                    ) : (
                      <Button
                        onPress={onSignUp}
                        loading={registerExhibitorLoading}
                        style={styles.signupBtn}>
                        {t('sign_up')}
                      </Button>
                    )}
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Country Code Modal */}
            <SharedModal
              visible={coutryCodeModal}
              onClose={() => setCoutryCodeModal(false)}
              colors={colors}>
              {/* Filtered List */}
              <FlatList
                data={filteredCountries}
                keyExtractor={item => item.id.toString()}
                ListHeaderComponent={
                  <View style={{padding: 10}}>
                    <TextInput
                      placeholder={t('search_country')}
                      placeholderTextColor={colors.border}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      style={[
                        styles.searchCountry,
                        {borderColor: colors.border, color: colors.text},
                      ]}
                    />
                  </View>
                }
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={[
                      styles.contentActionModalBottom,
                      {borderBottomColor: colors.border},
                    ]}
                    onPress={() => {
                      setCountryCode(item);
                      handleInputChange('countryCode', item.phonecode);
                      setCoutryCodeModal(false);
                    }}>
                    {item.phonecode === form.countryCode ? (
                      <Text
                        body2
                        semibold
                        style={{
                          color: colors.primary,
                        }}>{`(+${item.phonecode}) ${item.name}`}</Text>
                    ) : (
                      <Text
                        body2
                        semibold>{`(+${item.phonecode}) ${item.name}`}</Text>
                    )}
                  </TouchableOpacity>
                )}
                contentContainerStyle={{paddingBottom: 20}}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={() => (
                  <Text style={{padding: 20}}>{t('no_country_code_data')}</Text>
                )}
              />
            </SharedModal>

            {/* JOB Sector Modal */}
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
                      handleInputChange('jobTitle', '');
                      handleInputChange('jobFunction', '');
                      handleInputChange('jobTitleText', '');
                      handleInputChange('jobFunctionText', '');
                      // Fill In DATA for selected Sector
                      handleInputChange('sector', item.id.toString());
                      handleInputChange('sectorText', item.name);
                      setJobFunctionList(item.job_function_categories ?? []);
                      setJobTitleList(item.job_title_categories ?? []);
                      setSectorModal(false);
                    }}>
                    {item.name === form.sectorText ? (
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

            {/* JOB Title Modal */}
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
                      handleInputChange('jobTitle', item.id.toString());
                      handleInputChange('jobTitleText', item.name);
                      setJobTitleModal(false);
                    }}>
                    {item.name === form.jobTitleText ? (
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
                    {form.sector == ''
                      ? t('choose_job_sector')
                      : t('no_job_title_data')}
                  </Text>
                )}
              />
            </SharedModal>

            {/* JOB Function Modal */}
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
                      handleInputChange('jobFunction', item.id.toString());
                      handleInputChange('jobFunctionText', item.name);
                      setJobFunctionModal(false);
                    }}>
                    {item.name === form.jobFunctionText ? (
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
                    {form.sector == ''
                      ? t('choose_job_sector')
                      : t('no_job_function_data')}
                  </Text>
                )}
              />
            </SharedModal>

            {/* Conditions Dialog */}
            <Modal
              visible={showConditionsDialog}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowConditionsDialog(false)}>
              <TouchableOpacity
                style={styles.dialogContainer}
                activeOpacity={1}
                onPressOut={() => {
                  setShowConditionsDialog(false);
                }}>
                <View style={[styles.dialogContent, {backgroundColor: colors.background}]}>
                  <ScrollView style={styles.dialogTextContainer}>
                    <Text style={styles.dialogText} numberOfLines={100}>
                      {t('sign_up_exhbitor_conditions')}
                    </Text>
                  </ScrollView>
                  <TouchableOpacity
                    style={[styles.dialogButton, {backgroundColor: colors.primary}]}
                    onPress={() => setShowConditionsDialog(false)}>
                    <Text style={styles.dialogButtonText}>{t('close')}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>

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
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}
