import { AdminLog } from "@/components/pages/admin/log"

export const metadata = {
  title: "Журнал действий",
  robots: { index: false, follow: false },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ before?: string }>
}) {
  const { before } = await searchParams

  return <AdminLog before={before} />
}
