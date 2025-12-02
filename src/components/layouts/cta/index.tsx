"use client";
import imageLinkGenerate from "@/lib/helpers/imageLinkGenerate";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CTA({ backgroundImage }: { backgroundImage: string }) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/help");
    router.prefetch("/support");
  }, [router]);

  return (
    <div
      style={{
        backgroundImage: `url(${imageLinkGenerate(backgroundImage)})`,
        backgroundBlendMode: "overlay",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
      className="bg-cover bg-center h-64 sm:h-80 md:h-96 flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col justify-center items-center gap-3 sm:gap-4 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight">
          Yardıma mı ihtiyacın var?
        </h1>
        <p className="text-sm sm:text-base md:text-lg font-bold text-muted-foreground max-w-xs sm:max-w-md md:max-w-2xl text-center leading-relaxed">
          Sorularınız için Destek Merkezimizi ziyaret edin veya Destek Talebi üzerinden 
          yeni bir talep oluşturun. Uzman ekibimiz size yardımcı olacak.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Button className="cursor-pointer w-full sm:w-auto" variant="outline" onClick={() => router.push("/help")}>
            Yardım Merkezi
          </Button>
          <Button className="cursor-pointer w-full sm:w-auto" variant="outline" onClick={() => router.push("/support")}>
            Destek
          </Button>
        </div>
      </div>
    </div>
  );
}
