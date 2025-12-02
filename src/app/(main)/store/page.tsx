import { Metadata } from "next";
import { serverServersService } from "@/lib/api/services/serversService";
import StoreCard from "@/components/ui/store/store-card";
import { DefaultBreadcrumb } from "@/components/ui/breadcrumb";
import { serverMarketplaceService } from "@/lib/api/services/marketplaceService";
import { serverWebsiteService } from "@/lib/api/services/websiteService";
import { headers } from "next/headers";
import { Server } from "@/lib/types/server";
import { ShoppingBag, Sparkles, Tag } from "lucide-react";

async function getWebsite() {
  const headersList = await headers();
  const websiteId = headersList.get("x-website-id") as string;

  const websiteService = serverWebsiteService(websiteId as string);
  const website = await websiteService.getWebsite({
    id: websiteId || "",
  });
  
  return website;
}

export const metadata: Metadata = {
  title: "Mağaza",
  description: "Sunucu mağazasında birbirinden özel ürünlere göz atın.",
};

export default async function StorePage() {
  const headersList = await headers();
  const websiteId = headersList.get("x-website-id") as string;
  const servers = await serverServersService(websiteId).getServers();
  const marketplaceSettings = await serverMarketplaceService(websiteId).getMarketplaceSettings();
  const website = await getWebsite();

  return (
    <div className="space-y-8">
      {/* Store Hero */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-2xl shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl" />
        
        <div className="relative px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 text-sm font-medium border border-violet-500/20">
              <ShoppingBag className="w-4 h-4" />
              <span>Marketplace</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Mağaza
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Sunucu deneyiminizi bir üst seviyeye taşıyacak özel ürünler, rütbeler ve kasalar.
            </p>
          </div>
          
          {marketplaceSettings.bulkDiscount ? (
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 max-w-sm w-full relative overflow-hidden group">
              <div className="absolute inset-0 bg-violet-500/5 group-hover:bg-violet-500/10 transition-colors" />
              <div className="relative flex items-start gap-4">
                <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    İndirim Fırsatı
                    <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tüm ürünlerde geçerli <span className="font-bold text-violet-500">{marketplaceSettings.bulkDiscount.amount} {marketplaceSettings.bulkDiscount.type === "fixed" ? website.currency : "%"}</span> indirim!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Tag className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold">{servers.length}</div>
                <div className="text-xs text-muted-foreground">Sunucu</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-500">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold">VIP</div>
                <div className="text-xs text-muted-foreground">Ayrıcalıklar</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <DefaultBreadcrumb items={[{ label: "Mağaza", href: "/store" }]} />

      {/* Servers Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Sunucular</h2>
          <span className="text-sm text-muted-foreground">
            {servers.length} sunucu listeleniyor
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.length > 0 ? (
            servers.map((server: Server) => (
              <StoreCard
                key={server.id}
                name={server.name}
                image={server.image}
                slug={server.slug}
                redirectUrl={`/store/${server.slug}`}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center space-y-4 bg-muted/30 rounded-2xl border border-dashed">
              <div className="p-4 rounded-full bg-muted">
                <ShoppingBag className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Henüz sunucu eklenmemiş</h3>
                <p className="text-muted-foreground">Lütfen daha sonra tekrar kontrol edin.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
