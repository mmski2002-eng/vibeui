import { StartPage } from "@/components/pages/start-page"
import { START_TEXTS } from "@/components/pages/start/texts"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "en",
  path: "/start",
  title: START_TEXTS.en.metaTitle,
  description: START_TEXTS.en.metaDescription,
})

export default function Start() {
  return <StartPage locale="en" />
}
