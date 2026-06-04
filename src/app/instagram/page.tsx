"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Heart, Instagram, ImageIcon, Film } from 'lucide-react';
import { Translatable } from '@/components/translatable';
import type { InstagramPost } from '@/app/api/instagram/route';

function PostSkeleton() {
  return (
    <div className="aspect-square bg-muted animate-pulse rounded-md" />
  );
}

function PostCard({ post }: { post: InstagramPost }) {
  const imageUrl =
    post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;

  return (
    <Link
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-square overflow-hidden rounded-md bg-muted block"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={post.caption ?? 'Instagram post'}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <ImageIcon className="h-10 w-10 text-muted-foreground" />
        </div>
      )}

      {/* Media type badge */}
      {post.media_type === 'VIDEO' && (
        <div className="absolute top-2 right-2 rounded-full bg-black/60 p-1">
          <Film className="h-3.5 w-3.5 text-white" />
        </div>
      )}
      {post.media_type === 'CAROUSEL_ALBUM' && (
        <div className="absolute top-2 right-2 rounded-full bg-black/60 p-1">
          <ImageIcon className="h-3.5 w-3.5 text-white" />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex items-center gap-2 text-white">
          <ExternalLink className="h-5 w-5" />
          <span className="text-sm font-medium">View on Instagram</span>
        </div>
      </div>
    </Link>
  );
}

export default function InstagramPage() {
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
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mb-3 flex items-center justify-center gap-2 text-primary">
          <Instagram className="h-7 w-7" />
          <h1 className="text-4xl font-bold font-headline">
            <Translatable text="Our Instagram" />
          </h1>
        </div>
        <p className="text-muted-foreground max-w-xl mx-auto">
          <Translatable text="Follow along as we explore the beauty of South Africa — landscapes, wildlife, culture, and hidden gems." />
        </p>
        <Link
          href="https://instagram.com/travellingsouthafrica.co.za"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <Instagram className="h-4 w-4" />
          <span>@travellingsouthafrica.co.za</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Grid */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Instagram className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">
            <Translatable text="Instagram posts unavailable right now." />
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
