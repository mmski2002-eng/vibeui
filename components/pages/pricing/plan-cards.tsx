"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { Check, Crown, Sparkles } from "lucide-react"

import { startCheckout } from "@/lib/payment-actions"
import { cn } from "@/lib/utils"

export type PlanCardsTexts = {
  switchLabel: string
  month: string
  year: string
  save: string
  perMonth: string
  perYear: string
  /** «492 ₽ в месяц» — уже с числом: функции в клиентский компонент не проходят. */
  yearlyNotePro: string
  yearlyNoteEnterprise: string
  savingNote: string
  free: {
    name: string
    eyebrow: string
    features: readonly string[]
    cta: string
    ctaSigned: string
    under: string
  }
  pro: {
    name: string
    eyebrow: string
    badge: string
    plusAll: string
    features: readonly string[]
    anchor: string
    cta: string
    payMonth: string
    payYear: string
    under: string
    activeUntil: string | null
    manage: string
  }
  enterprise: {
    name: string
    eyebrow: string
    badge: string
    plusAll: string
    features: readonly string[]
    cta: string
    under: string
  }
}

export type PlanCardsProps = {
  locale: "ru" | "en"
  texts: PlanCardsTexts
  prices: { monthly: number; yearly: number; enterpriseMonthly: number; enterpriseYearly: number }
  signed: boolean
  pro: boolean
  signupHref: string
  accountHref: string
  manageHref: string
}

const money = new Intl.NumberFormat("ru-RU")

/** Цена не прыгает, а докручивается: сотни рублей за полсекунды. */
function AnimatedPrice({ value }: { value: number }) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)

  useEffect(() => {
    const start = from.current
    const delta = value - start

    if (
      delta === 0 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      from.current = value
      setShown(value)
      return
    }

    const began = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min(1, (now - began) / 520)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + delta * eased)

      setShown(current)

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        from.current = value
      }
    }

    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [value])

  return <>{money.format(shown)}</>
}

function Feature({
  children,
  tone,
}: {
  children: ReactNode
  tone: "muted" | "accent" | "onDark"
}) {
  return (
    <li className="flex items-start gap-2.5 text-sm leading-relaxed">
      <Check
        className={cn(
          "mt-1 size-3.5 shrink-0",
          tone === "muted" && "text-shell-muted",
          tone === "accent" && "text-shell-accent-text",
          tone === "onDark" && "text-[#ff5900]",
        )}
        aria-hidden="true"
      />
      <span>{children}</span>
    </li>
  )
}

/**
 * Три карточки тарифов с переключателем периода. Pro стоит в центре тёмной
 * панелью — единственное тёмное пятно на светлой странице, чтобы глаз шёл
 * туда сам. Энтерпрайз — тот же Pro вдвое дороже плюс респект: шутка,
 * которую человек либо оценит, либо просто пройдёт мимо к Pro.
 */
