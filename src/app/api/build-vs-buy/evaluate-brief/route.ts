import { evaluateBrief } from '@/lib/evaluateBrief';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { brief, formData } = (await req.json()) as { brief: string; formData: string };
  const result = await evaluateBrief(brief, formData);
  if (result instanceof Response) {
    return result;
  }

  return result.toTextStreamResponse();
}

