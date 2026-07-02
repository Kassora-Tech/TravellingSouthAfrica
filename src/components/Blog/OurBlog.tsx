'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ImageIcon, Calendar, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
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
    <Card className="overflow-hidden animate-pulse flex flex-col">
      <div className="h-44 bg-muted" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-2/3" />
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

function truncateCaption(caption: string | undefined, maxLength = 100) {
  if (!caption) return null;
  if (caption.length <= maxLength) return caption;
  return caption.slice(0, maxLength).trimEnd() + '…';
}

// Renders plain text as React nodes, turning Markdown-style [label](url) links
// and bare https:// URLs into clickable <a> tags. Avoids dangerouslySetInnerHTML.
function renderContentWithLinks(text: string | undefined): React.ReactNode {
  if (!text) return null;

  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<]+)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    let matchEnd = match.index + match[0].length;
    let url = match[2];
    let label = match[1];

    if (!url && match[3]) {
      // Bare URL — trim trailing punctuation that's likely part of the sentence, not the link.
      const trimmed = match[3].replace(/[.,!?;:'")\]]+$/, '');
      matchEnd = match.index + trimmed.length;
      url = trimmed;
      label = trimmed;
    }

    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    nodes.push(
      <a
        key={`link-${key++}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:text-primary/80"
        onClick={(e) => e.stopPropagation()}
      >
        {label}
      </a>
    );

    lastIndex = matchEnd;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

interface PostCardProps {
  post: BlogPost;
  onPreview: (post: BlogPost) => void;
}

function PostCard({ post, onPreview }: PostCardProps) {
  const caption = truncateCaption(post.caption);

  return (
    <Card
      className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 flex flex-col h-full cursor-pointer border border-border/60"
      onClick={() => onPreview(post)}
    >
      {/* Image — reduced height for better proportions */}
      <div className="relative h-44 w-full overflow-hidden bg-muted flex-shrink-0">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        {/* Subtle gradient only at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-2.5 left-2.5">
          <Badge variant="secondary" className="text-[11px] px-2 py-0.5 font-medium">
            Article
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Date */}
        {post.date && (
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(post.date)}
          </p>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground">
          {post.title}
        </h3>

        {/* Caption */}
        <p className="flex-1 text-xs text-muted-foreground leading-relaxed">
          {caption ?? <span className="italic">No caption</span>}
        </p>

        {/* Read More */}
        <div className="pt-2 border-t border-border/50 mt-1">
          <button
            type="button"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(post);
            }}
          >
            Read article
            <ChevronDown className="h-3 w-3" />
          </button>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ImageIcon className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">
          <Translatable text="Blog posts unavailable right now." />
        </p>
        <p className="text-xs text-muted-foreground mt-1">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ImageIcon className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">
          <Translatable text="No blog posts published yet." />
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onPreview={setSelectedPost} />
        ))}
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) {
              setSelectedPost(null);
              setExpandedContent(false);
            }
          }}
        >
          <DialogContent className="max-w-2xl w-full max-h-[85vh] overflow-y-auto p-0 gap-0 rounded-xl">
            {/* Required for screen reader accessibility */}
            <VisuallyHidden>
              <DialogTitle>{selectedPost.title}</DialogTitle>
            </VisuallyHidden>

            {/* Modal Image — shorter, sits at the top flush */}
            <div className="relative h-52 w-full overflow-hidden rounded-t-xl bg-muted flex-shrink-0">
              {selectedPost.imageUrl ? (
                <Image
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 576px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Title overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <Badge variant="secondary" className="text-[11px] mb-2">Article</Badge>
                <h2 className="text-white font-bold text-lg leading-tight drop-shadow-sm">
                  {selectedPost.title}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {selectedPost.date ? formatDate(selectedPost.date) : 'Date unknown'}
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {selectedPost.author}
                </span>
              </div>

              {/* Caption */}
              {selectedPost.caption && (
                <p className="text-base font-medium text-foreground italic border-l-2 border-primary pl-3">
                  {selectedPost.caption}
                </p>
              )}

              {/* Content */}
              <div className="text-lg leading-loose text-foreground">
                {expandedContent ? (
                  <p className="whitespace-pre-wrap">{renderContentWithLinks(selectedPost.content)}</p>
                ) : (
                  <p className="line-clamp-5 whitespace-pre-wrap">{renderContentWithLinks(selectedPost.content)}</p>
                )}
              </div>

              {/* Show More / Less */}
              {selectedPost.content && selectedPost.content.length > 300 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedContent(!expandedContent)}
                  className="w-full text-xs text-muted-foreground hover:text-foreground"
                >
                  {expandedContent ? (
                    <><ChevronUp className="h-3.5 w-3.5 mr-1" />Show less</>
                  ) : (
                    <><ChevronDown className="h-3.5 w-3.5 mr-1" />Show full article</>
                  )}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}