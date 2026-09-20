import { AdminPartner } from "@/components/pages/admin/partner"

export const metadata = {
  title: "Партнёр",
  robots: { index: false, follow: false },
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ before?: string }>
}) {
  const [{ id }, { before }] = await Promise.all([params, searchParams])

  return <AdminPartner id={id} before={before} />
}
