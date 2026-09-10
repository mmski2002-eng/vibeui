import { AdminReports } from "@/components/pages/admin/reports"

export const metadata = {
  title: "Жалобы",
  robots: { index: false, follow: false },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    kind?: string
    status?: string
    mine?: string
    before?: string
  }>
}) {
  const { kind, status, mine, before } = await searchParams

  return (
    <AdminReports
      kind={kind}
      status={status}
      mine={mine === "1"}
      before={before}
    />
  )
}
