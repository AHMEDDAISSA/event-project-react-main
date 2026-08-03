import { TouchableOpacity } from "react-native";
import { Icon, Text } from "..";
import { useTheme } from "../../config";
import { useTranslation } from "react-i18next";
import styles from "./styles";

export default function ActionButton(props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const {
    icon,
    text,
    onPress,
    backgroundColor,
    borderColor,
    textColor,
    iconColor,
  } = props;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.actionButton,
        {
          backgroundColor,
          borderColor,
        },
      ]}
    >
      <Icon name={icon} size={15} color={iconColor} enableRTL={true} />

      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
        style={[styles.actionButtonText, { color: textColor }]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
