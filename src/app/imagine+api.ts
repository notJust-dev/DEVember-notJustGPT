import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import OpenAI from 'openai';

const OPEN_AI_KEY = process.env.OPEN_AI_KEY;
const openai = new OpenAI({ apiKey: OPEN_AI_KEY });

export async function POST(request: ExpoRequest) {
  const body = await request.json();

  const response = await openai.images.generate({
    prompt: body.prompt,
    model: 'dall-e-3',
    n: 1,
    size: '1024x1024',
  });

  return ExpoResponse.json(response);
}
