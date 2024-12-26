'use client';
import { useCompletion } from 'ai/react';
import { experimental_useObject as useObject } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
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
    const [formData, setFormData] = useState<FormData | null>(null);
    const { object, submit } = useObject({
        api: '/api/build-vs-buy/evaluate-brief',
        schema: briefEvaluation,
    });
    const { completion, complete, isLoading } = useCompletion({
        api: '/api/build-vs-buy/generate-brief',
        onFinish(prompt, completion) {
            console.log('onFinish', {prompt, completion});
            if (formData) {
                const formDataObj = Object.fromEntries(formData);
                submit({
                    brief: completion,
                    formData: JSON.stringify(formDataObj)
                });
            } else {
                console.error('Form data is null');
            }
        },
    });

    const formRef = useRef<HTMLFormElement>(null);
    const searchParams = useSearchParams();
    const isSuperuser = searchParams.get('user_type') === 'superuser';

    useEffect(() => {
        if (completion) {
            setRightPaneContent(<MemoizedMarkdown content={completion} id="build-vs-buy-doc-generator" />);
        }
    }, [completion, setRightPaneContent]);

    async function handleSubmit(formData: FormData) {
        const clonedFormData = new FormData(formRef.current!);
        setFormData(clonedFormData);
        await complete(JSON.stringify(Object.fromEntries(formData)));
    }

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
            <form ref={formRef} action={handleSubmit} className="space-y-6">
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
            {object && <div>{JSON.stringify(object)}</div>}
            
        </Card>
    );
} 