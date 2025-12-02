import { Card } from "../card";
import Image from "next/image";
import imageLinkGenerate from "@/lib/helpers/imageLinkGenerate";
import { ArrowRight, Gamepad2 } from "lucide-react";
import Link from "next/link";

type StoreCardProps = {
  name: string;
  image: string;
  slug: string;
  redirectUrl: string;
};

export default function StoreCard({ name, image, slug, redirectUrl }: StoreCardProps) {
  return (
    <Link href={redirectUrl} className="group block h-full">
      <Card className="relative h-full overflow-hidden border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 group-hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          {image ? (
            <Image
              src={imageLinkGenerate(image)}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Gamepad2 className="w-12 h-12 text-muted-foreground/20" />
            </div>
          )}
          
          {/* Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <h3 className="text-2xl font-bold tracking-tight text-white drop-shadow-md group-hover:text-primary transition-colors">
              {name}
            </h3>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 flex items-center justify-between border-t border-border/50 bg-muted/20 group-hover:bg-primary/5 transition-colors">
          <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
            Mağazayı Görüntüle
          </span>
          <div className="w-8 h-8 rounded-full bg-background border border-border/50 flex items-center justify-center group-hover:border-primary/50 group-hover:text-primary transition-all">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
