import { ScenariosPage } from "@/components/pages/scenarios-page"
import { getDictionary } from "@/lib/i18n"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "ru",
  path: "/scenarios",
  title: getDictionary("ru").scenarios.metaTitle,
  description: getDictionary("ru").scenarios.description,
})

export default function Scenarios() {
  return <ScenariosPage locale="ru" />
}
