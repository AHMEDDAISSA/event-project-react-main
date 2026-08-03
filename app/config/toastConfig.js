import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';

export const toastConfig = {
  customToast: ({text1, text2, props}) => {
    let toastStyle = {
      width: '90%',
      paddingHorizontal: 15,
      backgroundColor: '#fff',
      shadowOffset: {width: 1, height: 1},
      shadowColor: 'green',
      shadowOpacity: 0.3,
      shadowRadius: 2,
      borderRadius: 12,
      borderLeftWidth: 4,
      paddingVertical: 15,
      zIndex: 1000,
      elevation: 5,
    };
    switch (text1) {
      case 'Information':
      case "معلومة":
        toastStyle = {
          ...toastStyle,
          borderLeftColor: 'blue',
        };
        break;
      case 'Erreur':
      case 'Error':
      case 'خطأ':
        toastStyle = {
          ...toastStyle,
          borderLeftColor: 'red',
        };
        break;
      case 'Succès':
      case 'Success':
      case "تم بنجاح":
        toastStyle = {
          ...toastStyle,
          borderLeftColor: 'green',
        };
        break;
      default:
        toastStyle = {
          ...toastStyle,
          borderLeftColor: 'green',
        };
    }

    return (
      <View style={toastStyle}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{text1}</Text>
        <Text style={{fontSize: 15, fontWeight: 'bold', flexWrap: 'wrap'}}>
          {text2}
        </Text>
        <View style={styles.buttonContainer}>
          {props.showButton1 && (
            <TouchableOpacity
              style={styles.button}
              onPress={props.onButton1Press}>
              <Text style={styles.buttonText}>{props.button1Title}</Text>
            </TouchableOpacity>
          )}
          {props.showButton2 && (
            <TouchableOpacity
              style={styles.button}
              onPress={props.onButton2Press}>
              <Text style={styles.buttonText}>{props.button2Title}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  },
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    flex: 1,
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
