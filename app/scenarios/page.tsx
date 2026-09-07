import { ScenariosPage } from "@/components/pages/scenarios-page"
import { getDictionary } from "@/lib/i18n"

export const metadata = {
  title: getDictionary("ru").scenarios.metaTitle,
  description: getDictionary("ru").scenarios.description,
}

export default function Scenarios() {
  return <ScenariosPage locale="ru" />
}
