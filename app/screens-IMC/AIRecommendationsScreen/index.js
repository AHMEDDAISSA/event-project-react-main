import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { BaseColor, BaseStyle, useTheme, Images } from '../../config';
import { Header, SafeAreaView, Text, IcebreakerCard, Button, Icon } from '../../components';
import { useTranslation } from 'react-i18next';
import { getAIRecommendations, autoContactMatches } from '../../services/aiService';
import ToastUtils from '../../config/toastUtils';
import useAndroidBack from '../../hooks/useAndroidBack';

export default function AIRecommendationsScreen({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [contacting, setContacting] = useState(false);

  useAndroidBack();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      // For now we simulate an empty response if the backend is not ready
      // const response = await getAIRecommendations(1);
      // setRecommendations(response.data || []);
      
      // Mock data for UI demonstration
      setTimeout(() => {
        setRecommendations([
          {
            id: '101',
            first_name: 'AI',
            last_name: 'Suggestion',
            organization_name: 'Tech Corp',
            type: 'exhibitor',
            ai_score: 95,
            ai_justification: 'Highly rated events in your sector',
            ai_icebreaker: 'I saw you have top ratings for AI tech, let\'s connect!',
            imagePath: ''
          }
        ]);
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error fetching AI recommendations', error);
      setLoading(false);
    }
  };

  const handleAutoContact = async () => {
    try {
      setContacting(true);
      // Call the AI auto contact API
      // await autoContactMatches('all', 'Context: interested in high rating events');
      
      setTimeout(() => {
        setContacting(false);
        ToastUtils.showSuccessToast(t('success'), 'AI has auto-contacted the best matches!');
      }, 1500);
      
    } catch (error) {
      setContacting(false);
      ToastUtils.showErrorToast(t('error'), t('Something_went_wrong'));
    }
  };

  const renderItem = ({ item }) => (
    <IcebreakerCard
      image={item.imagePath ? { uri: item.imagePath } : Images.profile2}
      name={`${item.first_name || ''} ${item.last_name || ''}`}
      company={item.organization_name}
      role={item.type}
      score={item.ai_score}
      justification={item.ai_justification}
      icebreaker={item.ai_icebreaker}
      onPressProfile={() => navigation.navigate('ExhibitorDetail', { id: item.id })}
      onBookSlot={() => navigation.navigate('RequestAmeeting', { exhibitor: item })}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="AI Recommendations"
        renderLeft={() => <Icon name="arrow-back" size={24} color={colors.text} />}
        onPressLeft={() => navigation.goBack()}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left', 'bottom']}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
              <Text headline style={{ marginBottom: 10 }}>Based on Best Ratings</Text>
              <Text body2 color={colors.textSecondary}>
                Our AI analyzed the highest rated events and profiles to find these matches for you.
              </Text>
            </View>
            <FlatList
              data={recommendations}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
            />
            <View style={{ padding: 20, position: 'absolute', bottom: 0, width: '100%', backgroundColor: colors.background }}>
              <Button loading={contacting} onPress={handleAutoContact}>
                Auto-Contact All Matches
              </Button>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
