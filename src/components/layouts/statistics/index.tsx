import { GetWebsiteStatisticsResponse } from "@/lib/api/services/websiteService";
import LatestCreditTopups from "./contents/latestCreditTopups";
import LatestPurchasements from "./contents/latestPurchasements";

export default function Statistics({ statistics }: { statistics: GetWebsiteStatisticsResponse }) {
  return (
    <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 px-4 sm:px-6 lg:px-8">
      <LatestCreditTopups latestCreditTopups={statistics.latest.payments} />
      <LatestPurchasements latestPurchasements={statistics.latest.purchases} />
    </div>
  );
}