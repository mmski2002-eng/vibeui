import { AuthCard } from "@/components/auth/auth-card"
import { REPORT_FORM_TEXTS } from "@/components/admin/texts"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import { ReportForm } from "@/components/report/report-form"
import { getSession } from "@/lib/session"

const LOCALE = "ru" as const
const t = REPORT_FORM_TEXTS[LOCALE]

export const metadata = {
  title: "Претензия по правам",
  robots: { index: false, follow: false },
}

/**
 * Приём претензий по правам на материал. Открыт без входа: правообладатель
 * не обязан заводить у нас аккаунт, чтобы сообщить о нарушении.
 */
export default async function ReportPage() {
  const session = await getSession()

  return (
    <CatalogShell locale={LOCALE}>
      <AuthCard
        locale={LOCALE}
        title={t.legalTitle}
        description={t.legalLead}
        showcase={false}
      >
        <ReportForm
          locale={LOCALE}
          kind="legal"
          email={session?.user.email}
          compact
        />
      </AuthCard>
    </CatalogShell>
  )
}
