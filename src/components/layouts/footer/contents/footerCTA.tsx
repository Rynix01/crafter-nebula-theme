"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useMinecraftStatus } from "@/lib/hooks/useMinecraftStatus";

interface FooterCTAProps {
  serverConfig: { ip: string; port: number };
  name: string;
}

export default function FooterCTA({ serverConfig, name }: FooterCTAProps) {
  const { status } = useMinecraftStatus({ hostname: serverConfig.ip, port: serverConfig.port });
  
  const handleCopy = () => {
    navigator.clipboard.writeText(serverConfig.ip);
    toast.success("IP kopyalandı!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          {name} Sunucusuna Katıl
        </h2>
        <p className="text-white/50 mb-8 max-w-md mx-auto">
          Minecraft&apos;ı aç, çok oyunculu bölümüne git ve aşağıdaki IP adresini yapıştır.
        </p>
        
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-4 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/30 rounded-xl transition-all group"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 font-medium">{status?.online || 0} online</span>
          </div>
          <div className="w-px h-5 bg-white/10" />
          <code className="text-lg sm:text-xl font-mono font-bold text-white">{serverConfig.ip}</code>
          <Copy className="w-4 h-4 text-white/40 group-hover:text-green-400 transition-colors" />
        </button>
      </div>
    </div>
  );
}
