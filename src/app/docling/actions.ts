'use server';

import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export interface ProcessingResult {
  runId: string;
  document_url?: string;
}

export async function processDocument(url: string): Promise<ProcessingResult> {
  const prediction = await replicate.deployments.predictions.create(
    'collinc777',
    'first-deployment',
    {
      input: {
        file: url,
        output_type: 'html',
      },
    }
  );

  return {
    runId: prediction.id,
    document_url: prediction.output ? String(prediction.output) : undefined,
  };
}

export async function pollDocumentStatus(runId: string): Promise<ProcessingResult> {
  const prediction = await replicate.predictions.get(runId);

  if (prediction.status === 'succeeded') {
    return {
      runId,
      document_url: String(prediction.output),
    };
  }

  if (prediction.status === 'failed') {
    throw new Error(prediction.error ? String(prediction.error) : 'Processing failed');
  }

  // Still processing
  return { runId };
}
