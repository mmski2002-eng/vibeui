import { ScenariosPage } from "@/components/pages/scenarios-page"
import { getDictionary } from "@/lib/i18n"
import { pageMetadata } from "@/lib/seo"

// Likes drive the card order: rebuild the page every 5 minutes.
export const revalidate = 300

export const metadata = pageMetadata({
  locale: "en",
  path: "/scenarios",
  title: getDictionary("en").scenarios.metaTitle,
  description: getDictionary("en").scenarios.description,
})

export default function Scenarios() {
  return <ScenariosPage locale="en" />
}
