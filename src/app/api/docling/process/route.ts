import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export const maxDuration = 300; // Increased timeout for Replicate

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Run the prediction
    const output = await replicate.run(
      'collinc777/docling:a4a056c2e9aa73db39eeee4e13e7913528e9180b672a2d128646439ce8c0903e',
      {
        input: {
          file: url,
          output_type: 'html',
        },
        wait: {
          mode: 'poll',
          interval: 1000,
        },
      }
    );

    return NextResponse.json({
      result: {
        document_url: String(output),
      },
    });
  } catch (error) {
    console.error('Error processing document:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
