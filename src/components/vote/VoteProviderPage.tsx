"use client";

import { useState, useEffect, useContext } from "react";
import { VoteProvider, VoteResponse, VoteService } from "@/lib/api/services/voteService";
import { getVoteProviderInfo, VoteProviderInfo } from "@/lib/constants/voteProviders";
import { AuthContext } from "@/lib/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  User, 
  Gift,
  ArrowLeft,
  ThumbsUp
} from "lucide-react";
import { toast } from "sonner";

interface VoteProviderPageProps {
  provider: VoteProvider;
  providerInfo: VoteProviderInfo | undefined;
}

export default function VoteProviderPage({ 
  provider, 
  providerInfo
}: VoteProviderPageProps) {
  const { user, reloadUser, isAuthenticated } = useContext(AuthContext);
  const voteService = new VoteService();
  const [isVoting, setIsVoting] = useState(false);
  const [voteResult, setVoteResult] = useState<VoteResponse | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [canVote, setCanVote] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (!user?.nextVoteAt) {
      setCanVote(true);
      setTimeLeft("");
      return;
    }

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const nextVoteTime = new Date(user.nextVoteAt!).getTime();
      const difference = nextVoteTime - now;

      if (difference <= 0) {
        setCanVote(true);
        setTimeLeft("");
      } else {
        setCanVote(false);
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [user?.nextVoteAt]);

  const handleVote = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Oy kullanmak için giriş yapmalısınız.");
      return;
    }

    setIsVoting(true);
    setVoteResult(null);

    try {
      // 1. Open vote page in new tab
      const voteUrl = provider.url || providerInfo?.websiteUrl;
      
      if (!voteUrl) {
        toast.error("Oylama linki bulunamadı.");
        setIsVoting(false);
        return;
      }

      window.open(voteUrl.replace("{username}", user.username), '_blank');

      // 2. Check vote status
      const result = await voteService.checkVote(provider.id, user.username);
      setVoteResult(result);

      if (result.success) {
        toast.success("Oyunuz başarıyla doğrulandı!");
        await reloadUser();
      } else {
        toast.error(result.message || "Oyunuz doğrulanamadı.");
      }
    } catch (error) {
      console.error("Vote error:", error);
      toast.error("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-2xl shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="relative px-8 py-12 flex flex-col md:flex-row items-center gap-8">
          <div className="relative shrink-0">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-32 h-32 rounded-2xl bg-background border border-border/50 shadow-xl flex items-center justify-center p-4">
              <Image
                src={providerInfo?.image || "/images/vote-providers/default.png"}
                alt={provider.name || providerInfo?.name || "Vote Provider"}
                fill
                className="object-contain p-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/vote-providers/default.png";
                }}
              />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                {provider.name || providerInfo?.name || "Vote Provider"}
              </h1>
              <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
                {providerInfo?.description || provider.description || "Bu site üzerinden oy vererek sunucumuza destek olabilir ve ödüller kazanabilirsiniz."}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              {providerInfo?.cooldownHours && (
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  <Clock className="w-3 h-3 mr-2" />
                  {providerInfo.cooldownHours} Saat Arayla
                </Badge>
              )}
              <Badge variant="outline" className="px-3 py-1 text-sm border-primary/20 text-primary">
                <ThumbsUp className="w-3 h-3 mr-2" />
                Destek
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Voting Action */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card/50 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Oy Kullanma İşlemi
              </CardTitle>
              <CardDescription>
                Aşağıdaki adımları takiperek oy kullanabilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isAuthenticated ? (
                <Alert variant="destructive" className="bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                  <User className="h-4 w-4" />
                  <AlertTitle>Giriş Yapmalısınız</AlertTitle>
                  <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
                    <span>Oy kullanmak ve ödül kazanmak için giriş yapmanız gerekmektedir.</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="bg-background/50 border-yellow-500/30 hover:bg-yellow-500/20" asChild>
                        <Link href="/auth/sign-in">Giriş Yap</Link>
                      </Button>
                      <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white border-none" asChild>
                        <Link href="/auth/sign-up">Kayıt Ol</Link>
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : !canVote ? (
                <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Clock className="h-4 w-4" />
                  <AlertTitle>Bekleme Süresi</AlertTitle>
                  <AlertDescription className="mt-2">
                    Bir sonraki oy hakkınız için beklemeniz gerekiyor: <span className="font-mono font-bold text-lg ml-2">{timeLeft}</span>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-4">
                    <div className="space-y-2">
                      <Label>Kullanıcı Adı</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input 
                          value={user?.username} 
                          disabled 
                          className="pl-9 bg-background font-mono" 
                        />
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <p>1. "Oy Ver ve Kazan" butonuna tıklayın.</p>
                      <p>2. Açılan sayfada kullanıcı adınızı girin ve oy verin.</p>
                      <p>3. Sistem oyunuzu otomatik olarak kontrol edecektir.</p>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full text-lg h-14 gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all" 
                    onClick={handleVote}
                    disabled={isVoting}
                  >
                    {isVoting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Kontrol Ediliyor...
                      </>
                    ) : (
                      <>
                        Oy Ver ve Kazan
                        <ExternalLink className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
              )}

              {voteResult && (
                <Alert variant={voteResult.success ? "default" : "destructive"} className={voteResult.success ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400" : ""}>
                  {voteResult.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <AlertTitle>{voteResult.success ? "Başarılı!" : "Hata"}</AlertTitle>
                  <AlertDescription>
                    {voteResult.message}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Rewards */}
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                Olası Ödüller
              </CardTitle>
              <CardDescription>
                Oy vererek kazanabileceğiniz ödüller.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {provider.rewards && provider.rewards.length > 0 ? (
                  provider.rewards.map((reward, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted transition-colors">
                      <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{reward.name}</p>
                        <p className="text-xs text-muted-foreground">Şans: %{reward.chance}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Gift className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Sürpriz ödüller sizi bekliyor!</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border/50 p-4">
              <p className="text-xs text-center w-full text-muted-foreground">
                Ödüller otomatik olarak envanterinize veya bakiyenize eklenir.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
