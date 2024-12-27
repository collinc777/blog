import { generateBrief } from '@/lib/generateBrief';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt: context } = (await req.json()) as { prompt: string };

  const result = await generateBrief(context);

  return result.toDataStreamResponse();
}

