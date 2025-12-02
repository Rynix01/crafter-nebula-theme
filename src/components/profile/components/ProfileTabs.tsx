"use client";

import React from "react";
import { User, WallMessage } from "@/lib/types/user";
import { ReportType } from "@/lib/types/website";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ProfileOverviewTab } from "./ProfileOverviewTab";
import { ProfileChestTab } from "./ProfileChestTab";
import { ProfileWallTab } from "./ProfileWallTab";
import { ProfileModerationTab } from "./ProfileModerationTab";

interface ProfileTabsProps {
  user: User;
  wallMessages: WallMessage[];
  ownUser: boolean;
  hasModerationPermission: boolean;
  onSendMessage: (message: string) => Promise<void>;
  onReplyMessage: (messageId: string, reply: string) => Promise<void>;
  onBanUser: (reason: string) => Promise<void>;
  onUnbanUser: () => Promise<void>;
}

export function ProfileTabs({
  user,
  wallMessages,
  ownUser,
  hasModerationPermission,
  onSendMessage,
  onReplyMessage,
  onBanUser,
  onUnbanUser,
}: ProfileTabsProps) {
  return (
    <Card>
      <CardHeader>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className={cn(
            "grid w-full",
            hasModerationPermission && !ownUser ? "grid-cols-4" : "grid-cols-3"
          )}>
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="chest">Sandık</TabsTrigger>
            <TabsTrigger value="wall">Duvar</TabsTrigger>
            {hasModerationPermission && !ownUser && (
              <TabsTrigger value="moderation">Moderasyon</TabsTrigger>
            )}
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          {/* Overview Tab */}
          <TabsContent value="overview">
            <ProfileOverviewTab user={user} />
          </TabsContent>

          {/* Chest Tab */}
          <TabsContent value="chest">
            <ProfileChestTab user={user} />
          </TabsContent>

          {/* Wall Tab */}
          <TabsContent value="wall">
            <ProfileWallTab
              user={user}
              wallMessages={wallMessages}
              onSendMessage={onSendMessage}
              onReplyMessage={onReplyMessage}
            />
          </TabsContent>

          {/* Moderasyon Tab */}
          {hasModerationPermission && !ownUser && (
            <TabsContent value="moderation">
              <ProfileModerationTab
                user={user}
                onBanUser={onBanUser}
                onUnbanUser={onUnbanUser}
              />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
