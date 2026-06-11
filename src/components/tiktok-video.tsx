'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    tiktokEmbed?: {
      lib?: {
        render?: (nodes: Element[]) => void;
      };
    };
  }
}

interface TikTokVideoProps {
  username: string;
  videoId: string;
}

/**
 * Standard TikTok blockquote embed. embed.js scans the page once when it
 * loads, so on client-side navigation (script already loaded, blockquote
 * freshly mounted) we re-trigger the render manually via window.tiktokEmbed.
 */
export function TikTokVideo({ username, videoId }: TikTokVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const renderEmbed = () => {
    const node = containerRef.current?.querySelector('blockquote.tiktok-embed');
    if (node && window.tiktokEmbed?.lib?.render) {
      window.tiktokEmbed.lib.render([node]);
    }
  };

  useEffect(() => {
    renderEmbed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, videoId]);

  return (
    <div ref={containerRef}>
      <blockquote
        className="tiktok-embed"
        cite={`https://www.tiktok.com/@${username}/video/${videoId}`}
        data-video-id={videoId}
        style={{ maxWidth: 605, minWidth: 325 }}
      >
        <section>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.tiktok.com/@${username}`}
          >
            @{username}
          </a>
        </section>
      </blockquote>
      <Script
        src="https://www.tiktok.com/embed.js"
        strategy="lazyOnload"
        onReady={renderEmbed}
      />
    </div>
  );
}
