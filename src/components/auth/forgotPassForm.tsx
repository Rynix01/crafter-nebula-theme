"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import imageLinkGenerate from "@/lib/helpers/imageLinkGenerate";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { AuthContext } from "@/lib/context/AuthContext";
import { useContext } from "react";
import TurnstileWidget from "@/components/ui/turnstile-widget";
import { useRouter } from "next/navigation";

export default function ForgotPasswordForm({
  bannerImage,
  logo,
  turnstilePublicKey,
}: {
  bannerImage: string;
  logo: string;
  turnstilePublicKey?: string;
}) {
  const { forgotPassword } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error on new submission
    setSuccess(false);
    
    if (turnstilePublicKey && !turnstileToken) {
      setError("Lütfen Turnstile doğrulamasını tamamlayın");
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword({
        email,
        turnstileToken: turnstileToken || undefined,
      });
      
      setSuccess(true);
      setError(null);
      
    } catch (error: any) {
      console.error("Forgot password error:", error);
      
      // Backend'den gelen hata mesajını göster
      if (error?.message) {
        if (Array.isArray(error.message)) {
          // Validation errors için
          setError(error.message.join(", "));
        } else {
          // Single error message için
          setError(error.message);
        }
      } else if (error?.response?.data?.message) {
        // Axios error response'dan gelen message
        setError(error.response.data.message);
      } else {
        // Genel hata mesajı
        setError("Şifre sıfırlama e-postası gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTurnstileVerify = (token: string) => {
    setTurnstileToken(token);
    setTurnstileError(false);
    setError(null); // Turnstile doğrulandığında hatayı temizle
  };

  const handleTurnstileError = (error: Error) => {
    console.error("Turnstile error:", error);
    setTurnstileError(true);
    setError("Turnstile doğrulaması başarısız. Lütfen tekrar deneyin.");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${imageLinkGenerate(bannerImage)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="relative flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden"
    >
      <Card className="relative w-full max-w-md bg-card/95 backdrop-blur-sm border-border shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center space-x-4">
            <Image
              src={imageLinkGenerate(logo)}
              alt="Logo"
              width={80}
              height={80}
              className="flex-shrink-0"
            />
            <div className="flex flex-col justify-center text-left">
              <CardTitle className="text-2xl font-bold text-foreground">
                Şifremi Unuttum
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          
          {/* Başarı mesajı gösterimi */}
          {success && (
            <div className="flex items-start space-x-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg animate-in slide-in-from-top-2 duration-300">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-green-500 font-medium">
                  Şifre sıfırlama e-postası gönderildi! Lütfen e-posta kutunuzu kontrol edin.
                </p>
              </div>
            </div>
          )}

          {/* Hata mesajı gösterimi */}
          {error && (
            <div className="flex items-start space-x-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            </div>
          )}

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  E-posta Adresi
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null); // Input değiştiğinde hatayı temizle
                  }}
                  required
                  className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-all"
                />
              </div>

              {turnstilePublicKey && (
                <TurnstileWidget
                  sitekey={turnstilePublicKey}
                  onVerify={handleTurnstileVerify}
                  onError={handleTurnstileError}
                  hasError={turnstileError}
                />
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Gönderiliyor..." : "Şifre Sıfırlama E-postası Gönder"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <Button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                  setTurnstileToken("");
                  setError(null);
                }}
                variant="outline"
                className="w-full"
              >
                Yeni E-posta Gönder
              </Button>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <Button
              variant="link"
              className="p-0 text-foreground hover:text-muted-foreground"
              onClick={() => router.push("/auth/sign-in")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Giriş sayfasına dön
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
