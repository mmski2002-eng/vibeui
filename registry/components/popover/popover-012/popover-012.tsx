"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Popover012Option = {
  value: string
  label: string
  count?: number
}

export type Popover012Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  label?: string
  title?: string
  options?: Popover012Option[]
  /** Что отмечено при первом показе. */
  defaultValue?: string[]
  applyLabel?: string
  resetLabel?: string
  /** Подпись счётчика на кнопке. {count} — сколько отмечено. */
  badgeTemplate?: string
  /** Показать панель раскрытой и в потоке: витрине и документации нужна открытая. */
  defaultOpen?: boolean
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: фильтр списка, который не уводит со страницы. Панель
// открывается у самой кнопки, поэтому список за ней виден и сравнивать «до и
// после» можно не вспоминая, что было. Отмеченное считается на самой кнопке:
// закрытая панель иначе не говорит, что фильтр вообще включён, и человек
// удивляется короткому списку. Сброс стоит рядом с применением и отключён,
// пока сбрасывать нечего, — так кнопка не обещает того, чего не сделает.
const STYLES = `
:where([data-vibeui-block="popover-012"]){
--vibeui-popover-012-surface:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-popover-012-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-popover-012-muted:color-mix(in oklab,var(--vibeui-popover-012-fg) 64%,transparent);
--vibeui-popover-012-border:light-dark(oklch(0.89 0 265),oklch(0.36 0 265));
--vibeui-popover-012-hover:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 7%));
--vibeui-popover-012-accent:light-dark(oklch(0.275 0 0),oklch(0.91 0 0));
--vibeui-popover-012-on-accent:oklch(from var(--vibeui-popover-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-popover-012-shadow:light-dark(oklch(0.2 0 265 / 24%),oklch(0 0 0 / 60%));
--vibeui-popover-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
anchor-name:--vibeui-popover-012-anchor;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="popover-012"]{color-scheme:dark}
[data-vibeui-block="popover-012"]{
display:inline-block;font-family:var(--vibeui-popover-012-font);color:var(--vibeui-popover-012-fg);
}
[data-vibeui-block="popover-012"] *{box-sizing:border-box}
[data-vibeui-block="popover-012"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
min-height:2.25rem;padding:0.375rem 0.75rem;
border:1px solid var(--vibeui-popover-012-border);border-radius:0.625rem;
background:var(--vibeui-popover-012-surface);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="popover-012"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-popover-012-accent);outline-offset:2px}
/* Счётчик на самой кнопке: закрытая панель иначе не говорит, что фильтр
   включён, и короткий список выглядит поломкой. */
[data-vibeui-block="popover-012"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.125rem;height:1.125rem;padding:0 0.3125rem;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-popover-012-fg) 12%,transparent);color:var(--vibeui-popover-012-fg);
font-size:0.6875rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="popover-012"] [popover]{
position:fixed;margin:0;padding:0.625rem;
width:16rem;max-width:calc(100vw - 1.5rem);
border:1px solid var(--vibeui-popover-012-border);border-radius:0.75rem;
background:var(--vibeui-popover-012-surface);color:var(--vibeui-popover-012-fg);
box-shadow:0 18px 44px -26px var(--vibeui-popover-012-shadow);
position-anchor:--vibeui-popover-012-anchor;inset:auto;
top:anchor(bottom);left:anchor(left);margin-top:0.5rem;
}
@supports not (anchor-name: --a){
[data-vibeui-block="popover-012"] [popover]{position:fixed;inset:0;margin:auto}
}
[data-vibeui-block="popover-012"] [data-part="title"]{
margin:0 0 0.375rem;padding:0 0.25rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-popover-012-muted);
}
[data-vibeui-block="popover-012"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.0625rem;
max-height:11rem;overflow-y:auto;margin:0 0 0.5rem;padding:0;list-style:none;
scrollbar-width:thin;scrollbar-color:var(--vibeui-popover-012-border) transparent;
}
[data-vibeui-block="popover-012"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;cursor:pointer;
padding:0.375rem 0.4375rem;border-radius:0.5rem;font-size:0.875rem;
}
[data-vibeui-block="popover-012"] [data-part="option"]:hover{background:var(--vibeui-popover-012-hover)}
[data-vibeui-block="popover-012"] [data-part="option"]:has(input:focus-visible){outline:2px solid var(--vibeui-popover-012-accent);outline-offset:1px}
[data-vibeui-block="popover-012"] [data-part="option"] input{
width:0.9375rem;height:0.9375rem;margin:0;flex:none;accent-color:var(--vibeui-popover-012-accent);
}
[data-vibeui-block="popover-012"] [data-part="name"]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="popover-012"] [data-part="count"]{
flex:none;font-size:0.75rem;color:var(--vibeui-popover-012-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="popover-012"] [data-part="foot"]{display:flex;gap:0.375rem}
[data-vibeui-block="popover-012"] [data-part="apply"],
[data-vibeui-block="popover-012"] [data-part="reset"]{
appearance:none;cursor:pointer;flex:1;
display:inline-flex;align-items:center;justify-content:center;
min-height:2rem;padding:0.25rem 0.625rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="popover-012"] [data-part="apply"]{
border:1px solid transparent;
background:var(--vibeui-popover-012-accent);color:oklch(from var(--vibeui-popover-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="popover-012"] [data-part="reset"]{
border:1px solid var(--vibeui-popover-012-border);background:transparent;color:inherit;
}
[data-vibeui-block="popover-012"] [data-part="reset"]:disabled{opacity:.5;cursor:default}
[data-vibeui-block="popover-012"] [data-part="apply"]:focus-visible,
[data-vibeui-block="popover-012"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-popover-012-accent);outline-offset:2px}
/* Раскрытая панель на месте: атрибут popover прячет её правилом браузера,
   а это правило той же специфичности его переопределяет и возвращает панель
   в поток. Так её показывают на витрине и в документации, без верхнего слоя.
   Только пока popover закрыт: у открытого положение задаёт верхний слой,
   и static отправил бы панель в левый верхний угол экрана. */
[data-vibeui-block="popover-012"][data-open] [popover]:not(:popover-open){
display:block;position:static;inset:auto;margin:0.5rem 0 0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="popover-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Popover012Option[] = [
  { value: "open", label: "Открытые", count: 42 },
  { value: "mine", label: "На мне", count: 12 },
  { value: "review", label: "На проверке", count: 7 },
  { value: "late", label: "Просроченные", count: 3 },
  { value: "done", label: "Закрытые", count: 128 },
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
 * Фильтр списка во всплывающей панели: счётчик на кнопке, сброс рядом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Popover012({
  label = "Фильтр",
  title = "Показывать задачи",
  options = DEFAULT_OPTIONS,
  defaultValue = ["open", "mine"],
  applyLabel = "Применить",
  resetLabel = "Сбросить",
  badgeTemplate = "{count}",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Popover012Props) {
  const id = useId().replace(/:/g, "")
  const [chosen, setChosen] = useState<string[]>(defaultValue)

  const toggle = (value: string) =>
    setChosen((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    )

  const palette = {
    ...(accent ? { "--vibeui-popover-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-popover-012-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-popover-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="popover"
        data-vibeui-block="popover-012"
        data-open={defaultOpen || undefined}
        className={className}
        style={palette}
      >
        <button type="button" data-part="trigger" popoverTarget={`${id}-panel`}>
          {label}
          {chosen.length > 0 ? (
            <span data-part="badge">
              {badgeTemplate.replace("{count}", String(chosen.length))}
            </span>
          ) : null}
        </button>

        <div id={`${id}-panel`} popover="auto" aria-label={title}>
          <p data-part="title">{title}</p>

          <ul data-part="list">
            {options.map((option) => (
              <li key={option.value}>
                <label data-part="option">
                  <input
                    type="checkbox"
                    checked={chosen.includes(option.value)}
                    onChange={() => toggle(option.value)}
                  />
                  <span data-part="name">{option.label}</span>
                  {option.count !== undefined ? (
                    <span data-part="count">{option.count}</span>
                  ) : null}
                </label>
              </li>
            ))}
          </ul>

          <div data-part="foot">
            {/* Сброс отключён, пока сбрасывать нечего: кнопка не должна
                обещать того, чего не сделает. */}
            <button
              type="button"
              data-part="reset"
              disabled={chosen.length === 0}
              onClick={() => setChosen([])}
            >
              {resetLabel}
            </button>
            <button
              type="button"
              data-part="apply"
              popoverTarget={`${id}-panel`}
              popoverTargetAction="hide"
            >
              {applyLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
