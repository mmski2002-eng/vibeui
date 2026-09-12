import Link from "next/link"
import type { ReactNode } from "react"
import { Check } from "lucide-react"

import { CatalogShell } from "@/components/catalog/catalog-shell"
import { Comparison001 } from "@/registry/blocks/comparison/comparison-001/comparison-001"
import { Pricing011 } from "@/registry/blocks/pricing/pricing-011/pricing-011"
import { getUsedCount } from "@/lib/entitlements"
import { localePath, type Locale } from "@/lib/i18n"
import { FREE_MONTHLY_LIMIT } from "@/lib/limits"
import { startCheckout } from "@/lib/payment-actions"
import { PLANS } from "@/lib/plans"
import { getSession } from "@/lib/session"
import { getSubscriptionState, isProState } from "@/lib/subscription-state"

/** Витрина красится фирменным оранжевым: блоки из реестра берут его пропом. */
const BRAND_ACCENT = "#ff5900"

const MONTHLY = Math.round(Number(PLANS.monthly.price))
const YEARLY = Math.round(Number(PLANS.yearly.price))
const YEARLY_SAVING = Math.round((1 - YEARLY / (MONTHLY * 12)) * 100)

const TEXTS = {
  ru: {
    title: "Тарифы",
    lede: "Витрина открыта целиком: смотреть, искать и примерять компоненты можно без аккаунта. Платным становится объём работы, а не доступ к дизайну.",
    switchLabel: "Период оплаты",
    month: "Помесячно",
    year: "На год",
    save: `−${YEARLY_SAVING} %`,
    perMonth: "/ мес",
    perYear: "/ год",
    free: "Бесплатно",
    pro: "Pro",
    freeFeatures: [
      "Весь каталог, превью и поиск",
      `${FREE_MONTHLY_LIMIT} разных компонентов в месяц`,
      "Copy for AI и установка через shadcn",
      "Избранное и история",
    ],
    proFeatures: [
      "Без лимита на компоненты",
      "Анимации и закрытые блоки",
      "Ключ для установки прямо из shadcn CLI",
    ],
    signup: "Создать аккаунт",
    toAccount: "В кабинет",
    payMonth: "Оплатить месяц",
    payYear: "Оплатить год",
    proUntil: (date: string) => `Pro активен до ${date}`,
    manage: "Управлять подпиской",
    limitTitle: "Как считается лимит",
    limitLines: [
      `С аккаунтом — ${FREE_MONTHLY_LIMIT} разных компонентов в месяц. Без аккаунта исходники не выдаются.`,
      "Повторное копирование того же компонента в том же месяце ничего не списывает.",
      "Pro снимает лимит целиком: считать ничего не нужно.",
    ],
    usage: (used: number) =>
      `В этом месяце вы взяли ${used} из ${FREE_MONTHLY_LIMIT}.`,
    compareEyebrow: "Сравнение",
    compareTitle: "Что входит в каждый тариф",
    compareRows: [
      { feature: "Каталог, живые превью и поиск", them: true, us: true },
      { feature: "Copy for AI и установка через shadcn", them: true, us: true },
      { feature: "Избранное и история", them: true, us: true },
      { feature: "Ключ для shadcn CLI", them: true, us: true },
      {
        feature: `${FREE_MONTHLY_LIMIT} разных компонентов в месяц`,
        them: true,
        us: true,
      },
      { feature: "Без лимита на компоненты", them: false, us: true },
      { feature: "Анимации", them: false, us: true },
      { feature: "Закрытые блоки", them: false, us: true },
    ],
    faqEyebrow: "Вопросы об оплате",
    faqTitle: "Что обычно спрашивают перед оплатой",
    faqLede: "Только про деньги, документы и отмену. Про сами компоненты — в каталоге.",
    faq: [
      {
        question: "Как оплатить?",
        answer:
          "Картой или через СБП, платёж принимает ЮKassa. Данные карты к нам не попадают.",
        open: true,
      },
      {
        question: "Подписка продлевается сама?",
        answer:
          "Да, в конце оплаченного периода. Отключить продление можно в кабинете в любой момент: доступ сохранится до конца периода, следующего списания не будет.",
      },
      {
        question: "Будет ли чек?",
        answer:
          "Продавец — самозанятый, чек формируется в «Мой налог» после каждой оплаты. Ссылка на чек появляется в кабинете в разделе оплат.",
      },
      {
        question: "Что будет, когда подписка закончится?",
        answer:
          "Тариф станет бесплатным: сто компонентов в месяц, избранное и история останутся. Всё, что вы уже скопировали в свой проект, остаётся вашим.",
      },
      {
        question: "Можно ли вернуть деньги?",
        answer:
          "Если Pro не подошёл в первые 7 дней — напишите нам, вернём оплату за текущий период.",
      },
      {
        question: "Есть ли тариф для команд?",
        answer:
          "Пока нет: подписка на человека. Если нужно несколько мест — напишите, договоримся вручную.",
      },
    ],
    contactText: "Не нашли свой вопрос?",
    contactLabel: "Написать в поддержку",
    legal: "Оплата картой или через СБП через ЮKassa. Продавец — самозанятый. Оформляя подписку, вы принимаете",
    offer: "оферту",
    and: "и",
    privacy: "политику конфиденциальности",
  },
  en: {
    title: "Pricing",
    lede: "The showcase is fully open: browse, search and try components without an account. You pay for volume of work, not for access to design.",
    switchLabel: "Billing period",
    month: "Monthly",
    year: "Yearly",
    save: `−${YEARLY_SAVING}%`,
    perMonth: "/ mo",
    perYear: "/ yr",
    free: "Free",
    pro: "Pro",
    freeFeatures: [
      "The whole catalog, previews and search",
      `${FREE_MONTHLY_LIMIT} different components a month`,
      "Copy for AI and install through shadcn",
      "Favourites and history",
    ],
    proFeatures: [
      "No limit on components",
      "Animations and closed blocks",
      "A key to install straight from the shadcn CLI",
    ],
    signup: "Create an account",
    toAccount: "Open account",
    payMonth: "Pay for a month",
    payYear: "Pay for a year",
    proUntil: (date: string) => `Pro is active until ${date}`,
    manage: "Manage subscription",
    limitTitle: "How the limit works",
    limitLines: [
      `With an account — ${FREE_MONTHLY_LIMIT} different components a month. Without an account no source is served.`,
      "Copying the same component again in the same month costs nothing.",
      "Pro removes the limit entirely: nothing to count.",
    ],
    usage: (used: number) =>
      `This month you have taken ${used} of ${FREE_MONTHLY_LIMIT}.`,
    compareEyebrow: "Comparison",
    compareTitle: "What each plan includes",
    compareRows: [
      { feature: "Catalog, live previews and search", them: true, us: true },
      { feature: "Copy for AI and shadcn install", them: true, us: true },
      { feature: "Favourites and history", them: true, us: true },
      { feature: "A key for the shadcn CLI", them: true, us: true },
      {
        feature: `${FREE_MONTHLY_LIMIT} different components a month`,
        them: true,
        us: true,
      },
      { feature: "No limit on components", them: false, us: true },
      { feature: "Animations", them: false, us: true },
      { feature: "Closed blocks", them: false, us: true },
    ],
    faqEyebrow: "Billing questions",
    faqTitle: "What people ask before paying",
    faqLede: "Only money, documents and cancellation. The components speak for themselves in the catalog.",
    faq: [
      {
        question: "How do I pay?",
        answer:
          "By card or via SBP; payments are handled by YooKassa. Card details never reach us.",
        open: true,
      },
      {
        question: "Does the subscription renew itself?",
        answer:
          "Yes, at the end of the paid period. Turn renewal off in your account at any time: access stays until the period ends, and there is no next charge.",
      },
      {
        question: "Will I get a receipt?",
        answer:
          "The seller is a self-employed individual; a receipt is issued through the tax service after every payment. A link to it appears in the payments section of your account.",
      },
      {
        question: "What happens when the subscription ends?",
        answer:
          "The plan becomes free: a hundred components a month, favourites and history stay. Everything you already copied into your project remains yours.",
      },
      {
        question: "Can I get a refund?",
        answer:
          "If Pro is not for you within the first 7 days, write to us and we refund the current period.",
      },
      {
        question: "Is there a team plan?",
        answer:
          "Not yet: the subscription is per person. If you need several seats, write to us and we will sort it out by hand.",
      },
    ],
    contactText: "Did not find your question?",
    contactLabel: "Write to support",
    legal: "Card or SBP payments via YooKassa. The seller is a self-employed individual. By subscribing you accept the",
    offer: "offer",
    and: "and the",
    privacy: "privacy policy",
  },
} as const

