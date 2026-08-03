import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {View, TouchableOpacity, StatusBar, useColorScheme} from 'react-native';
import {Text, SafeAreaView} from '../../components';
import styles from './styles';
import PropTypes from 'prop-types';

export default function Header(props) {
  const forceDark = useSelector(state => state.application.force_dark);
  const {
    style,
    styleLeft,
    styleCenter,
    styleTitle,
    styleRight,
    styleRightSecond,
    title,
    subTitle,
    onPressLeft,
    onPressRight,
    onPressRightSecond,
    renderLeft,
    renderRightSecond,
    renderRight,
    barStyle,
  } = props;

  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    let option = isDarkMode ? 'light-content' : 'dark-content';
    if (forceDark) {
      option = 'light-content';
    }
    if (forceDark === false) {
      option = 'dark-content';
    }
    if (barStyle) {
      option = barStyle;
    }
    StatusBar.setBarStyle(option, true);
  }, [barStyle, forceDark, isDarkMode]);

  return (
    <SafeAreaView style={{width: '100%'}} edges={['top', 'left', 'right']}>
      <View style={[styles.contain, style]}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={[styles.contentLeft, styleLeft]}
            onPress={onPressLeft}>
            {renderLeft && renderLeft()}
          </TouchableOpacity>
        </View>
        <View style={[styles.contentCenter, styleCenter]}>
          <Text headline numberOfLines={1} style={styleTitle} >
            {title}
          </Text>
          {subTitle && subTitle !== '' && (
            <Text caption2 light>
              {subTitle}
            </Text>
          )}
        </View>
        <View style={styles.right}>
          <TouchableOpacity
            style={[styles.contentRightSecond, styleRightSecond]}
            onPress={onPressRightSecond}>
            {renderRightSecond && renderRightSecond()}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.contentRight, styleRight]}
            onPress={onPressRight}>
            {renderRight && renderRight()}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

Header.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleLeft: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleCenter: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleTitle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleRight: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleRightSecond: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  renderLeft: PropTypes.func,
  renderRight: PropTypes.func,
  renderRightSecond: PropTypes.func,
  onPressRightSecond: PropTypes.func,
  onPressLeft: PropTypes.func,
  onPressRight: PropTypes.func,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  barStyle: PropTypes.string,
};

Header.defaultProps = {
  style: {},
  styleLeft: {},
  styleCenter: {},
  styleTitle: {},
  styleRight: {},
  styleRightSecond: {},
  renderLeft: () => {},
  renderRight: () => {},
  renderRightSecond: () => {},
  onPressLeft: () => {},
  onPressRight: () => {},
  onPressRightSecond: () => {},
  title: 'Title',
  subTitle: '',
  barStyle: '',
};
