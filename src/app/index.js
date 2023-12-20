import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';

import Message from '../components/Message';

export default function App() {
  const [message, setMessages] = useState([
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hello there, how can I help' },
  ]);

  const [prompt, setPrompt] = useState('');

  const onSend = () => {
    setMessages((existingMessage) => [
      ...existingMessage,
      {
        role: 'user',
        content: prompt,
      },
    ]);

    setPrompt('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Text>Key: {process.env.EXPO_PUBLIC_SHARABLE_KEY}</Text>
        <FlatList
          data={message}
          contentContainerStyle={{ gap: 10, padding: 10 }}
          renderItem={({ item }) => <Message message={item} />}
        />

        <View style={styles.footer}>
          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            placeholder="how can I help you?"
            style={styles.input}
          />
          <Button title="Send" onPress={onSend} />
        </View>
      </KeyboardAvoidingView>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gainsboro',
    padding: 10,
    borderRadius: 50,
    flex: 1,
  },
  footer: {
    marginTop: 'auto',
    flexDirection: 'row',
    padding: 10,
  },
  message: {
    backgroundColor: 'gainsboro',
    padding: 10,
    borderRadius: 10,
    width: '90%',
  },
  messageText: {},
});
