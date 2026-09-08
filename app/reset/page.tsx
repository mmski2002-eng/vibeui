import { AuthCard } from "@/components/auth/auth-card"
import { ResetRequestForm } from "@/components/auth/reset-forms"
import { CatalogShell } from "@/components/catalog/catalog-shell"

export const metadata = {
  title: "Восстановление пароля",
  robots: { index: false, follow: false },
}

export default function ResetPage() {
  return (
    <CatalogShell locale="ru">
      <AuthCard
        title="Восстановление пароля"
        description="Пришлём ссылку на почту, по которой можно задать новый пароль."
      >
        <ResetRequestForm />
      </AuthCard>
    </CatalogShell>
  )
}
