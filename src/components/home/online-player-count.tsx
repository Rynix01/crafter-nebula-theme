"use client";

import { useMinecraftStatus } from "@/lib/hooks/useMinecraftStatus";

interface OnlinePlayerCountProps {
  ip: string;
  port: number;
}

export default function OnlinePlayerCount({ ip, port }: OnlinePlayerCountProps) {
  const { status } = useMinecraftStatus({
    hostname: ip,
    port: port
  });

  return <>{status?.online || 0}</>;
}
