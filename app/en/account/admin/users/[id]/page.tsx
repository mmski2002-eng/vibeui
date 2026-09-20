import { AdminUser } from "@/components/pages/admin/user"

export const metadata = {
  title: "Пользователь",
  robots: { index: false, follow: false },
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <AdminUser id={id} />
}
