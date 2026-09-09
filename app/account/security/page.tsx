import { PasswordForm } from "@/components/account/password-form"
import { requireUser } from "@/lib/session"

export default async function SecurityPage() {
  const user = await requireUser()

  return (
    <>
      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight">
        Безопасность
      </h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
        <section className="border-shell-border bg-shell-panel rounded-2xl border p-6">
          <h2 className="text-shell-fg text-sm font-medium">Смена пароля</h2>
          <PasswordForm />
        </section>

        <aside className="border-shell-border rounded-2xl border p-6">
          <h2 className="text-shell-fg text-sm font-medium">
            Что при этом произойдёт
          </h2>
          <ul className="text-shell-muted mt-3 grid gap-2 text-sm leading-relaxed">
            <li>
              Вход на других устройствах закроется — это способ вернуть себе
              аккаунт, если пароль куда-то утёк.
            </li>
            <li>Текущая вкладка останется открытой.</li>
            <li>
              Аккаунт привязан к адресу {user.email}. Письма о подписке и
              восстановление пароля приходят туда же.
            </li>
          </ul>
        </aside>
      </div>
    </>
  )
}
