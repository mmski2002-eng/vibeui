import { LandingPage } from "@/components/pages/landing-page"
import { getDictionary } from "@/lib/i18n"

export const metadata = {
  title: "VibeUI",
  description: getDictionary("en").home.description,
}

export default function EnHomePage() {
  return <LandingPage locale="en" />
}
