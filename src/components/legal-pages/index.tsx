"use client";

import { Card, CardContent } from "@/components/ui/card";
import LexicalViewer from "@/lib/helpers/lexicalViewer";
import { DefaultBreadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Shield, FileText, Scale, Info, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LegalPageProps {
  title: string;
  content: any; // Lexical JSON content
  description?: string;
  lastUpdated?: string;
  className?: string;
}

export default function LegalPage({
  title,
  content,
  description,
  lastUpdated,
  className,
}: LegalPageProps) {
  
  // Helper to get icon based on title
  const getIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("kural")) return Scale;
    if (lowerTitle.includes("gizlilik")) return Shield;
    if (lowerTitle.includes("şart")) return FileText;
    return ScrollText;
  };

  const Icon = getIcon(title);

  return (
    <div className="space-y-8">
      <DefaultBreadcrumb 
        items={[
          { label: "Kurumsal", href: "#" },
          { label: title, href: "#" }
        ]} 
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-2xl shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl" />
        
        <div className="relative px-8 py-12 flex flex-col md:flex-row items-center gap-8 z-10">
          <div className="relative shrink-0">
            <div className="absolute -inset-4 bg-violet-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl shadow-2xl flex items-center justify-center transform -rotate-3">
              <Icon className="w-12 h-12 md:w-16 md:h-16 text-white" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-500 backdrop-blur-sm mb-4">
                <Info className="mr-2 h-3.5 w-3.5" />
                Resmi Belge
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                {title}
              </h1>
              {description && (
                <p className="text-lg text-muted-foreground mt-4 max-w-2xl">
                  {description}
                </p>
              )}
            </div>

            {lastUpdated && (
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Son güncelleme: {new Date(lastUpdated).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar / Navigation (Optional - could be added later) */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
            <Card className="border-border/50 bg-card/50 sticky top-24">
                <CardContent className="p-4 space-y-2">
                    <p className="font-semibold text-sm text-muted-foreground mb-4 px-2">DİĞER SAYFALAR</p>
                    <a href="/legal/rules" className={cn("flex items-center gap-2 px-3 py-2 rounded-lg transition-colors", title.toLowerCase().includes("kural") ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground")}>
                        <Scale className="w-4 h-4" />
                        Kurallar
                    </a>
                    <a href="/legal/privacy-policy" className={cn("flex items-center gap-2 px-3 py-2 rounded-lg transition-colors", title.toLowerCase().includes("gizlilik") ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground")}>
                        <Shield className="w-4 h-4" />
                        Gizlilik Politikası
                    </a>
                    <a href="/legal/terms" className={cn("flex items-center gap-2 px-3 py-2 rounded-lg transition-colors", title.toLowerCase().includes("şart") ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground")}>
                        <FileText className="w-4 h-4" />
                        Kullanım Şartları
                    </a>
                </CardContent>
            </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
            <Card className="border-border/50 bg-card/50 shadow-lg min-h-[500px]">
                <CardContent className="p-8 md:p-12">
                    <LexicalViewer 
                        content={content || null} 
                        className="prose prose-zinc dark:prose-invert max-w-none
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
                        "
                    />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
