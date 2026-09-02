"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Commerce020Code = {
  code: string
  percent: number
  label: string
}

export type Commerce020Props = {
  title?: string
  goods?: number
  shipping?: number
  codes?: Commerce020Code[]
  placeholder?: string
  cta?: string
  error?: string
  /** Подпись поля ввода кода. */
  fieldLabel?: string
  /** Шаблон сообщения об успехе, {label} — название скидки. */
  appliedText?: string
  /** Шаблон подписи кнопки снятия, {code} — код. */
  removeText?: string
  /** Подписи строк итога. */
  goodsLabel?: string
  shippingLabel?: string
  totalLabel?: string
  /** Что стоит вместо цены при бесплатной доставке. */
  freeText?: string
  /** Шаблон строки скидки, {code} — применённый код. */
  discountText?: string
  /** Сноска под итогом. */
  hint?: string
  /** Локаль для разрядов в суммах. */
  locale?: string
  /** Шаблон суммы, {value} — число с разрядами. */
  priceText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: промокод, который сразу показывает результат в итоге. Поле
// «применить» без пересчёта заставляет верить на слово; здесь скидка
// появляется отдельной строкой и вычитается из суммы. Ошибка говорит,
// что именно не так, и живёт в aria-live: иначе о ней узнают только зрячие.
// Применённый код показан отдельным элементом с кнопкой снятия — набранный
// в поле код через минуту уже никто не помнит.
const STYLES = `
:where([data-vibeui-block="commerce-020"]){
--vibeui-commerce-020-bg:transparent;
--vibeui-commerce-020-paper:light-dark(oklch(1 0 0),oklch(0.2 0.012 265));
--vibeui-commerce-020-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-commerce-020-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-commerce-020-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-commerce-020-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.01 265));
--vibeui-commerce-020-accent:light-dark(oklch(0.55 0.2 262),oklch(0.73 0.16 262));
--vibeui-commerce-020-ok:light-dark(oklch(0.55 0.14 152),oklch(0.75 0.14 152));
--vibeui-commerce-020-bad:light-dark(oklch(0.58 0.19 25),oklch(0.74 0.16 25));
--vibeui-commerce-020-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-020"]{
box-sizing:border-box;
background:var(--vibeui-commerce-020-bg);
font-family:var(--vibeui-commerce-020-sans);color:var(--vibeui-commerce-020-fg);
}
[data-vibeui-block="commerce-020"] *{box-sizing:border-box}
[data-vibeui-block="commerce-020"] [data-part="shell"]{padding:1rem;max-width:34rem;margin:0 auto}
[data-vibeui-block="commerce-020"] h2{margin:0 0 0.75rem;font-size:1.0625rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-020"] [data-part="form"]{display:flex;gap:0.5rem;align-items:flex-end;flex-wrap:wrap}
[data-vibeui-block="commerce-020"] label{display:flex;flex-direction:column;gap:0.25rem;flex:1 1 12rem;font-size:0.6875rem;color:var(--vibeui-commerce-020-muted)}
[data-vibeui-block="commerce-020"] input{
font:inherit;font-size:0.875rem;color:inherit;height:2.5rem;padding:0 0.75rem;letter-spacing:0.06em;text-transform:uppercase;
border:1px solid var(--vibeui-commerce-020-border);border-radius:0.625rem;background:var(--vibeui-commerce-020-paper);
}
[data-vibeui-block="commerce-020"] input:focus-visible{outline:2px solid var(--vibeui-commerce-020-accent);outline-offset:1px}
[data-vibeui-block="commerce-020"] [data-part="apply"]{
appearance:none;border:0;cursor:pointer;height:2.5rem;padding:0 1rem;border-radius:0.625rem;
background:var(--vibeui-commerce-020-fg);color:var(--vibeui-commerce-020-paper);font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-020"] [data-part="apply"]:disabled{opacity:.4;cursor:not-allowed}
[data-vibeui-block="commerce-020"] [data-part="apply"]:focus-visible{outline:2px solid var(--vibeui-commerce-020-accent);outline-offset:2px}
/* Ошибка в aria-live: иначе о ней узнают только те, кто видит поле. */
[data-vibeui-block="commerce-020"] [data-part="says"]{margin:0.5rem 0 0;font-size:0.75rem;min-height:1.125rem;line-height:1.4}
[data-vibeui-block="commerce-020"] [data-tone="bad"]{color:var(--vibeui-commerce-020-bad)}
[data-vibeui-block="commerce-020"] [data-tone="ok"]{color:var(--vibeui-commerce-020-ok)}
[data-vibeui-block="commerce-020"] [data-part="chips"]{list-style:none;display:flex;flex-wrap:wrap;gap:0.375rem;margin:0.5rem 0 0;padding:0}
[data-vibeui-block="commerce-020"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.5rem;padding:0.25rem 0.375rem 0.25rem 0.625rem;border-radius:9999px;
border:1px dashed var(--vibeui-commerce-020-ok);color:var(--vibeui-commerce-020-ok);
font-size:0.75rem;font-weight:650;letter-spacing:0.04em;
}
[data-vibeui-block="commerce-020"] [data-part="chip"] button{
appearance:none;border:0;background:none;cursor:pointer;padding:0 0.25rem;color:inherit;font:inherit;line-height:1;
}
[data-vibeui-block="commerce-020"] [data-part="chip"] button:focus-visible{outline:2px solid var(--vibeui-commerce-020-accent);outline-offset:2px;border-radius:9999px}
[data-vibeui-block="commerce-020"] dl{
display:grid;grid-template-columns:1fr auto;gap:0.375rem 0.75rem;
margin:0.875rem 0 0;padding-top:0.75rem;border-top:1px solid var(--vibeui-commerce-020-border);font-size:0.8125rem;
}
[data-vibeui-block="commerce-020"] [data-part="pair"]{display:contents}
[data-vibeui-block="commerce-020"] dt{color:var(--vibeui-commerce-020-muted)}
[data-vibeui-block="commerce-020"] dd{margin:0;text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-020"] [data-cut="true"] dt,
[data-vibeui-block="commerce-020"] [data-cut="true"] dd{color:var(--vibeui-commerce-020-ok);font-weight:650}
[data-vibeui-block="commerce-020"] [data-grand="true"] dt,
[data-vibeui-block="commerce-020"] [data-grand="true"] dd{font-size:1.125rem;font-weight:700;color:var(--vibeui-commerce-020-fg)}
[data-vibeui-block="commerce-020"] [data-part="hint"]{margin:0.75rem 0 0;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-commerce-020-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-020"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CODES: Commerce020Code[] = [
  { code: "VESNA10", percent: 10, label: "Весенняя скидка 10%" },
  { code: "FIRST15", percent: 15, label: "Первый заказ, 15%" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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

/**
 * Промокод в корзине: скидка сразу становится строкой в итоге.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce020({
  title = "Промокод",
  goods = 53700,
  shipping = 490,
  codes = DEFAULT_CODES,
  placeholder = "VESNA10",
  cta = "Применить",
  error = "Такого промокода нет или он уже закончился",
  fieldLabel = "Код из письма или из подписки",
  appliedText = "{label} применена",
  removeText = "Снять промокод {code}",
  goodsLabel = "Товары",
  shippingLabel = "Доставка",
  totalLabel = "Итого",
  freeText = "бесплатно",
  discountText = "Скидка {code}",
  hint = "Промокод не суммируется с товарами по акции. Скидка пересчитается, если состав корзины изменится.",
  locale = "ru-RU",
  priceText = "{value} ₽",
  accent,
  background = "",
  className,
  style,
}: Commerce020Props) {
  const money = (value: number) =>
    priceText.replace("{value}", Math.round(value).toLocaleString(locale))

  const [draft, setDraft] = useState("")
  const [applied, setApplied] = useState<Commerce020Code | null>(null)
  const [says, setSays] = useState<{ tone: "ok" | "bad"; text: string } | null>(
    null,
  )

  // Скидка считается от суммы товаров, а не приходит готовым числом.
  const cut = applied ? (goods * applied.percent) / 100 : 0

  const apply = () => {
    const found = codes.find(
      (entry) => entry.code.toLowerCase() === draft.trim().toLowerCase(),
    )

    if (!found) {
      setSays({ tone: "bad", text: error })
      return
    }

    setApplied(found)
    setDraft("")
    setSays({ tone: "ok", text: appliedText.replace("{label}", found.label) })
  }

  const palette = {
    ...(accent ? { "--vibeui-commerce-020-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-020-bg": background,
          "--vibeui-commerce-020-paper": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-020" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-020"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>

          <div data-part="form">
            <label htmlFor="commerce-020-code">
              {fieldLabel}
              <input
                id="commerce-020-code"
                type="text"
                value={draft}
                placeholder={placeholder}
                autoComplete="off"
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    apply()
                  }
                }}
              />
            </label>
            <button
              type="button"
              data-part="apply"
              disabled={draft.trim().length === 0}
              onClick={apply}
            >
              {cta}
            </button>
          </div>

          <p data-part="says" data-tone={says?.tone} aria-live="polite">
            {says?.text ?? ""}
          </p>

          {applied ? (
            <ul data-part="chips">
              <li data-part="chip">
                {applied.code} · −{applied.percent}%
                <button
                  type="button"
                  aria-label={removeText.replace("{code}", applied.code)}
                  onClick={() => {
                    setApplied(null)
                    setSays(null)
                  }}
                >
                  ✕
                </button>
              </li>
            </ul>
          ) : null}

          <dl>
            <div data-part="pair">
              <dt>{goodsLabel}</dt>
              <dd>{money(goods)}</dd>
            </div>
            {applied ? (
              <div data-part="pair" data-cut="true">
                <dt>{discountText.replace("{code}", applied.code)}</dt>
                <dd>−{money(cut)}</dd>
              </div>
            ) : null}
            <div data-part="pair">
              <dt>{shippingLabel}</dt>
              <dd>{shipping === 0 ? freeText : money(shipping)}</dd>
            </div>
            <div data-part="pair" data-grand="true">
              <dt>{totalLabel}</dt>
              <dd>{money(goods - cut + shipping)}</dd>
            </div>
          </dl>

          <p data-part="hint">{hint}</p>
        </div>
      </section>
    </>
  )
}
