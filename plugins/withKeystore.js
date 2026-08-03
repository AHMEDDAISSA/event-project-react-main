const {
  withAppBuildGradle,
  withDangerousMod,
} = require('@expo/config-plugins');

const fs = require('fs');
const path = require('path');

const KEYSTORE_NAME = 'my-upload-key.keystore';

module.exports = function withKeystore(config) {
  /**
   * 1. Copy keystore into android/app
   */
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const androidAppPath = path.join(
        projectRoot,
        'android',
        'app'
      );

      const sourceKeystore = path.join(
        projectRoot,
        'keystore',
        KEYSTORE_NAME
      );

      const destinationKeystore = path.join(
        androidAppPath,
        KEYSTORE_NAME
      );

      if (!fs.existsSync(sourceKeystore)) {
        throw new Error(
          `Keystore not found at: ${sourceKeystore}`
        );
      }

      fs.copyFileSync(sourceKeystore, destinationKeystore);

      console.log('✅ Keystore copied to android/app');

      return config;
    },
  ]);

  /**
   * 2. Modify build.gradle
   */
  config = withAppBuildGradle(config, (config) => {
    let gradle = config.modResults.contents;

    if (gradle.includes('myRelease')) {
      return config; // avoid duplicate
    }

    const signingConfig = `signingConfigs {
        debug {
            storeFile file('${KEYSTORE_NAME}')
            storePassword '123456'
            keyAlias 'my-key-alias'
            keyPassword '123456'
        }
    }`;

    // Inject inside android { }
    gradle = gradle.replace(
      `signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }`,
      signingConfig
    );

    // Attach release signingConfig to buildTypes
    gradle = gradle.replace(
      /buildTypes\s?{([\s\S]*?)}/,
      (match) => {
        if (match.includes('signingConfig signingConfigs.release')) {
          return match;
        }

        return match.replace(
          /release\s?{([\s\S]*?)}/,
          `release {
                signingConfig signingConfigs.release
                minifyEnabled false
                proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
            }`
        );
      }
    );

    config.modResults.contents = gradle;

    console.log('✅ build.gradle updated with signingConfigs');

    return config;
  });

  return config;
};