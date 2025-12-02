"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/lib/context/AuthContext";
import { userService } from "@/lib/api/services/userService";
import { GiftService } from "@/lib/api/services/giftService";
import { User } from "@/lib/types/user";
import { GiftItem } from "@/lib/types/gift";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Gift,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Send,
  XCircle,
  Wallet,
  Inbox,
  History,
  Clock,
  User as UserIcon,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { DefaultBreadcrumb } from "../ui/breadcrumb";

interface GiftPageProps {
  currency?: string;
}

export default function GiftPage({ currency = "Kredi" }: GiftPageProps) {
  const { user, isAuthenticated, reloadUser } = useContext(AuthContext);
  const giftService = new GiftService();
  const userApiService = userService();

  // Tabs
  const [activeTab, setActiveTab] = useState("send");

  // Send Gift State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);

  // History State
  const [receivedGifts, setReceivedGifts] = useState<GiftItem[]>([]);
  const [sentGifts, setSentGifts] = useState<GiftItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [processingGiftId, setProcessingGiftId] = useState<string | null>(null);

  // Fetch history when tab changes
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        if (activeTab === "inbox") {
          const data = await giftService.getReceivedGifts(user.id);
          setReceivedGifts(data);
        } else if (activeTab === "sent") {
          const data = await giftService.getSentGifts(user.id);
          setSentGifts(data);
        }
      } catch (error) {
        console.error("Error fetching gift history:", error);
        toast.error("Hediye geçmişi yüklenirken bir hata oluştu.");
      } finally {
        setIsLoadingHistory(false);
      }
    };

    if (activeTab !== "send") {
      fetchHistory();
    }
  }, [activeTab, user, isAuthenticated]);

  const handleSearchUser = async () => {
    if (!searchQuery.trim()) {
      toast.error("Lütfen bir kullanıcı adı girin.");
      return;
    }

    try {
      setIsSearching(true);
      setSelectedUser(null);
      const foundUser = await userApiService.getUserById(searchQuery.trim());

      if (foundUser.id === user?.id) {
        toast.error("Kendinize hediye gönderemezsiniz.");
        return;
      }

      setSelectedUser(foundUser);
    } catch (err: any) {
      console.error("Failed to find user:", err);
      toast.error("Kullanıcı bulunamadı.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendGift = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error("Lütfen giriş yapın.");
      return;
    }

    if (!selectedUser) {
      toast.error("Lütfen bir kullanıcı seçin.");
      return;
    }

    const amountValue = parseFloat(amount);
    if (!amountValue || amountValue <= 0) {
      toast.error("Geçerli bir miktar girin.");
      return;
    }

    setIsSending(true);
    try {
      const result = await giftService.sendGift(user.id, {
        targetUserId: selectedUser.id,
        amount: amountValue,
      });

      if (result.success) {
        toast.success("Hediye başarıyla gönderildi!");
        setAmount("");
        setSelectedUser(null);
        setSearchQuery("");
        await reloadUser(); // Update balance
      } else {
        toast.error(result.message || "Hediye gönderilemedi.");
      }
    } catch (error: any) {
      console.error("Send gift error:", error);
      toast.error(error.response?.data?.message || "Bir hata oluştu.");
    } finally {
      setIsSending(false);
    }
  };

  const handleAcceptGift = async (giftId: string) => {
    if (!user) return;
    setProcessingGiftId(giftId);
    try {
      const result = await giftService.acceptGift(user.id, giftId);
      if (result.success) {
        toast.success("Hediye kabul edildi!");
        // Refresh list
        const data = await giftService.getReceivedGifts(user.id);
        setReceivedGifts(data);
        await reloadUser(); // Update balance
      } else {
        toast.error(result.message || "İşlem başarısız.");
      }
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setProcessingGiftId(null);
    }
  };

  const handleRejectGift = async (giftId: string) => {
    if (!user) return;
    setProcessingGiftId(giftId);
    try {
      const result = await giftService.rejectGift(user.id, giftId);
      if (result.success) {
        toast.success("Hediye reddedildi.");
        // Refresh list
        const data = await giftService.getReceivedGifts(user.id);
        setReceivedGifts(data);
      } else {
        toast.error(result.message || "İşlem başarısız.");
      }
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setProcessingGiftId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20"><Clock className="w-3 h-3 mr-1" /> Bekliyor</Badge>;
      case "accepted":
        return <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Kabul Edildi</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20"><XCircle className="w-3 h-3 mr-1" /> Reddedildi</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-2xl shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/5" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Gift className="w-4 h-4" />
              <span>Hediyeleşme & Transfer</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Hediye Merkezi
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Arkadaşlarınıza kredi gönderin veya size gelen hediyeleri yönetin. Paylaşmak güzeldir!
            </p>
          </div>

          <div className="relative shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center animate-pulse">
              <Gift className="w-16 h-16 md:w-20 md:h-20 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="send" value={activeTab} onValueChange={setActiveTab} className="space-y-12">
        <div className="flex justify-center">
          <TabsList className="h-auto p-1.5 bg-muted/30 border border-border/50 rounded-2xl backdrop-blur-sm">
            <TabsTrigger 
              value="send" 
              className="px-8 py-3 rounded-xl gap-2 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all duration-300"
            >
              <Send className="w-4 h-4" /> Hediye Gönder
            </TabsTrigger>
            <TabsTrigger 
              value="inbox" 
              className="px-8 py-3 rounded-xl gap-2 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all duration-300"
            >
              <Inbox className="w-4 h-4" /> Gelen Kutusu
            </TabsTrigger>
            <TabsTrigger 
              value="sent" 
              className="px-8 py-3 rounded-xl gap-2 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all duration-300"
            >
              <History className="w-4 h-4" /> Gönderilenler
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="send" className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column: Form */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="border-border/50 bg-card/50 shadow-xl shadow-primary/5 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Transfer İşlemi
                  </CardTitle>
                  <CardDescription>
                    Kullanıcı adı ve miktar girerek hızlıca kredi transferi yapın.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {!isAuthenticated ? (
                    <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Giriş Yapmalısınız</AlertTitle>
                      <AlertDescription>
                        Hediye göndermek için lütfen giriş yapın.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      {/* Step 1: Search User */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Alıcı Kullanıcı</label>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                          <div className="relative flex gap-2">
                            <div className="relative flex-1">
                              <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                              <Input
                                placeholder="Kullanıcı adı girin..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearchUser()}
                                className="pl-12 h-12 bg-background border-border/50 focus:border-primary/50 rounded-xl text-lg"
                                disabled={!!selectedUser}
                              />
                            </div>
                            {selectedUser ? (
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="h-12 w-12 rounded-xl border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:hover:bg-red-900/20"
                                onClick={() => { setSelectedUser(null); setSearchQuery(""); }}
                              >
                                <XCircle className="w-5 h-5" />
                              </Button>
                            ) : (
                              <Button 
                                className="h-12 px-6 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20"
                                onClick={handleSearchUser} 
                                disabled={isSearching}
                              >
                                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Selected User Preview */}
                      <AnimatePresence>
                        {selectedUser && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                            animate={{ opacity: 1, height: "auto", scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10 flex items-center gap-4 relative overflow-hidden group">
                              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                              
                              <Avatar className="w-14 h-14 border-2 border-background shadow-lg ring-2 ring-primary/10">
                                <AvatarImage src={`https://mc-heads.net/avatar/${selectedUser.username}`} />
                                <AvatarFallback>{selectedUser.username[0]}</AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 relative z-10">
                                <h4 className="font-bold text-lg flex items-center gap-2">
                                  {selectedUser.username}
                                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 text-[10px] px-1.5 py-0 h-5">Doğrulandı</Badge>
                                </h4>
                                <p className="text-sm text-muted-foreground">Transfer alıcısı</p>
                              </div>
                              
                              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                                <CheckCircle2 className="w-6 h-6" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Separator className="bg-border/50" />

                      {/* Step 2: Amount */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-muted-foreground ml-1">Gönderilecek Miktar</label>
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                            Bakiye: {user?.balance || 0} {currency}
                          </span>
                        </div>
                        
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                          <div className="relative">
                            <Wallet className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="pl-12 h-12 bg-background border-border/50 focus:border-primary/50 rounded-xl text-lg font-mono font-medium"
                              min="0"
                            />
                            <div className="absolute right-4 top-3.5 text-sm font-bold text-muted-foreground">
                              {currency}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button 
                        className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" 
                        onClick={handleSendGift}
                        disabled={isSending || !selectedUser || !amount}
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            İşlem Yapılıyor...
                          </>
                        ) : (
                          <>
                            Transferi Tamamla <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Info / Tips */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border/50 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Bilgilendirme</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p>Gönderilen hediyeler alıcı tarafından kabul edilene kadar "Bekliyor" durumunda kalır.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <p>Reddedilen hediyeler bakiyenize iade edilir.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <p>İşlemler anlık olarak gerçekleşir ve geri alınamaz (alıcı kabul ettikten sonra).</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inbox" className="max-w-4xl mx-auto">
          <Card className="border-border/50 bg-card/50 shadow-lg overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary" />
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-primary" />
                    Gelen Kutusu
                  </CardTitle>
                  <CardDescription>Size gönderilen hediyeleri buradan yönetebilirsiniz.</CardDescription>
                </div>
                <Badge variant="secondary" className="h-8 px-3 bg-primary/10 text-primary border-primary/20">
                  {receivedGifts.length} Mesaj
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingHistory ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="text-muted-foreground">Yükleniyor...</p>
                </div>
              ) : receivedGifts.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {receivedGifts.map((gift) => (
                    <motion.div 
                      key={gift.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group flex flex-col md:flex-row items-center gap-6 p-6 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 w-full">
                        <div className="relative">
                          <Avatar className="w-12 h-12 border-2 border-background shadow-sm group-hover:scale-105 transition-transform">
                            <AvatarImage src={`https://mc-heads.net/avatar/${gift.sender?.username}`} />
                            <AvatarFallback>?</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                            <Gift className="w-3 h-3 text-primary-foreground" />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{gift.sender?.username || "Bilinmeyen"}</span>
                            <span className="text-muted-foreground">size hediye gönderdi</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md">
                              <Clock className="w-3 h-3" /> {formatDate(gift.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                          <div className="text-2xl font-black text-primary tracking-tight">+{gift.amount} {currency}</div>
                          <div className="flex justify-end mt-1">{getStatusBadge(gift.status)}</div>
                        </div>

                        {gift.status === "pending" && (
                          <div className="flex gap-2 pl-4 border-l border-border/50">
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-10 w-10 rounded-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:border-red-900/30 dark:hover:bg-red-900/20"
                              onClick={() => handleRejectGift(gift.id)}
                              disabled={!!processingGiftId}
                              title="Reddet"
                            >
                              {processingGiftId === gift.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-5 h-5" />}
                            </Button>
                            <Button 
                              size="icon" 
                              className="h-10 w-10 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20"
                              onClick={() => handleAcceptGift(gift.id)}
                              disabled={!!processingGiftId}
                              title="Kabul Et"
                            >
                              {processingGiftId === gift.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                  <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6 ring-8 ring-primary/5 animate-pulse">
                    <Inbox className="w-10 h-10 text-primary/40" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Gelen Kutusu Boş</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Henüz size gönderilmiş bir hediye bulunmuyor. Arkadaşlarınız size hediye gönderdiğinde burada görünecek.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent" className="max-w-4xl mx-auto">
          <Card className="border-border/50 bg-card/50 shadow-lg overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary" />
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    Gönderilenler
                  </CardTitle>
                  <CardDescription>Gönderdiğiniz hediyelerin durumunu buradan takip edebilirsiniz.</CardDescription>
                </div>
                <Badge variant="secondary" className="h-8 px-3 bg-primary/10 text-primary border-primary/20">
                  {sentGifts.length} İşlem
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingHistory ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="text-muted-foreground">Yükleniyor...</p>
                </div>
              ) : sentGifts.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {sentGifts.map((gift) => (
                    <motion.div 
                      key={gift.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col md:flex-row items-center gap-6 p-6 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 w-full">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border border-border">
                          <ArrowRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Alıcı:</span>
                            <span className="font-bold text-lg">{gift.receiver?.username || "Bilinmeyen"}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md">
                              <Clock className="w-3 h-3" /> {formatDate(gift.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-muted-foreground tracking-tight">-{gift.amount} {currency}</div>
                          <div className="flex justify-end mt-1">{getStatusBadge(gift.status)}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                  <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6 ring-8 ring-primary/5">
                    <Send className="w-10 h-10 text-primary/40" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Henüz Hediye Göndermediniz</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                    Sevdiklerinize kredi göndererek onları mutlu edebilirsiniz. İlk hediyenizi göndermeye ne dersiniz?
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("send")}
                    className="gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary"
                  >
                    Hediye Gönder <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
