import Link from "next/link"

import { AuthCard } from "@/components/auth/auth-card"
import { SignInForm } from "@/components/auth/signin-form"
import { AUTH_TEXTS } from "@/components/auth/texts"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import { localePath } from "@/lib/i18n"

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
        title={t.signInTitle}
        description={t.signInHint}
        footer={
          <>
            {t.noAccount}{" "}
            <Link
              href={localePath(LOCALE, "/signup")}
              className="text-shell-fg underline"
            >
              {t.createShort}
            </Link>
          </>
        }
      >
        <SignInForm locale={LOCALE} />
      </AuthCard>
    </CatalogShell>
  )
}
