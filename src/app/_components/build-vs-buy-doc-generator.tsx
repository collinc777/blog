'use client';
import { useCompletion } from 'ai/react';
import { experimental_useObject as useObject } from 'ai/react';
import { useActionState, useCallback, useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { MemoizedMarkdown } from './memoized-markdown';
import { useRightPane } from './split-layout-context';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { briefEvaluation } from '../schemas/brief-evaluation';
import { Badge } from "@/components/ui/badge";
import { z } from 'zod';

type Rating = "pass" | "fail" | "needs_more_info";
type Recommendation = "build" | "buy" | "hybrid" | "needs_more_info";

interface CriterionData {
  rating: Rating;
  reasoning: string;
  questions?: string[];
  improvements?: string[];
}

interface CriterionProps extends CriterionData {
  title: string;
}

function isCompleteCriterion(criterion: any): criterion is CriterionData {
  return criterion && 
    typeof criterion.rating === 'string' && 
    typeof criterion.reasoning === 'string' &&
    (!criterion.questions || Array.isArray(criterion.questions)) &&
    (!criterion.improvements || Array.isArray(criterion.improvements));
}

function isCompleteRecommendation(recommendation: any): recommendation is {
  recommendation: Recommendation;
  reasoning: string;
  nextSteps: string[];
} {
  return recommendation &&
    typeof recommendation.recommendation === 'string' &&
    typeof recommendation.reasoning === 'string' &&
    Array.isArray(recommendation.nextSteps);
}

function CriterionCard({ title, rating, reasoning, questions, improvements }: CriterionProps) {
  const ratingColors: Record<Rating, string> = {
    pass: "bg-green-500",
    fail: "bg-red-500",
    needs_more_info: "bg-yellow-500"
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-lg">{title}</h4>
        <Badge className={ratingColors[rating]}>
          {rating.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>
      <p className="text-sm text-gray-600">{reasoning}</p>
      {questions && questions.length > 0 && (
        <div>
          <h5 className="font-medium text-sm">Questions to Consider:</h5>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {questions.map((q, i) => <li key={i}>{q}</li>)}
          </ul>
        </div>
      )}
      {improvements && improvements.length > 0 && (
        <div>
          <h5 className="font-medium text-sm">Suggested Improvements:</h5>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {improvements.map((imp, i) => <li key={i}>{imp}</li>)}
          </ul>
        </div>
      )}
    </Card>
  );
}

function FinalRecommendation({ 
  recommendation, 
  reasoning, 
  nextSteps 
}: { 
  recommendation: Recommendation; 
  reasoning: string; 
  nextSteps: string[]; 
}) {
  const recommendationColors: Record<Recommendation, string> = {
    build: "bg-blue-500",
    buy: "bg-purple-500",
    hybrid: "bg-indigo-500",
    needs_more_info: "bg-yellow-500"
  };

  return (
    <Card className="p-4 space-y-3 border-2 border-primary">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-xl">Final Recommendation</h3>
        <Badge className={recommendationColors[recommendation]}>
          {recommendation.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>
      <p className="text-gray-600">{reasoning}</p>
      <div>
        <h4 className="font-semibold">Next Steps:</h4>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {nextSteps.map((step, i) => <li key={i}>{step}</li>)}
        </ul>
      </div>
    </Card>
  );
}

function QuestionResponses({ 
  questions, 
  onSubmit 
}: { 
  questions: string[]; 
  onSubmit: (answers: Record<string, string>) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  return (
    <Card className="p-4 space-y-4">
      <h4 className="font-semibold">Additional Questions</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.map((question, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`question-${index}`}>{question}</Label>
            <Textarea
              id={`question-${index}`}
              value={answers[question] || ''}
              onChange={(e) => setAnswers(prev => ({
                ...prev,
                [question]: e.target.value
              }))}
              required
              className="h-24"
            />
          </div>
        ))}
        <Button type="submit" className="w-full">Submit Answers</Button>
      </form>
    </Card>
  );
}

function EvaluationResults({ evaluation, onAnswerSubmit }: { 
  evaluation: z.infer<typeof briefEvaluation>;
  onAnswerSubmit: (answers: Record<string, string>) => void;
}) {
  // Helper type guard
  const hasCriterionQuestions = (value: unknown): value is { questions?: string[] } => {
    return value !== null && 
           typeof value === 'object' && 
           'questions' in value && 
           (value as any).questions !== undefined;
  };

  // Collect all questions from the evaluation criteria (excluding finalRecommendation)
  const allQuestions = [
    evaluation.stateComplexityAnalysis,
    evaluation.requirementsClarityAnalysis,
    evaluation.categoryMaturityAnalysis,
    evaluation.resourceConsiderationAnalysis,
    evaluation.llmImpactAnalysis
  ]
    .filter(hasCriterionQuestions)
    .flatMap(criterion => criterion.questions || []);

  return (
    <div className="space-y-6 mt-8">
      {evaluation.stateComplexityAnalysis && isCompleteCriterion(evaluation.stateComplexityAnalysis) && (
        <CriterionCard
          title="State Complexity Analysis"
          rating={evaluation.stateComplexityAnalysis.rating}
          reasoning={evaluation.stateComplexityAnalysis.reasoning}
          questions={evaluation.stateComplexityAnalysis.questions}
          improvements={evaluation.stateComplexityAnalysis.improvements}
        />
      )}
      {evaluation.requirementsClarityAnalysis && isCompleteCriterion(evaluation.requirementsClarityAnalysis) && (
        <CriterionCard
          title="Requirements Clarity Analysis"
          rating={evaluation.requirementsClarityAnalysis.rating}
          reasoning={evaluation.requirementsClarityAnalysis.reasoning}
          questions={evaluation.requirementsClarityAnalysis.questions}
          improvements={evaluation.requirementsClarityAnalysis.improvements}
        />
      )}
      {evaluation.categoryMaturityAnalysis && isCompleteCriterion(evaluation.categoryMaturityAnalysis) && (
        <CriterionCard
          title="Category Maturity Analysis"
          rating={evaluation.categoryMaturityAnalysis.rating}
          reasoning={evaluation.categoryMaturityAnalysis.reasoning}
          questions={evaluation.categoryMaturityAnalysis.questions}
          improvements={evaluation.categoryMaturityAnalysis.improvements}
        />
      )}
      {evaluation.resourceConsiderationAnalysis && isCompleteCriterion(evaluation.resourceConsiderationAnalysis) && (
        <CriterionCard
          title="Resource Consideration Analysis"
          rating={evaluation.resourceConsiderationAnalysis.rating}
          reasoning={evaluation.resourceConsiderationAnalysis.reasoning}
          questions={evaluation.resourceConsiderationAnalysis.questions}
          improvements={evaluation.resourceConsiderationAnalysis.improvements}
        />
      )}
      {evaluation.llmImpactAnalysis && isCompleteCriterion(evaluation.llmImpactAnalysis) && (
        <CriterionCard
          title="LLM Impact Analysis"
          rating={evaluation.llmImpactAnalysis.rating}
          reasoning={evaluation.llmImpactAnalysis.reasoning}
          questions={evaluation.llmImpactAnalysis.questions}
          improvements={evaluation.llmImpactAnalysis.improvements}
        />
      )}
      {allQuestions.length > 0 && (
        <QuestionResponses 
          questions={allQuestions} 
          onSubmit={onAnswerSubmit} 
        />
      )}
      {evaluation.finalRecommendation && isCompleteRecommendation(evaluation.finalRecommendation) && (
        <FinalRecommendation {...evaluation.finalRecommendation} />
      )}
    </div>
  );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            className="w-full"
            disabled={pending}
        >
            {pending ? 'Generating...' : 'Generate Decision Framework Analysis'}
        </Button>
    );
}

const syntheticData = {
    projectName: "AI-Powered Document Search",
    stateComplexity: "high",
    stateDescription: "Complex distributed system requiring real-time updates, caching layers, and multi-region deployment.",
    requirementsClarity: "evolving",
    mvpDescription: "Basic document search with AI summaries, supporting PDF and Word documents initially.",
    evolutionPath: "Planning to add real-time collaboration, more file types, and advanced AI features.",
    categoryMaturity: "emerging",
    existingSolutions: "Evaluated Elastic, Algolia, and custom solutions. Each has tradeoffs in AI capabilities vs. search performance.",
    teamCapabilities: "Strong backend team with ML experience, previous search implementation experience."
};

export function BuildVsBuyDocGenerator() {
    const { setRightPaneContent } = useRightPane();
    const { object, submit } = useObject({
        api: '/api/build-vs-buy/evaluate-brief',
        schema: briefEvaluation,
    });
    const lastFormDataRef = useRef<any>(null);

    async function handleSubmit(_prevState: any, formData: FormData) {
        const formDataObj = Object.fromEntries(formData);
        lastFormDataRef.current = formDataObj;
        await complete(JSON.stringify(formDataObj));
        return formDataObj;
    }
    const [state, action] = useActionState(handleSubmit, null);

    const onFinish = useCallback((prompt: string, completion: string) => {
        console.log('onFinish', {prompt, completion});
        const formData = lastFormDataRef.current;
        if (formData) {
            submit({
                brief: completion,
                formData: JSON.stringify(formData)
            });
        } else {
            console.error('Form data is null');
        }
    }, [submit]);
    
    const { completion, complete, isLoading } = useCompletion({
        api: '/api/build-vs-buy/generate-brief',
        onFinish,
    });

    const handleAnswerSubmit = async (answers: Record<string, string>) => {
        if (!lastFormDataRef.current) {
            console.error('No form data available');
            return;
        }

        // Combine the original form data with the answers
        const updatedFormData = {
            ...lastFormDataRef.current,
            questionResponses: answers
        };
        lastFormDataRef.current = updatedFormData;
        
        // Trigger a new brief generation with the updated data
        await complete(JSON.stringify(updatedFormData));
    };

    const formRef = useRef<HTMLFormElement>(null);
    const searchParams = useSearchParams();
    const isSuperuser = searchParams.get('user_type') === 'superuser';

    useEffect(() => {
        if (completion) {
            setRightPaneContent(<MemoizedMarkdown content={completion} id="build-vs-buy-doc-generator" />);
        }
    }, [completion, setRightPaneContent]);

   
    const fillSyntheticData = () => {
        if (!formRef.current) return;
        
        // Fill text inputs and textareas
        Object.entries(syntheticData).forEach(([key, value]) => {
            const element = formRef.current?.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement;
            if (element) {
                element.value = value;
            }
        });

        // Fill radio buttons
        ['stateComplexity', 'requirementsClarity', 'categoryMaturity'].forEach(name => {
            const radio = formRef.current?.querySelector(`input[name="${name}"][value="${syntheticData[name as keyof typeof syntheticData]}"]`) as HTMLInputElement;
            if (radio) {
                radio.checked = true;
            }
        });
    };

    return (
        <Card className="p-6 my-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Build vs Buy Decision Framework</h3>
                {isSuperuser && (
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={fillSyntheticData}
                        className="text-sm"
                    >
                        Quick Fill
                    </Button>
                )}
            </div>
            <form ref={formRef} action={action} className="space-y-6">
                <div>
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                        id="projectName"
                        name="projectName"
                        placeholder="e.g., AI-Powered Search Implementation"
                        required
                    />
                </div>

                <Separator />

                <div className="space-y-4">
                    <h4 className="font-semibold">1. State Management Complexity</h4>
                    <RadioGroup name="stateComplexity" defaultValue="medium">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="low" id="state-low" />
                            <Label htmlFor="state-low">Low - Simple state, minimal infrastructure needs</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="state-medium" />
                            <Label htmlFor="state-medium">Medium - Moderate complexity, manageable infrastructure</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="high" id="state-high" />
                            <Label htmlFor="state-high">High - Complex state management, significant infrastructure</Label>
                        </div>
                    </RadioGroup>
                    <Textarea
                        name="stateDescription"
                        placeholder="Describe your state management needs (e.g., data storage, caching, distributed systems requirements...)"
                        className="h-24"
                        required
                    />
                </div>

                <Separator />

                <div className="space-y-4">
                    <h4 className="font-semibold">2. Requirements Clarity & Evolution Path</h4>
                    <RadioGroup name="requirementsClarity" defaultValue="evolving">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="clear" id="req-clear" />
                            <Label htmlFor="req-clear">Clear - Well-defined requirements with minimal expected changes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="evolving" id="req-evolving" />
                            <Label htmlFor="req-evolving">Evolving - Requirements are still being refined</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="unclear" id="req-unclear" />
                            <Label htmlFor="req-unclear">Unclear - Requirements are likely to change significantly</Label>
                        </div>
                    </RadioGroup>
                    <div className="space-y-4">
                        <Textarea
                            name="mvpDescription"
                            placeholder="What's your minimum viable product (MVP)? What are the core features needed for initial release?"
                            className="h-24"
                            required
                        />
                        <Textarea
                            name="evolutionPath"
                            placeholder="How do you see this solution evolving over time? What future capabilities might be needed?"
                            className="h-24"
                            required
                        />
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h4 className="font-semibold">3. Product Category Maturity</h4>
                    <RadioGroup name="categoryMaturity" defaultValue="established">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="emerging" id="cat-emerging" />
                            <Label htmlFor="cat-emerging">Emerging - New technology, rapidly evolving best practices</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="established" id="cat-established" />
                            <Label htmlFor="cat-established">Established - Stable technology with some innovation</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mature" id="cat-mature" />
                            <Label htmlFor="cat-mature">Mature - Well-understood technology, clear best practices</Label>
                        </div>
                    </RadioGroup>
                    <div className="space-y-4">
                        <Textarea
                            name="existingSolutions"
                            placeholder="What existing solutions have you evaluated? What are their strengths and limitations?"
                            className="h-24"
                            required
                        />
                        <Textarea
                            name="teamCapabilities"
                            placeholder="What relevant capabilities does your team have? Any experience with similar projects?"
                            className="h-24"
                            required
                        />
                    </div>
                </div>

                <SubmitButton />
            </form>
            {object && <EvaluationResults 
                evaluation={object as z.infer<typeof briefEvaluation>} 
                onAnswerSubmit={handleAnswerSubmit}
            />}
        </Card>
    );
} 