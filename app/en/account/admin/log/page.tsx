import { AdminLog } from "@/components/pages/admin/log"

export const metadata = {
  title: "Activity log",
  robots: { index: false, follow: false },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ before?: string }>
}) {
  const { before } = await searchParams

  return <AdminLog before={before} locale="en" />
}
