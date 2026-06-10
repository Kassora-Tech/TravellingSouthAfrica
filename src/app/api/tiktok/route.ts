import { NextResponse } from 'next/server';

// ─── How to set up TikTok API access ─────────────────────────────────────────
//
// 1. Go to https://developers.tiktok.com and create an account / app.
// 2. Under "Products", enable "Login Kit" and "Content Posting API".
//    You only need READ scope (video.list) — not write.
// 3. Add your site domain as a redirect URI, e.g. https://yoursite.com/api/tiktok/callback
// 4. Note your Client Key and Client Secret.
// 5. Do the OAuth flow once (see TikTok docs) to get an access_token + refresh_token.
//    Scopes needed: video.list
// 6. Paste the four values into your .env:
//      TIKTOK_CLIENT_KEY=...
//      TIKTOK_CLIENT_SECRET=...
//      TIKTOK_ACCESS_TOKEN=...
//      TIKTOK_REFRESH_TOKEN=...
//
// The route auto-refreshes the access token when it expires (every 24 h).
// The refresh token is valid for 365 days — repeat step 5 once a year.
// ─────────────────────────────────────────────────────────────────────────────

export interface TikTokPost {
  id: string;
  title: string;
  cover_image_url: string;
  share_url: string;
  create_time: number; // Unix timestamp (seconds)
}

const TIKTOK_API = 'https://open.tiktokapis.com/v2';
const VIDEO_FIELDS = 'id,title,video_description,cover_image_url,share_url,create_time';

// ── Token refresh ─────────────────────────────────────────────────────────────

async function refreshAccessToken(): Promise<string | null> {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const refreshToken = process.env.TIKTOK_REFRESH_TOKEN;

  if (!clientKey || !clientSecret || !refreshToken) return null;

  const res = await fetch(`${TIKTOK_API}/oauth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  // data.access_token is the new token — in production you'd persist this.
  // For now we just use it for this request.
  return data.access_token ?? null;
}

// ── Video list fetch ──────────────────────────────────────────────────────────

async function fetchVideos(accessToken: string): Promise<TikTokPost[] | null> {
  const res = await fetch(`${TIKTOK_API}/video/list/?fields=${VIDEO_FIELDS}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ max_count: 20 }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;

  const json = await res.json();
  return json?.data?.videos ?? null;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET() {
  let accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'TikTok credentials not configured.' },
      { status: 500 },
    );
  }

  // Try with the current token first.
  let videos = await fetchVideos(accessToken);

  // If that failed, attempt a token refresh and retry once.
  if (!videos) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      videos = await fetchVideos(newToken);
    }
  }

  if (!videos) {
    return NextResponse.json(
      { error: 'Failed to fetch TikTok posts.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ data: videos });
}
