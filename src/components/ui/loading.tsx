import Image from "next/image";
import imageLinkGenerate from "@/lib/helpers/imageLinkGenerate";
import { Loader2 } from "lucide-react";

export default function Loading({ logo }: { logo: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 animate-pulse">
      <Image src={imageLinkGenerate(logo)} alt="logo" width={100} height={100} />
      <Loader2 className="animate-spin" size={32} />
    </div>
  );
}
