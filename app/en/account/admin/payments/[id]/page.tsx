import { AdminPayment } from "@/components/pages/admin/payment"

export const metadata = {
  title: "Payment",
  robots: { index: false, follow: false },
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <AdminPayment id={id} locale="en" />
}
