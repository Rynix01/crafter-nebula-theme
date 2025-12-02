"use client";

import React, { useState } from "react";
import { User } from "@/lib/types/user";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Ban, CheckCircle, AlertTriangle, UserX, UserCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface ProfileModerationTabProps {
  user: User;
  onBanUser: (reason: string) => Promise<void>;
  onUnbanUser: () => Promise<void>;
}

export function ProfileModerationTab({ 
  user, 
  onBanUser, 
  onUnbanUser 
}: ProfileModerationTabProps) {
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState("");

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: tr,
    });
  };

  const handleBanUser = async () => {
    if (!banReason.trim()) return;
    
    try {
      await onBanUser(banReason);
      setBanDialogOpen(false);
      setBanReason("");
    } catch (err) {
      // Error handling is done in parent
    }
  };

  const handleUnbanUser = async () => {
    try {
      await onUnbanUser();
    } catch (err) {
      // Error handling is done in parent
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Moderasyon Durumu
          </CardTitle>
          <CardDescription>
            Kullanıcının mevcut durumu ve geçmiş cezaları.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${user.banned ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"}`}>
                {user.banned ? <Ban className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-semibold">Hesap Durumu</h4>
                <p className="text-sm text-muted-foreground">
                  {user.banned ? "Bu hesap şu anda yasaklı." : "Bu hesap aktif ve sorunsuz."}
                </p>
              </div>
            </div>
            <Badge variant={user.banned ? "destructive" : "outline"} className="text-sm px-3 py-1">
              {user.banned ? "Yasaklı" : "Aktif"}
            </Badge>
          </div>

          {user.banned && user.bannedBy && (
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 space-y-4">
              <div className="flex items-center gap-2 text-red-500 font-semibold">
                <AlertTriangle className="w-5 h-5" />
                Yasaklama Detayları
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase font-bold">Yasaklayan Yetkili</span>
                  <p className="font-medium">{user.bannedBy.username}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase font-bold">Yasaklama Tarihi</span>
                  <p className="font-medium">{formatDate(user.bannedAt || "")}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserX className="w-5 h-5 text-primary" />
            İşlemler
          </CardTitle>
          <CardDescription>
            Kullanıcı üzerinde uygulayabileceğiniz işlemler.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {!user.banned ? (
              <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Ban className="w-4 h-4" />
                    Kullanıcıyı Yasakla
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Kullanıcıyı Yasakla</DialogTitle>
                    <DialogDescription>
                      Bu işlem kullanıcının siteye erişimini engelleyecektir.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Yasaklama Sebebi</Label>
                      <Textarea
                        placeholder="Lütfen bir sebep belirtin..."
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setBanDialogOpen(false)}>İptal</Button>
                    <Button variant="destructive" onClick={handleBanUser}>Yasakla</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Button variant="default" onClick={handleUnbanUser} className="gap-2 bg-green-600 hover:bg-green-700">
                <UserCheck className="w-4 h-4" />
                Yasağı Kaldır
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
