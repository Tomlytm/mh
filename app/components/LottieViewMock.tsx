import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import colors from '../config/colors';

// Temporary mock for LottieView until dependencies are fixed
const LottieView = ({ style, source, autoPlay, ...props }: any) => {
  return (
    <View style={[{ justifyContent: 'center', alignItems: 'center' }, style]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default LottieView;