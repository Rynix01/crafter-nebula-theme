import { Metadata } from "next";
import { serverVoteService } from "@/lib/api/services/voteService";
import VoteProviders from "@/components/vote/VoteProviders";
import VoteInfo from "@/components/vote/VoteInfo";
import { DefaultBreadcrumb } from "@/components/ui/breadcrumb";
import { headers } from "next/headers";
import { ThumbsUp, Star, Gift } from "lucide-react";

export const metadata: Metadata = {
  title: "Oy Ver",
  description: "Minecraft sunucumuz için oy verin ve ödüller kazanın!",
};

async function getVoteProviders(websiteId: string) {
  const voteService = serverVoteService(websiteId);
  try {
    const response = await voteService.getVoteProviders();
    return response.providers || [];
  } catch (error) {
    console.error("Error getting vote providers:", error);
    return [];
  }
}

export default async function VotePage() {
  const headersList = await headers();
  const websiteId = headersList.get("x-website-id") as string;

  const providers = await getVoteProviders(websiteId);

  return (
    <div className="space-y-8">
      <DefaultBreadcrumb items={[{ label: "Oy Ver", href: "/vote" }]} />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-2xl shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl" />
        
        <div className="relative px-8 py-12 md:py-16 flex flex-col items-center text-center space-y-6 z-10">
          <div className="relative">
            <div className="absolute -inset-4 bg-violet-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-xl">
              <ThumbsUp className="w-10 h-10 text-violet-500" />
            </div>
          </div>
          
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Oy Ver & Kazan
            </h1>
            <p className="text-lg text-muted-foreground">
              Sunucumuzu desteklemek için aşağıdaki sitelerden oy verebilirsiniz. 
              Her oy size özel ödüller kazandırır!
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50 backdrop-blur-sm">
              <Gift className="w-4 h-4 text-fuchsia-500" />
              <span>Sürpriz Ödüller</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50 backdrop-blur-sm">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Sunucuya Destek</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        <VoteInfo />
        <VoteProviders providers={providers} />
      </div>
    </div>
  );
}
