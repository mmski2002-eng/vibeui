import { Suspense } from "react"

import { AuthCard } from "@/components/auth/auth-card"
import { ResetPasswordForm } from "@/components/auth/reset-forms"
import { CatalogShell } from "@/components/catalog/catalog-shell"

export const metadata = {
  title: "Новый пароль",
  robots: { index: false, follow: false },
}

export default function ResetNewPage() {
  return (
    <CatalogShell locale="ru">
      <AuthCard title="Новый пароль">
        {/* Токен приходит в query, а useSearchParams требует границы. */}
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </AuthCard>
    </CatalogShell>
  )
}
