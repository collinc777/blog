'use client';

import React, { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { ExternalLink, Loader2 } from 'lucide-react';
import { pollDocumentStatus, processDocument, ProcessingResult } from './actions';

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        'Process Document'
      )}
    </Button>
  );
}

export default function DoclingPage() {
  const { toast } = useToast();

  const [state, formAction, pending] = useActionState<ProcessingResult | null, FormData>(
    async (prevState, formData) => {
      const url = formData.get('url') as string;

      const result = await processDocument(url);

      if (!result.document_url) {
        return new Promise((resolve, reject) => {
          const intervalId = setInterval(async () => {
            try {
              const pollResult = await pollDocumentStatus(result.runId);

              if (pollResult.document_url) {
                clearInterval(intervalId);
                toast({
                  title: 'Success!',
                  description: 'Document processed successfully',
                });
                resolve(pollResult);
              }
            } catch (error) {
              clearInterval(intervalId);
              toast({
                title: 'Error',
                description: 'Failed to poll document status',
                variant: 'destructive',
              });
              reject(error);
            }
          }, 2000);

          // Cleanup interval after 5 minutes
          setTimeout(
            () => {
              clearInterval(intervalId);
              toast({
                title: 'Timeout',
                description: 'Document processing timed out',
                variant: 'destructive',
              });
              resolve(prevState); // Keep the previous state on timeout
            },
            5 * 60 * 1000
          );
        });
      }

      return result;
    },
    null
  );

  return (
    <div className="container py-8 px-2">
      <h1 className="text-4xl font-bold mb-4">Docling Document Processor</h1>
      <p className="text-muted-foreground mb-8">Process documents from publicly accessible URLs</p>

      <Card className="p-6">
        <form action={formAction} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="url-input" className="block text-sm font-medium mb-2">
                Document URL
              </label>
              <Input
                id="url-input"
                name="url"
                type="url"
                placeholder="https://example.com/document.pdf"
                required
                pattern="https?://.*"
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Enter a publicly accessible URL to a supported document (PDF, DOCX, PPTX, XLSX,
                Images, HTML, Markdown)
              </p>
            </div>
          </div>

          <SubmitButton pending={pending} />
        </form>

        {(pending || state?.document_url) && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold">Processing Result</h2>
            <div className="rounded-lg border bg-card p-4">
              {pending ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing document...
                </div>
              ) : state?.document_url ? (
                <div className="space-y-4">
                  <a
                    href={state.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View in New Tab
                  </a>

                  <div className="border rounded-lg overflow-hidden bg-white">
                    <iframe
                      src={state.document_url}
                      className="w-full h-[600px]"
                      title="Processed Document"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
