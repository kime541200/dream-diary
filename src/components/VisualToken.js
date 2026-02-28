import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Path, Defs, RadialGradient, Stop } from 'react-native-svg';

export const VisualToken = (props) => {
  const { 
    path = '', 
    moodColor = '#7C3AED', 
    turbulence = 0.5, 
    size = 70 
  } = props || {};

  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000 / (turbulence || 0.5), easing: Easing.inOut(Easing.sine), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 2000 / (turbulence || 0.5), easing: Easing.inOut(Easing.sine), useNativeDriver: true })
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [turbulence]);

  const scale = pulseAnim.interpolate({ 
    inputRange: [0, 1], 
    outputRange: [1, 1 + (0.1 * (turbulence || 0.5))] 
  });

  return (
    <Animated.View style={{ width: size, height: size, transform: [{ scale }], justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={moodColor || '#7C3AED'} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={moodColor || '#7C3AED'} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Path d={path || 'M50 20 C70 20 80 50 50 80 C20 50 30 20 50 20'} fill="url(#grad)" />
        <Path d={path || 'M50 20 C70 20 80 50 50 80 C20 50 30 20 50 20'} fill="none" stroke={moodColor || '#7C3AED'} strokeWidth="1.5" />
      </Svg>
    </Animated.View>
  );
};
