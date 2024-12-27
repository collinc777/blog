import { z } from 'zod';

const criterionSchema = z.object({
  rating: z.enum(['pass', 'fail', 'needs_more_info']),
  reasoning: z.string(),
  questions: z.array(z.string()).optional(),
  improvements: z.array(z.string()).optional(),
});

export const briefEvaluation = z.object({
  stateComplexityAnalysis: criterionSchema.describe(
    'Analysis of the state management complexity and infrastructure requirements'
  ),
  requirementsClarityAnalysis: criterionSchema.describe(
    'Analysis of requirements clarity and future evolution path'
  ),
  categoryMaturityAnalysis: criterionSchema.describe(
    'Analysis of the product category maturity and market landscape'
  ),
  resourceConsiderationAnalysis: criterionSchema.describe(
    'Analysis of team capabilities and resource availability'
  ),
  llmImpactAnalysis: criterionSchema.describe(
    'Analysis of how LLMs impact the build vs buy decision'
  ),
  finalRecommendation: z
    .object({
      recommendation: z.enum(['build', 'buy', 'hybrid', 'needs_more_info']),
      reasoning: z.string(),
      nextSteps: z.array(z.string()),
    })
    .describe('Final recommendation and next steps'),
});
