import { loremIpsumSchema } from '@/app/schemas/lorem';
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const context = await req.json();

  const result = streamObject({
    model: openai('gpt-4o-mini'),
    schema: loremIpsumSchema,
    prompt: `Generate a lorem ipsum for a messages app in this context:` + context,
  });

  return result.toTextStreamResponse();
}
