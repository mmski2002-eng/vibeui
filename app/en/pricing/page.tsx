import Link from "next/link"

import { CatalogShell } from "@/components/catalog/catalog-shell"
import { FREE_MONTHLY_LIMIT } from "@/lib/entitlements"
import { startCheckout } from "@/lib/payment-actions"
import { PLANS } from "@/lib/plans"
import { pageMetadata } from "@/lib/seo"
import { getSession } from "@/lib/session"

export const metadata = pageMetadata({
  locale: "en",
  path: "/pricing",
  title: "Pricing",
  description:
    "A hundred components a month for free. Pro unlocks closed components and removes the limit.",
})

const FREE_FEATURES = [
  "The whole catalog, previews and search",
  `${FREE_MONTHLY_LIMIT} different components a month`,
  "Copy for AI and install through shadcn",
  "Favourites and history",
]

const PRO_FEATURES = [
  "Closed Pro components",
  "No limit on copying",
  "Personal install key",
  "14 days of Pro for every paying invite",
]

export default async function PricingPageEn() {
  const session = await getSession()

  return (
    <CatalogShell locale="en">
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:py-16 lg:px-6">
        <h1 className="text-shell-fg text-3xl font-semibold tracking-tight sm:text-4xl">
          Pricing
        </h1>
        <p className="text-shell-muted mt-3 max-w-2xl text-base leading-relaxed">
          The catalog stays open: browsing, searching and trying components on
          needs no account. What costs money is the volume of work, not access
          to the design.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <section className="border-shell-border bg-shell-panel rounded-2xl border p-6">
            <h2 className="text-shell-fg text-lg font-semibold">Free</h2>
            <p className="text-shell-fg mt-3 text-3xl font-semibold">0 ₽</p>
            <ul className="mt-6 grid gap-2.5">
              {FREE_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="text-shell-muted text-sm leading-relaxed"
                >
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={session ? "/en/account" : "/en/signup"}
              className="border-shell-border-strong text-shell-fg hover:border-shell-accent mt-6 inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-colors"
            >
              {session ? "Open account" : "Create account"}
            </Link>
          </section>

          <section className="border-shell-accent bg-shell-panel rounded-2xl border p-6">
            <h2 className="text-shell-fg text-lg font-semibold">Pro</h2>
            <p className="text-shell-fg mt-3 text-3xl font-semibold">
              {Math.round(Number(PLANS.monthly.price))} ₽
              <span className="text-shell-muted text-base font-normal">
                {" "}
                / month
              </span>
            </p>
            <p className="text-shell-muted mt-1 text-sm">
              {Math.round(Number(PLANS.yearly.price))} ₽ a year, two months free
            </p>
            <ul className="mt-6 grid gap-2.5">
              {PRO_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="text-shell-muted text-sm leading-relaxed"
                >
                  {feature}
                </li>
              ))}
            </ul>

            {session ? (
              <div className="mt-6 flex flex-wrap gap-2">
                <form action={startCheckout}>
                  <input type="hidden" name="plan" value="monthly" />
                  <button
                    type="submit"
                    className="bg-shell-accent text-shell-accent-fg inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-opacity hover:opacity-90"
                  >
                    Pay monthly
                  </button>
                </form>
                <form action={startCheckout}>
                  <input type="hidden" name="plan" value="yearly" />
                  <button
                    type="submit"
                    className="border-shell-border-strong text-shell-fg hover:border-shell-accent inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-colors"
                  >
                    Pay yearly
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/en/signup"
                className="bg-shell-accent text-shell-accent-fg mt-6 inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-opacity hover:opacity-90"
              >
                Get started
              </Link>
            )}
          </section>
        </div>

        <p className="text-shell-muted mt-8 text-sm leading-relaxed">
          Payment by card or through SBP. The subscription renews itself;
          renewal can be switched off in the account at any time and access
          stays until the paid period ends. A receipt arrives by email.
        </p>
      </main>
    </CatalogShell>
  )
}
