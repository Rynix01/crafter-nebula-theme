import { StatisticCard } from "@/components/ui/statistic-card";
import { GetWebsiteStatisticsResponse } from "@/lib/api/services/websiteService";

// Dummy data for credit topups
const dummyCreditTopups = [
  {
    username: "yorex01",
    action: "Kredi Yükleme",
    timeAgo: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    avatarUrl: "/api/avatar/yorex01",
    avatarFallback: "YO",
  },
  {
    username: "minecraftPro",
    action: "Kredi Yükleme",
    timeAgo: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    avatarUrl: "/api/avatar/minecraftPro",
    avatarFallback: "MP",
  },
  {
    username: "craftMaster",
    action: "Kredi Yükleme",
    timeAgo: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    avatarUrl: "/api/avatar/craftMaster",
    avatarFallback: "CM",
  },
  {
    username: "voidRunner",
    action: "Kredi Yükleme",
    timeAgo: new Date(Date.now() - 1 * 7 * 24 * 60 * 60 * 1000), // 1 week ago
    avatarUrl: "/api/avatar/voidRunner",
    avatarFallback: "VR",
  },
];

export default function LatestCreditTopups({
  latestCreditTopups,
}: {
  latestCreditTopups: GetWebsiteStatisticsResponse["latest"]["payments"];
}) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6 py-6 sm:py-8 lg:py-12">
      <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-center sm:text-left">
        En Son Kredi Yüklemeleri
      </h1>

      {latestCreditTopups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {latestCreditTopups.map((topup, index) => (
            <StatisticCard
              key={index}
              username={topup.username}
              action={`${topup.amount}₺ - ${topup.paymentMethod}`}
              timeAgo={new Date(topup.timestamp)}
              avatarUrl={`https://mc-heads.net/avatar/${topup.username || 'Unknown'}/256`}
              avatarFallback={topup.username?.charAt(0) || '?'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-muted-foreground">
            Maalesef henüz kredi yüklemesi yok.
          </p>
        </div>
      )}
    </div>
  );
}
