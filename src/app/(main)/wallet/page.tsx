import Wallet from "@/components/wallet";

export default async function WalletPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const paymentId = typeof resolvedSearchParams.paymentId === 'string' ? resolvedSearchParams.paymentId : null;
  const event = typeof resolvedSearchParams.event === 'string' ? resolvedSearchParams.event : null;

  return <Wallet paymentId={paymentId} event={event} />;
}
