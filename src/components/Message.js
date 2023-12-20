import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function Message({ message }) {
  return (
    <View
      style={[
        styles.message,
        {
          marginLeft: message.role === 'user' ? 'auto' : 0,
          backgroundColor: message.role === 'user' ? '#2A87FF' : '#DCE7FF',
        },
      ]}
    >
      <Text
        style={[
          styles.messageText,
          { color: message.role === 'user' ? 'white' : 'black' },
        ]}
      >
        {message.content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    backgroundColor: 'gainsboro',
    padding: 10,
    borderRadius: 10,
    width: '90%',
  },
  messageText: {},
});