const CHECK =
  "text-shell-muted flex items-start gap-2.5 text-sm leading-relaxed"

/**
 * Страница тарифов. Карточки — свои, потому что кнопка оплаты зависит и от
 * тарифа, и от периода: блок из реестра умеет одну ссылку на план. Период
 * переключается без JavaScript: две радиокнопки и `has()` на секции.
 * Сравнение и вопросы — блоки из реестра в фирменном цвете.
 */
export async function PricingPage({ locale }: { locale: Locale }) {
  const t = TEXTS[locale]
  const session = await getSession()
  const [state, used] = session
    ? await Promise.all([
        getSubscriptionState(session.user.id),
        getUsedCount(session.user.id),
      ])
    : [null, 0]
  const pro = state ? isProState(state) : false
  const dates = locale === "en" ? "en-GB" : "ru-RU"
  const until = state && "until" in state ? state.until : null

  return (
    <CatalogShell locale={locale}>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:py-16 lg:px-6">
        <h1 className="text-shell-fg text-3xl font-semibold tracking-tight sm:text-4xl">
          {t.title}
        </h1>
        <p className="text-shell-muted mt-3 max-w-2xl text-base leading-relaxed">
          {t.lede}
        </p>

        {/* Переключатель периода: радиокнопки в форме, цены и кнопки оплаты
            прячутся правилами `group-has-[…:checked]`. */}
        <section className="group/period mt-10">
          <form
            className="border-shell-border bg-shell-panel inline-flex items-center gap-0.5 rounded-lg border p-0.5"
            aria-label={t.switchLabel}
          >
            <PeriodOption id="pricing-month" name="period" defaultChecked>
              {t.month}
            </PeriodOption>
            <PeriodOption id="pricing-year" name="period">
              {t.year}
              <span className="bg-shell-accent text-shell-accent-fg ml-2 rounded px-1.5 py-0.5 text-[0.6875rem] font-semibold">
                {t.save}
              </span>
            </PeriodOption>
          </form>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="border-shell-border bg-shell-panel rounded-2xl border p-6">
              <h2 className="text-shell-fg text-lg font-semibold">{t.free}</h2>
              <p className="text-shell-fg mt-3 text-4xl font-semibold tabular-nums">
                0 ₽
              </p>
              <ul className="mt-6 grid gap-2.5">
                {t.freeFeatures.map((feature) => (
                  <li key={feature} className={CHECK}>
                    <Check
                      className="text-shell-muted mt-1 size-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={
                  session
                    ? localePath(locale, "/account")
                    : localePath(locale, "/signup?next=/pricing")
                }
                className="border-shell-border-strong text-shell-fg hover:border-shell-accent mt-6 inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-colors"
              >
                {session ? t.toAccount : t.signup}
              </Link>
            </article>

            <article className="border-shell-accent bg-shell-panel relative rounded-2xl border p-6">
              <h2 className="text-shell-fg text-lg font-semibold">{t.pro}</h2>
              <p className="text-shell-fg mt-3 text-4xl font-semibold tabular-nums group-has-[#pricing-year:checked]/period:hidden">
                {MONTHLY} ₽
                <span className="text-shell-muted text-base font-normal">
                  {" "}
                  {t.perMonth}
                </span>
              </p>
              <p className="text-shell-fg mt-3 hidden text-4xl font-semibold tabular-nums group-has-[#pricing-year:checked]/period:block">
                {YEARLY} ₽
                <span className="text-shell-muted text-base font-normal">
                  {" "}
                  {t.perYear}
                </span>
              </p>
              <p className="text-shell-muted mt-1 text-sm">
                {locale === "en"
                  ? `${Math.round(YEARLY / 12)} ₽ a month when paid yearly`
                  : `${Math.round(YEARLY / 12)} ₽ в месяц при оплате за год`}
              </p>
              <ul className="mt-6 grid gap-2.5">
                {t.proFeatures.map((feature) => (
                  <li key={feature} className={CHECK}>
                    <Check
                      className="text-shell-accent-text mt-1 size-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {!session ? (
                <Link
                  href={localePath(locale, "/signup?next=/pricing")}
                  className="bg-shell-accent text-shell-accent-fg hover:bg-shell-accent-deep mt-6 inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors"
                >
                  {t.signup}
                </Link>
              ) : pro ? (
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {until ? (
                    <span className="text-shell-fg text-sm font-medium">
                      {t.proUntil(until.toLocaleDateString(dates))}
                    </span>
                  ) : null}
                  <Link
                    href={localePath(locale, "/account/subscription")}
                    className="border-shell-border-strong text-shell-fg hover:border-shell-accent inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-colors"
                  >
                    {t.manage}
                  </Link>
                </div>
              ) : (
                <div className="mt-6">
                  <form
                    action={startCheckout}
                    className="group-has-[#pricing-year:checked]/period:hidden"
                  >
                    <input type="hidden" name="plan" value="monthly" />
                    <button
                      type="submit"
                      className="bg-shell-accent text-shell-accent-fg hover:bg-shell-accent-deep inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors"
                    >
                      {t.payMonth}
                    </button>
                  </form>
                  <form
                    action={startCheckout}
                    className="hidden group-has-[#pricing-year:checked]/period:block"
                  >
                    <input type="hidden" name="plan" value="yearly" />
                    <button
                      type="submit"
                      className="bg-shell-accent text-shell-accent-fg hover:bg-shell-accent-deep inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors"
                    >
                      {t.payYear}
                    </button>
                  </form>
                </div>
              )}
            </article>
          </div>
        </section>

        <section className="border-shell-border mt-8 rounded-2xl border p-5 sm:p-6">
          <h2 className="text-shell-fg text-sm font-medium">{t.limitTitle}</h2>
          <ul className="text-shell-muted mt-3 grid gap-2 text-sm leading-relaxed">
            {t.limitLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          {session && !pro ? (
            <p className="text-shell-fg mt-3 text-sm font-medium tabular-nums">
              {t.usage(used)}
            </p>
          ) : null}
        </section>

        <div className="mt-12">
          <Comparison001
            eyebrow={t.compareEyebrow}
            title={t.compareTitle}
            themLabel={t.free}
            usLabel={t.pro}
            rows={[...t.compareRows]}
            accent={BRAND_ACCENT}
          />
        </div>

        <div className="mt-12">
          <Pricing011
            eyebrow={t.faqEyebrow}
            title={t.faqTitle}
            lede={t.faqLede}
            questions={[...t.faq]}
            contact={{
              text: t.contactText,
              label: t.contactLabel,
              href: localePath(locale, "/report"),
            }}
            accent={BRAND_ACCENT}
          />
        </div>

        <p className="text-shell-muted mt-10 text-sm leading-relaxed">
          {t.legal}{" "}
          <Link
            href={localePath(locale, "/legal/offer")}
            className="text-shell-fg underline-offset-4 hover:underline"
          >
            {t.offer}
          </Link>{" "}
          {t.and}{" "}
          <Link
            href={localePath(locale, "/legal/privacy")}
            className="text-shell-fg underline-offset-4 hover:underline"
          >
            {t.privacy}
          </Link>
          .
        </p>
      </main>
    </CatalogShell>
  )
}

function PeriodOption({
  id,
  name,
  defaultChecked,
  children,
}: {
  id: string
  name: string
  defaultChecked?: boolean
  children: ReactNode
}) {
  return (
    <label
      htmlFor={id}
      className="text-shell-muted has-[:checked]:bg-shell-elevated has-[:checked]:text-shell-fg has-[:focus-visible]:ring-shell-ring inline-flex h-8 cursor-pointer items-center rounded-md px-3 text-sm transition-colors has-[:checked]:font-medium has-[:focus-visible]:ring-2"
    >
      <input
        id={id}
        type="radio"
        name={name}
        defaultChecked={defaultChecked}
        className="sr-only"
      />
      {children}
    </label>
  )
}
