"use client";

import React from "react";
import { User } from "@/lib/types/user";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Box } from "lucide-react";
import imageLinkGenerate from "@/lib/helpers/imageLinkGenerate";

interface ProfileChestTabProps {
  user: User;
}

export function ProfileChestTab({ user }: ProfileChestTabProps) {
  return (
    <Card className="border-border/50 bg-card/50 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Sandık Eşyaları
        </CardTitle>
      </CardHeader>
      <CardContent>
        {user.chest && user.chest.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.chest.map((item, index) => (
              <div 
                key={index} 
                className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/50 transition-all duration-300"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border/50">
                  {item.product.image ? (
                    <img
                      src={imageLinkGenerate(item.product.image)}
                      alt={item.product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <Box className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate pr-2">{item.product.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={item.used ? "secondary" : "default"} className="text-xs">
                      {item.used ? "Kullanıldı" : "Kullanılabilir"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 text-muted-foreground">
            <Package className="w-12 h-12 opacity-20" />
            <p>Henüz sandık eşyası bulunmuyor.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
