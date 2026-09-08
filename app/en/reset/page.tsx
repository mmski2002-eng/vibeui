import { AuthCard } from "@/components/auth/auth-card"
import { ResetRequestForm } from "@/components/auth/reset-forms"
import { AUTH_TEXTS } from "@/components/auth/texts"
import { CatalogShell } from "@/components/catalog/catalog-shell"

const LOCALE = "en" as const
const t = AUTH_TEXTS[LOCALE]

export const metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
}

export default function ResetPageEn() {
  return (
    <CatalogShell locale={LOCALE}>
      <AuthCard locale={LOCALE} title={t.resetTitle} description={t.resetHint}>
        <ResetRequestForm locale={LOCALE} />
      </AuthCard>
    </CatalogShell>
  )
}
