"use client";

import React, { useEffect, useState, useContext } from "react";
import { User, WallMessage } from "@/lib/types/user";
import { userService } from "@/lib/api/services/userService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthContext } from "@/lib/context/AuthContext";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { ProfileOverviewTab } from "./components/ProfileOverviewTab";
import { ProfileChestTab } from "./components/ProfileChestTab";
import { ProfileWallTab } from "./components/ProfileWallTab";
import { ProfileModerationTab } from "./components/ProfileModerationTab";
import Settings from "./settings";
import { Loader2, User as UserIcon, Shield, Settings as SettingsIcon } from "lucide-react";

interface ProfileProps {
  ownUser?: boolean;
  username?: string;
  className?: string;
  currency?: string;
}

export function Profile({
  ownUser = false,
  username,
  className,
  currency,
}: ProfileProps) {
  const userServiceInstance = userService();
  const [user, setUser] = useState<User | null>(null);
  const [wallMessages, setWallMessages] = useState<WallMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const { user: currentUser } = useContext(AuthContext);

  const hasModerationPermission = Boolean(
    currentUser?.role?.permissions?.includes(PERMISSIONS.MANAGE_USERS)
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        let userData: User;

        if (ownUser) {
          userData = await userServiceInstance.getMe();
          if (!userData) {
            return router.push("/auth/sign-in?return=/profile");
          }
        } else if (username) {
          userData = await userServiceInstance.getUserById(username);
        } else {
          throw new Error("Username gerekli");
        }

        setUser(userData);

        if (userData.id) {
          const messages = await userServiceInstance.getWallMessages(userData.id);
          setWallMessages(messages);
        }
      } catch (err) {
        toast.error("Kullanıcı bilgileri alınamadı");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [ownUser, username]);

  const handleSendMessage = async (message: string) => {
    if (!user) return;
    try {
      await userServiceInstance.sendWallMessage(user.id, "", message);
      toast.success("Mesaj gönderildi!");
      const messages = await userServiceInstance.getWallMessages(user.id);
      setWallMessages(messages);
    } catch (err) {
      toast.error("Mesaj gönderilemedi.");
    }
  };

  const handleReplyMessage = async (messageId: string, reply: string) => {
    if (!user) return;
    try {
      await userServiceInstance.replyWallMessage(user.id, messageId, reply);
      toast.success("Yanıt gönderildi!");
      const messages = await userServiceInstance.getWallMessages(user.id);
      setWallMessages(messages);
    } catch (err) {
      toast.error("Yanıt gönderilemedi.");
    }
  };

  const handleBanUser = async (reason: string) => {
    // Implement ban logic
    toast.info("Bu özellik henüz aktif değil.");
  };

  const handleUnbanUser = async () => {
    // Implement unban logic
    toast.info("Bu özellik henüz aktif değil.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 shadow-2xl shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl" />
        
        <div className="relative px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 text-sm font-medium border border-violet-500/20">
              <UserIcon className="w-4 h-4" />
              <span>Kullanıcı Profili</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              {ownUser ? "Hoş Geldin, " + user.username : user.username}
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              {ownUser 
                ? "Profilinizi yönetin, istatistiklerinizi inceleyin ve ayarlarınızı yapılandırın."
                : "Kullanıcı istatistiklerini, son aktivitelerini ve paylaşımlarını görüntüleyin."
              }
            </p>
          </div>
          
          <div className="flex gap-4">
            {ownUser && (
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-card/80 transition-colors" onClick={() => setActiveTab("settings")}>
                <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500">
                  <SettingsIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold">Ayarlar</div>
                  <div className="text-xs text-muted-foreground">Profili Düzenle</div>
                </div>
              </div>
            )}
            {hasModerationPermission && !ownUser && (
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-card/80 transition-colors" onClick={() => setActiveTab("moderation")}>
                <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold">Yönetim</div>
                  <div className="text-xs text-muted-foreground">İşlemler</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <ProfileSidebar
            user={user}
            ownUser={ownUser}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            hasModerationPermission={hasModerationPermission}
            currency={currency}
          />
        </div>

        {/* Content */}
        <div className="lg:col-span-9">
          <div className="space-y-6">
            {activeTab === "overview" && (
              <ProfileOverviewTab user={user} currency={currency} />
            )}
            
            {activeTab === "chest" && (
              <ProfileChestTab user={user} />
            )}
            
            {activeTab === "wall" && (
              <ProfileWallTab
                user={user}
                currentUser={currentUser}
                wallMessages={wallMessages}
                onSendMessage={handleSendMessage}
                onReplyMessage={handleReplyMessage}
              />
            )}
            
            {activeTab === "settings" && ownUser && (
              <Settings />
            )}
            
            {activeTab === "moderation" && hasModerationPermission && !ownUser && (
              <ProfileModerationTab
                user={user}
                onBanUser={handleBanUser}
                onUnbanUser={handleUnbanUser}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
