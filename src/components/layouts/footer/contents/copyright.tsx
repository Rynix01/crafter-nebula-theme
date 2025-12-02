"use client";

import { Heart } from "lucide-react";

export default function Copyright({ name }: { name: string }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between py-8 gap-4 text-center md:text-left">
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} <span className="font-bold text-foreground">{name}</span>. Tüm hakları saklıdır.
      </p>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Powered by</span>
        <a 
          href="https://crafter.net.tr" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          Crafter CMS
        </a>
        <span className="flex items-center gap-1">
          Made with <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
        </span>
        <span>Themed by</span>
        <a 
          href="https://rynix.com.tr" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          Rynix
        </a>
      </div>
    </div>
  );
}
