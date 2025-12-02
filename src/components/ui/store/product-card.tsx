"use client";

import { Product } from "@/lib/types/product";
import { Card } from "../card";
import Image from "next/image";
import imageLinkGenerate from "@/lib/helpers/imageLinkGenerate";
import Link from "next/link";
import { BulkDiscount } from "@/lib/types/marketplace";
import ProductActionButtons from "../product-action-buttons";
import { Badge } from "../badge";
import { Package, Sparkles } from "lucide-react";

type ProductCardProps = {
  product: Product;
  currency: string;
  bulkDiscount: BulkDiscount | null;
};

export default function ProductCard({
  product,
  currency,
  bulkDiscount,
}: ProductCardProps) {
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
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 flex flex-col h-full">
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-3 right-3 z-20">
          <Badge variant="destructive" className="font-bold shadow-sm animate-pulse">
            %{discountPercentage} İndirim
          </Badge>
        </div>
      )}

      {/* Image Section */}
      <Link href={`/store/product/${product.slug}`} className="relative aspect-square w-full overflow-hidden bg-muted/20">
        {product.image ? (
          <Image
            src={imageLinkGenerate(product.image)}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
            <Package className="w-16 h-16" />
          </div>
        )}
        
        {/* Quick View Overlay (Optional) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-background/90 text-foreground px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            İncele
          </span>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow gap-4">
        <div className="space-y-1">
          <Link href={`/store/product/${product.slug}`} className="block">
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 h-10">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {product.price} {currency}
              </span>
            )}
            <div className="flex items-center gap-1 text-primary font-bold text-xl">
              {discountedPrice === 0 ? (
                <span className="text-green-500 flex items-center gap-1">
                  ÜCRETSİZ <Sparkles className="w-4 h-4" />
                </span>
              ) : (
                <>
                  {discountedPrice.toFixed(2)} {currency}
                </>
              )}
            </div>
          </div>

          <div className="flex-shrink-0">
            <ProductActionButtons product={product} />
          </div>
        </div>
      </div>
    </Card>
  );
}
