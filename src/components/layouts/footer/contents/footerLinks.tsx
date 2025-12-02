"use client";

import Link from "next/link";
import Image from "next/image";
import imageLinkGenerate from "@/lib/helpers/imageLinkGenerate";
import { 
  Twitter, 
  Instagram, 
  Youtube, 
  MessageCircle, 
  Github,
  Music2
} from "lucide-react";
import { Website } from "@/lib/types/website";

interface FooterLinksProps {
  logoImage: string;
  name: string;
  description: string;
  socialMedia: {
    instagram: string;
    tiktok: string;
    github: string;
    twitter: string;
    youtube: string;
    discord: string;
  };
  quickLinks: Website["theme"]["navbar"];
}

export default function FooterLinks({
  logoImage,
  name,
  description,
  socialMedia,
  quickLinks
}: FooterLinksProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16 border-b border-border/40">
      {/* Brand Column */}
      <div className="space-y-6">
        <Link href="/" className="flex items-center gap-3 group w-fit">
          <div className="relative w-14 h-14 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 group-hover:border-primary/50 transition-all duration-300 shadow-lg shadow-primary/5 flex items-center justify-center">
            {logoImage ? (
              <Image
                src={imageLinkGenerate(logoImage)}
                alt={name}
                width={56}
                height={56}
                className="object-contain p-1.5"
              />
            ) : (
              <div className="w-full h-full bg-primary/20" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-2xl tracking-tight group-hover:text-primary transition-colors">{name}</span>
          </div>
        </Link>
        
        <p className="text-muted-foreground leading-relaxed text-sm">
          {description || "En iyi Minecraft deneyimi için doğru adrestesiniz. Topluluğumuza katılın ve maceraya hemen başlayın!"}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {socialMedia?.discord && <SocialButton icon={<MessageCircle className="w-4 h-4" />} href={socialMedia.discord} label="Discord" />}
          {socialMedia?.twitter && <SocialButton icon={<Twitter className="w-4 h-4" />} href={socialMedia.twitter} label="Twitter" />}
          {socialMedia?.instagram && <SocialButton icon={<Instagram className="w-4 h-4" />} href={socialMedia.instagram} label="Instagram" />}
          {socialMedia?.youtube && <SocialButton icon={<Youtube className="w-4 h-4" />} href={socialMedia.youtube} label="Youtube" />}
          {socialMedia?.tiktok && <SocialButton icon={<Music2 className="w-4 h-4" />} href={socialMedia.tiktok} label="TikTok" />}
          {socialMedia?.github && <SocialButton icon={<Github className="w-4 h-4" />} href={socialMedia.github} label="GitHub" />}
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-6 lg:pl-8">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Hızlı Erişim
        </h3>
        <ul className="space-y-3">
          {quickLinks && quickLinks.length > 0 ? (
            quickLinks.map((link, index) => (
              <FooterLink key={index} href={link.url}>{link.label}</FooterLink>
            ))
          ) : (
            <>
              <FooterLink href="/home">Ana Sayfa</FooterLink>
              <FooterLink href="/store">Mağaza</FooterLink>
              <FooterLink href="/vote">Oy Ver</FooterLink>
              <FooterLink href="/posts">Haberler</FooterLink>
            </>
          )}
        </ul>
      </div>

      {/* Support */}
      <div className="space-y-6">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Destek
        </h3>
        <ul className="space-y-3">
          <FooterLink href="/support">Destek Talebi</FooterLink>
          <FooterLink href="/help">Yardım Merkezi</FooterLink>
          <FooterLink href="/punishments">Cezalar</FooterLink>
        </ul>
      </div>

      {/* Legal */}
      <div className="space-y-6">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Kurumsal
        </h3>
        <ul className="space-y-3">
          <FooterLink href="/legal/terms">Kullanım Şartları</FooterLink>
          <FooterLink href="/legal/privacy">Gizlilik Politikası</FooterLink>
          <FooterLink href="/legal/rules">Sunucu Kuralları</FooterLink>
        </ul>
      </div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-muted-foreground hover:text-primary hover:pl-1 transition-all duration-200 text-sm flex items-center gap-2 w-fit"
      >
        <span className="w-1 h-1 rounded-full bg-primary/50 opacity-0 hover:opacity-100 transition-opacity" />
        {children}
      </Link>
    </li>
  );
}

function SocialButton({ icon, href, label }: { icon: React.ReactNode; href: string; label: string }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-xl bg-background/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
    >
      {icon}
    </a>
  );
}
