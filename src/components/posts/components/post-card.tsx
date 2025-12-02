import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Heart, MessageCircle, Calendar, User, Pin, Flame, ArrowRight } from 'lucide-react';
import { WebsitePost } from '@/lib/types/posts';
import { cn } from '@/lib/utils';
import imageLinkGenerate from '@/lib/helpers/imageLinkGenerate';

interface PostCardProps {
  post: WebsitePost;
  className?: string;
}

const getPostTypeColor = (type: string) => {
  switch (type) {
    case 'news':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'announcement':
      return 'bg-red-500/10 text-red-600 border-red-500/20';
    case 'blog':
      return 'bg-green-500/10 text-green-600 border-green-500/20';
    case 'update':
      return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  }
};

const getPostTypeLabel = (type: string) => {
  switch (type) {
    case 'news':
      return 'Haber';
    case 'announcement':
      return 'Duyuru';
    case 'blog':
      return 'Blog';
    case 'update':
      return 'Güncelleme';
    default:
      return type;
  }
};

export default function PostCard({ post, className }: PostCardProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Link href={`/posts/${post.slug}`} className="block h-full">
      <Card className={cn(
        "group h-full flex flex-col overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-300",
        className
      )}>
        {/* Image Section */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          {post.featuredImage ? (
            <img
              src={imageLinkGenerate(post.featuredImage)}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted">
              <span className="text-4xl font-black text-muted-foreground/20">VOID</span>
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            <Badge variant="outline" className={cn("backdrop-blur-md border shadow-sm", getPostTypeColor(post.type))}>
              {getPostTypeLabel(post.type)}
            </Badge>
            {post.isPinned && (
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-200 border-yellow-500/30 backdrop-blur-md">
                <Pin className="w-3 h-3 mr-1" />
                Sabit
              </Badge>
            )}
            {post.isHot && (
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-200 border-orange-500/30 backdrop-blur-md">
                <Flame className="w-3 h-3 mr-1" />
                Popüler
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="flex-1 p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{post.author?.username || 'Yönetici'}</span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
            
            {post.metaDescription && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.metaDescription}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 mt-auto border-t border-border/50 bg-muted/5">
          <div className="w-full flex items-center justify-between pt-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{post.viewCount || 0}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4" />
                <span>{post.likeCount || 0}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              Devamını Oku
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
