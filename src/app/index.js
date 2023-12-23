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
  ActivityIndicator,
  Text,
} from 'react-native';

import Message from '../components/Message';

const fetchApi = async (endpoint, bodyJson) => {
  const result = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyJson),
  });

  return await result.json();
};

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
  const [isLoading, setIsLoading] = useState(false);

  const list = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      list.current?.scrollToEnd({ animated: true });
    }, 10);
  }, [messages]);

  const onSend = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const userMessage = {
      role: 'user',
      content: prompt,
    };

    setMessages((existingMessage) => [...existingMessage, userMessage]);
    setPrompt('');

    try {
      const shouldGenerateImage = await isImagePrompt(prompt);

      if (shouldGenerateImage) {
        await generateImage();
      } else {
        await generateCompletion(userMessage);
      }
    } catch (e) {
      Alert.alert('Something went wrong');
    }

    setIsLoading(false);
  };

  const generateCompletion = async (userMessage) => {
    const resultJSON = await fetchApi('/completion', [
      ...messages.filter((m) => m.role !== 'image'),
      userMessage,
    ]);
    const answer = resultJSON.choices?.[0]?.message;

    setMessages((existingMessage) => [...existingMessage, answer]);
  };

  const isImagePrompt = async (prompt) => {
    const resultJSON = await fetchApi('/completion', [
      {
        role: 'system',
        content:
          'You are an AI that categorizes prompts into image generate requests and completion requests. You only answer with one number 0 to 1.0 that represents how confident you are that the prompt is for image genreation',
      },
      {
        role: 'user',
        content: `Categorize the prompt that I will give you and tell me if it is a prompt for image generation. Answer with a value from 0 to 1.0 that represents how confident you are that the prompt is for image generation. 
        The prompt is: ${prompt}
        `,
      },
    ]);
    const answer = resultJSON.choices?.[0]?.message;
    if (answer) {
      return Number(answer.content) > 0.75;
    }

    return false;
  };

  const generateImage = async () => {
    const data = await fetchApi('/imagine', { prompt });

    if (data?.data?.[0]?.url) {
      const imageMessage = {
        role: 'image',
        content: data.data[0].url,
      };

      setMessages((existingMessage) => [...existingMessage, imageMessage]);
    }
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
          ListFooterComponent={() =>
            isLoading && (
              <>
                <Text>Generating... </Text>
                <ActivityIndicator />
              </>
            )
          }
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
