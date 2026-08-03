import React, {useState, useEffect} from 'react';
import {View, BackHandler} from 'react-native';
import {BaseStyle, useTheme} from '../../config';
import {Header, SafeAreaView, Icon, NoInternet} from '../../components';
import NetInfo from '@react-native-community/netinfo';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function NoInternetScreen({navigation}) {
  const {colors} = useTheme();
  const [isConnected, setIsConnected] = useState(false);
  const {t} = useTranslation();

  // Function to handle back button behavior
  const handleBackButtonClick = async () => {
    // Perform a manual check for the internet connection
    const netState = await NetInfo.fetch();

    if (netState.isConnected) {
      // If connected, go back to the previous screen
      navigation.goBack();
    } else {
      // Stay on the same screen and retry the check
      setIsConnected(false); // Keep the UI showing no internet
      // You could show some notification or message to the user here
    }

    return true; // Prevent default back button behavior
  };

  useEffect(() => {
    // Monitor internet connection status
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected); // Update state with connection status
    });

    // Set up the back handler listener
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonClick,
    );

    // Cleanup the listeners on unmount
    return () => {
      unsubscribe(); // Cleanup network listener
      backHandler.remove(); // Cleanup back handler
    };
  }, [isConnected]); // Re-run effect when connection status changes

  return (
    <View style={{flex: 1, backgroundColor: colors.background}}>
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <Header
          title="Aucun Internet"
          renderLeft={() => (
            <Icon
              name="arrow-back"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          )}
          onPressLeft={() => {
            if (isConnected) {
              navigation.goBack(); // Allow manual back if connected
            }
          }}
        />
        <View style={styles.container}>
          <NoInternet
            title={t('no_internet')}
            description={t('no_internet_description')}
            onHandleBack={handleBackButtonClick} // Use updated back button handling
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
