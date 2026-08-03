const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withPatchImports(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      // Create a babel plugin to remove problematic imports during iOS build
      const babelConfigPath = path.join(config.modRequest.projectRoot, 'babel.config.js');
      
      if (fs.existsSync(babelConfigPath)) {
        let babelConfig = await fs.promises.readFile(babelConfigPath, 'utf-8');
        
        // Add plugin to remove specific imports for iOS
        if (!babelConfig.includes('babel-plugin-transform-remove-imports')) {
          // We'll create a separate approach - see Step 4
        }
      }
      
      return config;
    }
  ]);
};