import React from 'react';
import { Text, TextProps } from 'react-native';
import { styles } from './AppText.styles';

interface AppTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'subtext' | 'caption' | 'tiny' | 'headline';
  bold?: boolean;
}

const AppText: React.FC<AppTextProps> = ({ 
  children, 
  style, 
  variant = 'body', 
  bold = false,
  ...props 
}) => {
  return (
    <Text 
      style={[
        styles.text,
        styles[variant],
        bold && styles.bold,
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
};

export default AppText;


