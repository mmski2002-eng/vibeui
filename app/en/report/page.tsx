import { AuthCard } from "@/components/auth/auth-card"
import { REPORT_FORM_TEXTS } from "@/components/admin/texts"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import { ReportForm } from "@/components/report/report-form"
import { getSession } from "@/lib/session"

const LOCALE = "en" as const
const t = REPORT_FORM_TEXTS[LOCALE]

export const metadata = {
  title: "Content rights claim",
  robots: { index: false, follow: false },
}

export default async function ReportPageEn() {
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