export function PlanCards({
  locale,
  texts: t,
  prices,
  signed,
  pro,
  signupHref,
  accountHref,
  manageHref,
}: PlanCardsProps) {
  const [yearly, setYearly] = useState(false)
  const proPrice = yearly ? prices.yearly : prices.monthly
  const enterprisePrice = yearly
    ? prices.enterpriseYearly
    : prices.enterpriseMonthly
  const period = yearly ? t.perYear : t.perMonth
  const proButton =
    "bg-[#ff5900] text-[#151515] hover:bg-[#ff7a33] focus-visible:ring-[#ff5900] inline-flex h-11 w-full items-center justify-center rounded-lg px-5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#151515] focus-visible:outline-none"
  const outlineButton =
    "border-shell-border-strong text-shell-fg hover:border-shell-accent focus-visible:ring-shell-ring inline-flex h-11 w-full items-center justify-center rounded-lg border px-5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"

  return (
    <div>
      <div
        role="group"
        aria-label={t.switchLabel}
        className="border-shell-border bg-shell-panel mx-auto inline-flex items-center gap-0.5 rounded-full border p-1"
      >
        {[false, true].map((option) => (
          <button
            key={String(option)}
            type="button"
            aria-pressed={yearly === option}
            onClick={() => setYearly(option)}
            className={cn(
              "focus-visible:ring-shell-ring inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
              yearly === option
                ? "bg-shell-fg text-shell font-medium"
                : "text-shell-muted hover:text-shell-fg",
            )}
          >
            {option ? t.year : t.month}
            {option ? (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[0.6875rem] font-semibold",
                  yearly
                    ? "bg-[#ff5900] text-[#151515]"
                    : "bg-shell-accent-soft text-shell-accent-text",
                )}
              >
                {t.save}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-8 grid items-stretch gap-4 text-left lg:grid-cols-3 lg:gap-5">
        {/* Free */}
        <article className="border-shell-border bg-shell-panel order-2 flex flex-col rounded-3xl border p-6 sm:p-7 lg:order-1">
          <p className="text-shell-muted text-xs font-medium tracking-wide uppercase">
            {t.free.eyebrow}
          </p>
          <h2 className="text-shell-fg mt-2 text-xl font-semibold">{t.free.name}</h2>
          <p className="text-shell-fg mt-5 text-4xl font-semibold tracking-tight tabular-nums">
            0 ₽
          </p>
          <p className="text-shell-muted mt-1 text-sm">&nbsp;</p>
          <ul className="text-shell-muted mt-6 grid gap-2.5">
            {t.free.features.map((feature) => (
              <Feature key={feature} tone="muted">
                {feature}
              </Feature>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            <Link href={signed ? accountHref : signupHref} className={outlineButton}>
              {signed ? t.free.ctaSigned : t.free.cta}
            </Link>
            <p className="text-shell-muted mt-3 text-center text-xs">{t.free.under}</p>
          </div>
        </article>

        {/* Pro */}
        <article className="relative order-1 flex flex-col rounded-3xl bg-[#151515] p-6 text-[#f2f2f2] shadow-[0_30px_80px_-30px_rgba(255,89,0,0.55)] ring-1 ring-[#ff5900]/60 sm:p-7 lg:order-2 lg:-my-3 lg:p-8">
          <div
            className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-[#ff5900] to-transparent"
            aria-hidden="true"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium tracking-wide text-[#f2f2f2]/60 uppercase">
              {t.pro.eyebrow}
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#ff5900] px-2.5 py-1 text-[0.6875rem] font-semibold text-[#151515]">
              <Sparkles className="size-3" aria-hidden="true" />
              {t.pro.badge}
            </span>
          </div>
          <h2 className="mt-2 text-xl font-semibold">{t.pro.name}</h2>
          <p className="mt-5 text-5xl font-semibold tracking-tight tabular-nums">
            <AnimatedPrice value={proPrice} /> ₽
            <span className="text-base font-normal text-[#f2f2f2]/60"> {period}</span>
          </p>
          <p className="mt-1 min-h-5 text-sm text-[#f2f2f2]/60">
            {yearly
              ? `${t.yearlyNotePro} · ${t.savingNote}`
              : t.pro.anchor}
          </p>
          <ul className="mt-6 grid gap-2.5">
            <li className="text-sm font-medium text-[#f2f2f2]/80">{t.pro.plusAll}</li>
            {t.pro.features.map((feature) => (
              <Feature key={feature} tone="onDark">
                {feature}
              </Feature>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            {!signed ? (
              <Link href={signupHref} className={proButton}>
                {t.pro.cta}
              </Link>
            ) : pro ? (
              <div className="grid gap-2">
                {t.pro.activeUntil ? (
                  <p className="text-sm font-medium">{t.pro.activeUntil}</p>
                ) : null}
                <Link
                  href={manageHref}
                  className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-[#f2f2f2]/25 px-5 text-sm font-medium transition-colors hover:border-[#ff5900] focus-visible:ring-2 focus-visible:ring-[#ff5900] focus-visible:outline-none"
                >
                  {t.pro.manage}
                </Link>
              </div>
            ) : (
              <form action={startCheckout}>
                <input type="hidden" name="plan" value={yearly ? "yearly" : "monthly"} />
                <input type="hidden" name="locale" value={locale} />
                <button type="submit" className={proButton}>
                  {yearly ? t.pro.payYear : t.pro.payMonth}
                </button>
              </form>
            )}
            <p className="mt-3 text-center text-xs text-[#f2f2f2]/50">{t.pro.under}</p>
          </div>
        </article>

        {/* Enterprise */}
        <article className="border-shell-border bg-shell-panel order-3 flex flex-col rounded-3xl border p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <p className="text-shell-muted text-xs font-medium tracking-wide uppercase">
              {t.enterprise.eyebrow}
            </p>
            <span className="border-shell-accent-line text-shell-accent-text inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold">
              <Crown className="size-3" aria-hidden="true" />
              {t.enterprise.badge}
            </span>
          </div>
          <h2 className="text-shell-fg mt-2 text-xl font-semibold">{t.enterprise.name}</h2>
          <p className="text-shell-fg mt-5 text-4xl font-semibold tracking-tight tabular-nums">
            <AnimatedPrice value={enterprisePrice} /> ₽
            <span className="text-shell-muted text-base font-normal"> {period}</span>
          </p>
          <p className="text-shell-muted mt-1 min-h-5 text-sm">
            {yearly ? t.yearlyNoteEnterprise : " "}
          </p>
          <ul className="text-shell-muted mt-6 grid gap-2.5">
            <li className="text-shell-fg text-sm font-medium">{t.enterprise.plusAll}</li>
            {t.enterprise.features.map((feature) => (
              <Feature key={feature} tone="accent">
                {feature}
              </Feature>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            {!signed ? (
              <Link href={signupHref} className={outlineButton}>
                {t.enterprise.cta}
              </Link>
            ) : (
              <form action={startCheckout}>
                <input
                  type="hidden"
                  name="plan"
                  value={yearly ? "enterprise-yearly" : "enterprise-monthly"}
                />
                <input type="hidden" name="locale" value={locale} />
                <button type="submit" className={outlineButton}>
                  {t.enterprise.cta}
                </button>
              </form>
            )}
            <p className="text-shell-muted mt-3 text-center text-xs">{t.enterprise.under}</p>
          </div>
        </article>
      </div>
    </div>
  )
}
