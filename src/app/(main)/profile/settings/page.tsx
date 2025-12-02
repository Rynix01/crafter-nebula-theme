import Settings from "@/components/profile/settings";
import { DefaultBreadcrumb } from "@/components/ui/breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ayarlar",
  description: "Ayarlarınızı düzenleyin",
};

export default function SettingsPage() {
  return (
    <div>
      <DefaultBreadcrumb
        items={[
          { label: "Profilim", href: "/profile" },
          { label: "Ayarlar", href: "/profile/settings" },
        ]}
      />
      <Settings />
    </div>
  );
}
