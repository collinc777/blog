'use client';

import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { ExternalLink } from 'lucide-react';

interface ProcessingResult {
  document_url: string;
}

export default function DoclingPage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const { toast } = useToast();

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setResult(null);
  };

  const isValidUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      toast({
        title: 'No URL provided',
        description: 'Please enter a URL to process',
        variant: 'destructive',
      });
      return;
    }

    if (!isValidUrl(url)) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid HTTP or HTTPS URL',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/docling/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const { result } = await response.json();
      setResult(result);

      toast({
        title: 'Success!',
        description: 'Document processed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process document',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-4xl font-bold mb-4">Docling Document Processor</h1>
      <p className="text-muted-foreground mb-8">Process documents from publicly accessible URLs</p>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="url-input" className="block text-sm font-medium mb-2">
                Document URL
              </label>
              <Input
                id="url-input"
                type="url"
                placeholder="https://example.com/document.pdf"
                value={url}
                onChange={handleUrlChange}
                disabled={isLoading}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Enter a publicly accessible URL to a supported document (PDF, DOCX, PPTX, XLSX,
                Images, HTML, Markdown)
              </p>
            </div>
          </div>

          <Button type="submit" disabled={!url || isLoading} className="w-full">
            {isLoading ? 'Processing...' : 'Process Document'}
          </Button>
        </form>

        {result && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold">Processing Result</h2>
            <div className="rounded-lg border bg-card p-4">
              <a
                href={result.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                View Processed Document
              </a>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
