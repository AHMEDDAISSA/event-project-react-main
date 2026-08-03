// plugins/withFirebaseFix.js
const { withDangerousMod, withPlugins } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withFirebaseFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      
      // Read the Podfile
      let podfileContent = await fs.promises.readFile(podfilePath, 'utf8');
      
      // Add post_install script to fix Firebase issues
      const postInstallScript = `
  post_install do |installer|
    # Fix for Firebase modular header issues
    installer.pods_project.targets.each do |target|
      if target.name.include?('RNFBApp') || target.name.include?('RNFBMessaging')
        target.build_configurations.each do |config|
          config.build_settings['GCC_TREAT_WARNINGS_AS_ERRORS'] = 'NO'
          config.build_settings['CLANG_WARN_NON_MODULAR_INCLUDE_IN_FRAMEWORK_MODULE'] = 'NO'
          config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
          config.build_settings['APPLICATION_EXTENSION_API_ONLY'] = 'NO'
        end
      end
      
      if target.name == 'React-Core'
        target.build_configurations.each do |config|
          config.build_settings['DEFINES_MODULE'] = 'NO'
          config.build_settings['CLANG_ENABLE_MODULES'] = 'NO'
        end
      end
    end
    
    # Find and fix the React-Core import paths
    installer.pods_project.targets.each do |target|
      if target.name == 'RNFBApp' || target.name == 'RNFBMessaging'
        target.headers_build_phase.files.each do |file|
          if file.file_ref && file.file_ref.path
            file.settings = { 'ATTRIBUTES' => ['Public'] }
          end
        end
      end
    end
  end
`;
      
      // Check if post_install already exists
      if (podfileContent.includes('post_install do |installer|')) {
        // Replace existing post_install
        podfileContent = podfileContent.replace(
          /post_install do \|installer\|.*?end/m,
          postInstallScript
        );
      } else {
        // Add post_install at the end
        podfileContent += postInstallScript;
      }
      
      await fs.promises.writeFile(podfilePath, podfileContent);
      return config;
    },
  ]);
};