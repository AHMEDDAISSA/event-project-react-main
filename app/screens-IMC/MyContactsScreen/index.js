import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {BaseStyle, Images, useTheme} from '../../config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  TextInput,
} from '../../components';
import {useTranslation} from 'react-i18next';
import LottieView from 'lottie-react-native';
import {
  fetchContacts,
  removeContact,
  optimisticRemove,
} from '../../reducers/contactsSlice';
import ToastUtils from '../../config/toastUtils';
import NetInfo from '@react-native-community/netinfo';
import useAndroidBack from '../../hooks/useAndroidBack';
import styles from './styles';

export default function MyContactsScreen({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const {contacts, loading, savedIds, pagination} = useSelector(
    state => state.contacts,
  );

  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const isMounted = useRef(false);

  useAndroidBack();

  // Handle No Internet Connection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        navigation.navigate('NoInternetScreen');
      }
    });
    return () => unsubscribe();
  }, [navigation]);

  // Debounce search
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const timer = setTimeout(() => {
      dispatch(fetchContacts({page: 1, search: searchText}));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Refresh on screen focus
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchContacts({page: 1, search: searchText}));
    }, []),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchContacts({page: 1, search: searchText}));
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!loading && pagination.current_page < pagination.last_page) {
      dispatch(
        fetchContacts({
          page: pagination.current_page + 1,
          search: searchText,
        }),
      );
    }
  };

  const handleRemove = contact => {
    Alert.alert(
      t('remove_contact'),
      t('remove_contact_confirm'),
      [
        {text: t('cancel'), style: 'cancel'},
        {
          text: t('remove'),
          style: 'destructive',
          onPress: async () => {
            // Optimistic remove
            dispatch(
              optimisticRemove({
                contactId: contact.contact_id,
                contactType: contact.contact_type,
              }),
            );
            const result = await dispatch(
              removeContact({
                contactId: contact.contact_id,
                contactType: contact.contact_type,
              }),
            );
            if (removeContact.fulfilled.match(result)) {
              ToastUtils.showSuccessToast(t('success'), t('contact_removed'));
            } else {
              ToastUtils.showErrorToast(t('error'), t('contact_remove_error'));
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const handleNavigateToProfile = contact => {
    if (contact.contact_type === 'exhibitor') {
      navigation.navigate('ExhibitorDetail', {
        id: contact.contact_id,
        isExhibitor: true,
      });
    } else {
      navigation.navigate('VisitorDetail', {id: contact.contact_id});
    }
  };

  const renderItem = ({item, index}) => (
    <ContactCard
      item={item}
      colors={colors}
      t={t}
      onPress={() => handleNavigateToProfile(item)}
      onRemove={() => handleRemove(item)}
      index={index}
    />
  );

  const filteredContacts = searchText.trim()
    ? contacts.filter(c => {
        const q = searchText.toLowerCase();
        return (
          c.name?.toLowerCase().includes(q) ||
          c.company?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q)
        );
      })
    : contacts;

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('my_contacts')}
        renderLeft={() => (
          <Icon
            name="arrow-back"
            size={20}
            color={colors.primary}
            enableRTL={true}
          />
        )}
        onPressLeft={() => navigation.goBack()}
      />

      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        {/* Search bar */}
        <View style={{paddingHorizontal: 20, paddingTop: 10, paddingBottom: 4}}>
          <TextInput
            placeholder={t('search')}
            value={searchText}
            onChangeText={setSearchText}
            leftIcon={
              <Icon
                name="person-search"
                size={20}
                color={colors.primary}
                style={{marginRight: 10}}
              />
            }
          />
        </View>

        {/* Counter badge */}
        {!loading && filteredContacts.length > 0 && (
          <View style={{paddingHorizontal: 20, paddingBottom: 6}}>
            <Text body2 style={{color: colors.text, opacity: 0.55}}>
              {filteredContacts.length} {t('contacts_count')}
            </Text>
          </View>
        )}

        {loading && filteredContacts.length === 0 ? (
          <View style={styles.centerContainer}>
            <LottieView
              source={Images.loading}
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text>{t('loading')}</Text>
          </View>
        ) : filteredContacts.length === 0 ? (
          <View style={styles.centerContainer}>
            <LottieView
              source={Images.no_data}
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text style={{marginTop: 10, opacity: 0.6}}>
              {searchText ? t('no_contacts_search') : t('no_contacts')}
            </Text>
            {!searchText && (
              <Text
                body2
                style={{
                  opacity: 0.45,
                  textAlign: 'center',
                  marginTop: 8,
                  paddingHorizontal: 30,
                }}>
                {t('no_contacts_hint')}
              </Text>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredContacts}
            renderItem={renderItem}
            keyExtractor={item =>
              `${item.contact_type}_${item.contact_id}_${item.id}`
            }
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 24,
              paddingTop: 4,
            }}
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

// ─── Contact Card Component ───────────────────────────────────────────────────

function ContactCard({item, colors, t, onPress, onRemove, index}) {
  const entryAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entryAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const isExhibitor = item.contact_type === 'exhibitor';

  return (
    <Animated.View
      style={{
        opacity: entryAnim,
        transform: [
          {
            translateY: entryAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [16, 0],
            }),
          },
        ],
      }}>
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={onPress}
        style={[
          styles.card,
          {backgroundColor: colors.card, borderColor: colors.border},
        ]}>
        {/* Left: Avatar */}
        <View
          style={[styles.avatarWrap, {backgroundColor: `${colors.primary}18`}]}>
          {item.imagePath ? (
            <Animated.Image
              source={{uri: item.imagePath}}
              style={styles.avatar}
              defaultSource={Images.noImage}
            />
          ) : (
            <Icon
              name={isExhibitor ? 'business' : 'person'}
              size={26}
              color={colors.primary}
            />
          )}
        </View>

        {/* Middle: Info */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text
              semibold
              style={[styles.nameText, {color: colors.text}]}
              numberOfLines={1}>
              {item.name}
            </Text>
            <View
              style={[
                styles.typeBadge,
                {backgroundColor: isExhibitor ? `${colors.primary}20` : '#10B98120'},
              ]}>
              <Text
                style={[
                  styles.typeText,
                  {color: isExhibitor ? colors.primary : '#10B981'},
                ]}>
                {isExhibitor ? t('exhibitor_label') : t('visitor_label')}
              </Text>
            </View>
          </View>

          {item.company ? (
            <Text
              style={[styles.companyText, {color: colors.primary}]}
              numberOfLines={1}>
              {item.company}
            </Text>
          ) : null}

          {item.email ? (
            <Text
              style={[styles.emailText, {color: colors.text}]}
              numberOfLines={1}>
              {item.email}
            </Text>
          ) : null}

          {item.hall && item.stand ? (
            <View style={styles.locationRow}>
              <Icon name="location-on" size={11} color={colors.text} />
              <Text
                style={[styles.locationText, {color: colors.text}]}
                numberOfLines={1}>
                {`${t('hall_num')} ${item.hall} · ${t('stand_num')} ${item.stand}`}
              </Text>
            </View>
          ) : null}

          {item.saved_at ? (
            <Text style={[styles.savedAtText, {color: colors.text}]}>
              {formatSavedDate(item.saved_at)}
            </Text>
          ) : null}
        </View>

        {/* Right: Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={onRemove}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            style={styles.removeBtn}>
            <Icon name="bookmark-remove" size={22} color="#EF4444" />
          </TouchableOpacity>
          <Icon
            name="chevron-right"
            size={18}
            color={colors.border}
            style={{marginTop: 8}}
            enableRTL={true}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function formatSavedDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'});
  } catch {
    return '';
  }
}
