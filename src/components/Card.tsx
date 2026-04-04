import React from 'react';
import { View, ViewProps } from 'react-native';
import { styles } from './Card.styles';

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'flat' | 'outlined';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  variant = 'elevated', 
  ...props 
}) => {
  return (
    <View 
      style={[
        styles.container,
        styles[variant],
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
};

export default Card;


