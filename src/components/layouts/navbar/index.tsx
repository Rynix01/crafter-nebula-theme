"use client";

import Link from "next/link";
import Image from "next/image";
import imageLinkGenerate from "@/lib/helpers/imageLinkGenerate";
import {
  User,
  Menu,
  X,
  Wallet,
  Package,
  LogOut,
  ShoppingCart,
  Gamepad2,
  Globe,
  MessageCircle,
  Twitter,
  Instagram,
  Youtube,
  Sun,
  Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Theme, Website } from "@/lib/types/website";
import {
  useContext,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AuthContext } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter, usePathname } from "next/navigation";
import Cart from "./components/cart";
import renderIcon from "@/lib/helpers/renderIcon";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useMinecraftStatus } from "@/lib/hooks/useMinecraftStatus";
import { getUserAvatarUrl } from "@/lib/helpers/getUserAvatarUrl";

export interface NavbarRef {
  openCart: () => void;
}

const Navbar = forwardRef<
  NavbarRef,
  {
    websiteName: string;
    logoImage?: string;
    navbarLinks: Theme["navbar"];
    serverConfig: { ip: string; port: number };
    socialMedia: Website["social_media"];
  }
>(({ websiteName, logoImage, navbarLinks, serverConfig, socialMedia }, ref) => {
  const { isAuthenticated, user, signOut, isLoading } = useContext(AuthContext);
  const { getItemCount, openCart, closeCart, isCartOpen } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  
  const { status } = useMinecraftStatus({
    hostname: serverConfig.ip,
    port: serverConfig.port
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/home");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useImperativeHandle(ref, () => ({
    openCart,
  }));

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="hidden lg:block bg-black/90 text-white py-2 border-b border-white/5">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-white/70">
              <Globe className="w-3 h-3" />
              {serverConfig.ip}
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="text-green-400">{status?.online || 0} Oyuncu Çevrimiçi</span>
          </div>
          <div className="flex items-center gap-3">
            {socialMedia?.discord && (
              <a href={socialMedia.discord} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <MessageCircle className="w-3 h-3" />
              </a>
            )}
            {socialMedia?.twitter && (
              <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Twitter className="w-3 h-3" />
              </a>
            )}
            {socialMedia?.instagram && (
              <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Instagram className="w-3 h-3" />
              </a>
            )}
            {socialMedia?.youtube && (
              <a href={socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Youtube className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={cn(
          "sticky top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          scrolled
            ? "bg-background/95 backdrop-blur-md border-border/50 shadow-lg py-2"
            : "bg-background/80 backdrop-blur-sm border-transparent py-4"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="/home" 
              className="flex items-center gap-3 group"
            >
              {logoImage ? (
                <div className="relative w-10 h-10 transform group-hover:rotate-6 transition-transform duration-300">
                  <Image
                    src={imageLinkGenerate(logoImage)}
                    alt={websiteName}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="bg-primary text-primary-foreground p-2 rounded-xl transform group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-primary/20">
                  <Gamepad2 className="w-6 h-6" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tighter leading-none">{websiteName.toUpperCase()}</span>
              </div>
            </Link>

            {/* Desktop Navigation - Centered & Modern */}
            <nav className="hidden lg:flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-white/5">
              {navbarLinks.map((link) => {
                const isActive = pathname === link.url;
                return (
                  <Link
                    key={link.index}
                    href={link.url}
                    className={cn(
                      "px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 relative overflow-hidden",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Cart Button */}
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-full border-2 hover:border-primary hover:text-primary transition-colors"
                onClick={openCart}
              >
                <ShoppingCart className="w-5 h-5" />
                {getItemCount() > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] border-2 border-background"
                  >
                    {getItemCount()}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              {isLoading ? (
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              ) : isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors">
                      <Avatar className="h-full w-full">
                        <AvatarImage
                          src={getUserAvatarUrl(user)}
                          alt={user.username}
                        />
                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                    <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg mb-2">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={getUserAvatarUrl(user)} />
                        <AvatarFallback>{user.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-bold truncate">{user.username}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                      </div>
                    </div>
                    
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/profile" className="w-full font-medium">
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/wallet" className="w-full flex justify-between items-center font-medium">
                        Cüzdan
                        <Badge variant="secondary" className="ml-auto bg-green-500/10 text-green-500 hover:bg-green-500/20">
                          {user.balance} ₺
                        </Badge>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/chest" className="w-full font-medium">
                        Sandık
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer font-medium">
                      <LogOut className="mr-2 h-4 w-4" />
                      Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" asChild className="hidden sm:flex font-bold">
                    <Link href="/auth/sign-in">Giriş</Link>
                  </Button>
                  <Button asChild className="font-bold rounded-full px-6 shadow-lg shadow-primary/20">
                    <Link href="/auth/sign-up">Kayıt Ol</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-background/95 backdrop-blur-md p-4 space-y-4 animate-in slide-in-from-top-5">
            <nav className="flex flex-col gap-2">
              {navbarLinks.map((link) => (
                <Link
                  key={link.index}
                  href={link.url}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-bold transition-colors flex items-center gap-3",
                    pathname === link.url
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  )}
                >
                  {renderIcon(link.icon, 5, 5)}
                  {link.label}
                </Link>
              ))}
            </nav>
            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <Button variant="outline" asChild className="w-full font-bold">
                  <Link href="/auth/sign-in">Giriş Yap</Link>
                </Button>
                <Button asChild className="w-full font-bold">
                  <Link href="/auth/sign-up">Kayıt Ol</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
