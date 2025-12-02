import { DefaultBreadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Search, RefreshCw, Smile } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted ">
      
      <div className="container mx-auto px-4 py-16 pt-40">

        <div className="flex flex-col items-center justify-center space-y-8">
          
          {/* Main 404 Display */}
          <div className="text-center space-y-4">
            <div className="relative">
              <h1 className="text-9xl font-black text-muted-foreground/20 select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-bold text-foreground">
                    Oops! Sayfa Kayboldu
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-md">
                    Bu sayfa bir creeper gibi patladı ve kayboldu! 💥
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fun Message Card */}
          <Card className="w-full max-w-md border-dashed border-2 border-muted-foreground/30">
            <CardContent className="space-y-4">
              
              <div className="text-center text-sm text-muted-foreground">
                <p>Bu sayfa ya yok ya da henüz craft edilmemiş!</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button asChild className="flex-1" size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Ana Sayfaya Dön
              </Link>
            </Button>
          </div>

          {/* Search Suggestion */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Aradığınız bir şey mi? Belki yardım sayfamızda bulabilirsiniz!
            </p>
            <Button variant="ghost" asChild size="sm">
              <Link href="/help">
                <Search className="mr-2 h-3 w-3" />
                Yardım Ara
              </Link>
            </Button>
          </div>

          {/* Fun Footer */}
          <div className="text-center pt-8">
            <p className="text-xs text-muted-foreground/60">
              💡 İpucu: Bu sayfayı bookmark'layın, belki bir gün geri gelir!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}