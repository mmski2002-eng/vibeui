import type { ComponentProps, CSSProperties } from "react"

export type Card003Props = Omit<
  ComponentProps<"article">,
  "children" | "title"
> & {
  name?: string
  role?: string
  about?: string
  stats?: { label: string; value: string }[]
  actionLabel?: string
  secondaryLabel?: string
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: карточка человека для команды и списка контактов. Цифры
// стоят в ряд под именем, потому что их сравнивают между карточками; текст
// «о себе» обрезан двумя строками — иначе карточки в сетке разной высоты и
// ряд рассыпается.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте рамка светлее подложки, а не темнее.
const STYLES = `
:where([data-vibeui-block="card-003"]){
--vibeui-card-003-bg:transparent;
--vibeui-card-003-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-card-003-muted:color-mix(in oklab,var(--vibeui-card-003-fg) 68%,transparent);
--vibeui-card-003-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-card-003-hue:250;
--vibeui-card-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-card-003-on-accent:light-dark(oklch(0.99 0 265),oklch(0.18 0 265));
--vibeui-card-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-003"]{color-scheme:dark}
[data-vibeui-block="card-003"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:17rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-card-003-bg);
border:1px solid var(--vibeui-card-003-border);border-radius:0.875rem;
color:var(--vibeui-card-003-fg);font-family:var(--vibeui-card-003-font);
}
[data-vibeui-block="card-003"] [data-part="head"]{display:flex;align-items:center;gap:0.625rem}
[data-vibeui-block="card-003"] [data-part="avatar"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:2.75rem;height:2.75rem;border-radius:9999px;
background:light-dark(oklch(0.92 0.05 var(--vibeui-card-003-hue)),oklch(0.33 0.07 var(--vibeui-card-003-hue)));
color:light-dark(oklch(0.38 0.09 var(--vibeui-card-003-hue)),oklch(0.92 0.05 var(--vibeui-card-003-hue)));
font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="card-003"] [data-part="name"]{margin:0;font-size:0.9375rem;font-weight:650;line-height:1.25}
[data-vibeui-block="card-003"] [data-part="role"]{font-size:0.8125rem;color:var(--vibeui-card-003-muted)}
/* Две строки и многоточие: карточки в сетке обязаны быть одной высоты. */
[data-vibeui-block="card-003"] [data-part="about"]{
margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-card-003-muted);
display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
}
[data-vibeui-block="card-003"] [data-part="stats"]{
display:flex;gap:0.75rem;padding:0.5rem 0;
border-top:1px solid var(--vibeui-card-003-border);
border-bottom:1px solid var(--vibeui-card-003-border);
}
[data-vibeui-block="card-003"] [data-part="stat"]{display:flex;flex-direction:column;gap:0.0625rem}
[data-vibeui-block="card-003"] [data-part="stat-value"]{font-size:0.9375rem;font-weight:680;font-variant-numeric:tabular-nums;line-height:1.1}
[data-vibeui-block="card-003"] [data-part="stat-label"]{font-size:0.6875rem;color:var(--vibeui-card-003-muted)}
[data-vibeui-block="card-003"] [data-part="actions"]{display:flex;gap:0.375rem}
[data-vibeui-block="card-003"] button{
appearance:none;cursor:pointer;flex:1;
height:2.125rem;padding:0 0.75rem;
border:1px solid var(--vibeui-card-003-border);border-radius:0.5rem;
background:transparent;color:inherit;font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="card-003"] button[data-primary="true"]{
border-color:transparent;background:var(--vibeui-card-003-accent);color:var(--vibeui-card-003-on-accent);
}
[data-vibeui-block="card-003"] button:focus-visible{outline:2px solid var(--vibeui-card-003-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-003"] *{animation:none!important;transition:none!important}}
`

function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

const DEFAULT_STATS = [
  { label: "Проектов", value: "14" },
  { label: "В команде", value: "3 года" },
  { label: "Отклик", value: "2 ч" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Карточка человека: аватар, роль, цифры в ряд и два действия.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card003({
  name = "Мария Гурова",
  role = "Продуктовый дизайнер",
  about = "Веду каталог и дизайн-систему, собираю интерфейсы, которые не приходится объяснять словами.",
  stats = DEFAULT_STATS,
  actionLabel = "Написать",
  secondaryLabel = "Профиль",
  background = "",
  accent,
  className,
  style,
  ...props
}: Card003Props) {
  const palette = {
    "--vibeui-card-003-hue": hue(name),
    ...(accent ? { "--vibeui-card-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-card-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-003" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-003"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span data-part="avatar" aria-hidden="true">
            {initials(name)}
          </span>
          <span>
            <h3 data-part="name">{name}</h3>
            <span data-part="role">{role}</span>
          </span>
        </div>
        {about ? <p data-part="about">{about}</p> : null}
        {stats.length ? (
          <div data-part="stats">
            {stats.map((stat) => (
              <span key={stat.label} data-part="stat">
                <span data-part="stat-value">{stat.value}</span>
                <span data-part="stat-label">{stat.label}</span>
              </span>
            ))}
          </div>
        ) : null}
        <div data-part="actions">
          <button type="button" data-primary="true">
            {actionLabel}
          </button>
          <button type="button">{secondaryLabel}</button>
        </div>
      </article>
    </>
  )
}
