import { Metadata } from "next";
import { serverServersService } from "@/lib/api/services/serversService";
import StoreCard from "@/components/ui/store/store-card";
import { serverCategoriesService } from "@/lib/api/services/categoriesService";
import { DefaultBreadcrumb } from "@/components/ui/breadcrumb";
import { serverMarketplaceService } from "@/lib/api/services/marketplaceService";
import { serverWebsiteService } from "@/lib/api/services/websiteService";
import { headers } from "next/headers";
import { Gamepad2, Layers, Sparkles, Tag } from "lucide-react";

async function getWebsite() {
  const headersList = await headers();
  const websiteId = headersList.get("x-website-id") as string;

  const websiteService = serverWebsiteService(websiteId as string);
  const website = await websiteService.getWebsite({ id: websiteId || "" });
  
  return website;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ server_slug: string }>;
}): Promise<Metadata> {
  const headersList = await headers();
  const websiteId = headersList.get("x-website-id") as string;
  const server = await serverServersService(websiteId).getServer((await params).server_slug);
  return {
    title: `${server.name}`,
    description: `${server.name} isimli oyuna ait ürün kategorileri!`,
  };
}

export default async function ServerPage({
  params,
}: {
  params: Promise<{ server_slug: string }>;
}) {
  const website = await getWebsite();
  const headersList = await headers();
  const websiteId = headersList.get("x-website-id") as string;
  const server = await serverServersService(websiteId).getServer((await params).server_slug);
  const categories = await serverCategoriesService(websiteId).getCategoriesByServer(
    server.id
  );
  const marketplaceSettings = await serverMarketplaceService(websiteId).getMarketplaceSettings();

  return (
    <div className="space-y-8">
      {/* Server Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-background to-background border border-primary/10 p-8 md:p-12">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-medium">
              <Gamepad2 className="w-5 h-5" />
              <span>Oyun Sunucusu</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              {server.name}
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Bu sunucu için özel olarak hazırlanmış kategorilere ve ürünlere göz atın.
            </p>
          </div>
          
          {marketplaceSettings.bulkDiscount && (
            <div className="bg-background/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 max-w-sm w-full relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
              <div className="relative flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    İndirim Fırsatı
                    <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tüm ürünlerde geçerli <span className="font-bold text-primary">{marketplaceSettings.bulkDiscount.amount} {marketplaceSettings.bulkDiscount.type === "fixed" ? website.currency : "%"}</span> indirim!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <DefaultBreadcrumb
        items={[
          { label: "Mağaza", href: "/store" },
          { label: server.name, href: `/store/${server.slug}` },
        ]}
      />

      {/* Categories Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" />
            Kategoriler
          </h2>
          <span className="text-sm text-muted-foreground">
            {categories.length} kategori listeleniyor
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length > 0 ? (
            categories.map((category) => (
              <StoreCard
                key={category.id}
                name={category.name}
                image={category.image}
                slug={category.slug}
                redirectUrl={`/store/${server.slug}/${category.slug}`}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center space-y-4 bg-muted/30 rounded-2xl border border-dashed">
              <div className="p-4 rounded-full bg-muted">
                <Layers className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Henüz kategori eklenmemiş</h3>
                <p className="text-muted-foreground">Bu sunucu için henüz bir kategori oluşturulmamış.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
