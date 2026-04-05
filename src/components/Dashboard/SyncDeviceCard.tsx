import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppText, Card, Icon } from '../index';
import { styles } from './SyncDeviceCard.styles';
import { colors } from '../../theme';

interface SyncDeviceCardProps {
  onPress: () => void;
}

const SyncDeviceCard: React.FC<SyncDeviceCardProps> = ({ onPress }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.iconContainer}>
         <Icon name="bluetooth" size={32} color={colors.primary} />
      </View>
      
      <AppText variant="h2" bold style={styles.title}>Sync New Device</AppText>
      <AppText variant="body" style={styles.description}>
        Connect your wearable to get more precise real-time health insights.
      </AppText>

      <TouchableOpacity style={styles.button} onPress={onPress}>
        <LinearGradient
          colors={[colors.primary, colors.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <AppText style={styles.buttonText}>Connect Device</AppText>
        </LinearGradient>
      </TouchableOpacity>
    </Card>
  );
};

export default SyncDeviceCard;
