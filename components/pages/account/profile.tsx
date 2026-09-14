import { desc, eq } from "drizzle-orm"

import { PasswordForm } from "@/components/account/password-form"
import {
  DevicesPanel,
  EmailPanel,
  ProfileForm,
  type DeviceRow,
} from "@/components/account/profile-panels"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { PageHeader } from "@/components/account/ui/page-header"
import { Panel, PanelHeader } from "@/components/account/ui/panel"
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
      <PageHeader title={t.title} />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Panel index={1}>
          <PanelHeader title={t.emailTitle} />
          <EmailPanel
            locale={locale}
            email={user.email}
            verified={Boolean(user.emailVerified)}
          />
        </Panel>

        <Panel index={2}>
          <PanelHeader title={t.nameTitle} note={t.nameNote} />
          <ProfileForm
            locale={locale}
            name={user.name ?? ""}
            accountLocale={accountLocale}
          />
        </Panel>

        <Panel index={3}>
          <PanelHeader title={t.passwordTitle} note={t.passwordNote} />
          <PasswordForm locale={locale} />
        </Panel>

        <Panel index={4}>
          <PanelHeader title={t.devicesTitle} note={t.devicesNote} />
          <DevicesPanel locale={locale} devices={devices} />
        </Panel>
      </div>
    </>
  )
}
