import { Platform } from 'react-native';
import * as Application from 'expo-application';

const iOSVersionCheck = {
  getCountry: async () => 'us',

  getPackageName: async () => Application.applicationId,

  getCurrentVersion: async () => Application.nativeApplicationVersion ?? '0.0.0',

  needUpdate: async () => {
    try {
      const bundleId = Application.applicationId;
      const currentVersion = Application.nativeApplicationVersion ?? '0.0.0';

      const res = await fetch(
        `https://itunes.apple.com/lookup?bundleId=${bundleId}`
      );
      const json = await res.json();

      if (!json.results?.length) return { isNeeded: false };

      const latestVersion = json.results[0].version;
      const storeUrl = json.results[0].trackViewUrl;

      const parseVer = (v) => v.split('.').map(Number);
      const [lMaj, lMin = 0, lPatch = 0] = parseVer(latestVersion);
      const [cMaj, cMin = 0, cPatch = 0] = parseVer(currentVersion);

      const isNeeded =
        lMaj > cMaj ||
        (lMaj === cMaj && lMin > cMin) ||
        (lMaj === cMaj && lMin === cMin && lPatch > cPatch);

      return { isNeeded, currentVersion, latestVersion, storeUrl };
    } catch (err) {
      console.warn('[iOSVersionCheck] needUpdate failed:', err);
      return { isNeeded: false };
    }
  },
};

// Conditionally import problematic packages
let VersionCheck, FileViewer;

if (Platform.OS === 'android') {
  // Only import on Android
  VersionCheck = require('react-native-version-check').default;
  FileViewer = require('react-native-file-viewer').default;
} else {
  // Provide mock implementations for iOS
  VersionCheck = iOSVersionCheck;
  
  FileViewer = {
    open: async () => Promise.resolve(),
  };
}

export { VersionCheck, FileViewer };