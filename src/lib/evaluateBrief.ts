import { streamObject } from 'ai';
import { getPostBySlug } from './api';
import { openai } from '@ai-sdk/openai';
import { briefEvaluation } from '@/app/schemas/brief-evaluation';
import { BuildVsBuyFormData } from '@/app/schemas/build-vs-buy-form';

export async function evaluateBrief(brief: string, formData: BuildVsBuyFormData) {
  const post = getPostBySlug('build-vs-buy');

  if (!post) {
    return new Response('Blog post not found', { status: 404 });
  }

  const result = streamObject({
    model: openai('gpt-4o'),
    schema: briefEvaluation,
    system: `You are an expert evaluator of build vs. buy decision briefs.
  Your task is to evaluate decision briefs based on a specific framework.
  
  For each analysis criterion, you must provide:
  1. A rating: "pass", "fail", or "needs_more_info"
  2. Detailed reasoning explaining your rating
  3. For "needs_more_info" ratings: specific questions to ask
  4. For "fail" ratings: specific improvements needed
  
  Analyze each criterion in this order:
  
  1. State Complexity Analysis
  - Evaluate infrastructure needs
  - Consider scaling requirements
  - Assess state management complexity
  
  2. Requirements Clarity Analysis
  - Evaluate MVP definition clarity
  - Assess evolution path clarity
  - Consider requirement stability
  
  3. Category Maturity Analysis
  - Evaluate market solutions
  - Consider best practices stability
  - Assess technology maturity
  
  4. Resource Consideration Analysis
  - Evaluate team capabilities
  - Consider resource availability
  - Assess experience alignment
  
  5. LLM Impact Analysis
  - Evaluate how LLMs affect build complexity
  - Consider LLM-aided development benefits
  - Assess LLM impact on maintenance
  
  Finally, provide a recommendation:
  - Choose: "build", "buy", "hybrid", or "needs_more_info"
  - Provide clear reasoning
  - List specific next steps
  
  IMPORTANT: Structure your response to match the schema exactly.`,
    prompt: `Please evaluate this decision brief based on the framework from the blog post.
  
  Framework (from blog post):
  ${post.content}
  
  Decision Brief:
  ${brief}
  
  Form Data:
  ${formData}
  
  Evaluate each criterion thoroughly and provide a structured response matching the schema.`,
    experimental_telemetry: {
      isEnabled: true,
    },
  });

  return result;
}
