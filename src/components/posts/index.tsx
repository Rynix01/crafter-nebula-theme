'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, ChevronRight, RefreshCw, Filter, SearchX } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PostCard from './components/post-card';
import Sidebar from './components/sidebar';
import { postsService } from '@/lib/api/services/postsService';
import { GetPostsParams, PostsResponse, WebsitePost } from '@/lib/types/posts';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Posts() {
  const postsServiceInstance = postsService();
  const [posts, setPosts] = useState<WebsitePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GetPostsParams>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const fetchPosts = async (params: GetPostsParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: PostsResponse = await postsServiceInstance.getPosts(params);
      
      setPosts(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Gönderiler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(filters);
  }, [filters]);

  const handleFiltersChange = (newFilters: GetPostsParams) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleRefresh = () => {
    fetchPosts(filters);
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-2 mt-12">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="bg-card/50 backdrop-blur-sm border-border/50"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Önceki
        </Button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <Button
                key={pageNum}
                variant={pagination.page === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 p-0 ${pagination.page !== pageNum ? 'bg-card/50 backdrop-blur-sm border-border/50' : ''}`}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.pages}
          className="bg-card/50 backdrop-blur-sm border-border/50"
        >
          Sonraki
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    );
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
      {/* Desktop Sidebar */}
      <div className="xl:col-span-1 order-2 xl:order-1 hidden xl:block space-y-6">
        <Sidebar
          onFiltersChange={handleFiltersChange}
          currentFilters={filters}
        />
      </div>

      {/* Main Content */}
      <div className="xl:col-span-3 order-1 xl:order-2 space-y-6">
        {/* Header with refresh button and mobile filter toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {filters.search ? `"${filters.search}" için sonuçlar` : 'Tüm Gönderiler'}
              <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {pagination.total}
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="xl:hidden flex items-center gap-2 bg-background/50"
                >
                  <Filter className="w-4 h-4" />
                  Filtrele
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filtreler</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <Sidebar
                    onFiltersChange={handleFiltersChange}
                    currentFilters={filters}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="bg-background/50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Yenile
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <SearchX className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Sonuç Bulunamadı</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  {filters.search || filters.type 
                    ? 'Arama kriterlerinize uygun gönderi bulunamadı. Lütfen filtreleri değiştirip tekrar deneyin.'
                    : 'Henüz hiç gönderi yayınlanmamış.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
}