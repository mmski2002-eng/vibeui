import { AdminUsers } from "@/components/pages/admin/users"

export const metadata = {
  title: "Пользователи",
  robots: { index: false, follow: false },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; before?: string }>
}) {
  const { q, before } = await searchParams

  return <AdminUsers query={q} before={before} />
}
