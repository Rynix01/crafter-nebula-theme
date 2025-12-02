"use client";

import { useState, useEffect } from "react";
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
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { AuthContext } from "@/lib/context/AuthContext";
import { useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordForm({
  bannerImage,
  logo,
}: {
  bannerImage: string;
  logo: string;
}) {
  const { resetPassword } = useContext(AuthContext);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError("Geçersiz veya eksik sıfırlama token'ı. Lütfen e-postanızdaki bağlantıyı kullanın.");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error on new submission
    setSuccess(false);
    
    if (!token) {
      setError("Geçersiz sıfırlama token'ı.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Şifreler eşleşmiyor. Lütfen aynı şifreyi girin.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      
      setSuccess(true);
      setError(null);
      
      // Redirect to sign-in page after 3 seconds
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 3000);
      
    } catch (error: any) {
      console.error("Reset password error:", error);
      
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
        setError("Şifre sıfırlanırken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setIsLoading(false);
    }
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
                Şifre Sıfırla
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Yeni şifrenizi girin ve hesabınızı güvenli hale getirin
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
                  Şifreniz başarıyla sıfırlandı! 3 saniye sonra giriş sayfasına yönlendirileceksiniz.
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

          {!success && token ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-foreground">
                  Yeni Şifre
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError(null); // Input değiştiğinde hatayı temizle
                    }}
                    required
                    className="pr-10 border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-all"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-muted text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">
                  Şifre Tekrar
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError(null); // Input değiştiğinde hatayı temizle
                    }}
                    required
                    className="pr-10 border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-all"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-muted text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sıfırlanıyor..." : "Şifreyi Sıfırla"}
              </Button>
            </form>
          ) : !token ? (
            <div className="text-center text-sm text-muted-foreground">
              <p>Geçersiz veya eksik sıfırlama token'ı.</p>
              <Button
                variant="link"
                className="p-0 text-foreground hover:text-muted-foreground mt-2"
                onClick={() => router.push("/auth/forgot-password")}
              >
                Yeni sıfırlama e-postası iste
              </Button>
            </div>
          ) : null}

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
