import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, LifeBuoy } from "lucide-react"

import {
  PARTNER_GUIDE_EMAIL,
  PARTNER_GUIDE_TEXTS,
} from "@/components/account/partner-guide-texts"
import { ButtonLink } from "@/components/account/ui/button"
import { PageHeader } from "@/components/account/ui/page-header"
import { Panel, PanelHeader } from "@/components/account/ui/panel"
import { localePath, type Locale } from "@/lib/i18n"
import { MIN_PAYOUT, MIN_PAYOUT_USD } from "@/lib/limits"
import { PARTNER_TRIAL_DAYS, partnerCode } from "@/lib/partners"
import { commissionPercent, defaultPromoPercent, partnerPromo } from "@/lib/promo"
import { requireUser } from "@/lib/session"

// Percents come from settings and the partner's own code, so the guide never drifts from what is actually paid.
export async function AccountReferralsGuide({ locale }: { locale: Locale }) {
  const user = await requireUser(locale)

  if (!(await partnerCode(user.id))) {
    notFound()
  }

  const [commission, promo, fallbackDiscount] = await Promise.all([
    commissionPercent(),
    partnerPromo(user.id),
    defaultPromoPercent(),
  ])
  const t = PARTNER_GUIDE_TEXTS[locale]
  const sections = t.sections({
    commission,
    discount: promo?.percent ?? fallbackDiscount,
    trialDays: PARTNER_TRIAL_DAYS,
    minimum: locale === "en" ? `$${MIN_PAYOUT_USD}` : `${MIN_PAYOUT} ₽`,
  })

  return (
    <>
      <PageHeader
        title={t.title}
        lead={t.lead}
        action={
          <ButtonLink
            href={localePath(locale, "/account/referrals")}
            icon={<ArrowLeft className="size-4" aria-hidden="true" />}
          >
            {t.back}
          </ButtonLink>
        }
      />

      <div className="grid gap-6">
        {sections.map((section, index) => (
          <Panel key={section.title} index={index}>
            <PanelHeader title={section.title} />
            <div className="text-shell-muted grid gap-3 text-sm leading-relaxed">
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.items ? (
                <ul className="grid gap-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span
                        className="text-shell-accent-text shrink-0"
                        aria-hidden="true"
                      >
                        •
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Panel>
        ))}

        <Panel variant="soft" index={sections.length}>
          <PanelHeader title={t.contactTitle} />
          <p className="text-shell-muted text-sm leading-relaxed">
            {t.contact}{" "}
            <a
              href={`mailto:${PARTNER_GUIDE_EMAIL}`}
              className="text-shell-accent-text underline-offset-4 hover:underline"
            >
              {PARTNER_GUIDE_EMAIL}
            </a>
            .
          </p>
          <div className="mt-4">
            <ButtonLink
              href={localePath(locale, "/account/support")}
              icon={<LifeBuoy className="size-4" aria-hidden="true" />}
            >
              {t.supportLink}
            </ButtonLink>
          </div>
        </Panel>
      </div>
    </>
  )
}

export function PartnerGuideLink({ locale }: { locale: Locale }) {
  return (
    <Link
      href={localePath(locale, "/account/referrals/guide")}
      className="text-shell-accent-text text-sm underline-offset-4 hover:underline"
    >
      {PARTNER_GUIDE_TEXTS[locale].open} →
    </Link>
  )
}
