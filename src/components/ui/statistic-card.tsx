import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface StatisticCardProps {
  username: string;
  action: string;
  timeAgo: Date;
  avatarUrl?: string;
  avatarFallback?: string;
  className?: string;
}

export function StatisticCard({
  username,
  action,
  timeAgo,
  avatarUrl,
  avatarFallback,
  className,
}: StatisticCardProps) {
  // Format the date using date-fns with Turkish locale
  const formattedTimeAgo = formatDistanceToNow(timeAgo, {
    addSuffix: true,
    locale: tr,
  });

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 rounded-lg border transition-colors duration-200',
        'bg-card text-card-foreground border-border',
        'hover:bg-accent hover:text-accent-foreground',
        className
      )}
    >
      {/* Avatar on the left */}
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl} alt={username} />
        <AvatarFallback className="bg-muted text-muted-foreground">
          {avatarFallback || username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Content on the right */}
      <div className="flex-1 min-w-0">
        {/* Username in large bold font */}
        <div className="font-bold text-base leading-tight text-foreground">
          {username}
        </div>
        
        {/* Action description in smaller muted font */}
        <div className="text-sm leading-tight text-muted-foreground">
          {action} • <span suppressHydrationWarning>{formattedTimeAgo}</span>
        </div>
      </div>
    </div>
  );
}
