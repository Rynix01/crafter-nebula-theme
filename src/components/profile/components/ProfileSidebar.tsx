"use client";

import React from "react";
import { User } from "@/lib/types/user";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User as UserIcon, 
  Settings, 
  Package, 
  MessageSquare, 
  Shield, 
  LogOut,
  Calendar,
  Wallet
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { getUserAvatarUrl } from "@/lib/helpers/getUserAvatarUrl";

interface ProfileSidebarProps {
  user: User;
  ownUser: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasModerationPermission: boolean;
  currency?: string;
}

export function ProfileSidebar({
  user,
  ownUser,
  activeTab,
  setActiveTab,
  hasModerationPermission,
  currency
}: ProfileSidebarProps) {
  const menuItems = [
    {
      id: "overview",
      label: "Genel Bakış",
      icon: UserIcon,
      show: true
    },
    {
      id: "chest",
      label: "Sandık",
      icon: Package,
      show: true
    },
    {
      id: "wall",
      label: "Duvar",
      icon: MessageSquare,
      show: true
    },
    {
      id: "settings",
      label: "Ayarlar",
      icon: Settings,
      show: ownUser
    },
    {
      id: "moderation",
      label: "Yönetim",
      icon: Shield,
      show: hasModerationPermission && !ownUser
    }
  ];

  return (
    <div className="space-y-6">
      {/* User Card */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-xl shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent h-32" />
        
        <div className="relative px-6 pt-12 pb-6 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-background shadow-2xl">
              <AvatarImage src={getUserAvatarUrl(user)} alt={user.username} />
              <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-background rounded-full" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight">{user.username}</h2>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="font-semibold">
                {user.role?.name || "Oyuncu"}
              </Badge>
              {ownUser && (
                <Badge variant="outline" className="border-primary/20 text-primary">
                  Siz
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-border/50">
            <div className="flex flex-col items-center p-3 rounded-2xl bg-muted/30">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Bakiye</span>
              <span className="text-lg font-bold text-primary flex items-center gap-1">
                <Wallet className="w-4 h-4" />
                {user.balance} {currency}
              </span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-muted/30">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Kayıt</span>
              <span className="text-sm font-semibold flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="rounded-3xl bg-card border border-border/50 p-2 shadow-sm">
        <nav className="space-y-1">
          {menuItems.filter(item => item.show).map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-12 rounded-xl font-medium transition-all duration-200",
                activeTab === item.id 
                  ? "bg-primary/10 text-primary hover:bg-primary/15" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className={cn("w-5 h-5", activeTab === item.id && "text-primary")} />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}
