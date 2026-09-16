import { PricingPage } from "@/components/pages/pricing-page"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "en",
  path: "/pricing",
  title: "Pricing",
  description:
    "A hundred components a month for free with an account. Pro removes the limit and unlocks animations and closed blocks.",
})

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ promo?: string }>
}) {
  const { promo } = await searchParams

  return <PricingPage locale="en" promo={promo} />
}
