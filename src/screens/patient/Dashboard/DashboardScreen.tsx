import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { AppText, Card, Header } from '../../../components';
import { styles } from './DashboardScreen.styles';
import { colors } from '../../../theme';
import { useAppSelector } from '../../../redux/hooks';

const DashboardScreen = () => {
  const { heartRate, spo2, weight, steps, sleep } = useAppSelector((state) => state.health);
  const user = useAppSelector((state) => state.auth.user);

  // Mock data for the pulse wave (high frequency)
  const pulseData = [
    { value: 70 }, { value: 72 }, { value: 68 }, { value: 85 }, { value: 60 },
    { value: 75 }, { value: 72 }, { value: 70 }, { value: 82 }, { value: 65 },
    { value: 70 }, { value: 72 }
  ];

  // Mock data for weight trend (last 7 data points)
  const weightTrendData = [
    { value: 73.2 }, { value: 73.0 }, { value: 72.8 }, { value: 73.1 },
    { value: 72.9 }, { value: 72.6 }, { value: 72.5 }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="h2" style={styles.greetingHeader}>
          Good Morning, <AppText variant="h2" bold>{user?.name || 'User'}</AppText>
        </AppText>
        <AppText variant="subtext" style={styles.dateText}>
          Sunday, April 5
        </AppText>

        {/* Heart Rate Card */}
        <Card style={styles.heartRateCard}>
          <View style={styles.cardHeader}>
            <AppText variant="headline" style={styles.cardTitle}>HEART RATE</AppText>
            <View style={styles.liveIndicator} />
          </View>
          <View style={styles.vitalValueContainer}>
            <AppText style={styles.vitalValue} variant="h1" bold>{heartRate}</AppText>
            <AppText variant="caption" style={styles.vitalUnit}>BPM</AppText>
          </View>
          
          <View style={styles.chartContainer}>
            <LineChart
              data={pulseData}
              height={80}
              width={300}
              initialSpacing={0}
              color1={colors.primary}
              thickness={3}
              hideDataPoints
              hideRules
              hideYAxisText
              hideAxesAndRules
              curved
              animateOnDataChange
              animationDuration={1000}
              areaChart
              startOpacity={0.2}
              endOpacity={0}
              color={colors.primary}
              startFillColor={colors.primary}
              endFillColor={colors.secondary}
            />
          </View>
          <View style={styles.cardFooter}>
             <AppText variant="tiny" style={styles.syncStatus}>● LIVE SYNCING</AppText>
             <AppText variant="tiny" style={styles.updateTime}>Updated 2m ago</AppText>
          </View>
        </Card>

        <View style={styles.row}>
          {/* SpO2 Card */}
          <Card style={[styles.halfCard, styles.spO2Card]}>
            <AppText variant="headline" style={styles.cardTitle}>SpO2</AppText>
            <View style={styles.vitalValueContainer}>
              <AppText variant="h2" bold>{spo2}</AppText>
              <AppText variant="caption" style={styles.vitalUnit}>%</AppText>
            </View>
            <AppText variant="tiny" style={styles.statusText}>Normal Range</AppText>
          </Card>

          {/* Sleep Card */}
          <Card style={[styles.halfCard, styles.sleepCardSmall]}>
            <AppText variant="headline" style={styles.cardTitle}>SLEEP</AppText>
            <View style={styles.vitalValueContainer}>
              <AppText variant="h2" bold>{sleep.duration.split(' ')[0]}</AppText>
              <AppText variant="caption" style={styles.vitalUnit}>h {sleep.duration.split(' ')[1]}</AppText>
            </View>
            <AppText variant="tiny" style={styles.statusText}>{sleep.status}</AppText>
          </Card>
        </View>

        {/* Weight Card (Refactored to match screenshot) */}
        <Card style={styles.weightCardFull}>
          <View style={styles.weightHeader}>
             <View style={styles.weightIconContainer}>
                <AppText style={styles.weightIconText}>⚖</AppText>
             </View>
             <View style={styles.weightTitleContainer}>
                <AppText variant="headline" style={styles.cardTitle}>WEIGHT</AppText>
                <View style={styles.weightTrendPill}>
                   <AppText variant="tiny" style={styles.weightTrendText}>↘ -0.5 kg this week</AppText>
                </View>
             </View>
          </View>

          <View style={styles.weightBody}>
            <View>
               <View style={styles.vitalValueContainer}>
                  <AppText variant="h2" bold>{weight}</AppText>
                  <AppText variant="caption" style={styles.vitalUnit}>kg</AppText>
               </View>
               <AppText variant="tiny" style={styles.lastDaysText}>LAST 7 DAYS</AppText>
            </View>
            
            <View style={styles.weightChartContainer}>
               <LineChart
                  data={weightTrendData}
                  height={60}
                  width={150}
                  initialSpacing={0}
                  color={colors.secondary}
                  thickness={3}
                  hideDataPoints
                  hideRules
                  hideYAxisText
                  hideAxesAndRules
                  curved
                  areaChart
                  startFillColor={colors.secondary}
                  endFillColor={colors.background}
                  startOpacity={0.1}
                  endOpacity={0}
               />
            </View>
          </View>
        </Card>

        {/* Steps Card */}
        <Card style={styles.stepsCard}>
          <AppText variant="headline" style={styles.cardTitle}>WALKING STEPS</AppText>
          <View style={styles.stepsContainer}>
            <View style={styles.stepsTextContainer}>
              <AppText variant="h2" bold>{steps.current.toLocaleString()}</AppText>
              <AppText variant="subtext">/ {steps.goal.toLocaleString()} steps</AppText>
            </View>
            {/* Progress Bar */}
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${(steps.current / steps.goal) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;


