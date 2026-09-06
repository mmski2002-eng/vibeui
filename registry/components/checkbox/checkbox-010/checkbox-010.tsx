"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Checkbox010Addon = {
  id: string
  title: string
  note: string
  price: number
  recommended?: boolean
}

export type Checkbox010Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange"
> & {
  legend?: string
  addons?: Checkbox010Addon[]
  defaultValue?: string[]
  currency?: string
  /** Плашка у рекомендованного дополнения. */
  recommendedLabel?: string
  /** Строка итога слева. {count} — сколько дополнений выбрано. */
  totalText?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: карточка-чекбокс, у которой выбор рисуется вложенной
// рамкой через box-shadow inset, а не толщиной border, — карточка не дёргается
// на ширину пикселя при отметке. Цены складываются в итог под списком, поэтому
// выбор сразу отвечает на вопрос «сколько всего».
//
// Тема берётся из color-scheme окружения через light-dark(): карточки темнеют
// вместе со страницей и не носят собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="checkbox-010"]){
--vibeui-checkbox-010-panel:transparent;
--vibeui-checkbox-010-bg:light-dark(oklch(1 0 0),oklch(0.29 0 265));
--vibeui-checkbox-010-surface:light-dark(oklch(0.985 0 265),oklch(0.24 0 265));
--vibeui-checkbox-010-fg:light-dark(oklch(0.21 0 265),oklch(0.95 0 265));
--vibeui-checkbox-010-muted:color-mix(in oklab,var(--vibeui-checkbox-010-fg) 68%,transparent);
--vibeui-checkbox-010-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-checkbox-010-accent:light-dark(oklch(0.52 0.15 168),oklch(0.74 0.13 168));
--vibeui-checkbox-010-soft:light-dark(oklch(0.96 0.03 168),oklch(0.3 0.05 168));
--vibeui-checkbox-010-mark:light-dark(oklch(0.99 0.01 168),oklch(0.19 0.03 168));
--vibeui-checkbox-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="checkbox-010"]{color-scheme:dark}
[data-vibeui-block="checkbox-010"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;
margin:0;padding:0.875rem;border:1px solid var(--vibeui-checkbox-010-border);border-radius:1rem;
background:var(--vibeui-checkbox-010-panel);
font-family:var(--vibeui-checkbox-010-font);color:var(--vibeui-checkbox-010-fg);
}
/* legend у fieldset садится на рамку: float возвращает его в поток, а
   clear:both не даёт следующим карточкам обтекать его. */
[data-vibeui-block="checkbox-010"] legend{float:left;width:100%;padding:0 0 0.25rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="checkbox-010"] [data-part="card"]{
clear:both;display:grid;grid-template-columns:1fr auto;column-gap:0.75rem;row-gap:0.25rem;
padding:0.75rem;border-radius:0.75rem;cursor:pointer;
background:var(--vibeui-checkbox-010-surface);
box-shadow:inset 0 0 0 1px var(--vibeui-checkbox-010-border);
transition:box-shadow .16s ease,background-color .16s ease;
}
[data-vibeui-block="checkbox-010"] [data-part="card"]:hover{background:var(--vibeui-checkbox-010-bg)}
/* Выбор — вложенная рамка в два пикселя вместо смены border: геометрия
   карточки не меняется, соседи не съезжают. */
[data-vibeui-block="checkbox-010"] [data-part="card"]:has(input:checked){
background:var(--vibeui-checkbox-010-soft);
box-shadow:inset 0 0 0 2px var(--vibeui-checkbox-010-accent);
}
[data-vibeui-block="checkbox-010"] [data-part="card"]:has(input:focus-visible){
outline:2px solid var(--vibeui-checkbox-010-accent);outline-offset:2px;
}
[data-vibeui-block="checkbox-010"] input{
appearance:none;position:absolute;width:1px;height:1px;margin:0;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="checkbox-010"] [data-part="head"]{
display:flex;align-items:center;gap:0.375rem;font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="checkbox-010"] [data-part="tick"]{
display:inline-flex;flex:none;width:1rem;height:1rem;border-radius:9999px;position:relative;
box-shadow:inset 0 0 0 1.5px var(--vibeui-checkbox-010-border);
}
[data-vibeui-block="checkbox-010"] [data-part="card"]:has(input:checked) [data-part="tick"]{
background:var(--vibeui-checkbox-010-accent);box-shadow:none;
}
[data-vibeui-block="checkbox-010"] [data-part="card"]:has(input:checked) [data-part="tick"]::after{
content:"";position:absolute;left:50%;top:50%;
width:0.1875rem;height:0.375rem;margin:-0.28125rem 0 0 -0.09375rem;
border-right:2px solid var(--vibeui-checkbox-010-mark);
border-bottom:2px solid var(--vibeui-checkbox-010-mark);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-010"] [data-part="flag"]{
padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-checkbox-010-accent);color:var(--vibeui-checkbox-010-mark);
font-size:0.625rem;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;
}
[data-vibeui-block="checkbox-010"] [data-part="price"]{
grid-row:1;grid-column:2;align-self:center;justify-self:end;
font-size:0.875rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="checkbox-010"] [data-part="note"]{
grid-column:1 / -1;font-size:0.75rem;line-height:1.45;color:var(--vibeui-checkbox-010-muted);
}
[data-vibeui-block="checkbox-010"] [data-part="total"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
margin:0.25rem 0 0;padding-top:0.625rem;
border-top:1px solid var(--vibeui-checkbox-010-border);
font-size:0.8125rem;
}
[data-vibeui-block="checkbox-010"] [data-part="sum"]{font-weight:700;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ADDONS: Checkbox010Addon[] = [
  {
    id: "backup",
    title: "Ежедневные бэкапы",
    note: "Копия базы каждую ночь, хранится месяц.",
    price: 300,
    recommended: true,
  },
  {
    id: "domain",
    title: "Свой домен",
    note: "Подключение и сертификат без доплаты.",
    price: 150,
  },
  {
    id: "support",
    title: "Поддержка 24/7",
    note: "Ответ в течение часа в любой день.",
    price: 900,
  },
]

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

/**
 * Карточки-чекбоксы с рамкой выбора и итоговой суммой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox010({
  legend = "Дополнения к тарифу",
  addons = DEFAULT_ADDONS,
  defaultValue = ["backup"],
  currency = "₽/мес",
  recommendedLabel = "советуем",
  totalText = "Дополнения: {count}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Checkbox010Props) {
  const [value, setValue] = useState<string[]>(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-checkbox-010-panel": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const total = addons
    .filter((addon) => value.includes(addon.id))
    .reduce((sum, addon) => sum + addon.price, 0)

  const toggle = (id: string) => {
    const next = value.includes(id)
      ? value.filter((item) => item !== id)
      : [...value, id]

    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-checkbox-010" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="checkbox"
        data-vibeui-block="checkbox-010"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        {addons.map((addon) => (
          <label data-part="card" key={addon.id}>
            <input
              type="checkbox"
              checked={value.includes(addon.id)}
              onChange={() => toggle(addon.id)}
            />
            <span data-part="head">
              <span data-part="tick" aria-hidden="true" />
              {addon.title}
              {addon.recommended ? (
                <span data-part="flag">{recommendedLabel}</span>
              ) : null}
            </span>
            <span data-part="price">
              {addon.price} {currency}
            </span>
            <span data-part="note">{addon.note}</span>
          </label>
        ))}
        <p data-part="total" role="status">
          <span>{totalText.replace("{count}", String(value.length))}</span>
          <span data-part="sum">
            {total} {currency}
          </span>
        </p>
      </fieldset>
    </>
  )
}
