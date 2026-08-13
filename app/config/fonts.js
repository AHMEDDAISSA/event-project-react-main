const variants = {
  Roboto: {
    100: 'Thin', 200: 'Thin', 300: 'Light', 400: 'Regular', 500: 'Medium',
    600: 'Medium', 700: 'Bold', 800: 'Bold', 900: 'Black',
    normal: 'Regular', bold: 'Bold',
  },
  Raleway: {
    100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular',
    500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold',
    900: 'Black', normal: 'Regular', bold: 'Bold',
  },
  Merriweather: {
    100: 'Light', 200: 'Light', 300: 'Light', 400: 'Regular',
    500: 'Regular', 600: 'Bold', 700: 'Bold', 800: 'Bold', 900: 'Black',
    normal: 'Regular', bold: 'Bold',
  },
};

// Expo needs each asset to be registered before a font family can be used.
export const FontAssets = {
  'Roboto-Thin': require('../assets/fonts/Roboto-Thin.ttf'),
  'Roboto-ThinItalic': require('../assets/fonts/Roboto-ThinItalic.ttf'),
  'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
  'Roboto-LightItalic': require('../assets/fonts/Roboto-LightItalic.ttf'),
  'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
  'Roboto-Italic': require('../assets/fonts/Roboto-Italic.ttf'),
  'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
  'Roboto-MediumItalic': require('../assets/fonts/Roboto-MediumItalic.ttf'),
  'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
  'Roboto-BoldItalic': require('../assets/fonts/Roboto-BoldItalic.ttf'),
  'Roboto-Black': require('../assets/fonts/Roboto-Black.ttf'),
  'Roboto-BlackItalic': require('../assets/fonts/Roboto-BlackItalic.ttf'),
  'Raleway-Thin': require('../assets/fonts/Raleway-Thin.ttf'),
  'Raleway-ThinItalic': require('../assets/fonts/Raleway-ThinItalic.ttf'),
  'Raleway-ExtraLight': require('../assets/fonts/Raleway-ExtraLight.ttf'),
  'Raleway-ExtraLightItalic': require('../assets/fonts/Raleway-ExtraLightItalic.ttf'),
  'Raleway-Light': require('../assets/fonts/Raleway-Light.ttf'),
  'Raleway-LightItalic': require('../assets/fonts/Raleway-LightItalic.ttf'),
  'Raleway-Regular': require('../assets/fonts/Raleway-Regular.ttf'),
  'Raleway-Italic': require('../assets/fonts/Raleway-Italic.ttf'),
  'Raleway-Medium': require('../assets/fonts/Raleway-Medium.ttf'),
  'Raleway-MediumItalic': require('../assets/fonts/Raleway-MediumItalic.ttf'),
  'Raleway-SemiBold': require('../assets/fonts/Raleway-SemiBold.ttf'),
  'Raleway-SemiBoldItalic': require('../assets/fonts/Raleway-SemiBoldItalic.ttf'),
  'Raleway-Bold': require('../assets/fonts/Raleway-Bold.ttf'),
  'Raleway-BoldItalic': require('../assets/fonts/Raleway-BoldItalic.ttf'),
  'Raleway-ExtraBold': require('../assets/fonts/Raleway-ExtraBold.ttf'),
  'Raleway-ExtraBoldItalic': require('../assets/fonts/Raleway-ExtraBoldItalic.ttf'),
  'Raleway-Black': require('../assets/fonts/Raleway-Black.ttf'),
  'Raleway-BlackItalic': require('../assets/fonts/Raleway-BlackItalic.ttf'),
  'Merriweather-Light': require('../assets/fonts/Merriweather-Light.ttf'),
  'Merriweather-LightItalic': require('../assets/fonts/Merriweather-LightItalic.ttf'),
  'Merriweather-Regular': require('../assets/fonts/Merriweather-Regular.ttf'),
  'Merriweather-Italic': require('../assets/fonts/Merriweather-Italic.ttf'),
  'Merriweather-Bold': require('../assets/fonts/Merriweather-Bold.ttf'),
  'Merriweather-BoldItalic': require('../assets/fonts/Merriweather-BoldItalic.ttf'),
  'Merriweather-Black': require('../assets/fonts/Merriweather-Black.ttf'),
  'Merriweather-BlackItalic': require('../assets/fonts/Merriweather-BlackItalic.ttf'),
};

/** Return the exact family name registered from the bundled font files. */
export const resolveFontFamily = (font, weight = 400, fontStyle) => {
  const variant = variants[font]?.[weight] ?? variants[font]?.[400];

  if (!variant) {
    return font;
  }

  const suffix = fontStyle === 'italic'
    ? variant === 'Regular'
      ? 'Italic'
      : `${variant}Italic`
    : variant;

  return `${font}-${suffix}`;
};
