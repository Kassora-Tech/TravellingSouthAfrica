import { NextResponse } from 'next/server';

export interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  full_picture?: string;
  permalink_url: string;
  created_time: string;
  attachments?: {
    data: Array<{
      media?: { image?: { src: string } };
      type: string;
    }>;
  };
}

const GRAPH_API_VERSION = 'v21.0';
const BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;
const PAGE_ID = process.env.FACEBOOK_PAGE_ID;

export async function GET() {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Facebook credentials not configured.' },
      { status: 500 },
    );
  }

  try {
    const fields = 'id,message,story,full_picture,permalink_url,created_time,attachments{media,type}';
    const url = `${BASE}/${PAGE_ID}/posts?fields=${fields}&limit=24&access_token=${accessToken}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      const error = await res.json();
      console.error('Facebook API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch Facebook posts.', detail: error },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Facebook fetch error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 },
    );
  }
}
