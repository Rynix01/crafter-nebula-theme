import axios from "axios";

export type StatusType = 'discord' | 'minecraft';

export type MinecraftConfig = {
    hostname: string;
    port: number | string;
}

export type DiscordConfig = {
    guildId: string;
}

export async function getDiscordStatus(config: DiscordConfig): Promise<{
    invite: string;
    online: number;
}> {
    const response = await axios.get(`https://discord.com/api/guilds/${config.guildId}/widget.json`);

    return {
        invite: response.data.instant_invite || "https://discord.gg/jhgXsgTk",
        online: response.data.presence_count || 0
    };
}

export async function getMinecraftStatus(config: MinecraftConfig) {
    const { hostname, port } = config;
    
    const response = await axios.get(`https://mcapi.tr/api/status/${hostname}:${port}`).catch(() => {
        return {
            data: {
                players: { online: 0 },
                version: { name: "Unknown" },
                roundTripLatency: 0,
                favicon: "",
                motd: { html: "Unknown" },
            }
        }
    });

    return {
        online: response.data.players.online,
        version: response.data.version.name,
        roundTripLatency: response.data.roundTripLatency,
        favicon: response.data.favicon,
        motd: response.data.motd.html,
    };
}