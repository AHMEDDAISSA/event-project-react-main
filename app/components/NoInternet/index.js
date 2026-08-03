import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {Text, Image, Button} from '../index';
import {Images} from '../../config';
import {useTranslation} from 'react-i18next';
import styles from './styles';

export default function NoInternet(props) {
  const {onHandleBack, title, description} = props;
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation();

  const handlePress = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onHandleBack();
    }, 1000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={Images.appLogo} style={{width: 120, height: 120}} resizeMode="contain" />
      <Text
        style={{
          fontSize: 20,
          marginBottom: 20,
          alignItems: 'center',
          fontWeight: 'bold',
          color: '#cdcdcd',
        }}>
        {title}
      </Text>
      <Text body2 style={{textAlign: 'center'}}>
        {description}
      </Text>
      <Button
        round
        style={{marginTop: 15}}
        disabled={loading}
        loading={loading}
        onPress={handlePress}>
        {t('try_again')}
      </Button>
    </ScrollView>
  );
}

NoInternet.propTypes = {
  image: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleContent: PropTypes.object,
  title: PropTypes.string,
  description: PropTypes.string,
  onHandleBack: PropTypes.func,
};

NoInternet.defaultProps = {
  style: {},
  styleContent: {},
  title: '',
  description: '',
  onHandleBack: () => {},
};
