import React, {useRef, useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {useTheme} from '../../config';

const OtpInput = ({onCodeFilled}) => {
  const {theme, colors} = useTheme();
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(''));

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.join('').length === 6 && onCodeFilled) {
      onCodeFilled(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={ref => (inputRefs.current[index] = ref)}
          value={digit}
          onChangeText={text =>
            handleChange(text.replace(/[^0-9]/g, ''), index)
          }
          onKeyPress={e => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          autoFocus={index === 0}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  input: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    marginHorizontal: 4,
  },
});

export default OtpInput;
