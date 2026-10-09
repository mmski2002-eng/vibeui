import { Suspense } from "react"

import { AuthCard } from "@/components/auth/auth-card"
import { FlipAuth } from "@/components/auth/flip-auth"
import { CatalogShell } from "@/components/catalog/catalog-shell"

const LOCALE = "en" as const

export const metadata = {
  title: "Create account",
  robots: { index: false, follow: false },
}

export default function SignUpPageEn() {
  return (
    <CatalogShell locale={LOCALE}>
      <AuthCard locale={LOCALE} bare>
        <Suspense fallback={null}>
          <FlipAuth locale={LOCALE} side="signup" />
        </Suspense>
      </AuthCard>
    </CatalogShell>
  )
}
