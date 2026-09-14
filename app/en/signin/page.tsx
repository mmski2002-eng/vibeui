import { Suspense } from "react"

import { AuthCard } from "@/components/auth/auth-card"
import { SignInForm } from "@/components/auth/signin-form"
import { AUTH_TEXTS } from "@/components/auth/texts"
import { CatalogShell } from "@/components/catalog/catalog-shell"

const LOCALE = "en" as const
const t = AUTH_TEXTS[LOCALE]

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
}

export default function SignInPageEn() {
  return (
    <CatalogShell locale={LOCALE}>
      <AuthCard
        locale={LOCALE}
        tabs="signin"
        title={t.signInTitle}
        description={t.signInHint}
      >
        {/* Форма читает ?next= и ?reset= из адреса: без границы
            Suspense страница входа перестала бы собираться заранее. */}
        <Suspense fallback={null}>
          <SignInForm locale={LOCALE} />
        </Suspense>
      </AuthCard>
    </CatalogShell>
  )
}
