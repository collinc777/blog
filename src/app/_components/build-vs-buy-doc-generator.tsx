'use client';
import { useCompletion, experimental_useObject as useObject } from 'ai/react';


import { useActionState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

const initialState = {};

function SubmitButton() {

    return (
        <Button
            type="submit"
            className="w-full"
        >
            Generate Decision Framework Analysis'
        </Button>
    );
}

export function BuildVsBuyDocGenerator() {
    const { completion, complete, isLoading } = useCompletion({
        api: '/api/build-vs-buy/generate-brief',
    });

    async function handleSubmit(state: any, formData: FormData) {
        const result = await complete(JSON.stringify(Object.fromEntries(formData)));
        return state;
    }

    const [state, formAction] = useActionState(handleSubmit, {});

    return (
        <Card className="p-6 my-8">
            <h3 className="text-xl font-bold mb-4">Build vs Buy Decision Framework</h3>
            <form action={formAction} className="space-y-6">
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

                {completion && (
                    <div className="text-sm">
                        <div>{completion}</div>
                    </div>
                )}
                <SubmitButton />
            </form>
        </Card>
    );
} 