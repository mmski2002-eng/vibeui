import { AdminSummary } from "@/components/pages/admin/summary"
import type { Period } from "@/lib/admin-stats"

export const metadata = {
  title: "Сводка",
  robots: { index: false, follow: false },
}

function parsePeriod(value: string | undefined): Period {
  return value === "7" ? 7 : value === "90" ? 90 : 30
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const { period } = await searchParams

  return <AdminSummary period={parsePeriod(period)} />
}
