"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Wallet as WalletIcon,
  User,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Edit3,
  Loader2,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { AuthContext } from "@/lib/context/AuthContext";
import { paymentService } from "@/lib/api/services/paymentService";
import { userService } from "@/lib/api/services/userService";
import { PaymentProvider } from "@/lib/types/payment";
import {
  InitiatePaymentData,
  InitiatePaymentResponse,
} from "@/lib/types/payment";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface WalletProps {
  paymentId?: string | null;
  event?: string | null;
}

export default function Wallet({ paymentId, event }: WalletProps) {
  const router = useRouter();
  const WEBSITE_ID = typeof window !== 'undefined' ? localStorage.getItem("websiteId") : null;
  const { isAuthenticated, isLoading, user, reloadUser } =
    useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/auth/sign-in?return=/wallet");
    }
  }, [isAuthenticated, isLoading, router]);

  // Create service instances for client-side usage
  const paymentServiceInstance = paymentService();
  const userServiceInstance = userService();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [currentCredit, setCurrentCredit] = useState(user?.balance || 0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("credit-card");
  const [amount, setAmount] = useState("");
  const [billingInfo, setBillingInfo] = useState({
    fullName: "",
    username: user?.username || "",
    email: user?.email || "",
    phone: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [tempEmail, setTempEmail] = useState("");

  // Payment dialog states
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentResponse, setPaymentResponse] =
    useState<InitiatePaymentResponse | null>(null);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  // Payment status notification states
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"COMPLETED" | "FAILED" | "PENDING" | "ERROR" | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  // Payment check effect
  useEffect(() => {
    const checkPayment = async () => {
      if (event === "check" && paymentId) {
        setIsCheckingPayment(true);
        setShowPaymentStatus(true);
        
        try {
          const result = await paymentServiceInstance.checkPayment({
            website_id: WEBSITE_ID || "",
            payment_id: paymentId
          });
          
          if (result.success) {
            setPaymentStatus(result.status);
          } else {
            setPaymentStatus("ERROR");
          }
        } catch (error) {
          console.error("Payment check failed:", error);
          setPaymentStatus("ERROR");
        } finally {
          setIsCheckingPayment(false);
        }
      }
    };

    checkPayment();
  }, [event, paymentId]);

  useEffect(() => {
    // Initialize billing info with user data
    if (user) {
      setBillingInfo((prev) => ({
        ...prev,
        username: user.username || "",
        email: user.email || "",
      }));
      setTempEmail(user.email || "");
      // Update current credit when user data changes
      setCurrentCredit(user.balance || 0);
    }

    paymentServiceInstance
      .getPaymentProviders()
      .then((providers) => {
        setPaymentMethods(
          providers.map((provider: PaymentProvider) => ({
            id: provider.id,
            name: provider.name,
            icon: <CreditCard className="h-5 w-5" />,
            description: provider.description,
          }))
        );
      });
  }, [user]);

  // Handle payment status from URL params
  useEffect(() => {
    if (paymentStatus && paymentId && !isCheckingPayment) {
      // If payment is completed, refresh user data to get updated balance
      if (paymentStatus === "COMPLETED" && user) {
        // Refresh user data after a short delay to allow backend to process
        const refreshTimer = setTimeout(async () => {
          try {
            await reloadUser();
            router.replace("/wallet");
            // Update local credit state with new user data
            if (user.balance !== undefined) {
              setCurrentCredit(user.balance);
            }
            toast.success("Ödeme başarılı! Krediniz yüklendi.");
          } catch (error) {
            console.error("Failed to refresh user data:", error);
          }
        }, 2000);

        return () => clearTimeout(refreshTimer);
      }

      // Auto-hide the notification after 5 seconds
      const timer = setTimeout(() => {
        setShowPaymentStatus(false);
        // Clear URL parameters to prevent showing notification again on refresh
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.searchParams.delete("event");
          url.searchParams.delete("paymentId");
          window.history.replaceState({}, "", url.toString());
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [paymentStatus, paymentId, user, isCheckingPayment]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setAmount(value);
    }
  };

  const handleBillingInfoChange = (field: string, value: string) => {
    setBillingInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEmailEdit = () => {
    setIsEmailEditing(true);
    setTempEmail(billingInfo.email);
  };

  const handleEmailSave = async () => {
    if (!user || !tempEmail || tempEmail === billingInfo.email) {
      setIsEmailEditing(false);
      return;
    }

    setIsUpdatingEmail(true);
    try {
      await userServiceInstance.updateUser(user.id, { email: tempEmail });
      setBillingInfo((prev) => ({ ...prev, email: tempEmail }));
      setIsEmailEditing(false);
      toast.success("E-posta adresi güncellendi.");
    } catch (error) {
      console.error("Email güncellenirken hata oluştu:", error);
      toast.error("E-posta güncellenemedi.");
      // Reset to original email on error
      setTempEmail(billingInfo.email);
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleEmailCancel = () => {
    setIsEmailEditing(false);
    setTempEmail(billingInfo.email);
  };

  const handlePayment = async () => {
    if (!termsAccepted || !amount || parseFloat(amount) <= 0) {
      return;
    }

    setIsProcessing(true);

    try {
      const paymentData: InitiatePaymentData = {
        websiteId: WEBSITE_ID || "",
        providerId: selectedPaymentMethod,
        amount: parseFloat(amount),
        currency: "TRY",
        basket: [
          {
            name: "Kredi Yükleme",
            price: amount,
            quantity: 1,
          },
        ],
        user: {
          name: billingInfo.fullName,
          email: billingInfo.email,
          phone: billingInfo.phone,
          address: "Türkiye",
        },
      };

      const response = await paymentServiceInstance.initiatePayment(paymentData);

      if (response.success) {
        setPaymentResponse(response);
        setShowPaymentDialog(true);

        if (response.type === "redirect") {
          // Redirect to payment URL
          window.location.href = response.redirectUrl;
        }
        // If iframe, it will be displayed in the dialog
      } else {
        console.error("Ödeme başlatılamadı");
        toast.error("Ödeme başlatılamadı.");
      }
    } catch (error) {
      console.error("Ödeme işlemi sırasında hata:", error);
      toast.error("Bir hata oluştu.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = () => {
    return (
      billingInfo.fullName &&
      billingInfo.phone &&
      termsAccepted &&
      amount &&
      parseFloat(amount) > 0
    );
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-2xl shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        
        <div className="relative px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-sm font-medium">
              <WalletIcon className="w-4 h-4" />
              <span>Cüzdan & Bakiye</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Bakiye Yükle
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Güvenli ödeme yöntemleriyle hesabınıza anında kredi yükleyin ve alışverişin tadını çıkarın.
            </p>
          </div>

          <div className="relative shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center animate-pulse">
              <CreditCard className="w-16 h-16 md:w-20 md:h-20 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Notification */}
      {showPaymentStatus && (
        isCheckingPayment ? (
          <div className="mb-6">
            <Card className="border-yellow-500/20 bg-yellow-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 text-yellow-600 animate-spin" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      Ödeme durumu kontrol ediliyor...
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Lütfen bekleyin, ödeme durumunuzu alıyoruz.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : paymentStatus && paymentId ? (
          <div className="mb-6">
            <Card
              className={`${
                paymentStatus === "COMPLETED"
                  ? "border-green-500/20 bg-green-500/5"
                  : paymentStatus === "FAILED"
                  ? "border-red-500/20 bg-red-500/5"
                  : "border-yellow-500/20 bg-yellow-500/5"
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  {paymentStatus === "COMPLETED" ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : paymentStatus === "FAILED" ? (
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {paymentStatus === "COMPLETED"
                        ? "Ödeme Başarılı!"
                        : paymentStatus === "FAILED"
                        ? "Ödeme Başarısız"
                        : "Ödeme Durumu"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {paymentStatus === "COMPLETED"
                        ? "Krediniz başarıyla yüklendi. Krediniz güncelleniyor..."
                        : paymentStatus === "FAILED"
                        ? "Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin."
                        : "Ödeme işleminiz işleniyor."}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPaymentStatus(false)}
                    className="h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Taraf - Mevcut Kredi ve Billing Bilgileri */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mevcut Kredi Kartı */}
          <Card className="border-none shadow-xl overflow-hidden relative bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-8 -mb-8" />
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2 text-blue-100">
                <WalletIcon className="h-5 w-5" />
                Mevcut Bakiyeniz
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black tracking-tight">
                  {currentCredit.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                <span className="text-xl font-medium text-blue-200">₺</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-blue-100 text-sm max-w-[60%]">
                  Bu bakiye ile mağazadaki tüm ürünleri satın alabilirsiniz.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={async () => {
                    try {
                      await reloadUser();
                      if (user?.balance !== undefined) {
                        setCurrentCredit(user.balance);
                      }
                      toast.success("Bakiye güncellendi");
                    } catch (error) {
                      console.error("Failed to refresh user data:", error);
                    }
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Yenile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Billing Bilgileri */}
          <Card className="border-border/50 bg-card/50 shadow-lg overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Fatura Bilgileri
              </CardTitle>
              <CardDescription>
                Ödeme işlemi için gerekli bilgileri doldurun
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">İsim Soyisim <span className="text-red-500">*</span></Label>
                  <Input
                    id="fullName"
                    value={billingInfo.fullName}
                    onChange={(e) =>
                      handleBillingInfoChange("fullName", e.target.value)
                    }
                    placeholder="Adınız Soyadınız"
                    className="h-11 bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Kullanıcı Adı</Label>
                  <Input
                    id="username"
                    value={billingInfo.username}
                    disabled
                    className="h-11 bg-muted/50 cursor-not-allowed"
                    placeholder="Kullanıcı adı"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta Adresi</Label>
                  <div className="flex gap-2">
                    {isEmailEditing ? (
                      <>
                        <Input
                          id="email"
                          type="email"
                          value={tempEmail}
                          onChange={(e) => setTempEmail(e.target.value)}
                          placeholder="E-posta adresi"
                          className="flex-1 h-11 bg-background/50"
                        />
                        <Button
                          size="icon"
                          onClick={handleEmailSave}
                          disabled={isUpdatingEmail}
                          className="h-11 w-11 shrink-0 bg-green-500 hover:bg-green-600 text-white"
                        >
                          {isUpdatingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={handleEmailCancel}
                          disabled={isUpdatingEmail}
                          className="h-11 w-11 shrink-0"
                        >
                          <AlertCircle className="w-4 h-4 rotate-45" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Input
                          id="email"
                          type="email"
                          value={billingInfo.email}
                          disabled
                          className="flex-1 h-11 bg-muted/50 cursor-not-allowed"
                          placeholder="E-posta adresi"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={handleEmailEdit}
                          className="h-11 w-11 shrink-0"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon <span className="text-red-500">*</span></Label>
                  <Input
                    id="phone"
                    value={billingInfo.phone}
                    onChange={(e) =>
                      handleBillingInfoChange("phone", e.target.value)
                    }
                    placeholder="+90 5XX XXX XX XX"
                    className="h-11 bg-background/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ödeme Özeti */}
          <Card className="border-border/50 bg-card/50 shadow-lg overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                Ödeme Özeti
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-base">Yüklenecek Miktar (₺) <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-lg font-bold text-muted-foreground">₺</span>
                  <Input
                    id="amount"
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    className="pl-10 h-14 text-xl font-bold bg-background/50"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 space-y-3 border border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Yüklenecek Kredi:</span>
                  <span className="font-medium">₺{amount || "0.00"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">İşlem Ücreti:</span>
                  <span className="font-medium text-green-600">Ücretsiz</span>
                </div>
                <Separator className="bg-border/50" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Toplam Tutar:</span>
                  <span className="text-primary">₺{amount || "0.00"}</span>
                </div>
              </div>

              {/* Onay Checkbox */}
              <div className="flex items-start space-x-3 pt-2">
                <Switch
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={setTermsAccepted}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                  <span className="text-red-500">*</span>{" "}
                  <a href="#" className="text-primary hover:underline font-medium">
                    Kullanım şartlarını
                  </a>{" "}
                  ve{" "}
                  <a href="#" className="text-primary hover:underline font-medium">
                    gizlilik politikasını
                  </a>{" "}
                  okudum ve kabul ediyorum.
                </Label>
              </div>

              {/* Ödeme Butonu */}
              <Button
                onClick={handlePayment}
                disabled={!isFormValid() || isProcessing}
                className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Ödeme İşleniyor...
                  </>
                ) : (
                  <>
                    Güvenli Ödeme Yap <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              {!isFormValid() && (
                <div className="flex items-center justify-center gap-2 text-sm text-red-500 bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                  <AlertCircle className="h-4 w-4" />
                  Lütfen tüm zorunlu alanları doldurun ve şartları kabul edin
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sağ Taraf - Ödeme Yöntemi */}
        <div className="space-y-6">
          {/* Ödeme Yöntemi Seçimi */}
          <Card className="border-border/50 bg-card/50 shadow-lg overflow-hidden relative h-fit sticky top-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-500" />
                Ödeme Yöntemi
              </CardTitle>
              <CardDescription>
                Tercih ettiğiniz ödeme yöntemini seçin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {paymentMethods.length > 0 ? (
                paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${
                      selectedPaymentMethod === method.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border/50 hover:border-primary/30 hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedPaymentMethod === method.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-foreground">{method.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {method.description}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === method.id
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {selectedPaymentMethod === method.id && (
                        <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 opacity-50" />
                  <p>Ödeme yöntemleri yükleniyor...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Dialog for iframe */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] p-0 overflow-hidden border-none bg-background/95 backdrop-blur-xl">
          <DialogHeader className="p-6 pb-4 border-b border-border/50">
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              Güvenli Ödeme İşlemi
            </DialogTitle>
          </DialogHeader>
          {paymentResponse && paymentResponse.type === "iframe" && (
            <div
              className="w-full h-[calc(90vh-80px)] overflow-hidden bg-white"
              dangerouslySetInnerHTML={{
                __html: paymentResponse.iframeHtml.replace(
                  /<iframe/g,
                  '<iframe style="width: 100% !important; height: 100% !important; border: none !important; margin: 0 !important; padding: 0 !important;"'
                ),
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
