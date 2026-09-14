import { PaymentSoonPage } from "@/components/pages/payment-soon-page"

export const metadata = {
  title: "Payments are not connected yet",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <PaymentSoonPage locale="en" />
}
