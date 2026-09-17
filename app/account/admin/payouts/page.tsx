import { AdminPayouts } from "@/components/pages/admin/payouts"

export const metadata = {
  title: "Выплаты",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AdminPayouts />
}
