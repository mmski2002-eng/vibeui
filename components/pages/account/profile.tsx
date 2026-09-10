import { desc, eq } from "drizzle-orm"

import { PasswordForm } from "@/components/account/password-form"
import {
  DevicesPanel,
  EmailPanel,
  ProfileForm,
  type DeviceRow,
} from "@/components/account/profile-panels"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { db } from "@/lib/db"
import { session as sessionTable } from "@/lib/db/schema"
import type { Locale } from "@/lib/i18n"
import { getSession, requireUser } from "@/lib/session"

/**
 * Браузер и система из user-agent. Полного разбора здесь не нужно: человеку
 * важно узнать своё устройство в списке, а не получить точную телеметрию.
 */
function describe(agent: string | null, unknown: string) {
  if (!agent) return unknown

  const browser =
    /Edg\//.test(agent) && "Edge" ||
    /OPR\//.test(agent) && "Opera" ||
    /Firefox\//.test(agent) && "Firefox" ||
    /Chrome\//.test(agent) && "Chrome" ||
    /Safari\//.test(agent) && "Safari" ||
    unknown

  const system =
    /Windows/.test(agent) && "Windows" ||
    /Android/.test(agent) && "Android" ||
    /iPhone|iPad/.test(agent) && "iOS" ||
    /Mac OS X/.test(agent) && "macOS" ||
    /Linux/.test(agent) && "Linux" ||
    ""

  return system ? `${browser} · ${system}` : browser
}

export async function AccountProfile({ locale }: { locale: Locale }) {
  const user = await requireUser(locale)
  const current = await getSession()
  const t = ACCOUNT_TEXTS[locale].profile

  const sessions = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.userId, user.id))
    .orderBy(desc(sessionTable.updatedAt))
    .limit(10)

  const now = new Date()
  const devices: DeviceRow[] = sessions
    .filter((row) => row.expiresAt > now)
    .map((row) => ({
      id: row.id,
      browser: describe(row.userAgent, locale === "en" ? "Unknown" : "Неизвестно"),
      lastSeen: row.updatedAt.toLocaleString(
        locale === "en" ? "en-GB" : "ru-RU",
        { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" },
      ),
      current: row.id === current?.session.id,
    }))

  const accountLocale =
    "locale" in user && user.locale === "en" ? "en" : ("ru" as const)

  return (
    <>
      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">
        {t.title}
      </h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="border-shell-border bg-shell-panel rounded-2xl border p-5 sm:p-6">
          <h2 className="text-shell-fg font-medium">{t.nameTitle}</h2>
          <p className="text-shell-muted mt-1.5 mb-4 text-sm leading-relaxed">
            {t.nameNote}
          </p>
          <ProfileForm
            locale={locale}
            name={user.name ?? ""}
            accountLocale={accountLocale}
          />
        </section>

        <section className="border-shell-border bg-shell-panel rounded-2xl border p-5 sm:p-6">
          <h2 className="text-shell-fg font-medium">{t.emailTitle}</h2>
          <div className="mt-4">
            <EmailPanel
              locale={locale}
              email={user.email}
              verified={Boolean(user.emailVerified)}
            />
          </div>
        </section>

        <section className="border-shell-border bg-shell-panel rounded-2xl border p-5 sm:p-6">
          <h2 className="text-shell-fg font-medium">{t.passwordTitle}</h2>
          {/* Пояснение внутри панели: под него не нужна вторая карточка во
              всю высоту формы. */}
          <p className="text-shell-muted mt-1.5 mb-4 text-sm leading-relaxed">
            {t.passwordNote}
          </p>
          <PasswordForm locale={locale} />
        </section>

        <section className="border-shell-border bg-shell-panel rounded-2xl border p-5 sm:p-6">
          <h2 className="text-shell-fg font-medium">{t.devicesTitle}</h2>
          <p className="text-shell-muted mt-1.5 mb-4 text-sm leading-relaxed">
            {t.devicesNote}
          </p>
          <DevicesPanel locale={locale} devices={devices} />
        </section>
      </div>
    </>
  )
}
