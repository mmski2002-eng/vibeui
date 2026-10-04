import { Suspense } from "react"

import { AuthCard } from "@/components/auth/auth-card"
import { SignUpForm } from "@/components/auth/signup-form"
import { AUTH_TEXTS } from "@/components/auth/texts"
import { CatalogShell } from "@/components/catalog/catalog-shell"

const LOCALE = "en" as const
const t = AUTH_TEXTS[LOCALE]

export const metadata = {
  title: "Create account",
  robots: { index: false, follow: false },
}

export default function SignUpPageEn() {
  return (
    <CatalogShell locale={LOCALE}>
      <AuthCard
        locale={LOCALE}
        tabs="signup"
        title={t.signUpTitle}
        description={t.signUpHint}
      >
        {/* The form reads ?next= and ?reset=, so Suspense keeps this page
            eligible for static rendering. */}
        <Suspense fallback={null}>
          <SignUpForm locale={LOCALE} />
        </Suspense>
      </AuthCard>
    </CatalogShell>
  )
}
