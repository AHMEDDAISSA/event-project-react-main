/**
 * IcebreakerCard
 *
 * A visually enriched suggestion card for the "Suggestions" / "Recommended for you" screen.
 * All data is received via props — no API calls inside this component.
 *
 * @param {object}   props
 * @param {string}   props.name          - Full name of the suggested contact
 * @param {string}   props.company       - Company / organisation of the contact
 * @param {string}   props.role          - Role type: 'visitor' | 'exhibitor'
 * @param {number}   props.score         - AI compatibility score between 0 and 100
 * @param {string}   props.justification - One-sentence AI justification (common ground)
 * @param {string}   props.icebreaker    - Suggested opening sentence to break the ice
 * @param {function} props.onBookSlot    - Callback when the user taps "Book a slot"
 */
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../config';

// Score helpers

function getScoreColor(score) {
  if (score > 75) return '#22C55E';
  if (score >= 50) return '#F97316';
  return '#94A3B8';
}

function getScoreLabel(score, t) {
  if (score > 75) return t('score_high_compatibility');
  if (score >= 50) return t('score_good_compatibility');
  return t('score_moderate_compatibility');
}

function getRoleMeta(role, t) {
  const isExhibitor = String(role).toLowerCase() === 'exhibitor';
  return {
    label: isExhibitor ? t('exhibitor_label') : t('visitor_label'),
    bg: isExhibitor ? '#EDE9FE' : '#E0F2FE',
    text: isExhibitor ? '#6D28D9' : '#0369A1',
  };
}

const SPARKLE = '\u2736';
const COPY_ICON = '\u2398';

export default function IcebreakerCard({
  name,
  company,
  role,
  score,
  justification,
  icebreaker,
  onBookSlot,
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [copied, setCopied] = useState(false);

  const safeScore = typeof score === 'number' ? Math.max(0, Math.min(100, score)) : 0;
  const scoreColor = getScoreColor(safeScore);
  const scoreLabel = getScoreLabel(safeScore, t);
  const roleMeta = getRoleMeta(role, t);

  const handleCopy = async () => {
    if (!icebreaker) return;
    await Clipboard.setStringAsync(icebreaker);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onPressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  const barWidth = safeScore + '%';

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.avatar, { backgroundColor: scoreColor + '22' }]}>
            <Text style={[styles.avatarText, { color: scoreColor }]}>
              {(name || '?').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.nameBlock}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{name || '-'}</Text>
            <Text style={[styles.company, { color: colors.text + '99' }]} numberOfLines={1}>{company || '-'}</Text>
          </View>
        </View>
        <View style={[styles.roleBadge, { backgroundColor: roleMeta.bg }]}>
          <Text style={[styles.roleText, { color: roleMeta.text }]}>{roleMeta.label}</Text>
        </View>
      </View>

      <View style={styles.scoreSection}>
        <View style={styles.scoreRow}>
          <View style={[styles.scoreBadge, { borderColor: scoreColor, backgroundColor: colors.background }]}>
            <Text style={[styles.scoreNumber, { color: scoreColor }]}>{safeScore}</Text>
            <Text style={[styles.scoreMax, { color: scoreColor }]}>/100</Text>
          </View>
          <View style={styles.scoreMeta}>
            <Text style={[styles.scoreLabel, { color: scoreColor }]}>{scoreLabel}</Text>
            <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
              <View style={[styles.progressFill, { width: barWidth, backgroundColor: scoreColor }]} />
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {justification ? (
        <View style={styles.justificationRow}>
          <Text style={styles.sparkleIcon}>{SPARKLE}</Text>
          <Text style={[styles.justificationText, { color: colors.text }]}>{justification}</Text>
        </View>
      ) : null}

      {icebreaker ? (
        <View style={[styles.icebreakerBox, { backgroundColor: colors.background, borderLeftColor: colors.primary }]}>
          <View style={styles.icebreakerHeader}>
            <Text style={[styles.icebreakerTitle, { color: colors.primary }]}>{t('icebreaker_how_to_approach')}</Text>
            <TouchableOpacity
              style={[styles.copyButton, { borderColor: colors.primary, backgroundColor: colors.card }, copied && { backgroundColor: colors.primary }]}
              onPress={handleCopy}
              activeOpacity={0.75}
              accessibilityLabel={t('icebreaker_copy_accessibility')}
            >
              <Text style={[styles.copyButtonText, { color: colors.primary }, copied && { color: '#FFFFFF' }]}>
                {copied ? '\u2713 ' + t('icebreaker_copied') : COPY_ICON + ' ' + t('icebreaker_copy')}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.icebreakerContent, { color: colors.text }]}>{icebreaker}</Text>
        </View>
      ) : null}

      <Animated.View style={{ transform: [{ scale: scaleAnim }], marginTop: 16 }}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={onBookSlot}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={0.9}
          accessibilityLabel={t('icebreaker_book_slot')}
          accessibilityRole="button"
        >
          <Text style={styles.ctaText}>{t('icebreaker_book_slot')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const PALETTE = {
  indigo: '#4F46E5',
  indigoDark: '#3730A3',
  indigoLight: '#EEF2FF',
  violet: '#7C3AED',
  white: '#FFFFFF',
  bg: '#F8FAFF',
  textPrimary: '#1E1B4B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  divider: '#F1F5F9',
  shadowColor: '#4F46E5',
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: PALETTE.white,
    borderRadius: 16,
    marginHorizontal: 2,
    marginBottom: 14,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: PALETTE.border,
    shadowColor: PALETTE.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
  },
  nameBlock: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.textPrimary,
    letterSpacing: 0.1,
  },
  company: {
    fontSize: 13,
    color: PALETTE.textSecondary,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  scoreSection: {
    marginBottom: 14,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  scoreBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.bg,
  },
  scoreNumber: {
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 20,
  },
  scoreMax: {
    fontSize: 9,
    fontWeight: '600',
    opacity: 0.7,
  },
  scoreMeta: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: PALETTE.divider,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  divider: {
    height: 1,
    backgroundColor: PALETTE.divider,
    marginBottom: 14,
  },
  justificationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 8,
  },
  sparkleIcon: {
    fontSize: 15,
    color: PALETTE.violet,
    marginTop: Platform.OS === 'android' ? 1 : 0,
  },
  justificationText: {
    flex: 1,
    fontSize: 13,
    color: PALETTE.textSecondary,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  icebreakerBox: {
    backgroundColor: PALETTE.indigoLight,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: PALETTE.indigo,
  },
  icebreakerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  icebreakerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: PALETTE.indigoDark,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  copyButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PALETTE.indigo,
    backgroundColor: PALETTE.white,
  },
  copyButtonActive: {
    backgroundColor: PALETTE.indigo,
    borderColor: PALETTE.indigo,
  },
  copyButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: PALETTE.indigo,
  },
  copyButtonTextActive: {
    color: PALETTE.white,
  },
  icebreakerContent: {
    fontSize: 14,
    color: PALETTE.indigoDark,
    lineHeight: 21,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PALETTE.indigo,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderBottomColor: PALETTE.indigoDark,
  },
  ctaIcon: {
    fontSize: 16,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: PALETTE.white,
    letterSpacing: 0.3,
  },
});
