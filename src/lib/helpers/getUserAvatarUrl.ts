import { User, WallMessageSender } from "@/lib/types/user";
import imageLinkGenerate from "./imageLinkGenerate";

export function getUserAvatarUrl(user: User | WallMessageSender | null | undefined) {
  if (!user) return "";
  
  // If user has a custom uploaded image/skin path from backend
  if (user.image) {
    return imageLinkGenerate(user.image);
  }
  
  if (user.skin) {
    return imageLinkGenerate(user.skin);
  }
  
  // Fallback to Minotar for Minecraft skin
  return `https://minotar.net/helm/${user.username}/100.png`;
}
