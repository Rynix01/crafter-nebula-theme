"use client";

import React, { useState } from "react";
import { User } from "@/lib/types/user";
import { ReportType } from "@/lib/types/website";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";

interface ProfileHeaderProps {
  user: User;
  ownUser: boolean;
  onReport: (reason: string, type: ReportType) => Promise<void>;
}

export function ProfileHeader({ user, ownUser, onReport }: ProfileHeaderProps) {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportType, setReportType] = useState<ReportType>(ReportType.SPAM);

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: tr,
    });
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    
    try {
      await onReport(reportReason, reportType);
      setReportDialogOpen(false);
      setReportReason("");
      setReportType(ReportType.SPAM);
    } catch (err) {
      // Hata yönetimi parent component'te yapılıyor
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={`https://mc-heads.net/avatar/${user.username}/256`}
              alt={user.username}
            />
            <AvatarFallback className="text-2xl font-bold bg-muted">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <CardTitle className="text-3xl">{user.username}</CardTitle>
              <Badge
                variant="outline"
                style={{
                  backgroundColor: user.role.color + "20",
                  borderColor: user.role.color,
                  color: user.role.color,
                }}
              >
                {user.role.name}
              </Badge>
              {user.banned && <Badge variant="destructive">Banlandı</Badge>}
            </div>

            <CardDescription className="text-base">
              Üye olma: {formatDate(user.createdAt)}
              {user.lastLogin &&
                ` • Son giriş: ${formatDate(user.lastLogin)}`}
            </CardDescription>
          </div>

          <div className="flex gap-2">
            {!ownUser && (
              <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Raporla
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Kullanıcıyı Raporla</DialogTitle>
                    <DialogDescription>
                      Bu kullanıcıyı raporlamak için sebep belirtin.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="report-type">Rapor Tipi</Label>
                      <select
                        id="report-type"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value as ReportType)}
                        className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value={ReportType.SPAM}>Spam</option>
                        <option value={ReportType.HARASSMENT}>Taciz</option>
                        <option value={ReportType.INAPPROPRIATE_CONTENT}>Uygunsuz İçerik</option>
                        <option value={ReportType.FRAUD}>Dolandırıcılık</option>
                        <option value={ReportType.OTHER}>Diğer</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-reason">Rapor Sebebi</Label>
                      <Textarea
                        id="report-reason"
                        placeholder="Rapor sebebini yazın..."
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setReportDialogOpen(false);
                        setReportReason("");
                        setReportType(ReportType.SPAM);
                      }}
                    >
                      İptal
                    </Button>
                    <Button
                      onClick={handleReport}
                      disabled={!reportReason.trim()}
                    >
                      Raporla
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            
            {ownUser && (
              <Link href="/profile/settings">
                <Button variant="outline" size="sm">
                  Profili Düzenle
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
