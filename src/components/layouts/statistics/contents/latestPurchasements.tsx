import { StatisticCard } from '@/components/ui/statistic-card';
import { GetWebsiteStatisticsResponse } from '@/lib/api/services/websiteService';

// Dummy data for purchases
const dummyPurchases = [
  {
    username: 'diamondHunter',
    action: 'Elmas Kılıç Satın Aldı',
    timeAgo: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    avatarUrl: '/api/avatar/diamondHunter',
    avatarFallback: 'DH'
  },
  {
    username: 'netherExplorer',
    action: 'Netherite Zırh Satın Aldı',
    timeAgo: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    avatarUrl: '/api/avatar/netherExplorer',
    avatarFallback: 'NE'
  },
  {
    username: 'redstoneEngineer',
    action: 'Redstone Mekanizması Satın Aldı',
    timeAgo: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    avatarUrl: '/api/avatar/redstoneEngineer',
    avatarFallback: 'RE'
  },
  {
    username: 'endDragonSlayer',
    action: 'Elytra Satın Aldı',
    timeAgo: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    avatarUrl: '/api/avatar/endDragonSlayer',
    avatarFallback: 'ED'
  }
];

export default function LatestPurchasements({ latestPurchasements }: { latestPurchasements: GetWebsiteStatisticsResponse["latest"]["purchases"] }) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6 py-6 sm:py-8 lg:py-12">
      <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-center sm:text-left">
        En Son Satın Alımlar
      </h1>
      
      {latestPurchasements.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {latestPurchasements.map((purchase, index) => (
            <StatisticCard
              key={index}
              username={purchase.username}
              action={`${purchase.productName} Satın Aldı`}
              timeAgo={new Date(purchase.timestamp)}
              avatarUrl={`https://mc-heads.net/avatar/${purchase.username || 'Unknown'}/256`}
              avatarFallback={purchase.username?.charAt(0) || '?'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <p className="text-sm sm:text-base text-muted-foreground">
            Maalesef henüz satın alım yok.
          </p>
        </div>
      )}
    </div>
  );
}