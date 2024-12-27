import { evaluateBrief } from '@/lib/evaluateBrief';
import { buildVsBuyFormSchema } from '@/app/schemas/build-vs-buy-form';
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { brief, formData } = (await req.json()) as { brief: string; formData: string };
  const typedFormData = buildVsBuyFormSchema.safeParse(JSON.parse(formData));
  if (!typedFormData.success) {
    return new Response('Invalid input', { status: 400 });
  }
  const result = await evaluateBrief(brief, typedFormData.data);
  if (result instanceof Response) {
    return result;
  }

  return result.toTextStreamResponse();
}
