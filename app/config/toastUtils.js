import Toast from 'react-native-toast-message';

export const showSuccessToast = (
  text1,
  text2,
  showButton1 = false,
  onButton1Press = () => {},
  showButton2 = false,
  onButton2Press = () => {},
  showCloseButton = false,
  visibilityTime = 3000,
) => {
  Toast.show({
    type: 'customToast',
    text1: text1,
    text2: text2,
    props: {
      showButton1,
      onButton1Press,
      showButton2,
      onButton2Press,
      showCloseButton,
    },
    autoHide: !(showButton1 || showButton2 || showCloseButton),
    visibilityTime: visibilityTime,
  });
};

export const showErrorToast = (
  text1,
  text2,
  showButton1 = false,
  onButton1Press = () => {},
  showButton2 = false,
  onButton2Press = () => {},
  showCloseButton = false,
  visibilityTime = 3000,
) => {
  Toast.show({
    type: 'customToast',
    text1: text1,
    text2: text2,
    props: {
      showButton1,
      onButton1Press,
      showButton2,
      onButton2Press,
      showCloseButton,
    },
    autoHide: !(showButton1 || showButton2 || showCloseButton),
    visibilityTime: visibilityTime,
  });
};

export const showInfoToast = (
  text1,
  text2,
  showButton1 = false,
  onButton1Press = () => {},
  showButton2 = false,
  onButton2Press = () => {},
  showCloseButton = false,
  visibilityTime = 10000,
) => {
  Toast.show({
    type: 'customToast',
    text1: text1,
    text2: text2,
    props: {
      showButton1,
      onButton1Press,
      showButton2,
      onButton2Press,
      showCloseButton,
    },
    autoHide: !(showButton1 || showButton2 || showCloseButton),
    visibilityTime: visibilityTime,
  });
};

// You can also export them as an object if you prefer
export default {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
};