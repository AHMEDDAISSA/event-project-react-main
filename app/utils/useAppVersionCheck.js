import {useEffect, useRef} from 'react';
import {AppState} from 'react-native';
import {navigationRef} from '../navigation/index';
import { VersionCheck } from './platformImports';

const useAppVersionCheck = () => {
  const appState = useRef(AppState.currentState);
  const isNavigating = useRef(false);

  const checkVersion = async () => {
    try {
      const updateNeeded = await VersionCheck.needUpdate();
      console.log('Checking app version', updateNeeded);

      if (
        updateNeeded &&
        updateNeeded.isNeeded &&
        navigationRef.current &&
        !isNavigating.current
      ) {
        isNavigating.current = true;

        navigationRef.current.reset({
          index: 0,
          routes: [
            {
              name: 'UpdateAppScreen',
              params: {storeURL: updateNeeded.storeUrl},
            },
          ],
        });
      }
    } catch (error) {
      console.log('Version check error:', error);
    }
  };

  useEffect(() => {
    checkVersion();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/background|inactive/) &&
        nextAppState === 'active'
      ) {
        checkVersion();
      }

      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);
};

export default useAppVersionCheck;
