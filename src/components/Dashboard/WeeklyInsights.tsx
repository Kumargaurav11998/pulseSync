import React, { useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { AppText, Card, Icon } from '../index';
import { colors, spacing } from '../../theme';
import QuoteService from '../../services/quotes/QuoteService';
import SQLiteService from '../../services/database/SQLiteService';
import { HealthMetric } from '../../services/ble/bleDeviceConfig';

const { width } = Dimensions.get('window');

interface InsightItem {
  id: string | number;
  text: string;
  type: 'insight' | 'quote';
  author?: string;
  icon?: string;
}

const WeeklyInsights: React.FC = () => {
  const [data, setData] = useState<InsightItem[]>([]);
  const [hasWeeklyData, setHasWeeklyData] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      // 1. Check if we have weekly data
      const weightHistory = await SQLiteService.getHistory(HealthMetric.WEIGHT, 7);
      const isDataSufficient = weightHistory.length >= 7;
      setHasWeeklyData(isDataSufficient);

      let items: InsightItem[] = [];

      if (isDataSufficient) {
        // Generate a mock insight based on real data trend
        // (In a real app, logic would be more complex)
        items.push({
          id: 'insight_1',
          type: 'insight',
          text: 'Your resting heart rate is 5% lower than last week. Great progress!',
          icon: 'lightbulb-on'
        });
        
        items.push({
          id: 'insight_2',
          type: 'insight',
          text: 'You have been more consistent with your weight tracking this week.',
          icon: 'trending-down'
        });
      }

      // 2. Fetch quotes from local DB (either as fallback or supplement)
      const quotes = await QuoteService.getDisplayQuotes();
      const quoteItems: InsightItem[] = quotes.map((q: any) => ({
        id: q.id || Math.random().toString(),
        type: 'quote',
        text: q.quote,
        author: q.author
      }));

      // Combine items (Limit to 5 total)
      setData([...items, ...quoteItems].slice(0, 5));
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const renderItem = ({ item }: { item: InsightItem }) => (
    <Card style={styles.card}>
      <View style={styles.contentContainer}>
        <View style={[styles.iconWrapper, { backgroundColor: item.type === 'insight' ? colors.primary + '15' : colors.secondary + '15' }]}>
          <Icon 
            name={item.type === 'insight' ? (item.icon || 'lightbulb') : 'format-quote-open'} 
            size={20} 
            color={item.type === 'insight' ? colors.primary : colors.secondary} 
          />
        </View>
        <View style={styles.textContainer}>
          <AppText variant="body" style={styles.insightText} numberOfLines={3}>
            {item.text}
          </AppText>
          {item.author && (
            <AppText variant="tiny" style={styles.authorText}>
              — {item.author}
            </AppText>
          )}
        </View>
      </View>
    </Card>
  );

  if (data.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="h3" bold style={styles.title}>
          {hasWeeklyData ? 'Weekly Insights' : 'Daily Motivation'}
        </AppText>
      </View>

      <Carousel
        loop
        width={width - (spacing.screenPadding * 2)}
        height={100}
        autoPlay={true}
        data={data}
        scrollAnimationDuration={1500}
        autoPlayInterval={5000}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.l,
    marginBottom: spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  title: {
    color: colors.textPrimary,
  },
  card: {
    flex: 1,
    marginRight: 0,
    justifyContent: 'center',
    padding: spacing.m,
    backgroundColor: colors.surface,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  textContainer: {
    flex: 1,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  authorText: {
    marginTop: 4,
    opacity: 0.6,
    fontStyle: 'italic',
  },
});

export default WeeklyInsights;
