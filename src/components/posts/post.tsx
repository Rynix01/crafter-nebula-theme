"use client";

import React, { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Heart,
  Pin,
  Flame,
  Share2,
  Loader2,
  Clock,
  Tag
} from "lucide-react";
import { postsService } from "@/lib/api/services/postsService";
import { WebsitePost } from "@/lib/types/posts";
import { cn } from "@/lib/utils";
import LexicalViewer from "@/lib/helpers/lexicalViewer";
import { AuthContext } from "@/lib/context/AuthContext";
import imageLinkGenerate from "@/lib/helpers/imageLinkGenerate";
import { DefaultBreadcrumb } from "@/components/ui/breadcrumb";

export default function Post() {
  const postsServiceInstance = postsService();
  const params = useParams();
  const postSlug = params?.post_slug as string;
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState<WebsitePost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false); 
  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);

  useEffect(() => {
    if (postSlug) {
      fetchPost();
    }
  }, [postSlug]);

  const likePost = async () => {
    try {
      const response = await postsServiceInstance.likePost(post?.id || "");
      setLikeCount(response.data.likeCount);
      setIsLiked(true);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const unlikePost = async () => {
    try {
      const response = await postsServiceInstance.unlikePost(post?.id || "");
      setLikeCount(response.data.likeCount);
      setIsLiked(false);
    } catch (err) {
      console.error("Error unliking post:", err);
    }
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);

      const foundPost = await postsServiceInstance.getPostBySlug(postSlug);

      if (foundPost) {
        setPost(foundPost);
        setLikeCount(foundPost.likeCount);
        setIsLiked(foundPost.likedBy?.includes(user?.id || "") || false);
      } else {
        setError("Post bulunamadı.");
      }
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Post yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    if (isLiked) {
      unlikePost();
    } else {
      likePost();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.metaDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "news":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "announcement":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "blog":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "update":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case "news":
        return "Haber";
      case "announcement":
        return "Duyuru";
      case "blog":
        return "Blog";
      case "update":
        return "Güncelleme";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error || "Post bulunamadı."}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/posts">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Gönderilere Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section with Background Image */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-2xl shadow-primary/5 min-h-[400px] flex items-end">
        {/* Background Image */}
        {post.featuredImage ? (
          <>
            <div className="absolute inset-0">
              <img 
                src={imageLinkGenerate(post.featuredImage)} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
        )}
        
        <div className="relative w-full px-8 py-12 z-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge
              variant="outline"
              className={cn("backdrop-blur-md border shadow-sm px-3 py-1 text-sm", getPostTypeColor(post.type))}
            >
              {getPostTypeLabel(post.type)}
            </Badge>
            {post.isPinned && (
              <Badge
                variant="secondary"
                className="bg-yellow-500/20 text-yellow-200 border-yellow-500/30 backdrop-blur-md px-3 py-1 text-sm"
              >
                <Pin className="w-3 h-3 mr-1" />
                Sabit
              </Badge>
            )}
            {post.isHot && (
              <Badge
                variant="secondary"
                className="bg-orange-500/20 text-orange-200 border-orange-500/30 backdrop-blur-md px-3 py-1 text-sm"
              >
                <Flame className="w-3 h-3 mr-1" />
                Popüler
              </Badge>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 max-w-4xl leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50">
              <User className="w-4 h-4" />
              <span className="font-medium text-foreground">{post.author?.username || "Yazar Yok"}</span>
            </div>
            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50">
              <Eye className="w-4 h-4" />
              <span>{post.viewCount} görüntülenme</span>
            </div>
          </div>
        </div>
      </div>

      <DefaultBreadcrumb 
        items={[
          { label: "Haberler", href: "/posts" },
          { label: post.title, href: `/posts/${postSlug}` }
        ]} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
            <CardContent className="p-8 md:p-10">
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl">
                <LexicalViewer content={post.content} />
              </div>
            </CardContent>
            
            <div className="px-8 pb-8">
              <Separator className="mb-6" />
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="lg"
                    onClick={handleLike}
                    className="flex items-center gap-2 min-w-[120px]"
                  >
                    <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                    <span>{likeCount} Beğeni</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShare}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    Paylaş
                  </Button>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-end">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Gönderi Detayları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Kategori
                </span>
                <p className="font-medium text-lg">{post.categoryName || "Genel"}</p>
              </div>

              <Separator />

              <div className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Durum
                </span>
                <div>
                  <Badge
                    variant={post.status === "published" ? "default" : "secondary"}
                    className="text-sm"
                  >
                    {post.status === "published"
                      ? "Yayında"
                      : post.status === "draft"
                      ? "Taslak"
                      : "Arşivlendi"}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Son Güncelleme
                </span>
                <p className="text-sm font-medium">
                  {post.updatedAt && post.updatedAt !== post.createdAt 
                    ? formatDate(post.updatedAt)
                    : formatDate(post.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
