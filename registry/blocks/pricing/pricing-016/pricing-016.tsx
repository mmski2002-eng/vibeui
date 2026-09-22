"use client"

import { useState } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import type { CSSProperties } from "react"

export type Pricing016Promo = {
  code: string
  percent: number
  caption: string
}

export type Pricing016Props = {
  eyebrow?: string
  title?: string
  planName?: string
  planCaption?: string
  price?: number
  currency?: string
  period?: string
  placeholder?: string
  applyLabel?: string
  promos?: Pricing016Promo[]
  hint?: string
  action?: { label: string; href: string }
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  /** Ответ на неизвестный код. Плейсхолдер {code}. */
  notFoundText?: string
  /** Ответ на принятый код. Плейсхолдер {caption}. */
  appliedText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: поле промокода, которое отвечает сразу. Клиентский компонент:
// без состояния поле не проверяет код. Результат проверки объявляется через
// role="status", а не только подкрашивается зелёным и красным — цвет один не
// доходит до скринридера и до дальтоника. Ошибочный код не стирается: его
// оставляют, чтобы человек увидел опечатку. Старая цена набрана в <s> и
// озвучивается как удалённая, новая стоит рядом обычным текстом.
const STYLES = `
:where([data-vibeui-block="pricing-016"]){
--vibeui-pricing-016-bg:transparent;
--vibeui-pricing-016-fg:light-dark(oklch(0.2 0 300),oklch(0.94 0 300));
--vibeui-pricing-016-muted:light-dark(oklch(0.51 0 300),oklch(0.7 0 300));
--vibeui-pricing-016-card:light-dark(oklch(1 0 0),oklch(0.25 0 300));
--vibeui-pricing-016-line:light-dark(oklch(0.89 0 300),oklch(0.37 0 300));
--vibeui-pricing-016-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-pricing-016-accent-fg:oklch(from var(--vibeui-pricing-016-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pricing-016-ok:light-dark(oklch(0.5 0.13 150),oklch(0.78 0.14 150));
--vibeui-pricing-016-bad:light-dark(oklch(0.53 0.16 25),oklch(0.75 0.15 25));
--vibeui-pricing-016-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-pricing-016-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-pricing-016-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-016"]{color-scheme:dark}
[data-vibeui-block="pricing-016"] [data-part="cta-button"]{margin-top:1.5rem;}
[data-vibeui-block="pricing-016"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-pricing-016-bg);color:var(--vibeui-pricing-016-fg);
font-family:var(--vibeui-pricing-016-sans);
}
[data-vibeui-block="pricing-016"] *{box-sizing:border-box}
[data-vibeui-block="pricing-016"] [data-part="heading"]{margin-bottom:1.5rem}
[data-vibeui-block="pricing-016"] [data-part="shell"]{max-width:38rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="pricing-016"] [data-part="card"]{
padding:1.75rem;border-radius:1.125rem;border:1px solid var(--vibeui-pricing-016-line);background:var(--vibeui-pricing-016-card);
}
[data-vibeui-block="pricing-016"] h3{margin:0;font-size:1rem;font-weight:700}
[data-vibeui-block="pricing-016"] [data-part="caption"]{margin:0.375rem 0 0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-pricing-016-muted)}
[data-vibeui-block="pricing-016"] [data-part="prices"]{
display:flex;align-items:baseline;flex-wrap:wrap;gap:0.5rem;margin:1.25rem 0 0;
}
[data-vibeui-block="pricing-016"] [data-part="now"]{
font-size:2.25rem;font-weight:700;letter-spacing:-0.045em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pricing-016"] s{font-size:1.125rem;color:var(--vibeui-pricing-016-muted)}
[data-vibeui-block="pricing-016"] [data-part="period"]{font-size:0.8125rem;color:var(--vibeui-pricing-016-muted)}
[data-vibeui-block="pricing-016"] form{margin:1.5rem 0 0}
[data-vibeui-block="pricing-016"] [data-part="row"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="pricing-016"] [data-part="row"] > [data-vibeui-block="input-001"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="pricing-016"] [data-part="row"] > [data-vibeui-block="button-001"]{align-self:center}
[data-vibeui-block="pricing-016"] [data-part="status"]{
display:flex;align-items:center;gap:0.4375rem;margin:0.75rem 0 0;min-height:1.25rem;
font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="pricing-016"] [data-state="ok"]{color:var(--vibeui-pricing-016-ok)}
[data-vibeui-block="pricing-016"] [data-state="bad"]{color:var(--vibeui-pricing-016-bad)}
@container (min-width: 30rem){
[data-vibeui-block="pricing-016"] [data-part="row"]{flex-direction:row;align-items:center}
[data-vibeui-block="pricing-016"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="pricing-016"] [data-part="card"]{padding:2.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PROMOS: Pricing016Promo[] = [
  { code: "VIBE20", percent: 20, caption: "Скидка 20 % на первый год" },
  { code: "FRIEND10", percent: 10, caption: "Скидка 10 % по приглашению" },
]

const MONEY = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 })

const DEFAULT_LABELS: Record<string, string> = {
  field: "Промокод",
  empty: "Введите промокод",
}

function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? values[key] : match,
  )
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/** Блок скидки по промокоду: проверка кода на месте, результат объявляется через role="status". */
export function Pricing016({
  eyebrow = "Промокод",
  title = "Есть код — примените его до оплаты",
  planName = "Тариф «Команда», год",
  planCaption = "До пяти участников, все секции каталога, поддержка за рабочий день.",
  price = 14880,
  currency = "₽",
  period = "в год",
  placeholder = "VIBE20",
  applyLabel = "Применить",
  promos = DEFAULT_PROMOS,
  hint = "Промокод действует на первую оплату и не суммируется с другими скидками.",
  action = { label: "Перейти к оплате", href: "#" },
  labels = DEFAULT_LABELS,
  notFoundText = "Код «{code}» не найден или уже использован",
  appliedText = "{caption} применена",
  accent,
  background = "",
  className,
  style,
}: Pricing016Props) {
  const [code, setCode] = useState("")
  const [applied, setApplied] = useState<Pricing016Promo | null>(null)
  const [error, setError] = useState("")

  const text = (key: string) => labels[key] ?? DEFAULT_LABELS[key]

  const palette = {
    ...(accent ? { "--vibeui-pricing-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pricing-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const discounted = applied
    ? Math.round(price * (1 - applied.percent / 100))
    : price

  function apply() {
    const normalized = code.trim().toUpperCase()
    const found = promos.find((promo) => promo.code === normalized)

    if (found) {
      setApplied(found)
      setError("")
      return
    }

    setApplied(null)
    setError(
      normalized ? fill(notFoundText, { code: normalized }) : text("empty"),
    )
  }

  return (
    <>
      <style href="vibeui-pricing-016" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-016"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            eyebrow={eyebrow}
            title={title}
            size="sm"
            accent={accent}
          />

          <div data-part="card">
            <h3>{planName}</h3>
            <p data-part="caption">{planCaption}</p>

            <p data-part="prices">
              <span data-part="now">
                {MONEY.format(discounted)} {currency}
              </span>
              {applied ? (
                <s>
                  {MONEY.format(price)} {currency}
                </s>
              ) : null}
              <span data-part="period">{period}</span>
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                apply()
              }}
            >
              <div data-part="row">
                <Input001
                  name="promo"
                  type="text"
                  autoComplete="off"
                  label={text("field")}
                  hint={placeholder}
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  accent={accent}
                />
                <Button001 type="submit" size="lg" accent={accent}>
                  {applyLabel}
                </Button001>
              </div>
            </form>

            <p
              data-part="status"
              data-state={applied ? "ok" : error ? "bad" : undefined}
              role="status"
            >
              {applied
                ? fill(appliedText, { caption: applied.caption })
                : error}
            </p>

            {hint ? <p data-part="hint">{hint}</p> : null}

            <Button016 data-part="cta-button" label={action.label} href={action.href} external={false} size="lg" tone="accent" accent={accent} />
          </div>
        </div>
      </section>
    </>
  )
}
