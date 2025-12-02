import StaffForms from "@/components/staff-forms";
import { DefaultBreadcrumb } from "@/components/ui/breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Başvuru Formları",
  description: "Aktif başvuru formlarını görüntüleyin ve yeni başvurular oluşturun.",
};

export default function StaffFormsPage() {
  return (
    <div>
      <DefaultBreadcrumb
        items={[
          { label: "Başvuru Formları", href: "/staff-forms" },
        ]}
      />
      <StaffForms />
    </div>
  );
}