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
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import imageLinkGenerate from "@/lib/helpers/imageLinkGenerate";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { AuthContext } from "@/lib/context/AuthContext";
import { useContext } from "react";
import TurnstileWidget from "@/components/ui/turnstile-widget";
import { useRouter } from "next/navigation";

export default function SignInForm({
  bannerImage,
  logo,
  turnstilePublicKey,
  returnUrl,
}: {
  bannerImage: string;
  logo: string;
  turnstilePublicKey?: string;
  returnUrl?: string;
}) {
  const { signIn } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error on new submission
    
    if (turnstilePublicKey && !turnstileToken) {
      setError("Lütfen Turnstile doğrulamasını tamamlayın");
      return;
    }

    setIsLoading(true);
    try {
      await signIn(username, password, turnstileToken, rememberMe);
      
      // Use setTimeout to ensure the redirect happens after the state updates
      setTimeout(() => {
        let targetUrl = returnUrl || "/home";
        
        // Ensure the URL starts with / if it's a relative path
        if (targetUrl && !targetUrl.startsWith("http") && !targetUrl.startsWith("/")) {
          targetUrl = "/" + targetUrl;
        }
        
        // Try router.push first, fallback to window.location if needed
        try {
          router.push(targetUrl);
        } catch (routerError) {
          window.location.href = targetUrl;
        }
      }, 100);
      
    } catch (error: any) {
      console.error("Sign in error:", error); // Debug için log
      
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
        setError("Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.");
        // Try to log stringified error for debugging
        try {
          console.error("Stringified error:", JSON.stringify(error));
        } catch (e) {
          // ignore
        }
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
    <div className="w-full lg:grid lg:grid-cols-2 min-h-screen">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto grid w-full max-w-[450px] gap-6">
          <div className="flex flex-col space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <Image
                src={imageLinkGenerate(logo)}
                alt="Logo"
                width={80}
                height={80}
                className="flex-shrink-0"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Giriş Yap</h1>
            <p className="text-muted-foreground">
              Hesabınıza giriş yapın ve oyuna devam edin
            </p>
          </div>

          {/* Hata mesajı gösterimi */}
          {error && (
            <div className="flex items-start space-x-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <Input
                id="username"
                placeholder="Kullanıcı adınız"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(null);
                }}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                <a
                  href="/auth/password/forgot"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Şifremi unuttum?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                  </span>
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
                disabled={isLoading}
              />
              <Label htmlFor="remember-me" className="text-sm font-normal">
                Beni hatırla
              </Label>
            </div>

            {turnstilePublicKey && (
              <div className="flex justify-center w-full my-2">
                <TurnstileWidget
                  sitekey={turnstilePublicKey}
                  onVerify={handleTurnstileVerify}
                  onError={handleTurnstileError}
                  hasError={turnstileError}
                />
              </div>
            )}

            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Hesabınız yok mu?{" "}
            <a
              href="/auth/sign-up"
              className="font-medium text-primary hover:underline"
            >
              Kayıt Ol
            </a>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative h-full w-full">
        <Image
          src={imageLinkGenerate(bannerImage)}
          alt="Banner"
          fill
          className="object-cover dark:brightness-[0.7]"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-10 text-center">
          <h2 className="text-4xl font-bold mb-4">Tekrar Hoşgeldiniz!</h2>
          <p className="text-lg text-white/90 max-w-md">
            Maceraya kaldığınız yerden devam etmek için giriş yapın. Sizi tekrar görmek harika!
          </p>
        </div>
      </div>
    </div>
  );
}
