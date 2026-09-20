import { AdminPayments } from "@/components/pages/admin/payments"

export const metadata = {
  title: "Платежи",
  robots: { index: false, follow: false },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const { q, status, page } = await searchParams

  return (
    <AdminPayments
      query={q}
      status={status}
      page={Number(page) > 1 ? Number(page) : 1}
    />
  )
}
