import React from "react";
import * as LucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { FaDiscord, FaTiktok, FaGithub, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";

export default function renderIcon(iconName: string, width: number = 8, height: number = 8) {
  if (!iconName) {
    return <HelpCircle className={`w-${width} h-${height} text-slate-900`} />;
  }
  const IconComponent = (LucideIcons as any)[iconName];
  if (IconComponent) {
    return React.createElement(IconComponent, { className: `w-${width} h-${height} dark:text-white text-black` });
  }
  return <HelpCircle className={`w-${width} h-${height} text-slate-900`} />;
}; 

export function getSocialIcon(iconName: string, width: number = 8, height: number = 8) {
  const className = `w-${width} h-${height} dark:text-white text-black`;
  switch (iconName) {
    case "discord": return <FaDiscord className={className} />;
    case "github": return <FaGithub className={className} />;
    case "instagram": return <FaInstagram className={className} />;
    case "tiktok": return <FaTiktok className={className} />;
    case "twitter": return <FaXTwitter className={className} />;
    case "youtube": return <FaYoutube className={className} />;
    default: return null;
  }
}

export function renderSocialIcon(iconName: string, link: string, text?: string, width: number = 8, height: number = 8) {
  return (
    <Link key={iconName} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
      {getSocialIcon(iconName, width, height)}
      {text && <span>{text}</span>}
    </Link>
  );
}