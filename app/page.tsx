import { LandingPage } from "@/components/pages/landing-page"
import { getDictionary } from "@/lib/i18n"

export const metadata = {
  title: "VibeUI",
  description: getDictionary("ru").home.description,
}

export default function HomePage() {
  return <LandingPage locale="ru" />
}
