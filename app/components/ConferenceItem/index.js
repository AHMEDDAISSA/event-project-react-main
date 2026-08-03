import { Images } from '../../config';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Image from '../Image';
import { Icon } from '../index';
import styles from './styles';

const ConferenceItem = ({
  item,
  slideStyle,
  colors,
  handleCardPress,
  handleAddToSchedule,
  handleRemoveToSchedule,
  speakerLength,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const imageSource =
    item?.imagePath && item.imagePath !== 'null' && !imageError
      ? { uri: item.imagePath }
      : Images.noImage;

  return (
    <TouchableOpacity
      onPress={() => handleCardPress(item)}
      style={[styles.cardContainer, slideStyle, {borderColor: colors.border}]}
      activeOpacity={0.8}
    >
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.imageContainer}>
          <Image
            source={imageSource}
            style={styles.cardImage}
            resizeMode="cover"
            onError={() => {
              setImageError(true);
            }}
          />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.typeText}>{item.type}</Text>

          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {item.title}
          </Text>

          <View style={styles.detailRow}>
            <Icon name="calendar-month" size={18} color="#555" />

            <Text style={[styles.detailText, { color: colors.text }]}>
              {item.date}
            </Text>

            <Icon
              name="access-time"
              size={18}
              color="#555"
              style={styles.iconSpacing}
            />

            <Text style={[styles.detailText, { color: colors.text }]}>
              {item.start_time} - {item.end_time}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="location-on" size={18} color="#555" />

            <Text style={[styles.detailText, { color: colors.text }]}>
              {item.location}
            </Text>
          </View>

          <View style={styles.bottomRow}>
            {item.speakers.length > 0 && (
              <View style={styles.speakersContainer}>
                <View style={styles.speakersList}>
                  {item.speakers
                    .slice(0, speakerLength)
                    .map((speaker, index) => (
                      <Image
                        key={index}
                        source={
                          speaker?.imagePath
                            ? { uri: speaker.imagePath }
                            : Images.noImage
                        }
                        style={styles.speakerAvatar}
                        onError={e => {
                          e.target?.setNativeProps?.({
                            source: Images.noImage,
                          });
                        }}
                      />
                    ))}

                  {item.speakers.length > speakerLength && (
                    <View style={styles.moreSpeakers}>
                      <Text style={styles.moreSpeakersText}>
                        +{item.speakers.length - speakerLength}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {handleRemoveToSchedule ? (
              <TouchableOpacity
                style={styles.removeScheduleButton}
                onPress={e => {
                  e.stopPropagation();
                  handleRemoveToSchedule(item.id);
                }}>
                <Icon name="highlight-remove" size={18} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.scheduleButton}
                onPress={e => {
                  e.stopPropagation();
                  handleAddToSchedule(item.id);
                }}
              >
                <Icon name="calendar-month" size={18} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ConferenceItem;
