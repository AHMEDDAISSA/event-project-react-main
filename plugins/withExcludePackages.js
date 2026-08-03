const { withDangerousMod, withAppDelegate } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withExcludePackages(config) {
  // Modify Podfile to exclude problematic packages
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfileContent = await fs.promises.readFile(podfilePath, 'utf-8');
      
      // Comment out or remove problematic package pods
      const problematicPods = [
        'react-native-version-check',
        'react-native-file-viewer',
      ];
      
      problematicPods.forEach(pod => {
        // Comment out the pod line
        const podRegex = new RegExp(`pod ['"]${pod}['"].*\\n`, 'g');
        podfileContent = podfileContent.replace(podRegex, `# ${pod} - excluded for iOS build\n`);
      });
      
      await fs.promises.writeFile(podfilePath, podfileContent);
      return config;
    }
  ]);
  
  return config;
};