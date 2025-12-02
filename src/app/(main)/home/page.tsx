import type { Metadata } from "next";
import { serverWebsiteService } from "@/lib/api/services/websiteService";
import { serverPostsService } from "@/lib/api/services/postsService";
import { serverCategoriesService } from "@/lib/api/services/categoriesService";
import { serverProductsService } from "@/lib/api/services/productsService";
import { headers } from "next/headers";
import PostCard from "@/components/ui/post-card";
import { StatisticCard } from "@/components/ui/statistic-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sword, 
  Shield, 
  Zap, 
  Trophy, 
  ShoppingCart, 
  MessageCircle,
  ArrowRight,
  Gamepad2,
  Copy,
  Users,
  Server as ServerIcon,
  Star
} from "lucide-react";
import Link from "next/link";
import { getDiscordStatus } from "@/lib/helpers/statusHelper";
import Image from "next/image";
import imageLinkGenerate from "@/lib/helpers/imageLinkGenerate";
import { Website } from "@/lib/types/website";

import HomeHero from "@/components/home/home-hero";

async function getWebsite() {
  const headersList = await headers();
  const websiteId = headersList.get("x-website-id");

  const websiteService = serverWebsiteService(websiteId as string);
  const website = await websiteService.getWebsite({
    id: websiteId || "",
  });
  
  return website;
}

export async function generateMetadata(): Promise<Metadata> {
  const website = await getWebsite();

  return {
    title: "Anasayfa",
    description: website.description || "Anasayfa",
  };
}

async function getWebsiteStatistics() {
  const headersList = await headers();
  const websiteId = headersList.get("x-website-id") as string;
  const websiteService = serverWebsiteService(websiteId as string);
  const websiteStatistics = await websiteService.getWebsiteStatistics();
  return websiteStatistics;
}

async function getPosts() {
  const headersList = await headers();
  const websiteId = headersList.get("x-website-id") as string;
  const postsService = serverPostsService(websiteId as string);
  const posts = await postsService.getPosts();
  return posts;
}

async function getFeaturedProducts() {
  const headersList = await headers();
  const websiteId = headersList.get("x-website-id") as string;
  
  const categoriesService = serverCategoriesService(websiteId);
  const productsService = serverProductsService(websiteId);

  try {
    const categories = await categoriesService.getCategories();
    if (!categories || categories.length === 0) return [];

    // Fetch products from the first category as featured
    const firstCategory = categories[0];
    const products = await productsService.getProductsByCategory(firstCategory.id);
    
    return products.slice(0, 4);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export default async function Home() {
  const website = await getWebsite();
  const websiteStatistics = await getWebsiteStatistics();
  const posts = await getPosts();
  const featuredProducts = await getFeaturedProducts();

  const discordStatus = await getDiscordStatus({
    guildId: website.discord?.guild_id || ""
  }).catch(() => ({ invite: "#", online: 0 }));

  return (
    <div className="min-h-screen pb-20">
      <HomeHero website={website} discordStatus={discordStatus} />

      <div className="container mx-auto px-4 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Featured Store Items */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  Öne Çıkan Ürünler
                </h2>
                <Button variant="link" asChild className="text-primary">
                  <Link href="/store">Mağazayı Görüntüle &rarr;</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featuredProducts.length > 0 ? (
                  featuredProducts.map((product) => (
                    <div key={product.id} className="group relative overflow-hidden rounded-xl bg-card border hover:border-primary/50 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                      <div className="h-48 bg-muted relative">
                        {product.image ? (
                           <Image 
                             src={imageLinkGenerate(product.image)} 
                             alt={product.name}
                             fill
                             className="object-cover transition-transform duration-500 group-hover:scale-110"
                           />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            <ShoppingCart className="w-12 h-12 opacity-20" />
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-green-400 font-bold">{product.price} ₺</span>
                          <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                            <Link href={`/store/product/${product.id}`}>İncele</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                   <div className="col-span-full text-center py-8 text-muted-foreground">
                     Henüz öne çıkan ürün bulunmuyor.
                   </div>
                )}
              </div>
            </section>

            {/* News Section */}
            <section>
              <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Gamepad2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Haberler & Duyurular</h2>
                  <p className="text-sm text-muted-foreground">Sunucumuzdan en son gelişmeler</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {posts.data.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Discord Widget */}
            <Card className="overflow-hidden border-none shadow-lg bg-[#5865F2] text-white relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <MessageCircle className="w-32 h-32" />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Discord Sunucusu</h3>
                    <p className="text-white/80 text-sm">Topluluğumuza katıl!</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-6 bg-black/20 rounded-lg p-3">
                  <span className="text-sm font-medium">Çevrimiçi Üyeler</span>
                  <Badge variant="secondary" className="bg-green-500 text-white border-none">
                    {discordStatus.online}
                  </Badge>
                </div>
                <Button className="w-full bg-white text-[#5865F2] hover:bg-white/90 font-bold" asChild>
                  <a href={discordStatus.invite} target="_blank" rel="noopener noreferrer">
                    Sunucuya Katıl
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Top Donors */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3 border-b bg-muted/30">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Son Destekçiler
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {websiteStatistics.latest.payments.length > 0 ? (
                  websiteStatistics.latest.payments.slice(0, 5).map((topup, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                          <Image 
                            src={`https://mc-heads.net/avatar/${topup.username}`} 
                            alt={topup.username}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-[10px] font-bold text-black border border-white">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm group-hover:text-primary transition-colors">{topup.username}</p>
                        <p className="text-xs text-muted-foreground">Kredi Yükledi</p>
                      </div>
                      <Badge variant="outline" className="font-mono">
                        {topup.amount}₺
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Henüz kredi yüklemesi yok.</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Purchases */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3 border-b bg-muted/30">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-green-500" />
                  Son Mağaza İşlemleri
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {websiteStatistics.latest.purchases.length > 0 ? (
                  websiteStatistics.latest.purchases.slice(0, 5).map((purchase, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                        <Image 
                          src={`https://mc-heads.net/avatar/${purchase.username}`} 
                          alt={purchase.username}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{purchase.username}</p>
                        <p className="text-xs text-muted-foreground truncate">{purchase.productName}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Henüz satın alım yok.</p>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
