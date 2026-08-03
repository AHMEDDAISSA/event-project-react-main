import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Animated,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { BaseColor, Images, useTheme } from '../../config';
import { Header, SafeAreaView, Icon, Text } from '../../components';
import * as Utils from '../../utils';
import styles from './styles';

export default function SponsorDetail({ navigation, route }) {
  const { colors } = useTheme();
  const item = route.params?.item;

  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [imageError, setImageError] = useState(false);

  const deltaY = new Animated.Value(0);

  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const marginTopBanner = heightImageBanner - heightHeader - 40;

  return (
    <View style={{ flex: 1 }}>
      <Animated.Image
        source={
          imageError || !item?.logoPath
            ? Images.noImage
            : { uri: item.logoPath }
        }
        style={[
          styles.imgBanner,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(200),
                Utils.scaleWithPixel(200),
              ],
              outputRange: [heightImageBanner, heightHeader, heightHeader],
            }),
          },
        ]}
        onError={() => setImageError(true)}
      />
      {/* Header */}
      <Header
        title=""
        renderLeft={() => {
          return (
            <Icon
              name="arrow-back"
              size={20}
              color={imageError ? colors.primary : BaseColor.whiteColor}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView style={{ flex: 1 }} edges={['right', 'left', 'bottom']}>
        <ScrollView
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: { y: deltaY },
              },
            },
          ])}
          onContentSizeChange={() => setHeightHeader(Utils.heightHeader())}
          scrollEventThrottle={8}
        >
          {/* Main Container */}
          <View style={{ paddingHorizontal: 20 }}>
            {/* Information */}
            <View
              style={[
                styles.contentBoxTop,
                {
                  marginTop: marginTopBanner,
                  backgroundColor: colors.card,
                  shadowColor: colors.border,
                  borderColor: colors.border,
                  minHeight: item?.description ? 100 : 70,
                },
              ]}
            >
              <Text title2 semibold style={{ marginBottom: 5 }}>
                {item?.name}
              </Text>
              {item?.description && (
                <Text
                  body2
                  style={{
                    marginTop: 5,
                    textAlign: 'center',
                  }}
                >
                  {item?.description}
                </Text>
              )}
            </View>

            {item?.phone && (
              <TouchableOpacity
                style={styles.contentBlockCall}
                onPress={() => {
                  Linking.openURL(`tel:${item?.phone}`);
                }}
                activeOpacity={0.9}
              >
                <Icon name="phone" size={18} color={colors.primary} />
                <View
                  style={{
                    marginHorizontal: 8,
                  }}
                >
                  <Text title3 accentColor>
                    {item?.phone}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {item?.email && (
              <TouchableOpacity
                style={styles.contentBlockCall}
                onPress={() => {
                  Linking.openURL(`mailto:${item?.email}`);
                }}
                activeOpacity={0.9}
              >
                <Icon name="email" size={18} color={colors.primary} />
                <View
                  style={{
                    marginHorizontal: 8,
                  }}
                >
                  <Text title3 accentColor>
                    {item?.email}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {item?.website && (
              <TouchableOpacity
                style={styles.contentBlockCall}
                onPress={() => {
                  Linking.openURL(`${item?.website}`);
                }}
                activeOpacity={0.9}
              >
                <Icon name="language" size={18} color={colors.primary} />
                <View
                  style={{
                    marginHorizontal: 8,
                  }}
                >
                  <Text title3 accentColor>
                    {item?.website}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
