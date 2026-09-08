import Link from "next/link"

import { AuthCard } from "@/components/auth/auth-card"
import { SignUpForm } from "@/components/auth/signup-form"
import { CatalogShell } from "@/components/catalog/catalog-shell"

export const metadata = {
  title: "Регистрация",
  robots: { index: false, follow: false },
}

export default function SignUpPage() {
  return (
    <CatalogShell locale="ru">
      <AuthCard
        title="Регистрация"
        description="Бесплатно: 100 компонентов в месяц, избранное и история."
        footer={
          <>
            Уже есть аккаунт?{" "}
            <Link href="/signin" className="text-shell-fg underline">
              Войти
            </Link>
          </>
        }
      >
        <SignUpForm />
      </AuthCard>
    </CatalogShell>
  )
}
