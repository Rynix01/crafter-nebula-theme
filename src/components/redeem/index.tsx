"use client";

import { useState, useContext } from "react";
import { RedeemCodeResponse, redeemService } from "@/lib/api/services/redeemService";
import { AuthContext } from "@/lib/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DefaultBreadcrumb } from "@/components/ui/breadcrumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
    Gift, 
    Loader2, 
    CheckCircle2, 
    XCircle, 
    Ticket, 
    ArrowRight,
    Info,
    Sparkles,
    Package,
    Coins
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function Redeem() {
    const { isAuthenticated, reloadUser } = useContext(AuthContext);
    const [code, setCode] = useState("");
    const [response, setResponse] = useState<RedeemCodeResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const redeemServiceInstance = redeemService();

    const handleRedeem = async () => {
        if (!code.trim()) return;
        
        if (!isAuthenticated) {
            toast.error("Kupon kodu kullanmak için giriş yapmalısınız.");
            return;
        }

        setIsLoading(true);
        setResponse(null);

        try {
            const res = await redeemServiceInstance.redeemCode(code);
            setResponse(res);
            
            if (res.success) {
                toast.success("Kupon kodu başarıyla kullanıldı!");
                setCode("");
                await reloadUser();
            } else {
                toast.error(res.message || "Kupon kodu geçersiz.");
            }
        } catch (error: any) {
            const errorMessage = error?.message || "Bir hata oluştu. Lütfen tekrar deneyin.";
            setResponse({
                success: false,
                message: errorMessage,
            });
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleRedeem();
        }
    };

    return (
        <div className="space-y-8">
            <DefaultBreadcrumb items={[{label: "Kupon Kodu", href: "/redeem"}]}/>

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-2xl shadow-primary/5">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5" />
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
                <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl" />
                
                <div className="relative px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
                    <div className="space-y-4 text-center md:text-left max-w-2xl">
                        <div className="inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-500 backdrop-blur-sm">
                            <Sparkles className="mr-2 h-3.5 w-3.5" />
                            Ödülleri Topla
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                            Kupon Kodu Kullan
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Elinizdeki hediye kodlarını veya promosyon kuponlarını burada kullanarak özel ödüller, krediler ve eşyalar kazanabilirsiniz.
                        </p>
                    </div>
                    
                    <div className="relative shrink-0">
                        <div className="absolute -inset-4 bg-fuchsia-500/20 rounded-full blur-xl animate-pulse" />
                        <div className="relative w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-500">
                            <Gift className="w-16 h-16 md:w-20 md:h-20 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Input Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border/50 bg-card/50 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Ticket className="w-5 h-5 text-primary" />
                                Kod Girişi
                            </CardTitle>
                            <CardDescription>
                                Lütfen kupon kodunuzu eksiksiz ve doğru bir şekilde giriniz.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                <div className="relative flex items-center">
                                    <Ticket className="absolute left-4 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        onKeyPress={handleKeyPress}
                                        placeholder="XXXX-XXXX-XXXX"
                                        className="pl-12 h-14 text-lg font-mono tracking-wider bg-background/80 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all"
                                        maxLength={32}
                                    />
                                </div>
                            </div>

                            <Button 
                                onClick={handleRedeem}
                                disabled={isLoading || !code.trim()}
                                className="w-full h-12 text-lg font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.01] transition-all"
                                size="lg"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Kontrol Ediliyor...
                                    </>
                                ) : (
                                    <>
                                        Kodu Kullan
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>

                            <AnimatePresence mode="wait">
                                {response && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <Alert 
                                            variant={response.success ? "default" : "destructive"}
                                            className={response.success 
                                                ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400" 
                                                : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                                            }
                                        >
                                            {response.success ? (
                                                <CheckCircle2 className="h-5 w-5" />
                                            ) : (
                                                <XCircle className="h-5 w-5" />
                                            )}
                                            <AlertTitle className="text-lg font-semibold ml-2">
                                                {response.success ? "Başarılı!" : "Hata"}
                                            </AlertTitle>
                                            <AlertDescription className="ml-2 mt-1">
                                                {response.message}
                                                
                                                {response.success && (response.bonus || (response.products && response.products.length > 0)) && (
                                                    <div className="mt-4 p-4 bg-background/50 rounded-lg border border-border/50 space-y-2">
                                                        <p className="font-medium text-foreground">Kazanılan Ödüller:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {response.bonus && response.bonus > 0 && (
                                                                <Badge variant="secondary" className="px-3 py-1 text-sm bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                                                    <Coins className="w-3.5 h-3.5 mr-1.5" />
                                                                    {response.bonus} Kredi
                                                                </Badge>
                                                            )}
                                                            {response.products?.map((product, idx) => (
                                                                <Badge key={idx} variant="secondary" className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20">
                                                                    <Package className="w-3.5 h-3.5 mr-1.5" />
                                                                    {product.name}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </div>

                {/* Info Column */}
                <div className="space-y-6">
                    <Card className="border-border/50 bg-card/50 h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-primary" />
                                Bilgilendirme
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm">1</div>
                                <p className="text-sm text-muted-foreground">
                                    Kodlar büyük/küçük harf duyarlı olabilir, ancak sistem otomatik olarak büyük harfe çevirir.
                                </p>
                            </div>
                            <Separator className="bg-border/50" />
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm">2</div>
                                <p className="text-sm text-muted-foreground">
                                    Her kod genellikle tek kullanımlıktır ve belirli bir süre için geçerlidir.
                                </p>
                            </div>
                            <Separator className="bg-border/50" />
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm">3</div>
                                <p className="text-sm text-muted-foreground">
                                    Kazanılan krediler ve eşyalar anında hesabınıza tanımlanır.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/30 border-t border-border/50 p-4">
                            <p className="text-xs text-center w-full text-muted-foreground">
                                Sorun yaşarsanız destek talebi oluşturabilirsiniz.
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
