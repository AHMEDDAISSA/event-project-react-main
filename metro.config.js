const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const firebaseMock = path.resolve(__dirname, 'firebase-mock.js');

// Force-redirect Firebase imports to our mock so the app runs in Expo Go.
// To restore real Firebase, delete (or comment out) this resolver override.
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === '@react-native-firebase/app' ||
    moduleName === '@react-native-firebase/messaging'
  ) {
    return {
      filePath: firebaseMock,
      type: 'sourceFile',
    };
  }
  // Fall back to default resolution
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
