import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Zocial from 'react-native-vector-icons/Zocial';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { colors } from '../../theme';

export type IconType = 
  | 'AntDesign' 
  | 'Entypo' 
  | 'EvilIcons' 
  | 'Feather' 
  | 'FontAwesome' 
  | 'FontAwesome5'
  | 'FontAwesome6'
  | 'Foundation' 
  | 'Ionicons' 
  | 'MaterialIcons' 
  | 'MaterialCommunityIcons' 
  | 'Octicons' 
  | 'Zocial' 
  | 'SimpleLineIcons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  type?: IconType;
}

const getIconComponent = (type: IconType) => {
  switch (type) {
    case 'AntDesign': return AntDesign;
    case 'Entypo': return Entypo;
    case 'EvilIcons': return EvilIcons;
    case 'Feather': return Feather;
    case 'FontAwesome': return FontAwesome;
    case 'FontAwesome5': return FontAwesome5;
    case 'FontAwesome6': return FontAwesome6;
    case 'Foundation': return Foundation;
    case 'Ionicons': return Ionicons;
    case 'MaterialIcons': return MaterialIcons;
    case 'MaterialCommunityIcons': return MaterialCommunityIcons;
    case 'Octicons': return Octicons;
    case 'Zocial': return Zocial;
    case 'SimpleLineIcons': return SimpleLineIcons;
    default: return MaterialCommunityIcons;
  }
};

/**
 * A reusable Icon component wrapping react-native-vector-icons.
 * Supports all major icon sets from the library.
 * Defaults to MaterialCommunityIcons.
 */
const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = colors.primary,
  style,
  type = 'MaterialCommunityIcons',
}) => {
  // @ts-ignore
  const IconComponent = getIconComponent(type);

  return (
    <IconComponent 
      name={name} 
      size={size} 
      color={color} 
      style={style} 
    />
  );
};

export default Icon;
