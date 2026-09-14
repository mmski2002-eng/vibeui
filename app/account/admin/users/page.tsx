import { AdminUsers } from "@/components/pages/admin/users"

export const metadata = {
  title: "Пользователи",
  robots: { index: false, follow: false },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page } = await searchParams

  return <AdminUsers query={q} page={Number(page) > 1 ? Number(page) : 1} />
}
