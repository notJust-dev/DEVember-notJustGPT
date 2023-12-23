import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

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
      {message.role === 'image' ? (
        <Image source={{ uri: message.content }} style={styles.image} />
      ) : (
        <Text
          style={[
            styles.messageText,
            { color: message.role === 'user' ? 'white' : 'black' },
          ]}
        >
          {message.content}
        </Text>
      )}
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
  image: {
    width: '100%',
    aspectRatio: 1,
  },
});
