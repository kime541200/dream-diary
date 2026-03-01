import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Path, Defs, RadialGradient, Stop, G, Filter, FeGaussianBlur } from 'react-native-svg';

export const VisualToken = ({ path, moodColor = '#7C3AED', turbulence = 0.5, size = 70 }) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 3000 / turbulence, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 3000 / turbulence, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    );
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 10000, easing: Easing.linear, useNativeDriver: true })
    );
    pulse.start();
    rotate.start();
    return () => { pulse.stop(); rotate.stop(); };
  }, [turbulence]);

  const scale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1.05] });
  const opacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.8] });
  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const defaultPath = 'M50 20 C70 20 80 50 50 80 C20 50 30 20 50 20';
  const finalPath = path && path.trim() ? path : defaultPath;

  return (
    <Animated.View style={{ width: size, height: size, transform: [{ scale }, { rotate: spin }], opacity, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} viewBox='0 0 100 100'>
        <Defs>
          <RadialGradient id='glow' cx='50%' cy='50%' rx='50%' ry='50%'>
            <Stop offset='0%' stopColor={moodColor} stopOpacity='1' />
            <Stop offset='100%' stopColor={moodColor} stopOpacity='0' />
          </RadialGradient>
          <Filter id='blurFilter'>
            <FeGaussianBlur stdDeviation='2' />
          </Filter>
        </Defs>
        <G>
          <Path d={finalPath} fill='url(#glow)' filter='url(#blurFilter)' />
          <Path d={finalPath} fill='none' stroke={moodColor} strokeWidth='2' strokeLinecap='round' opacity='0.8' />
        </G>
      </Svg>
    </Animated.View>
  );
};
