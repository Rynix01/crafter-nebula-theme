import ProductCard from "@/components/ui/store/product-card";
import ProductComparisonTable from "@/components/ui/store/product-comparison-table";
import { serverCategoriesService } from "@/lib/api/services/categoriesService";
import { serverProductsService } from "@/lib/api/services/productsService";
import { serverWebsiteService } from "@/lib/api/services/websiteService";
import { Metadata } from "next";
import { DefaultBreadcrumb } from "@/components/ui/breadcrumb";
import { serverServersService } from "@/lib/api/services/serversService";
import { serverMarketplaceService } from "@/lib/api/services/marketplaceService";
import { headers } from "next/headers";
import { Layers, Package, Sparkles, Tag } from "lucide-react";

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
  params: Promise<{ server_slug: string; category_slug: string }>;
}): Promise<Metadata> {
  const headersList = await headers();
  const websiteId = headersList.get("x-website-id") as string;
  const category = await serverCategoriesService(websiteId).getCategory(
    (
      await params
    ).category_slug
  );
  return {
    title: `${category.name}`,
    description: `${category.name} isimli kategoriye ait ürünler!`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ server_slug: string; category_slug: string }>;
}) {
  const website = await getWebsite();

  const headersList = await headers();
  const websiteId = headersList.get("x-website-id") as string;
  const category = await serverCategoriesService(websiteId).getCategory(
    (await params).category_slug
  );
  const server = await serverServersService(websiteId).getServer(category.server_id);

  const products = await serverProductsService(websiteId).getProductsByCategory(category.id);

  const marketplaceSettings = await serverMarketplaceService(websiteId).getMarketplaceSettings();

  return (
    <div className="space-y-8">
      {/* Category Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-background to-background border border-primary/10 p-8 md:p-12">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-medium">
              <Layers className="w-5 h-5" />
              <span>{server.name}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              {category.name}
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Bu kategorideki en özel ürünleri keşfedin ve avantajlardan yararlanın.
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
          {
            label: category.name,
            href: `/store/${server.slug}/${category.slug}`,
          },
        ]}
      />

      {/* Products Grid or Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            Ürünler
          </h2>
          <span className="text-sm text-muted-foreground">
            {products.length} ürün listeleniyor
          </span>
        </div>

        {category.type === "listed_products" ? (
          // Tablo görünümü
          products.length > 0 ? (
            <ProductComparisonTable
              category={category}
              products={products}
              currency={website.currency}
              bulkDiscount={marketplaceSettings.bulkDiscount}
            />
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center space-y-4 bg-muted/30 rounded-2xl border border-dashed">
              <div className="p-4 rounded-full bg-muted">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Henüz ürün eklenmemiş</h3>
                <p className="text-muted-foreground">Bu kategori için henüz bir ürün bulunmuyor.</p>
              </div>
            </div>
          )
        ) : (
          // Kart görünümü
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={website.currency}
                  bulkDiscount={marketplaceSettings.bulkDiscount}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center space-y-4 bg-muted/30 rounded-2xl border border-dashed">
                <div className="p-4 rounded-full bg-muted">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Henüz ürün eklenmemiş</h3>
                  <p className="text-muted-foreground">Bu kategori için henüz bir ürün bulunmuyor.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
