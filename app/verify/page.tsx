import { Suspense } from "react"

import { AuthCard } from "@/components/auth/auth-card"
import { VerifyPanel } from "@/components/auth/verify-panel"
import { CatalogShell } from "@/components/catalog/catalog-shell"

const LOCALE = "ru" as const

export const metadata = {
  title: "Подтверждение почты",
  robots: { index: false, follow: false },
}

export default function VerifyPage() {
  return (
    <CatalogShell locale={LOCALE}>
      <AuthCard locale={LOCALE}>
        {/* Панель читает query — Next требует границу Suspense вокруг такого
            клиента, иначе страница целиком уходит в динамический рендер. */}
        <Suspense fallback={null}>
          <VerifyPanel locale={LOCALE} />
        </Suspense>
      </AuthCard>
    </CatalogShell>
  )
}
