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

export default function SignUpForm({
  bannerImage,
  logo,
  turnstilePublicKey,
}: {
  bannerImage: string;
  logo: string;
  turnstilePublicKey?: string;
}) {
  const { signUp } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!username.trim()) {
      setError("Kullanıcı adı gereklidir");
      return false;
    }
    
    if (!email.trim()) {
      setError("E-posta gereklidir");
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Geçerli bir e-posta adresi giriniz");
      return false;
    }
    
    if (!password) {
      setError("Şifre gereklidir");
      return false;
    }
    
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return false;
    }
    
    if (password !== passwordRepeat) {
      setError("Şifreler eşleşmiyor");
      return false;
    }
    
    if (turnstilePublicKey && !turnstileToken) {
      setError("Lütfen Turnstile doğrulamasını tamamlayın");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error on new submission
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await signUp({
        username,
        email,
        password,
        confirm_password: passwordRepeat,
        turnstileToken,
      });
      router.push("/home");
    } catch (error: any) {
      console.error("Sign up error:", error); // Debug için log
      
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
        setError("Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.");
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
            <h1 className="text-3xl font-bold tracking-tight">Kayıt Ol</h1>
            <p className="text-muted-foreground">
              Hesabınızı oluşturun ve oyuna devam edin
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
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                placeholder="E-posta adresiniz"
                type="email"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Şifre</Label>
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
              {password && (
                <div className="text-xs text-muted-foreground">
                  {password.length < 6 ? (
                    <span className="text-destructive">Şifre çok kısa</span>
                  ) : password.length < 8 ? (
                    <span className="text-yellow-600">Şifre orta güçte</span>
                  ) : (
                    <span className="text-green-600">Şifre güçlü</span>
                  )}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Şifre Tekrar</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  placeholder="••••••••"
                  type={showPasswordRepeat ? "text" : "password"}
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={passwordRepeat}
                  onChange={(e) => {
                    setPasswordRepeat(e.target.value);
                    setError(null);
                  }}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPasswordRepeat(!showPasswordRepeat)}
                  disabled={isLoading}
                >
                  {showPasswordRepeat ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPasswordRepeat ? "Şifreyi gizle" : "Şifreyi göster"}
                  </span>
                </Button>
              </div>
              {passwordRepeat && (
                <div className="text-xs text-muted-foreground">
                  {password === passwordRepeat ? (
                    <span className="text-green-600">Şifreler eşleşiyor</span>
                  ) : (
                    <span className="text-destructive">Şifreler eşleşmiyor</span>
                  )}
                </div>
              )}
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
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Kayıt olunuyor...</span>
                </div>
              ) : (
                "Kayıt Ol"
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Hesabınız var mı?{" "}
            <a
              href="/auth/sign-in"
              className="font-medium text-primary hover:underline"
            >
              Giriş Yap
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
          <h2 className="text-4xl font-bold mb-4">Aramıza Katılın!</h2>
          <p className="text-lg text-white/90 max-w-md">
            Eşsiz bir deneyim ve sınırsız eğlence için hemen hesabınızı oluşturun. Sizi aramızda görmekten mutluluk duyarız!
          </p>
        </div>
      </div>
    </div>
  );
}
