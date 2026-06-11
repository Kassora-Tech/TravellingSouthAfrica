import { NextResponse } from 'next/server';
import { TIKTOK_VIDEO_URLS } from '@/lib/tiktok-videos';

// To add or remove videos, edit src/lib/tiktok-videos.ts.
// That file is committed to git, so the list reaches Vercel — unlike .env.

export interface TikTokPost {
  id: string;       // numeric video ID used to build the embed
  username: string; // account handle, without the leading @
  videoUrl: string; // original share URL, used as the permalink
}

export async function GET() {
  // Deduplicate by post ID, and support both /video/ and /photo/ URL formats.
  const seen = new Set<string>();

  const posts: TikTokPost[] = TIKTOK_VIDEO_URLS
    .map((u) => u.trim())
    .filter(Boolean)
    .map((rawUrl) => {
      // Strip tracking query params — keep only the clean share URL.
      const cleanUrl = rawUrl.split('?')[0];
      const match = cleanUrl.match(/@([^/]+)\/(video|photo)\/(\d+)/);
      if (!match) return null;
      const [, username, , id] = match;
      if (seen.has(id)) return null;
      seen.add(id);
      return { id, username, videoUrl: cleanUrl };
    })
    .filter((p): p is TikTokPost => p !== null);

  return NextResponse.json({ data: posts });
}
