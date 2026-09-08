import { PasswordForm } from "@/components/account/password-form"
import { requireUser } from "@/lib/session"

export default async function SecurityPage() {
  await requireUser()

  return (
    <>
      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight">
        Безопасность
      </h1>
      <p className="text-shell-muted mt-2 max-w-2xl text-sm leading-relaxed">
        Смена пароля обрывает вход на других устройствах: если доступ к аккаунту
        вызывает сомнения, это и есть способ его вернуть.
      </p>
      <PasswordForm />
    </>
  )
}
