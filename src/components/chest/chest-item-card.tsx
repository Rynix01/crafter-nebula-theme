import imageLinkGenerate from "@/lib/helpers/imageLinkGenerate";
import { Button } from "../ui/button";
import Image from "next/image";
import { ChestItem } from "@/lib/types/chest";
import { Badge } from "../ui/badge";
import { PackageCheck, PackageOpen, Clock, Calendar } from "lucide-react";

export default function ChestItemCard({ item, action }: { item: ChestItem, action: (itemId: string) => void }) {
  return (
    <div className="group relative flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:border-primary/20">
       {/* Image Section */}
       <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-xl bg-muted/50 flex items-center justify-center overflow-hidden border border-border/50 group-hover:border-primary/50 transition-colors">
             <Image
                src={imageLinkGenerate(item.product.image)}
                alt={item.product.name}
                width={64}
                height={64}
                className="object-contain group-hover:scale-110 transition-transform duration-300"
             />
          </div>
       </div>

       {/* Content Section */}
       <div className="flex-1 text-center sm:text-left space-y-2 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
             <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{item.product.name}</h3>
             <Badge variant={item.used ? "secondary" : "outline"} className={item.used ? "bg-muted w-fit mx-auto sm:mx-0" : "border-primary/20 text-primary bg-primary/5 w-fit mx-auto sm:mx-0"}>
                {item.used ? "Kullanıldı" : "Kullanılabilir"}
             </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.product.description}</p>
          
          <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground pt-1">
             <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-md">
                <Calendar className="w-3 h-3" />
                <span>{new Date(item.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
             </div>
             <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-md">
                <Clock className="w-3 h-3" />
                <span>{new Date(item.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
             </div>
          </div>
       </div>

       {/* Action Section */}
       <div className="shrink-0 w-full sm:w-auto pt-2 sm:pt-0">
          <Button 
             onClick={() => action(item.id)}
             disabled={item.used}
             className="w-full sm:w-auto min-w-[140px]"
             variant={item.used ? "ghost" : "default"}
             size="lg"
          >
             {item.used ? (
                <span className="flex items-center gap-2 text-muted-foreground">
                   <PackageCheck className="w-4 h-4" />
                   Aktarıldı
                </span>
             ) : (
                <span className="flex items-center gap-2">
                   <PackageOpen className="w-4 h-4" />
                   Oyuna Aktar
                </span>
             )}
          </Button>
       </div>
    </div>
  );
}
