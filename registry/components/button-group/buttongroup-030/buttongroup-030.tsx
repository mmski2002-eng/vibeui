import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup030Step = {
  label: string
  href: string
  points: string
}

export type Buttongroup030Props = Omit<ComponentProps<"nav">, "children"> & {
  steps?: Buttongroup030Step[]
  current?: string
  label?: string
  /** Пусто — заливки нет, сцепка ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: шаг графика живёт в адресе страницы, поэтому группа
// собрана из ссылок, а не из кнопок. Это меняет всё поведение: работает
// средняя кнопка мыши, «открыть в новой вкладке» и кнопка «назад», а
// состояние переживает перезагрузку. Текущий шаг помечен aria-current="page"
// — им же выбирается стиль, так что подсветка не может разойтись с тем,
// что объявлено вслух. Текущая ссылка остаётся ссылкой, а не превращается
// в span: иначе фокус на ней теряется при возврате из истории.
const STYLES = `
:where([data-vibeui-block="buttongroup-030"]){
--vibeui-buttongroup-030-surface:transparent;
--vibeui-buttongroup-030-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-030-muted:color-mix(in oklab,var(--vibeui-buttongroup-030-fg) 68%,transparent);
--vibeui-buttongroup-030-border:light-dark(oklch(0.89 0 265),oklch(0.39 0 265));
--vibeui-buttongroup-030-hover:light-dark(oklch(0.97 0 265),oklch(0.33 0 265));
--vibeui-buttongroup-030-on:light-dark(oklch(0.24 0 265),oklch(0.92 0 265));
--vibeui-buttongroup-030-on-fg:light-dark(oklch(0.99 0 265),oklch(0.2 0 265));
--vibeui-buttongroup-030-accent:light-dark(oklch(0.55 0.15 200),oklch(0.78 0.12 200));
--vibeui-buttongroup-030-radius:0.625rem;
--vibeui-buttongroup-030-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-030"]{color-scheme:dark}
[data-vibeui-block="buttongroup-030"]{
box-sizing:border-box;display:inline-block;
font-family:var(--vibeui-buttongroup-030-font);
}
[data-vibeui-block="buttongroup-030"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-030"] ul{
display:flex;isolation:isolate;margin:0;padding:0;list-style:none;
border:1px solid var(--vibeui-buttongroup-030-border);
border-radius:var(--vibeui-buttongroup-030-radius);
background:var(--vibeui-buttongroup-030-surface);
overflow:hidden;
}
[data-vibeui-block="buttongroup-030"] li + li{
border-inline-start:1px solid var(--vibeui-buttongroup-030-border);
}
[data-vibeui-block="buttongroup-030"] a{
position:relative;z-index:0;
display:flex;flex-direction:column;align-items:center;gap:0.125rem;
min-width:4.25rem;padding:0.4375rem 0.75rem;
color:var(--vibeui-buttongroup-030-muted);text-decoration:none;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-030"] [data-part="name"]{
font-size:0.8125rem;font-weight:650;line-height:1.1;
}
[data-vibeui-block="buttongroup-030"] [data-part="points"]{
font-size:0.625rem;font-weight:600;line-height:1.1;opacity:.75;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="buttongroup-030"] a:hover{
background:var(--vibeui-buttongroup-030-hover);color:var(--vibeui-buttongroup-030-fg);
}
/* Стиль выбирается тем же атрибутом, что объявляет состояние. */
[data-vibeui-block="buttongroup-030"] a[aria-current="page"]{
z-index:1;
background:var(--vibeui-buttongroup-030-on);
color:var(--vibeui-buttongroup-030-on-fg);
}
[data-vibeui-block="buttongroup-030"] a:focus-visible{
z-index:2;outline:2px solid var(--vibeui-buttongroup-030-accent);outline-offset:-2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-030"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Buttongroup030Step[] = [
  { label: "День", href: "?step=day", points: "24 точки" },
  { label: "Неделя", href: "?step=week", points: "7 точек" },
  { label: "Месяц", href: "?step=month", points: "30 точек" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая заливка досталась бы тексту
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
 * Шаг графика ссылками: состояние живёт в адресе и переживает перезагрузку.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup030({
  steps = DEFAULT_STEPS,
  current = "Неделя",
  label = "Шаг графика",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup030Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-030-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-030-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-030" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-030"
        className={className}
        style={palette}
        aria-label={label}
      >
        <ul>
          {steps.map((step) => (
            <li key={step.label}>
              <a
                href={step.href}
                aria-current={step.label === current ? "page" : undefined}
              >
                <span data-part="name">{step.label}</span>
                <span data-part="points">{step.points}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
