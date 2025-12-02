"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "../ui/card";
import ChestItemCard from "./chest-item-card";
import { ChestItem } from "@/lib/types/chest";
import { AuthContext } from "@/lib/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { chestService } from "@/lib/api/services/chestService";
import { alert } from "../ui/alerts";
import { useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function Chest() {
  const [chestItems, setChestItems] = useState<ChestItem[]>([]);
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);
  const router = useRouter();

  // Create chestService instance for client-side usage
  const chestServiceInstance = chestService();

  useEffect(() => {
    const fetchChestItems = async () => {
      if (!user?.id) return;

      try {
        const items = await chestServiceInstance.getChestItems(user.id);
        setChestItems(items);
      } catch (error) {
        console.error("Error fetching chest items:", error);
      }
    };

    if (isAuthenticated && user) {
      fetchChestItems();
    }
  }, [user, isAuthenticated]);

  const handleUseItem = async (itemId: string) => {
    if (!user?.id) return;

    try {
      const res = await chestServiceInstance.useChestItem(user.id, itemId);

      if (res.success) {
        setChestItems(
          chestItems.map((item) =>
            item.id === itemId ? { ...item, used: true } : item
          )
        );

        alert({
          title: "Başarılı",
          message: "Eşya başarıyla kullanıldı ve oyuna gönderildi.",
          type: "success",
          confirmText: "Tamam",
        });
      } else {
        alert({
          title: "Hata",
          message: res.message || "Eşya kullanılırken bir hata oluştu.",
          type: "error",
          confirmText: "Tamam",
        });
      }
    } catch (error) {
      console.error("Error using chest item:", error);
      alert({
        title: "Hata",
        message: "Eşya kullanılırken bir hata oluştu.",
        type: "error",
        confirmText: "Tamam",
      });
    }
  };

  if (!isAuthenticated && !isLoading) {
    router.push("/auth/sign-in?return=/chest");
    return null;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-48 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (chestItems.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
            <SearchX className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Sandığınız Boş</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Henüz sandığınızda hiç eşya bulunmuyor. Mağazadan ürün satın alarak veya etkinliklere katılarak eşya kazanabilirsiniz.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {chestItems.map((item) => (
        <ChestItemCard key={item.id} item={item} action={handleUseItem} />
      ))}
    </div>
  );
}
