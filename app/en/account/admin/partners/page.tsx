import { AdminPartners } from "@/components/pages/admin/partners"

export const metadata = {
  title: "Partners",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AdminPartners locale="en" />
}
