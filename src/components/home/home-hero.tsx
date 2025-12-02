"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import imageLinkGenerate from "@/lib/helpers/imageLinkGenerate";
import { Website } from "@/lib/types/website";
import { Copy, Gamepad2, MessageCircle, Server as ServerIcon, Users } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import OnlinePlayerCount from "./online-player-count";

interface HomeHeroProps {
  website: Website;
  discordStatus: any;
}

export default function HomeHero({ website, discordStatus }: HomeHeroProps) {
  const servers = website.servers || [];
  const mainServer = servers.find((server) => server.port === 25565) || servers[0];
  const serverIp = mainServer?.ip || "play.example.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(serverIp);
    toast.success("IP adresi kopyalandı!");
  };

  return (
    <div className="relative w-full -mt-16 mb-12">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 h-[600px] w-full overflow-hidden">
        <Image
          src={imageLinkGenerate(website.theme.header.bannerImage)}
          alt="Hero Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 pt-40 pb-16 flex flex-col items-center text-center gap-8">
        {/* Logo */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 animate-in fade-in zoom-in duration-1000">
          <Image
            src={imageLinkGenerate(website.image)}
            alt={website.name}
            fill
            className="object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          />
        </div>

        {/* Server Name & Description */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-lg">
            {website.name.toUpperCase()}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            {website.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center mt-4">
          <Button 
            size="lg" 
            className="h-14 text-lg font-bold bg-yellow-500 hover:bg-yellow-400 text-black border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 transition-all"
            onClick={handleCopy}
          >
            <Gamepad2 className="mr-2 w-6 h-6" />
            HEMEN OYNA
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="h-14 text-lg font-bold bg-indigo-600/20 hover:bg-indigo-600/40 text-white border-2 border-indigo-500 backdrop-blur-sm"
            asChild
          >
            <a href={discordStatus.invite} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 w-6 h-6" />
              DISCORD
            </a>
          </Button>
        </div>

        {/* IP Copy Box */}
        <div 
          className="mt-8 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-4 group cursor-pointer hover:bg-black/50 transition-all"
          onClick={handleCopy}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 font-bold text-sm">AKTIF</span>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <code className="text-xl font-mono font-bold text-white tracking-wide">
            {serverIp}
          </code>
          <Button size="icon" variant="ghost" className="text-white/70 group-hover:text-white">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-20 container mx-auto px-4 -mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/95 backdrop-blur border-primary/20 shadow-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Aktif Oyuncu</p>
                <h3 className="text-2xl font-bold">
                  <OnlinePlayerCount ip={serverIp} port={mainServer?.port || 25565} />
                </h3>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/95 backdrop-blur border-primary/20 shadow-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
                <ServerIcon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Sunucu Durumu</p>
                <h3 className="text-2xl font-bold text-green-500">Aktif</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/95 backdrop-blur border-primary/20 shadow-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-500">
                <MessageCircle className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Discord Üyesi</p>
                <h3 className="text-2xl font-bold">{discordStatus.online} Online</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
