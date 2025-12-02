import { Metadata } from "next";
import { DefaultBreadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ban, MicOff, AlertTriangle, ShieldAlert, ArrowRight, Gavel } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cezalar",
  description: "Sunucu cezalarını görüntüleyin ve yönetin.",
};

const punishmentTypes = [
  {
    type: "ban",
    title: "Yasaklamalar",
    description: "Sunucu kurallarını ihlal eden ve uzaklaştırılan oyuncular",
    icon: Ban,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "group-hover:border-red-500/50",
    gradient: "from-red-500/5 to-orange-500/5",
    href: "/punishments/ban"
  },
  {
    type: "mute",
    title: "Susturulmalar", 
    description: "Sohbet kurallarını ihlal eden ve susturulan oyuncular",
    icon: MicOff,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "group-hover:border-purple-500/50",
    gradient: "from-purple-500/5 to-pink-500/5",
    href: "/punishments/mute"
  },
  {
    type: "warning",
    title: "Uyarılar",
    description: "Hafif ihlaller nedeniyle uyarı alan oyuncular", 
    icon: AlertTriangle,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "group-hover:border-yellow-500/50",
    gradient: "from-yellow-500/5 to-amber-500/5",
    href: "/punishments/warning"
  }
];

export default function PunishmentsPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-2xl shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        
        <div className="relative px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium">
              <Gavel className="w-4 h-4" />
              <span>Adalet & Güvenlik</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Ceza Listesi
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Sunucu düzenini sağlamak amacıyla uygulanan cezaları ve detaylarını buradan inceleyebilirsiniz.
            </p>
          </div>

          <div className="relative shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-16 h-16 md:w-20 md:h-20 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <DefaultBreadcrumb items={[{ label: "Cezalar", href: "/punishments" }]} />

      <div className="grid gap-6 md:grid-cols-3">
        {punishmentTypes.map((item) => (
          <Link key={item.type} href={item.href}>
            <Card className={`group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 cursor-pointer h-full ${item.borderColor}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <CardHeader className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${item.bgColor} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className={`w-8 h-8 rounded-full ${item.bgColor} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0`}>
                    <ArrowRight className={`w-4 h-4 ${item.color}`} />
                  </div>
                </div>
                
                <CardTitle className="text-xl font-bold mb-2 group-hover:text-foreground transition-colors">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-border/50">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h3 className="text-lg font-semibold">Kurallar Hakkında</h3>
          <p className="text-muted-foreground">
            Sunucumuzda adil ve eğlenceli bir ortam sağlamak için belirli kurallar uygulanmaktadır. 
            Kurallara uymayan oyunculara ihlalin ciddiyetine göre çeşitli cezalar verilebilir.
          </p>
        </div>
      </div>
    </div>
  );
}
