"use client";

import React from "react";
import { User } from "@/lib/types/user";
import { WallMessage } from "@/lib/types/user";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface ProfileStatsProps {
  user: User;
  wallMessages: WallMessage[];
  currency?: string;
}

export function ProfileStats({ user, wallMessages, currency }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-primary">
            {user.balance} {currency || "TL"}
          </div>
          <div className="text-sm text-muted-foreground">Bakiye</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-primary">
            {user.chest?.length || 0}
          </div>
          <div className="text-sm text-muted-foreground">Sandık Eşyaları</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-primary">
            {wallMessages.length}
          </div>
          <div className="text-sm text-muted-foreground">Duvar Mesajı</div>
        </CardContent>
      </Card>
    </div>
  );
}
