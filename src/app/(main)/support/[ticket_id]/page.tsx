import TicketDetail from "@/components/support/ticket/detail";
import { DefaultBreadcrumb } from "@/components/ui/breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Destek Talebi",
  description: "Destek talebi detayı",
};

export default function TicketDetailPage() {
  return (
    <div className="flex flex-col gap-4">
      <DefaultBreadcrumb items={[{ label: "Destek", href: "/support" }]} />
      <TicketDetail />
    </div>
  );
}