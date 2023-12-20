import { ExpoRequest, ExpoResponse } from 'expo-router/server';

const OPEN_AI_KEY = process.env.OPEN_AI_KEY;

export function GET(request: ExpoRequest) {
  console.log('Key: ', OPEN_AI_KEY);
  return ExpoResponse.json({ hello: 'world asdasdasda' });
}
