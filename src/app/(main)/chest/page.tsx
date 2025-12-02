import { DefaultBreadcrumb } from "@/components/ui/breadcrumb";
import Chest from "@/components/chest";
import { Metadata } from "next";
import { Archive, PackageOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Sandık",
  description: "Sandığınızdaki eşyaları görüntüleyin veya kullanın.",
};

export default async function ChestPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-2xl shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-yellow-500/5" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        
        <div className="relative px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-sm font-medium">
              <Archive className="w-4 h-4" />
              <span>Dijital Envanter</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Sandığım
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Satın aldığınız ürünleri, kazandığınız ödülleri ve diğer dijital varlıklarınızı buradan yönetebilir ve oyuna aktarabilirsiniz.
            </p>
          </div>

          <div className="relative shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center animate-pulse">
              <PackageOpen className="w-16 h-16 md:w-20 md:h-20 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <DefaultBreadcrumb items={[{ label: "Sandığım", href: "/chest" }]} />
      <Chest />
    </div>
  );
}
