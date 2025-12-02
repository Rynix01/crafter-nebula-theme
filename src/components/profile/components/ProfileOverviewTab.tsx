"use client";

import React from "react";
import { User } from "@/lib/types/user";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Wallet, 
  Package, 
  MessageSquare, 
  Clock, 
  Shield, 
  Mail,
  Calendar,
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileOverviewTabProps {
  user: User;
  currency?: string;
}

export function ProfileOverviewTab({ user, currency }: ProfileOverviewTabProps) {
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: tr,
    });
  };

  const stats = [
    {
      label: "Bakiye",
      value: `${user.balance} ${currency || "TL"}`,
      icon: Wallet,
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      label: "Sandık Eşyası",
      value: user.chest?.length || 0,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      label: "Duvar Mesajı",
      value: user.wall?.length || 0,
      icon: MessageSquare,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border/50 bg-card/50 hover:bg-card transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Info */}
        <Card className="border-border/50 bg-card/50 h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Kullanıcı Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Email Adresi</span>
              </div>
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Rol</span>
              </div>
              <Badge variant="secondary">{user.role.name}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Kayıt Tarihi</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50 bg-card/50 h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Son Hareketler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for recent activity since we don't have the data yet */}
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-3 text-muted-foreground">
                <Clock className="w-10 h-10 opacity-20" />
                <p className="text-sm">Henüz kaydedilmiş bir hareket bulunmuyor.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
