import { LandingPage } from "@/components/pages/landing-page"
import { getDictionary } from "@/lib/i18n"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "en",
  path: "/",
  title: getDictionary("en").home.metaTitle,
  description: getDictionary("en").home.metaDescription,
  absoluteTitle: true,
})

export default function EnHomePage() {
  return <LandingPage locale="en" />
}
