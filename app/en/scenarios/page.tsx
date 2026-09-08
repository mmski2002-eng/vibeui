import { ScenariosPage } from "@/components/pages/scenarios-page"
import { getDictionary } from "@/lib/i18n"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "en",
  path: "/scenarios",
  title: getDictionary("en").scenarios.metaTitle,
  description: getDictionary("en").scenarios.description,
})

export default function Scenarios() {
  return <ScenariosPage locale="en" />
}
