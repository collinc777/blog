import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { BuildVsBuyFormData } from '@/app/schemas/build-vs-buy-form';
import { z } from 'zod';

export const briefSchema = z.object({
  thinking: z.string().describe('Your thinking process'),
  brief: z.string().describe('The decision brief in markdown format'),
});

export async function generateBrief(formData: BuildVsBuyFormData) {
  return streamObject({
    model: openai('gpt-4o'),
    schema: briefSchema,
    system: `
      You are an expert technology decision maker specializing in build vs. buy analysis. 
  Your recommendations are clear, well-reasoned, and based on concrete data.
  
  You will generate structured decision briefs with the following sections:
  1. Executive Summary (2-3 sentences)
  2. Key Factors Analysis
     - State Management Complexity
     - Requirements Clarity & Evolution
     - Product Category Maturity
  3. Resource Considerations
  4. LLM Impact Analysis
  5. Final Recommendation with clear BUILD or BUY decision
  
  Your recommendations should be:
  - Decisive and well-justified
  - Based on concrete data provided
  - Focused on the three key pillars: State Management Complexity, Requirements Clarity & Evolution Path, and Product Category Maturity
  - Clear in the final BUILD or BUY decision
  
  Your output should be in markdown format.
      `,
    prompt: `Based on the following build vs. buy analysis data, generate a structured decision brief.
      
  Analysis Data:
  ${JSON.stringify(formData)}`,
    experimental_telemetry: {
      isEnabled: true,
    },
  });
}
