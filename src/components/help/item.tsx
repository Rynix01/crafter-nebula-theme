"use client";

import type { HelpItem } from "@/lib/types/help";
import LexicalViewer from "@/lib/helpers/lexicalViewer";
import { DefaultBreadcrumb } from "../ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  ChevronLeft, 
  Share2, 
  ThumbsUp, 
  ThumbsDown,
  Calendar,
  User
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function HelpItem({ item }: { item: HelpItem }) {
  return (
    <div className="space-y-8">
      <DefaultBreadcrumb
        items={[
          { label: "Yardım Merkezi", href: "/help" },
          { label: item.title, href: `/help/${item.id}` },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
            
            <div className="relative p-8 md:p-10 space-y-6">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Rehber
                </Badge>
                
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  {item.title}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Admin</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Son güncelleme: Bugün</span>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="prose prose-zinc dark:prose-invert max-w-none
                prose-headings:scroll-m-20 prose-headings:font-bold prose-headings:tracking-tight 
                prose-h1:text-3xl prose-h1:mb-8 prose-h1:pb-4 prose-h1:border-b prose-h1:border-border/50
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-primary
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:leading-7 prose-p:mb-4 prose-p:text-muted-foreground
                prose-a:text-primary prose-a:no-underline prose-a:font-medium hover:prose-a:underline
                prose-strong:font-bold prose-strong:text-foreground
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                prose-li:my-2 prose-li:text-muted-foreground
                prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg
                prose-code:rounded-md prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:text-primary
                prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-border/50
              ">
                <LexicalViewer content={item.content} />
              </div>
            </div>
          </div>

          {/* Feedback Section (Visual Only) */}
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">Bu makale yardımcı oldu mu?</h3>
                <p className="text-sm text-muted-foreground">Geri bildiriminiz içeriğimizi geliştirmemize yardımcı olur.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  Evet
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <ThumbsDown className="w-4 h-4" />
                  Hayır
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/help">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Yardım Merkezi'ne Dön
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                <Share2 className="w-4 h-4 mr-2" />
                Makaleyi Paylaş
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
