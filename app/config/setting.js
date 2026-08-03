/**
 * Basic Setting Variables Define
 */
import {version} from '../../package.json';
export const BaseSetting = {
  name: 'IMC Events',
  displayName: 'IMC Events',
  appVersion: version,
  defaultLanguage: 'en',
  languageSupport: [
    'en',
    'fr',
    'ar',
  ],
  resourcesLanguage: {
    en: {
      translation: require('../lang/en.json'),
    },
    fr: {
      translation: require('../lang/fr.json'),
    },
    ar: {
      translation: require('../lang/ar.json'),
    },
  },
};
