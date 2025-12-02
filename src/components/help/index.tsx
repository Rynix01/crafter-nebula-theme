"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  BookOpen,
  HelpCircle,
  FileText,
  MessageCircle,
  ChevronRight,
  LifeBuoy,
  ExternalLink,
  Loader2,
  Sparkles,
  Zap,
  ArrowRight
} from "lucide-react";
import { helpService } from "@/lib/api/services/helpService";
import { HelpData } from "@/lib/types/help";
import { DefaultBreadcrumb } from "../ui/breadcrumb";
import { lexicalToString } from "@/lib/helpers/lexicalToString";
import LexicalViewer from "@/lib/helpers/lexicalViewer";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export default function Help({ discordLink }: { discordLink: string }) {
  const [helpData, setHelpData] = useState<HelpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("guides");

  const helpServiceInstance = helpService();

  useEffect(() => {
    const fetchHelpData = async () => {
      try {
        setLoading(true);
        const data = await helpServiceInstance.getHelpCenter({
          query: {
            activeOnly: true,
            limit: 50,
          },
        });
        setHelpData(data);
      } catch (error) {
        console.error("Error fetching help data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHelpData();
  }, []);

  const filteredCategories = helpData?.categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredFAQs = helpData?.faqs.filter(
    (faq) =>
      JSON.stringify(faq.question).toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(faq.answer).toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getCategoryItems = (categoryId: string) => {
    return helpData?.items.filter((item) => item.categoryId === categoryId) || [];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Yardım merkezi yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <DefaultBreadcrumb items={[{ label: "Yardım Merkezi", href: "/help" }]} />

      {/* Modern Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-2xl shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl" />
        
        <div className="relative px-8 py-20 flex flex-col items-center text-center gap-8 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-500 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4" />
            <span>Bilgi Bankası & Destek</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter"
          >
            Size nasıl yardım edebiliriz?
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative w-full max-w-2xl mt-4 group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-violet-500/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg">
              <Search className="absolute left-5 w-6 h-6 text-muted-foreground group-focus-within:text-violet-500 transition-colors" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Bir konu veya soru arayın..."
                className="pl-14 h-16 text-lg bg-transparent border-none focus-visible:ring-0 rounded-xl placeholder:text-muted-foreground/50"
              />
            </div>
          </motion.div>   
        </div>
      </div>

      {/* Content Tabs with Modern Pill Design */}
      <Tabs defaultValue="guides" value={activeTab} onValueChange={setActiveTab} className="space-y-10">
        <div className="flex justify-center">
          <TabsList className="h-auto p-2 bg-muted/30 border border-border/50 rounded-full backdrop-blur-sm">
            <TabsTrigger 
              value="guides" 
              className="px-8 py-3 rounded-full text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Rehberler
            </TabsTrigger>
            <TabsTrigger 
              value="faq" 
              className="px-8 py-3 rounded-full text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Sıkça Sorulanlar
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="guides" className="space-y-8">
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category, index) => {
                const items = getCategoryItems(category.id);
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="group h-full relative bg-card hover:bg-card/80 border border-border/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-primary -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                      </div>
                      
                      <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <BookOpen className="w-7 h-7" />
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                        {category.description || "Bu kategori için açıklama bulunmuyor."}
                      </p>

                      <div className="space-y-1">
                        {items.slice(0, 3).map((item) => (
                          <Link 
                            key={item.id}
                            href={`/help/${item.id}`}
                            className="flex items-center p-2 -mx-2 rounded-lg hover:bg-muted/50 text-sm text-muted-foreground hover:text-foreground transition-colors group/item"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/30 mr-3 group-hover/item:bg-primary transition-colors" />
                            <span className="line-clamp-1 flex-1">{item.title}</span>
                          </Link>
                        ))}
                        {items.length > 3 && (
                          <div className="pt-2 pl-2 text-xs font-medium text-primary">
                            + {items.length - 3} diğer makale
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold">Sonuç Bulunamadı</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                "{searchQuery}" araması için herhangi bir sonuç bulamadık. Lütfen farklı anahtar kelimeler deneyin.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="faq" className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {filteredFAQs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Accordion type="single" collapsible className="bg-card border border-border/50 rounded-2xl px-6 shadow-sm hover:shadow-md transition-all">
                      <AccordionItem value={faq.id} className="border-none">
                        <AccordionTrigger className="hover:no-underline py-6">
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <HelpCircle className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-lg">{lexicalToString(faq.question)}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-6 pl-[3.25rem]">
                          <div className="prose dark:prose-invert max-w-none">
                            <LexicalViewer content={faq.answer} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Aramanızla eşleşen bir soru bulunamadı.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modern CTA Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
        <div className="group relative overflow-hidden rounded-3xl bg-indigo-600 p-1">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative h-full bg-background rounded-[1.4rem] p-8 flex flex-col items-start justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-6">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Discord Topluluğu</h3>
              <p className="text-muted-foreground mb-8 max-w-xs">
                Binlerce oyuncu ile sohbet et, etkinliklere katıl ve anlık destek al.
              </p>
            </div>
            
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-xl text-base" asChild>
              <Link href={discordLink || "#"} target="_blank">
                Discord'a Katıl <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl bg-orange-500 p-1">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative h-full bg-background rounded-[1.4rem] p-8 flex flex-col items-start justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 mb-6">
                <LifeBuoy className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Destek Talebi</h3>
              <p className="text-muted-foreground mb-8 max-w-xs">
                Sorununuz çözülmedi mi? Yetkili ekibimizle iletişime geçin.
              </p>
            </div>
            
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 rounded-xl text-base" asChild>
              <Link href="/support">
                Talep Oluştur <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
