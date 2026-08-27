'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

/** Neutral local placeholder — never depends on Firebase Storage or an external CDN. */
export const IMAGE_FALLBACK_SRC = '/Images/placeholder.png';

type ImageWithFallbackProps = Omit<ImageProps, 'src' | 'onError'> & {
  src?: string | null;
  fallbackSrc?: string;
};

/**
 * next/image that swaps in a neutral placeholder when the source is missing or
 * fails to load, so a broken remote image never falls back to rendering its raw
 * alt text over the card. The alt text is still passed through for screen readers.
 */
export function ImageWithFallback({
  src,
  fallbackSrc = IMAGE_FALLBACK_SRC,
  alt,
  ...props
}: ImageWithFallbackProps) {
  // Track the src that failed rather than a boolean, so a later src change retries.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const useFallback = !src || failedSrc === src;
  const resolvedSrc = useFallback ? fallbackSrc : src;

  return (
    <Image
      // Remount on src change so onError fires again for a new source.
      key={resolvedSrc}
      src={resolvedSrc}
      alt={alt}
      onError={() => {
        if (src) setFailedSrc(src);
      }}
      {...props}
    />
  );
}
