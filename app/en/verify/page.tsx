import { Suspense } from "react"

import { AuthCard } from "@/components/auth/auth-card"
import { VerifyPanel } from "@/components/auth/verify-panel"
import { CatalogShell } from "@/components/catalog/catalog-shell"

const LOCALE = "en" as const

export const metadata = {
  title: "Confirm your email",
  robots: { index: false, follow: false },
}

export default function VerifyPage() {
  return (
    <CatalogShell locale={LOCALE}>
      <AuthCard locale={LOCALE}>
        {/* The panel reads the query, so Next requires a Suspense boundary to
            keep the page statically rendered. */}
        <Suspense fallback={null}>
          <VerifyPanel locale={LOCALE} />
        </Suspense>
      </AuthCard>
    </CatalogShell>
  )
}
