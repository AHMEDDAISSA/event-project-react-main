const { withGradleProperties } = require('@expo/config-plugins');

function withEnableNewApkCreator(config) {
  return withGradleProperties(config, (config) => {
    // Inject the property
    config.modResults.push({
      type: 'property',
      key: 'android.experimental.enableNewApkCreator',
      value: 'true',
    });
    return config;
  });
}

module.exports = withEnableNewApkCreator;