import React from 'react';
import { View } from 'react-native';
import AppText from '../AppText';
import Card from '../Card';
import { styles } from './StepCounterCard.styles';

interface StepCounterCardProps {
  currentSteps: number;
  goalSteps: number;
}

const StepCounterCard: React.FC<StepCounterCardProps> = ({ currentSteps, goalSteps }) => {
  const progressPercent = Math.min((currentSteps / goalSteps) * 100, 100);
  const isGoalReached = progressPercent === 100;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconContainer}>
            <AppText style={styles.icon}>👟</AppText>
          </View>
          <AppText variant="headline">Steps</AppText>
        </View>
        
        {isGoalReached ? (
          <View style={styles.goalPill}>
            <AppText style={styles.goalText}>GOAL REACHED</AppText>
          </View>
        ) : (
          <AppText variant="caption" style={styles.goalSubtext}>
            Goal: {goalSteps.toLocaleString()}
          </AppText>
        )}
      </View>

      <View style={styles.stepsRow}>
        <AppText style={styles.stepsValue}>
          {currentSteps === 0 ? '--' : currentSteps.toLocaleString()}
        </AppText>
        <AppText style={styles.stepsUnit}>steps</AppText>
      </View>

      <View style={styles.progressTrack}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${progressPercent}%` },
            isGoalReached && styles.progressFillGoal
          ]} 
        />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <AppText style={styles.statValue}>
            {((currentSteps / goalSteps) * 100).toFixed(0)}%
          </AppText>
          <AppText style={styles.statLabel}>COMPLETED</AppText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <AppText style={styles.statValue}>
            {Math.max(0, goalSteps - currentSteps).toLocaleString()}
          </AppText>
          <AppText style={styles.statLabel}>REMAINING</AppText>
        </View>
      </View>
    </Card>
  );
};

export default StepCounterCard;
