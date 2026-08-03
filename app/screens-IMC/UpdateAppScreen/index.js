import {View, Text, TouchableOpacity, Linking, Image} from 'react-native';
import {Images, useTheme} from '../../config';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function UpdateAppScreen({navigation, route}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const {storeURL} = route.params;
  const handleUpdate = () => {
    Linking.openURL(storeURL);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Image
            source={Images.update}
            style={styles.updateIcon}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>{t('required_update_message')}</Text>

        <Text style={styles.message}>{t('new_version_message')}</Text>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.primary}]}
          onPress={handleUpdate}>
          <Text style={styles.buttonText}>{t('update')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomIconContainer}>
        <Image
          source={Images.appLogo}
          style={styles.appIcon}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
