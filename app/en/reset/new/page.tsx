import { Suspense } from "react"

import { AuthCard } from "@/components/auth/auth-card"
import { ResetPasswordForm } from "@/components/auth/reset-forms"
import { AUTH_TEXTS } from "@/components/auth/texts"
import { CatalogShell } from "@/components/catalog/catalog-shell"

const LOCALE = "en" as const
const t = AUTH_TEXTS[LOCALE]

export const metadata = {
  title: "New password",
  robots: { index: false, follow: false },
}

export default function ResetNewPageEn() {
  return (
    <CatalogShell locale={LOCALE}>
      <AuthCard locale={LOCALE} title={t.newPasswordTitle}>
        {/* The token comes from the query and useSearchParams needs a boundary. */}
        <Suspense fallback={null}>
          <ResetPasswordForm locale={LOCALE} />
        </Suspense>
      </AuthCard>
    </CatalogShell>
  )
}
