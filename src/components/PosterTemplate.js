import React from 'react';
import { View, Text } from 'react-native';

export const PosterTemplate = ({ dream }) => (
  <View style={{ padding: 20, backgroundColor: 'white' }}>
    <Text>{dream?.content || '無夢境內容'}</Text>
  </View>
);
