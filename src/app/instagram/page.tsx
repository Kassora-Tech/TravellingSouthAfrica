"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Instagram, ImageIcon, Film, Calendar, ArrowRight } from 'lucide-react';
import { Translatable } from '@/components/translatable';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { InstagramPost } from '@/app/api/instagram/route';

function formatDate(timestamp: string) {
  return new Date(timestamp).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function truncateCaption(caption: string | undefined, maxLength = 120) {
  if (!caption) return null;
  if (caption.length <= maxLength) return caption;
  return caption.slice(0, maxLength).trimEnd() + '…';
}

function PostSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="h-56 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="h-5 bg-muted rounded w-full" />
        <div className="h-5 bg-muted rounded w-2/3" />
        <div className="h-4 bg-muted rounded w-1/4 mt-4" />
      </div>
    </Card>
  );
}

function PostCard({ post }: { post: InstagramPost }) {
  const imageUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
  const caption = truncateCaption(post.caption);

  const mediaLabel =
    post.media_type === 'VIDEO'
      ? 'Video'
      : post.media_type === 'CAROUSEL_ALBUM'
      ? 'Gallery'
      : 'Photo';

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      {/* Image */}
      <Link
        href={post.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block h-56 w-full overflow-hidden bg-muted flex-shrink-0"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.caption ?? 'Instagram post'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            {post.media_type === 'VIDEO' ? (
              <Film className="h-3 w-3" />
            ) : (
              <ImageIcon className="h-3 w-3" />
            )}
            {mediaLabel}
          </Badge>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {post.timestamp && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.timestamp)}
          </p>
        )}

        <p className="flex-1 text-sm text-foreground leading-relaxed">
          {caption ? (
            caption
          ) : (
            <span className="italic text-muted-foreground">No caption</span>
          )}
        </p>

        <Link
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          View on Instagram
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </Card>
  );
}

export default function InstagramBlogPage() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/instagram')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPosts(data.data ?? []);
        }
      })
      .catch(() => setError('Could not load Instagram posts.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section
        className="relative bg-cover bg-center py-20 text-white"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/bj4CV8rW/578251416429199326767899.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Instagram className="h-7 w-7 text-white/80" />
            <h1 className="text-4xl font-bold font-headline md:text-5xl">
              <Translatable text="Our Blog" />
            </h1>
          </div>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-200">
            <Translatable text="Follow along as we explore the beauty of South Africa — landscapes, wildlife, culture, and hidden gems." />
          </p>
          <Link
            href="https://instagram.com/travellingsouthafrica.co.za"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
          >
            <Instagram className="h-4 w-4" />
            <span>@travellingsouthafrica.co.za</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 9 }).map((_, i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Instagram className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                <Translatable text="Blog posts unavailable right now." />
              </p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Instagram className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                <Translatable text="No posts to display yet." />
              </p>
            </div>
          )}

          {!loading && posts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
