import { notFound } from "next/navigation";
import { serverProductsService } from "@/lib/api/services/productsService";
import { serverWebsiteService } from "@/lib/api/services/websiteService";
import { serverMarketplaceService } from "@/lib/api/services/marketplaceService";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import imageLinkGenerate from "@/lib/helpers/imageLinkGenerate";
import {
  Package,
  Tag,
  Server,
  Clock,
  Sparkles,
  Layers,
  Info,
  CheckCircle2
} from "lucide-react";
import { serverServersService } from "@/lib/api/services/serversService";
import { serverCategoriesService } from "@/lib/api/services/categoriesService";
import { DefaultBreadcrumb } from "@/components/ui/breadcrumb";
import ProductActionButtons from "@/components/ui/product-action-buttons";
import type { Metadata } from "next";
import { headers } from "next/headers";

interface ProductPageProps {
  params: Promise<{
    product_slug: string;
  }>;
}

export const generateMetadata = async ({ params }: { params: Promise<{ product_slug: string }> }): Promise<Metadata> => {
  const headersList = await headers();
  const websiteId = headersList.get("x-website-id") as string;
  const product = await serverProductsService(websiteId).getProductById((await params).product_slug);
  return {
    title: product.name,
    description: product.description || "Ürün detayları",
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const headersList = await headers();
  const websiteId = headersList.get("x-website-id") as string;
  const websiteService = serverWebsiteService(websiteId as string);
  const productsService = serverProductsService(websiteId as string);
  try {
    const [product, website] = await Promise.all([
      productsService.getProductById((await params).product_slug),
      websiteService.getWebsite({
        id: websiteId || "",
      }),
    ]);

    if (!product) {
      notFound();
    }

    const currency = website.currency;
    const server = await serverServersService(websiteId).getServer(product.server_id);
    const category = await serverCategoriesService(websiteId).getCategory(
      product.category
    );

    // Get bulk discount from marketplace settings
    const marketplaceSettings = await serverMarketplaceService(websiteId).getMarketplaceSettings();
    const bulkDiscount = marketplaceSettings.bulkDiscount;

    // Calculate total discount by combining product discount and bulk discount
    const calculateDiscountedPrice = () => {
      let currentPrice = product.price;

      // Apply product discount first
      if (product.discountValue > 0) {
        if (product.discountType === "percentage") {
          currentPrice = currentPrice - (currentPrice * product.discountValue) / 100;
        } else {
          currentPrice = currentPrice - product.discountValue;
        }
      }

      // Apply bulk discount
      if (bulkDiscount) {
        if (bulkDiscount.type === "percentage") {
          currentPrice = currentPrice - (currentPrice * bulkDiscount.amount) / 100;
        } else {
          currentPrice = currentPrice - bulkDiscount.amount;
        }
      }

      return Math.max(0, currentPrice);
    };

    const discountedPrice = calculateDiscountedPrice();
    const hasDiscount = discountedPrice < product.price;
    const discountPercentage = hasDiscount 
      ? Math.round(((product.price - discountedPrice) / product.price) * 100) 
      : 0;

    return (
      <div className="space-y-8">
        <DefaultBreadcrumb
          items={[
            { label: "Mağaza", href: "/store" },
            { label: server.name, href: `/store/${server.slug}` },
            { label: category.name, href: `/store/${server.slug}/${category.slug}` },
            { label: product.name, href: `/store/product/${product.slug}` },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Image */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border/50 bg-card/50 shadow-xl shadow-primary/5 group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {product.image ? (
                <Image
                  src={imageLinkGenerate(product.image)}
                  alt={product.name}
                  fill
                  className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                  <Package className="w-32 h-32" />
                </div>
              )}
              
              {hasDiscount && (
                <div className="absolute top-6 right-6 z-20">
                  <Badge variant="destructive" className="text-lg px-4 py-1.5 font-bold shadow-lg animate-pulse">
                    %{discountPercentage} İndirim
                  </Badge>
                </div>
              )}
            </div>

            {/* Product Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 flex items-center gap-3 bg-muted/30 border-border/50">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Sunucu</p>
                  <p className="font-semibold">{server.name}</p>
                </div>
              </Card>
              <Card className="p-4 flex items-center gap-3 bg-muted/30 border-border/50">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Kategori</p>
                  <p className="font-semibold">{category.name}</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-baseline gap-2">
                  {hasDiscount && (
                    <span className="text-xl text-muted-foreground line-through decoration-2 decoration-destructive/50">
                      {product.price} {currency}
                    </span>
                  )}
                  <span className="text-4xl font-black text-primary">
                    {discountedPrice === 0 ? "ÜCRETSİZ" : `${discountedPrice.toFixed(2)} ${currency}`}
                  </span>
                </div>
                
                {product.stock !== null && (
                  <Badge variant={product.stock > 0 || product.stock === -1 ? "outline" : "destructive"} className="text-sm px-3 py-1">
                    {product.stock === -1 ? "Sınırsız Stok" : product.stock > 0 ? `${product.stock} Stok` : "Stokta Yok"}
                  </Badge>
                )}
              </div>

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm px-3 py-1 bg-secondary/50 hover:bg-secondary/70 transition-colors">
                      <Tag className="w-3 h-3 mr-1.5" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator className="bg-border/50" />

            <div className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-primary" />
                  Ürün Açıklaması
                </h3>
                <div 
                  className="text-muted-foreground leading-relaxed bg-muted/20 p-6 rounded-2xl border border-border/50"
                  dangerouslySetInnerHTML={{ __html: product.description || "Açıklama bulunmuyor." }}
                />
              </div>
            </div>

            <div className="sticky bottom-4 z-50 bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-primary/20 shadow-2xl lg:static lg:bg-transparent lg:p-0 lg:border-none lg:shadow-none">
              <ProductActionButtons product={product} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
