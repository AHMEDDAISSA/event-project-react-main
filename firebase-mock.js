
const mockApp = {
  name: '[DEFAULT]',
  options: {},
};

function getApp() {
  return mockApp;
}


const AuthorizationStatus = {
  NOT_DETERMINED: -1,
  DENIED: 0,
  AUTHORIZED: 1,
  PROVISIONAL: 2,
};

function getMessaging() {
  return {
    getToken: async () => 'expo-go-mock-token',
    onMessage: () => () => {},
    onNotificationOpenedApp: () => () => {},
    getInitialNotification: async () => null,
    setBackgroundMessageHandler: () => {},
    requestPermission: async () => AuthorizationStatus.AUTHORIZED,
    registerDeviceForRemoteMessages: async () => {},
  };
}

async function requestPermission() {
  return AuthorizationStatus.AUTHORIZED;
}

async function registerDeviceForRemoteMessages() {}

async function getToken() {
  return 'expo-go-mock-token';
}

function onMessage(_messaging, callback) {
  // No-op: no real messages in Expo Go
  return () => {};
}

function setBackgroundMessageHandler() {}

function onNotificationOpenedApp(_messaging, callback) {
  return () => {};
}

async function getInitialNotification() {
  return null;
}

module.exports = {
  // app exports
  getApp,
  // messaging exports
  getMessaging,
  requestPermission,
  registerDeviceForRemoteMessages,
  getToken,
  onMessage,
  setBackgroundMessageHandler,
  onNotificationOpenedApp,
  getInitialNotification,
  AuthorizationStatus,
};
