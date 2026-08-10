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
    borderBottomColor,
    textColor,
    iconColor,
    style,
  } = props;

  const bg = backgroundColor || colors.primary;
  const bColor = borderColor || bg;
  const bbColor = borderBottomColor || '#3730A3';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.actionButton,
        {
          backgroundColor: bg,
          borderColor: bColor,
          borderBottomColor: bbColor,
        },
        style,
      ]}
    >
      <Icon name={icon} size={16} color={iconColor || '#FFFFFF'} enableRTL={true} />

      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
        style={[styles.actionButtonText, { color: textColor || '#FFFFFF' }]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
