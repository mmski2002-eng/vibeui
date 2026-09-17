import { StartPage } from "@/components/pages/start-page"
import { START_TEXTS } from "@/components/pages/start/texts"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "ru",
  path: "/start",
  title: START_TEXTS.ru.metaTitle,
  description: START_TEXTS.ru.metaDescription,
})

export default function Start() {
  return <StartPage locale="ru" />
}
