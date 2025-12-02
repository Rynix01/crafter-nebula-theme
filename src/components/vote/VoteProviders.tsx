"use client";

import { VoteProvider } from "@/lib/api/services/voteService";
import { getVoteProviderInfo } from "@/lib/constants/voteProviders";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, Gift } from "lucide-react";

interface VoteProvidersProps {
  providers: VoteProvider[];
}

export default function VoteProviders({ providers }: VoteProvidersProps) {
  if (providers.length === 0) {
    return (
      <Card className="border-dashed border-2 p-12 flex flex-col items-center justify-center text-center bg-muted/50">
        <div className="p-4 rounded-full bg-muted mb-4">
          <Gift className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Henüz Aktif Oylama Yok</h3>
        <p className="text-muted-foreground mt-2">
          Şu anda aktif olan bir oylama sitesi bulunmuyor. Lütfen daha sonra tekrar kontrol edin.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {providers.map((provider) => {
        const providerInfo = getVoteProviderInfo(provider.type);
        
        return (
          <Card key={provider.id} className="group overflow-hidden border-border/50 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
            <CardHeader className="p-0">
              <div className="relative h-32 bg-gradient-to-br from-primary/10 to-background flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                <div className="relative w-20 h-20 drop-shadow-xl transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={providerInfo?.image || "/images/vote-providers/default.png"}
                    alt={provider.name ?? "Vote Provider"}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/vote-providers/default.png";
                    }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {provider.name || providerInfo?.name || "Vote Provider"}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {providerInfo?.description || "Minecraft sunucumuz için oy verin ve ödüller kazanın."}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
                <Clock className="w-3 h-3" />
                <span>Her {providerInfo?.cooldownHours || 24} saatte bir oy verilebilir</span>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button asChild className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <Link href={`/vote/${provider.id}`}>
                  Oy Ver
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
