import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { Icon, IconNames } from './Icon';
import { colors } from '../constants/globalStyle';

export function AnimatedChevron({ chevronUp, color }: { chevronUp: boolean; color?: string }) {
  // Used for animating the chevron
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const toggleDownAnimation = Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    });

    const toggleUpAnimation = Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    });

    if (chevronUp) toggleDownAnimation.start();
    else toggleUpAnimation.start();
  }, [chevronUp, rotateAnim]);

  return (
    <Animated.View
      style={{
        transform: [
          {
            rotate: rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg'],
            }),
          },
        ],
      }}
    >
      <Icon name={IconNames.ChevronDown} style={[styles.icon, color && { color: color }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 18,
    color: colors.temp.darkGray,
  },
});
