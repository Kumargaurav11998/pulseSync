import React from 'react';
import { View } from 'react-native';
import { AppText } from './index';
import { styles } from './Header.styles';

const Header = () => {
  return (
    <View style={styles.container}>
      <AppText variant="h3" bold style={styles.logoText}>PulseSync</AppText>
      <View style={styles.profileIndicator} />
    </View>
  );
};

export default Header;


