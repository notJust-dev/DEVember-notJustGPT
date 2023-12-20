import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';

import Message from '../components/Message';

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content:
        'You are a helpful assistant. You are very sarcastic and passive aggresive',
    },
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hello there, how can I help' },
  ]);
  const [prompt, setPrompt] = useState('');

  const list = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      list.current?.scrollToEnd({ animated: true });
    }, 10);
  }, [messages]);

  const onSend = async () => {
    const userMessage = {
      role: 'user',
      content: prompt,
    };

    setMessages((existingMessage) => [...existingMessage, userMessage]);
    setPrompt('');

    const result = await fetch('http://localhost:8081/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, userMessage]),
    });

    const resultJSON = await result.json();
    const answer = resultJSON.choices?.[0]?.message;

    setMessages((existingMessage) => [...existingMessage, answer]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={list}
          data={messages.filter((m) => m.role !== 'system')}
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
    alignItems: 'center',
    gap: 10,
  },
  message: {
    backgroundColor: 'gainsboro',
    padding: 10,
    borderRadius: 10,
    width: '90%',
  },
  messageText: {},
});
