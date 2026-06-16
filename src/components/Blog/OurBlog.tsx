'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ImageIcon, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Translatable } from '@/components/translatable';
import { getPublishedBlogPosts } from '@/services/blogService';

interface BlogPost {
  id: string;
  title: string;
  caption: string;
  content: string;
  author: string;
  imageUrl: string;
  date?: { seconds: number };
  published: boolean;
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

function formatDate(timestamp: { seconds: number }) {
  return new Date(timestamp.seconds * 1000).toLocaleDateString('en-ZA', {
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

interface PostCardProps {
  post: BlogPost;
  onPreview: (post: BlogPost) => void;
}

function PostCard({ post, onPreview }: PostCardProps) {
  const caption = truncateCaption(post.caption);

  return (
    <Card
      className="group overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col h-full cursor-pointer"
      onClick={() => onPreview(post)}
    >
      {/* Image */}
      <div className="relative block h-56 w-full overflow-hidden bg-muted flex-shrink-0">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
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
            Article
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {post.date && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.date)}
          </p>
        )}

        <h3 className="text-base font-semibold line-clamp-2 mb-2">{post.title}</h3>

        <p className="flex-1 text-sm text-foreground leading-relaxed">
          {caption ? (
            caption
          ) : (
            <span className="italic text-muted-foreground">No caption</span>
          )}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(post);
            }}
          >
            <ChevronDown className="h-4 w-4 mr-1" />
            Read More
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function OurBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [expandedContent, setExpandedContent] = useState(false);

  useEffect(() => {
    fetchPublishedPosts();
  }, []);

  const fetchPublishedPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const publishedPosts = await getPublishedBlogPosts();
      setPosts(publishedPosts);
    } catch (err: any) {
      console.error('Error fetching published blog posts:', err);
      setError('Could not load blog posts.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-lg">
          <Translatable text="Blog posts unavailable right now." />
        </p>
        <p className="text-sm text-muted-foreground mt-1">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-lg">
          <Translatable text="No blog posts published yet." />
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onPreview={setSelectedPost} />
        ))}
      </div>

      {selectedPost && (
        <Dialog open onOpenChange={(open) => !open && (setSelectedPost(null), setExpandedContent(false))}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPost.title}</DialogTitle>
              <DialogDescription>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {selectedPost.date ? formatDate(selectedPost.date) : 'Date unknown'} • By {selectedPost.author}
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6">
              {/* Featured Image */}
              <div className="relative h-80 overflow-hidden rounded-lg bg-muted">
                {selectedPost.imageUrl ? (
                  <Image
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Caption */}
                {selectedPost.caption && (
                  <p className="text-sm font-semibold text-foreground italic">{selectedPost.caption}</p>
                )}

                {/* Full Content */}
                <div className="space-y-3 text-sm leading-relaxed text-foreground">
                  {expandedContent ? (
                    <p className="whitespace-pre-wrap">{selectedPost.content}</p>
                  ) : (
                    <p className="line-clamp-3 whitespace-pre-wrap">{selectedPost.content}</p>
                  )}
                </div>

                {/* Expand/Collapse Button */}
                {selectedPost.content && selectedPost.content.length > 300 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedContent(!expandedContent)}
                    className="w-full"
                  >
                    {expandedContent ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Show More
                      </>
                    )}
                  </Button>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Badge variant="secondary">Article</Badge>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
