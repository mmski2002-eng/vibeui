import Link from "next/link"

import { AuthCard } from "@/components/auth/auth-card"
import { SignInForm } from "@/components/auth/signin-form"
import { CatalogShell } from "@/components/catalog/catalog-shell"

export const metadata = {
  title: "Вход",
  robots: { index: false, follow: false },
}

export default function SignInPage() {
  return (
    <CatalogShell locale="ru">
      <AuthCard
        title="Вход"
        description="Аккаунт хранит избранное, лимит копирований и подписку."
        footer={
          <>
            Нет аккаунта?{" "}
            <Link href="/signup" className="text-shell-fg underline">
              Создать
            </Link>
          </>
        }
      >
        <SignInForm />
      </AuthCard>
    </CatalogShell>
  )
}
