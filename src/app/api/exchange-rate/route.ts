import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');

  if (!from) {
    return NextResponse.json({ error: 'Missing "from" currency parameter' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=ZAR`, {
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Frankfurter API responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Exchange rate fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch exchange rates' }, { status: 500 });
  }
}
