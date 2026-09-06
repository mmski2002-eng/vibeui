"use client"

import { useId, useState } from "react"
import type { CSSProperties } from "react"

export type Commerce053Option = {
  value: string
  label: string
  hint: string
  add: number
  days: number
}

export type Commerce053Group = {
  id: string
  legend: string
  options: Commerce053Option[]
}

export type Commerce053Extra = {
  id: string
  label: string
  hint: string
  add: number
  days: number
}

export type Commerce053Props = {
  title?: string
  lead?: string
  base?: number
  currency?: string
  groups?: Commerce053Group[]
  extras?: Commerce053Extra[]
  summaryTitle?: string
  totalLabel?: string
  leadLabel?: string
  codeLabel?: string
  extrasLegend?: string
  baseLabel?: string
  includedLabel?: string
  /** Срок изготовления: {days} подставляется числом. */
  daysTemplate?: string
  cta?: string
  note?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: конфигуратор товара, где каждая опция сразу называет свою цену
// и свой срок. Итог и срок изготовления считаются из выбора, а не хранятся
// отдельным числом: иначе после первой правки они расходятся. Код конфигурации
// собирается из значений опций — по нему заказ ищут в производстве.
const STYLES = `
:where([data-vibeui-block="commerce-053"]){
--vibeui-commerce-053-bg:transparent;
--vibeui-commerce-053-fg:light-dark(oklch(0.21 0.014 90),oklch(0.94 0.006 90));
--vibeui-commerce-053-muted:light-dark(oklch(0.53 0.016 90),oklch(0.73 0.013 90));
--vibeui-commerce-053-border:light-dark(oklch(0.9 0.01 90),oklch(0.38 0.012 90));
--vibeui-commerce-053-soft:light-dark(oklch(0.975 0.008 90),oklch(0.27 0.01 90));
--vibeui-commerce-053-chip:light-dark(oklch(1 0 0),oklch(0.22 0.008 90));
--vibeui-commerce-053-accent:light-dark(oklch(0.55 0.11 39.8),oklch(0.76 0.13 39.8));
--vibeui-commerce-053-onaccent:oklch(0.15 0.02 39.8);
--vibeui-commerce-053-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-053"]{color-scheme:dark}
[data-vibeui-block="commerce-053"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-053-bg);
color:var(--vibeui-commerce-053-fg);font-family:var(--vibeui-commerce-053-sans);
}
[data-vibeui-block="commerce-053"] *{box-sizing:border-box}
[data-vibeui-block="commerce-053"] [data-part="shell"]{max-width:64rem;margin:0 auto;padding:1.25rem 1rem 2rem;display:grid;gap:1.25rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-053"] h2{margin:0 0 0.375rem;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-053"] [data-part="lead"]{margin:0 0 1.125rem;max-width:52ch;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-053-muted)}
[data-vibeui-block="commerce-053"] fieldset{border:0;margin:0 0 1.125rem;padding:0;min-inline-size:0}
[data-vibeui-block="commerce-053"] legend{
padding:0;margin:0 0 0.5rem;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-commerce-053-muted);
}
[data-vibeui-block="commerce-053"] [data-part="options"]{display:grid;gap:0.5rem;grid-template-columns:1fr;clear:both}
[data-vibeui-block="commerce-053"] [data-part="option"]{position:relative;display:block}
[data-vibeui-block="commerce-053"] [data-part="option"] input{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
[data-vibeui-block="commerce-053"] [data-part="face"]{
display:flex;gap:0.75rem;align-items:flex-start;cursor:pointer;
border:1px solid var(--vibeui-commerce-053-border);border-radius:0.875rem;padding:0.6875rem 0.875rem;
transition:border-color .14s ease,background-color .14s ease;
}
[data-vibeui-block="commerce-053"] [data-part="option"] input:checked+[data-part="face"]{
border-color:var(--vibeui-commerce-053-accent);background:var(--vibeui-commerce-053-soft);
box-shadow:inset 0 0 0 1px var(--vibeui-commerce-053-accent);
}
[data-vibeui-block="commerce-053"] [data-part="option"] input:focus-visible+[data-part="face"]{outline:2px solid var(--vibeui-commerce-053-accent);outline-offset:2px}
[data-vibeui-block="commerce-053"] [data-part="texts"]{flex:1;min-width:0}
[data-vibeui-block="commerce-053"] [data-part="olabel"]{display:block;font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-053"] [data-part="ohint"]{display:block;margin-top:0.125rem;font-size:0.75rem;line-height:1.45;color:var(--vibeui-commerce-053-muted)}
[data-vibeui-block="commerce-053"] [data-part="oadd"]{flex:none;font-size:0.8125rem;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="commerce-053"] [data-part="panel"]{
border:1px solid var(--vibeui-commerce-053-border);border-radius:1rem;padding:1rem 1.125rem;
background:var(--vibeui-commerce-053-soft);align-self:start;
}
[data-vibeui-block="commerce-053"] h3{margin:0 0 0.625rem;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="commerce-053"] dl{margin:0 0 0.75rem;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:0.3125rem 0.75rem;font-size:0.8125rem}
[data-vibeui-block="commerce-053"] [data-part="pair"]{display:contents}
[data-vibeui-block="commerce-053"] dt{color:var(--vibeui-commerce-053-muted);min-width:0}
[data-vibeui-block="commerce-053"] dd{margin:0;text-align:right;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-053"] [data-part="total"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
padding-top:0.75rem;border-top:1px solid var(--vibeui-commerce-053-border);
}
[data-vibeui-block="commerce-053"] [data-part="total"] span:first-child{font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-053"] [data-part="sum"]{font-size:1.5rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-053"] [data-part="meta"]{margin:0.625rem 0 0;font-size:0.8125rem;color:var(--vibeui-commerce-053-muted)}
[data-vibeui-block="commerce-053"] [data-part="code"]{
display:inline-block;margin-top:0.25rem;padding:0.1875rem 0.5rem;border-radius:0.375rem;
background:var(--vibeui-commerce-053-chip);border:1px solid var(--vibeui-commerce-053-border);
font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.75rem;user-select:all;
}
[data-vibeui-block="commerce-053"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;width:100%;height:2.875rem;margin-top:0.875rem;border-radius:0.875rem;
background:var(--vibeui-commerce-053-accent);color:var(--vibeui-commerce-053-onaccent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-053"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-commerce-053-accent);outline-offset:2px}
[data-vibeui-block="commerce-053"] [data-part="note"]{margin:0.75rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-053-muted)}
@container (min-width: 34rem){
[data-vibeui-block="commerce-053"] [data-part="options"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 50rem){
[data-vibeui-block="commerce-053"] [data-part="shell"]{padding:2rem 2rem 3rem;grid-template-columns:minmax(0,1.5fr) 19rem;gap:1.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-053"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Commerce053Group[] = [
  {
    id: "material",
    legend: "Материал столешницы",
    options: [
      {
        value: "oak",
        label: "Дуб",
        hint: "Массив, масло-воск, тон «натуральный»",
        add: 0,
        days: 14,
      },
      {
        value: "ash",
        label: "Ясень",
        hint: "Более светлый рисунок, та же прочность",
        add: 4800,
        days: 14,
      },
      {
        value: "walnut",
        label: "Орех",
        hint: "Тёмный тон, партия ограничена",
        add: 12600,
        days: 21,
      },
    ],
  },
  {
    id: "size",
    legend: "Размер",
    options: [
      {
        value: "140",
        label: "140 × 80 см",
        hint: "Четыре места, помещается в кухню от 9 м²",
        add: 0,
        days: 14,
      },
      {
        value: "180",
        label: "180 × 90 см",
        hint: "Шесть мест, нужен проём от 80 см",
        add: 9400,
        days: 18,
      },
    ],
  },
  {
    id: "legs",
    legend: "Подстолье",
    options: [
      {
        value: "wood",
        label: "Деревянное",
        hint: "Из того же массива, ножки конусом",
        add: 0,
        days: 14,
      },
      {
        value: "steel",
        label: "Стальное",
        hint: "Порошковая окраска, регулируемые опоры",
        add: 6200,
        days: 16,
      },
    ],
  },
]

const DEFAULT_EXTRAS: Commerce053Extra[] = [
  {
    id: "engrave",
    label: "Гравировка на торце",
    hint: "До 24 символов, шрифт мастерской",
    add: 1900,
    days: 3,
  },
  {
    id: "assembly",
    label: "Сборка у вас дома",
    hint: "Мастер приезжает в день доставки",
    add: 3500,
    days: 0,
  },
]

function money(value: number, currency: string) {
  return `${value.toLocaleString("ru-RU")} ${currency}`
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

/**
 * Конфигуратор товара: цена и срок изготовления считаются из выбранных
 * опций, а не хранятся отдельно. Один файл, ноль зависимостей.
 */
export function Commerce053({
  title = "Стол «Отмель» под заказ",
  lead = "Соберите стол под свою кухню: у каждой опции написано, сколько она добавляет к цене и к сроку изготовления.",
  base = 42000,
  currency = "₽",
  groups = DEFAULT_GROUPS,
  extras = DEFAULT_EXTRAS,
  summaryTitle = "Ваша конфигурация",
  totalLabel = "Итого",
  leadLabel = "Срок изготовления",
  codeLabel = "Код конфигурации",
  extrasLegend = "Дополнительно",
  baseLabel = "Базовая цена",
  includedLabel = "включено",
  daysTemplate = "{days} рабочих дней",
  cta = "Заказать сборку",
  note = "Код конфигурации сохраните: по нему мастерская восстановит заказ, даже если корзина потеряется.",
  accent,
  background = "",
  className,
  style,
}: Commerce053Props) {
  // Радиогруппа изолируется по экземпляру: имя фиксировано на id набора,
  // и два блока на одной странице делили бы выбор без useId().
  const uid = useId()
  const [picked, setPicked] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      groups.map((group) => [group.id, group.options[0]?.value ?? ""]),
    ),
  )
  const [addons, setAddons] = useState<string[]>([])

  const chosen = groups.map((group) => ({
    group,
    option:
      group.options.find((option) => option.value === picked[group.id]) ??
      group.options[0],
  }))
  const chosenExtras = extras.filter((extra) => addons.includes(extra.id))

  const total =
    base +
    chosen.reduce((sum, entry) => sum + (entry.option?.add ?? 0), 0) +
    chosenExtras.reduce((sum, extra) => sum + extra.add, 0)

  const days = Math.max(
    ...chosen.map((entry) => entry.option?.days ?? 0),
    ...chosenExtras.map((extra) => extra.days),
    0,
  )

  const code = [
    ...chosen.map((entry) => entry.option?.value ?? ""),
    ...chosenExtras.map((extra) => extra.id.slice(0, 3)),
  ]
    .join("-")
    .toUpperCase()

  const palette = {
    ...(accent ? { "--vibeui-commerce-053-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-053-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-053" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-053"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <h2>{title}</h2>
            <p data-part="lead">{lead}</p>

            {groups.map((group) => (
              <fieldset key={group.id}>
                <legend>{group.legend}</legend>
                <div data-part="options">
                  {group.options.map((option) => (
                    <label
                      key={option.value}
                      data-part="option"
                      htmlFor={`${uid}-${group.id}-${option.value}`}
                    >
                      <input
                        type="radio"
                        id={`${uid}-${group.id}-${option.value}`}
                        name={`${uid}-${group.id}`}
                        value={option.value}
                        checked={picked[group.id] === option.value}
                        onChange={() =>
                          setPicked((state) => ({
                            ...state,
                            [group.id]: option.value,
                          }))
                        }
                      />
                      <span data-part="face">
                        <span data-part="texts">
                          <span data-part="olabel">{option.label}</span>
                          <span data-part="ohint">{option.hint}</span>
                        </span>
                        <span data-part="oadd">
                          {option.add === 0
                            ? includedLabel
                            : `+ ${money(option.add, currency)}`}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            <fieldset>
              <legend>{extrasLegend}</legend>
              <div data-part="options">
                {extras.map((extra) => (
                  <label
                    key={extra.id}
                    data-part="option"
                    htmlFor={`commerce-053-extra-${extra.id}`}
                  >
                    <input
                      type="checkbox"
                      id={`commerce-053-extra-${extra.id}`}
                      checked={addons.includes(extra.id)}
                      onChange={() =>
                        setAddons((state) =>
                          state.includes(extra.id)
                            ? state.filter((id) => id !== extra.id)
                            : [...state, extra.id],
                        )
                      }
                    />
                    <span data-part="face">
                      <span data-part="texts">
                        <span data-part="olabel">{extra.label}</span>
                        <span data-part="ohint">{extra.hint}</span>
                      </span>
                      <span data-part="oadd">
                        + {money(extra.add, currency)}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <aside data-part="panel" aria-live="polite">
            <h3>{summaryTitle}</h3>
            <dl>
              <dt>{baseLabel}</dt>
              <dd>{money(base, currency)}</dd>
              {chosen.map((entry) => (
                <div key={entry.group.id} data-part="pair">
                  <dt>{entry.group.legend}</dt>
                  <dd>{entry.option?.label}</dd>
                </div>
              ))}
              {chosenExtras.map((extra) => (
                <div key={extra.id} data-part="pair">
                  <dt>{extra.label}</dt>
                  <dd>+ {money(extra.add, currency)}</dd>
                </div>
              ))}
            </dl>
            <p data-part="total">
              <span>{totalLabel}</span>
              <span data-part="sum">{money(total, currency)}</span>
            </p>
            <p data-part="meta">
              {leadLabel}: {daysTemplate.replace("{days}", String(days))}
            </p>
            <p data-part="meta">
              {codeLabel}
              <br />
              <span data-part="code">{code}</span>
            </p>
            <button type="button" data-part="go">
              {cta}
            </button>
            <p data-part="note">{note}</p>
          </aside>
        </div>
      </section>
    </>
  )
}
