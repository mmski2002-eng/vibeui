import { AdminReport } from "@/components/pages/admin/report"

export const metadata = {
  title: "Обращение",
  robots: { index: false, follow: false },
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <AdminReport id={id} />
}
