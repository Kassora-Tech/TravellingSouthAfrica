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
const BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

async function resolveIgAccountId(accessToken: string, envIgId: string): Promise<string> {
  // Try the env-supplied ID directly first via the Instagram Graph API endpoint.
  // For Business accounts the token must be a Page token or the IG account must
  // be reachable through one of the user's Pages.
  const pageRes = await fetch(
    `${BASE}/me/accounts?fields=instagram_business_account&access_token=${accessToken}`
  );
  if (!pageRes.ok) return envIgId;

  const pageData = await pageRes.json();
  const pages: Array<{ instagram_business_account?: { id: string } }> = pageData.data ?? [];

  // Return the first matching IG account id, or fall back to the env value.
  for (const page of pages) {
    if (page.instagram_business_account?.id) {
      return page.instagram_business_account.id;
    }
  }
  return envIgId;
}

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const envIgId = process.env.INSTAGRAM_ACCOUNT_ID;

  if (!accessToken || !envIgId) {
    return NextResponse.json(
      { error: 'Instagram credentials not configured.' },
      { status: 500 }
    );
  }

  try {
    // Resolve the correct IG account ID reachable by this token.
    const igAccountId = await resolveIgAccountId(accessToken, envIgId);

    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const url = `${BASE}/${igAccountId}/media?fields=${fields}&limit=24&access_token=${accessToken}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      const error = await res.json();
      console.error('Instagram API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch Instagram posts.', detail: error },
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
