import { buildVsBuyFormSchema } from '@/app/schemas/build-vs-buy-form';
import { generateBrief } from '@/lib/generateBrief';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt: context } = (await req.json()) as { prompt: string };
  const typedContext = buildVsBuyFormSchema.safeParse(JSON.parse(context));
  if (!typedContext.success) {
    return new Response("Invalid input", { status: 400 });
  }

  const result = await generateBrief(typedContext.data);

  return result.toDataStreamResponse();
}

