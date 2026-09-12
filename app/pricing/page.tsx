import { PricingPage } from "@/components/pages/pricing-page"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "ru",
  path: "/pricing",
  title: "Тарифы",
  description:
    "Бесплатно — сто компонентов в месяц с аккаунтом. Pro снимает лимит и открывает анимации и закрытые блоки.",
})

export default function Page() {
  return <PricingPage locale="ru" />
}
