import {useSelector} from 'react-redux';
import {useColorScheme} from 'react-native';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

/**
 * Define Const color use for whole application
 */
export const BaseColor = {
  grayColor: '#9B9B9B',
  dividerColor: '#BDBDBD',
  whiteColor: '#FFFFFF',
  fieldColor: '#F5F5F5',
  yellowColor: '#FDC60A',
  navyBlue: '#3C5A99',
  kashmir: '#5D6D7E',
  orangeColor: '#E5634D',
  blueColor: '#5DADE2',
  pinkColor: '#A569BD',
  greenColor: '#58D68D',
  blackColor: '#000000',
  danger: '#E5634D',
};

/**
 * Define Const list theme use for whole application
 */
export const ThemeSupport = [
  {
    theme: 'blue',
    light: {
      dark: false,
      colors: {
        primary: '#5DADE2',
        primaryDark: '#1281ac',
        primaryLight: '#68c9ef',
        accent: '#FF8A65',
        background: 'white',
        card: '#F5F5F5',
        text: '#212121',
        border: '#c7c7cc',
        disabled: '#cccccc', 
        disabledText: '#888888', 
        buttonText: '#ffffff', 
        danger: '#E5634D',
      },
    },
    dark: {
      dark: true,
      colors: {
        primary: '#5DADE2',      // Keep primary the same for brand consistency
        primaryDark: '#8FC7E8',  // Lighter version for dark mode
        primaryLight: '#3A7CA5', // Darker version for dark mode
        accent: '#FF8A65',      // Keep accent the same
        background: '#121212',  // Deep dark background
        card: '#1E1E1E',       // Slightly lighter than background
        text: '#E0E0E0',       // Off-white for better readability
        border: '#383838',      // Subtle borders
        disabled: '#424242',    // Darker disabled elements
        disabledText: '#686868', // Less prominent disabled text
        buttonText: '#FFFFFF',  // White text for buttons
        danger: '#E5634D',
      },
    },
  },
  {
    theme: 'orange',
    light: {
      dark: false,
      colors: {
        primary: '#E5634D',
        primaryDark: '#C31C0D',
        primaryLight: '#FF8A65',
        accent: '#4A90A4',
        background: 'white',
        card: '#F5F5F5',
        text: '#212121',
        border: '#c7c7cc',
        disabled: '#cccccc', 
        disabledText: '#888888', 
        buttonText: '#ffffff', 
        danger: '#E5634D',
      },
    },
    dark: {
      dark: true,
      colors: {
        primary: '#E5634D',
        primaryDark: '#C31C0D',
        primaryLight: '#FF8A65',
        accent: '#4A90A4',
        background: '#010101',
        card: '#121212',
        text: '#e5e5e7',
        border: '#272729',
        disabled: '#cccccc', 
        disabledText: '#888888', 
        buttonText: '#ffffff', 
        danger: '#E5634D',
      },
    },
  },
  {
    theme: 'pink',
    light: {
      dark: false,
      colors: {
        primary: '#A569BD',
        primaryDark: '#C2185B',
        primaryLight: '#F8BBD0',
        accent: '#8BC34A',
        background: 'white',
        card: '#F5F5F5',
        text: '#212121',
        border: '#c7c7cc',
        disabled: '#cccccc', 
        disabledText: '#888888', 
        buttonText: '#ffffff', 
        danger: '#E5634D',
      },
    },
    dark: {
      dark: true,
      colors: {
        primary: '#A569BD',
        primaryDark: '#C2185B',
        primaryLight: '#F8BBD0',
        accent: '#8BC34A',
        background: '#010101',
        card: '#121212',
        text: '#e5e5e7',
        border: '#272729',
        disabled: '#cccccc', 
        disabledText: '#888888', 
        buttonText: '#ffffff', 
        danger: '#E5634D',
      },
    },
  },
  {
    theme: 'green',
    light: {
      dark: false,
      colors: {
        primary: '#58D68D',
        primaryDark: '#388E3C',
        primaryLight: '#C8E6C9',
        accent: '#607D8B',
        background: 'white',
        card: '#F5F5F5',
        text: '#212121',
        border: '#c7c7cc',
        disabled: '#cccccc', 
        disabledText: '#888888', 
        buttonText: '#ffffff', 
        danger: '#E5634D',
      },
    },
    dark: {
      dark: true,
      colors: {
        primary: '#58D68D',
        primaryDark: '#388E3C',
        primaryLight: '#C8E6C9',
        accent: '#607D8B',
        background: '#010101',
        card: '#121212',
        text: '#e5e5e7',
        border: '#272729',
        disabled: '#cccccc', 
        disabledText: '#888888', 
        buttonText: '#ffffff', 
        danger: '#E5634D',
      },
    },
  },
  {
    theme: 'yellow',
    light: {
      dark: false,
      colors: {
        primary: '#FDC60A',
        primaryDark: '#FFA000',
        primaryLight: '#FFECB3',
        accent: '#795548',
        background: 'white',
        card: '#F5F5F5',
        text: '#212121',
        border: '#c7c7cc',
        disabled: '#cccccc', 
        disabledText: '#888888', 
        buttonText: '#ffffff', 
        danger: '#E5634D',
      },
    },
    dark: {
      dark: true,
      colors: {
        primary: '#FDC60A',
        primaryDark: '#FFA000',
        primaryLight: '#FFECB3',
        accent: '#795548',
        background: '#010101',
        card: '#121212',
        text: '#e5e5e7',
        border: '#272729',
        disabled: '#cccccc', 
        disabledText: '#888888', 
        buttonText: '#ffffff', 
        danger: '#E5634D',
      },
    },
  },
];

/**
 * Define default theme use for whole application
 */
export const DefaultTheme = {
  theme: 'blue',
  light: {
    dark: false,
    colors: {
      primary: '#5DADE2',
      primaryDark: '#1281ac',
      primaryLight: '#68c9ef',
      accent: '#FF8A65',
      background: 'white',
      card: '#F5F5F5',
      text: '#212121',
      border: '#c7c7cc',
      disabled: '#cccccc', 
      disabledText: '#888888', 
      buttonText: '#ffffff', 
      danger: '#E5634D',
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: '#5DADE2',
      primaryDark: '#1281ac',
      primaryLight: '#68c9ef',
      accent: '#FF8A65',
      background: '#010101',
      card: '#121212',
      text: '#e5e5e7',
      border: '#272729',
      disabled: '#cccccc', 
      disabledText: '#888888', 
      buttonText: '#ffffff', 
      danger: '#E5634D',
    },
  },
};

/**
 * Define list font use for whole application
 */
export const FontSupport = ['Raleway', 'Roboto', 'Merriweather'];

/**
 * Define font default use for whole application
 */
export const DefaultFont = 'Raleway';

/**
 * export theme and colors for application
 * @returns theme,colors
 */
export const useTheme = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const forceDark = useSelector(state => state.application.force_dark);
  const themeStorage = useSelector(state => state.application.theme);

  const theme = ThemeSupport.find(
    item => item.theme === (themeStorage ?? DefaultTheme.theme),
  );

  const selectedTheme = theme.light;

  return {
    theme: {
      ...NavigationDefaultTheme,
      dark: selectedTheme.dark,
      colors: {
        ...NavigationDefaultTheme.colors,
        ...selectedTheme.colors,
      },
    },
    colors: selectedTheme.colors,
  };
};

/**
 * export font for application
 * @returns font
 */
export const useFont = () => {
  const font = useSelector(state => state.application.font);
  return font ?? DefaultFont;
};
