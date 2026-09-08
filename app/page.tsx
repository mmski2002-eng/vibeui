import { LandingPage } from "@/components/pages/landing-page"
import { getDictionary } from "@/lib/i18n"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "ru",
  path: "/",
  title: getDictionary("ru").home.metaTitle,
  description: getDictionary("ru").home.metaDescription,
  absoluteTitle: true,
})

export default function HomePage() {
  return <LandingPage locale="ru" />
}
