import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt: context } = await req.json();
  console.log({ context });

  const result = streamText({
    model: openai('gpt-4o'),
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
    prompt:
      `Based on the following build vs. buy analysis data, generate a structured decision brief.
    
Analysis Data:
${context}`,
  });

  return result.toDataStreamResponse();
}