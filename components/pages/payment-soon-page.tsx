import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { CatalogShell } from "@/components/catalog/catalog-shell"
import { localePath, type Locale } from "@/lib/i18n"
import { FREE_MONTHLY_LIMIT } from "@/lib/limits"

const TEXTS = {
  ru: {
    eyebrow: "Оплата",
    title: "Оплата пока не подключена",
    text: `Мы ещё подключаем кассу. Пока пользуйтесь бесплатно: ${FREE_MONTHLY_LIMIT} компонентов в месяц, избранное, история и ключ для shadcn CLI уже работают. Когда оплата откроется, напишем на почту аккаунта.`,
    catalog: "Открыть каталог",
    pricing: "К тарифам",
  },
  en: {
    eyebrow: "Payment",
    title: "Payments are not connected yet",
    text: `We are still connecting the payment provider. Meanwhile use VibeUI for free: ${FREE_MONTHLY_LIMIT} components a month, favourites, history and the shadcn CLI key already work. We will email your account when payments open.`,
    catalog: "Open the catalog",
    pricing: "Back to pricing",
  },
} as const

/** Куда ведёт «Оплатить», пока касса не подключена: не ошибка, а объяснение. */
export function PaymentSoonPage({ locale }: { locale: Locale }) {
  const t = TEXTS[locale]

  return (
    <CatalogShell locale={locale}>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <section className="border-shell-border bg-shell-panel relative w-full max-w-xl overflow-hidden rounded-2xl border px-6 py-12 text-center sm:px-10 sm:py-14">
          <div
            className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-[#ff5900] to-transparent"
            aria-hidden="true"
          />
          <p className="text-shell-accent-text text-xs font-semibold tracking-[0.14em] uppercase">
            {t.eyebrow}
          </p>
          <h1 className="text-shell-fg mt-3 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {t.title}
          </h1>
          <p className="text-shell-muted mt-4 text-sm leading-relaxed text-pretty sm:text-base">
            {t.text}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={localePath(locale, "/components")}
              className="bg-shell-accent text-shell-accent-fg hover:bg-shell-accent-deep inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors"
            >
              {t.catalog}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href={localePath(locale, "/pricing")}
              className="border-shell-border-strong text-shell-fg hover:border-shell-accent inline-flex h-11 items-center rounded-full border px-6 text-sm font-medium transition-colors"
            >
              {t.pricing}
            </Link>
          </div>
        </section>
      </main>
    </CatalogShell>
  )
}
