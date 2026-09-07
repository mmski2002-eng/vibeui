import { ScenariosPage } from "@/components/pages/scenarios-page"
import { getDictionary } from "@/lib/i18n"

export const metadata = {
  title: getDictionary("en").scenarios.metaTitle,
  description: getDictionary("en").scenarios.description,
}

export default function Scenarios() {
  return <ScenariosPage locale="en" />
}
