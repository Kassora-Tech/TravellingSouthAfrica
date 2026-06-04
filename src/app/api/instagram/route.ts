import { NextResponse } from 'next/server';

export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

const GRAPH_API_VERSION = 'v21.0';

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igAccountId = process.env.INSTAGRAM_ACCOUNT_ID;

  if (!accessToken || !igAccountId) {
    return NextResponse.json(
      { error: 'Instagram credentials not configured.' },
      { status: 500 }
    );
  }

  try {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${igAccountId}/media?fields=${fields}&limit=24&access_token=${accessToken}`;

    const res = await fetch(url, { next: { revalidate: 3600 } }); // cache for 1 hour

    if (!res.ok) {
      const error = await res.json();
      console.error('Instagram API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch Instagram posts.' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Instagram fetch error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
