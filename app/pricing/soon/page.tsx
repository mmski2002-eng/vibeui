import { PaymentSoonPage } from "@/components/pages/payment-soon-page"

export const metadata = {
  title: "Оплата пока не подключена",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <PaymentSoonPage locale="ru" />
}
