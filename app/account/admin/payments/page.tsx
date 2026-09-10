import { AdminPayments } from "@/components/pages/admin/payments"

export const metadata = {
  title: "Платежи",
  robots: { index: false, follow: false },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; before?: string }>
}) {
  const { q, status, before } = await searchParams

  return <AdminPayments query={q} status={status} before={before} />
}
