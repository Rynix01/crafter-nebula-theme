"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Gamepad2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useMinecraftStatus } from "@/lib/hooks/useMinecraftStatus";

interface StartToPlayProps {
  serverConfig: {
    ip: string;
    port: number;
  };
  websiteName: string;
}

export default function StartToPlay({ serverConfig, websiteName }: StartToPlayProps) {
  const [copied, setCopied] = useState(false);
  const { status } = useMinecraftStatus({
    hostname: serverConfig.ip,
    port: serverConfig.port
  });
  
  const handleCopy = () => {
    navigator.clipboard.writeText(serverConfig.ip);
    setCopied(true);
    toast.success("IP adresi kopyalandı!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500 rounded-full blur-[128px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold">Maceraya Hazır Mısın?</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            {websiteName} Dünyasına <br />
            <span className="text-primary">Hemen Katıl</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Binlerce oyuncunun arasına katıl, eşsiz oyun modlarını keşfet ve kendi efsaneni yazmaya başla. Seni bekleyen ödülleri kaçırma!
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
            <div className="relative group w-full sm:w-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
              <Button 
                size="lg" 
                className="relative w-full sm:w-auto h-14 px-8 text-lg font-bold bg-background hover:bg-background/90 text-foreground border border-primary/20"
                onClick={handleCopy}
              >
                <Gamepad2 className="mr-2 h-5 w-5 text-primary" />
                {copied ? "Kopyalandı!" : `IP: ${serverConfig.ip}`}
                <Copy className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </div>

            <Button 
              size="lg" 
              variant="default" 
              asChild
              className="w-full sm:w-auto h-14 px-8 text-lg font-bold shadow-lg shadow-primary/25"
            >
              <Link href="/store">
                Mağazaya Git
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="pt-8 flex items-center gap-8 text-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-foreground">{status?.online || "0"}</span>
              <span className="text-xs uppercase tracking-wider">Aktif Oyuncu</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-foreground">7/24</span>
              <span className="text-xs uppercase tracking-wider">Destek</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
