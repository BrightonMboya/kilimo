import { Text, View } from 'react-native';
import React from 'react';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24 }}>diagnostic build — hello</Text>
    </View>
  );
}
