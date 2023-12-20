import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import OpenAI from 'openai';

const OPEN_AI_KEY = process.env.OPEN_AI_KEY;
const openai = new OpenAI({ apiKey: OPEN_AI_KEY });

export async function POST(request: ExpoRequest) {
  const body = await request.json();

  const completion = await openai.chat.completions.create({
    messages: body,
    model: 'gpt-3.5-turbo',
  });

  return ExpoResponse.json(completion);
}
