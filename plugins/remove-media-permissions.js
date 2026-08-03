const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function removeMediaPermissions(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;

    if (androidManifest.manifest["uses-permission"]) {
      androidManifest.manifest["uses-permission"] = (
        androidManifest.manifest["uses-permission"] || []
      ).map((perm) => {
        if (
          perm.$["android:name"] === "android.permission.READ_MEDIA_IMAGES" ||
          perm.$["android:name"] === "android.permission.READ_MEDIA_VIDEO"
        ) {
          return {
            ...perm,
            $: {
              ...perm.$,
              "tools:node": "remove",
            },
          };
        }
        return perm;
      });
    }

    return config;
  });
};
