import { NextResponse } from 'next/server';

// ─── How to add your TikTok videos ───────────────────────────────────────────
//
// 1. Open TikTok and go to your profile (@travellingsouthaf).
// 2. Tap a video → Share → Copy link.
//    The link looks like: https://www.tiktok.com/@travellingsouthaf/video/7123456789012345678
// 3. Add the links to .env as a comma-separated list:
//
//    TIKTOK_VIDEO_URLS=https://www.tiktok.com/@travellingsouthaf/video/ID1,https://...
//
// Videos appear in the blog feed as native TikTok embeds, exactly as they look on TikTok.
// ─────────────────────────────────────────────────────────────────────────────

export interface TikTokPost {
  id: string;      // numeric video ID used to build the embed iframe URL
  videoUrl: string; // original share URL, used as the permalink
}

export async function GET() {
  const rawUrls = process.env.TIKTOK_VIDEO_URLS ?? '';

  // Deduplicate by post ID, and support both /video/ and /photo/ URL formats.
  const seen = new Set<string>();

  const posts: TikTokPost[] = rawUrls
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean)
    .map((rawUrl) => {
      // Strip tracking query params — keep only the clean share URL.
      const cleanUrl = rawUrl.split('?')[0];
      const match = cleanUrl.match(/\/(video|photo)\/(\d+)/);
      if (!match) return null;
      const id = match[2];
      if (seen.has(id)) return null;
      seen.add(id);
      return { id, videoUrl: cleanUrl };
    })
    .filter((p): p is TikTokPost => p !== null);

  return NextResponse.json({ data: posts });
}
