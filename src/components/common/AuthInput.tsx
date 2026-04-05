import React from 'react';
import { View, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import AppText from '../AppText';
import { colors } from '../../theme';
import { styles } from './AuthInput.styles';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <AppText variant="caption" style={styles.label}>
        {label}
      </AppText>
      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textSecondary + '80'}
          autoCapitalize="none"
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconContainer}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <AppText variant="tiny" style={styles.errorText}>
          {error}
        </AppText>
      )}
    </View>
  );
};

export default AuthInput;
