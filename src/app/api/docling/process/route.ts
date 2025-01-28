import { NextResponse } from 'next/server';
export const maxDuration = 60;

const DOCLING_API_URL = 'https://api.cortex.cerebrium.ai/v4/p-db1accac/docling-api/run';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(DOCLING_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0SWQiOiJwLWRiMWFjY2FjIiwiaWF0IjoxNzM3Njc1NTczLCJleHAiOjIwNTMyNTE1NzN9.fU6-5q1c071f2Jew8dM152lF5_PvwR9-36jetlmjuCGFjct3ZeeMQgIZqFCxlibgmUgxMImo50JqeqoILsMM5jzHD9kzVVTtIqQLLkxJH3rkETvoeReXQDkdqWofajsLXTGChnuSewiyzSa23NY74hjb1sr-m4ZDZtAnx3dzi3LMlVfHYO_93Qpsgw42STBpFidMSnjftS2iyMiUuC_FFGBKRpAXvsM1potp29hwJaa7HYg3iKFSdDswH5-Wt1N_faql1tFzqRs0WqcYi3UT-xozROUT5rGEyekuy4C6lxEkcgEW_51o9Vdn93V_mj78ljfsb_PyYzTlAc1Wu_9Orw',
      },
      body: JSON.stringify({ output_type: 'html', org_id: '7794' }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: error || 'Failed to process document' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ result: data.result });
  } catch (error) {
    console.error('Error processing document:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
