import React from 'react';
import { 
  TouchableOpacity, 
  TouchableOpacityProps, 
  ActivityIndicator, 
  ViewStyle, 
  StyleProp 
} from 'react-native';
import { styles } from './Button.styles';
import AppText from './AppText';
import { colors } from '../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  ...props
}) => {
  const containerStyle = [
    styles.container,
    styles[variant],
    disabled && styles.disabled,
    style
  ];

  const textStyle = [
    styles.buttonText,
    variant === 'outline' || variant === 'text' ? { color: colors.primary } : { color: colors.textInverse }
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled || loading}
      style={containerStyle}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.textInverse} />
      ) : (
        <AppText bold variant="body" style={textStyle}>
          {title}
        </AppText>
      )}
    </TouchableOpacity>
  );
};

export default Button;
