import Link from "next/link"

import { AuthCard } from "@/components/auth/auth-card"
import { SignUpForm } from "@/components/auth/signup-form"
import { AUTH_TEXTS } from "@/components/auth/texts"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import { localePath } from "@/lib/i18n"

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
        title={t.signUpTitle}
        description={t.signUpHint}
        footer={
          <>
            {t.haveAccount}{" "}
            <Link
              href={localePath(LOCALE, "/signin")}
              className="text-shell-fg underline"
            >
              {t.enterShort}
            </Link>
          </>
        }
      >
        <SignUpForm locale={LOCALE} />
      </AuthCard>
    </CatalogShell>
  )
}
