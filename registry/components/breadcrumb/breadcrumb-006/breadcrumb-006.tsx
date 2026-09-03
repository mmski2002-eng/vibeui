import type { ComponentProps, CSSProperties } from "react"

export type Breadcrumb006Item = {
  label: string
  href?: string
}

export type Breadcrumb006Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  items?: Breadcrumb006Item[]
  title?: string
  meta?: string
  /** Подпись навигации: компонент несёт русскую, проект подставляет свою. */
  navLabel?: string
  /** Пусто — подложки нет, шапка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: шапка страницы, где путь и заголовок — одно целое.
// Название текущего уровня не дублируется в крошках: строка пути ведёт до
// родителя, а «где я» отвечает сам заголовок. Дублирование заставляет
// читать одно и то же дважды и съедает высоту первого экрана.
//
// Тема берётся из color-scheme окружения через light-dark(): шапка темнеет
// вместе со страницей и не выкладывает под себя плашку.
const STYLES = `
:where([data-vibeui-block="breadcrumb-006"]){
--vibeui-breadcrumb-006-fg:light-dark(oklch(0.22 0.016 265),oklch(0.95 0.008 265));
--vibeui-breadcrumb-006-muted:color-mix(in oklab,var(--vibeui-breadcrumb-006-fg) 68%,transparent);
--vibeui-breadcrumb-006-sep:light-dark(oklch(0.78 0.01 265),oklch(0.5 0.012 265));
--vibeui-breadcrumb-006-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-breadcrumb-006-bg:transparent;
--vibeui-breadcrumb-006-pad:0;
--vibeui-breadcrumb-006-radius:0;
--vibeui-breadcrumb-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="breadcrumb-006"]{color-scheme:dark}
[data-vibeui-block="breadcrumb-006"]{
box-sizing:border-box;padding:var(--vibeui-breadcrumb-006-pad);
background:var(--vibeui-breadcrumb-006-bg);
border-radius:var(--vibeui-breadcrumb-006-radius);
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:32rem;
font-family:var(--vibeui-breadcrumb-006-font);color:var(--vibeui-breadcrumb-006-fg);
}
[data-vibeui-block="breadcrumb-006"] ol{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
margin:0;padding:0;list-style:none;
font-size:0.75rem;line-height:1.3;color:var(--vibeui-breadcrumb-006-muted);
}
[data-vibeui-block="breadcrumb-006"] li{display:inline-flex;align-items:center;gap:0.375rem}
[data-vibeui-block="breadcrumb-006"] li + li::before{content:"/";color:var(--vibeui-breadcrumb-006-sep)}
[data-vibeui-block="breadcrumb-006"] a{color:inherit;text-decoration:none;border-radius:0.25rem}
[data-vibeui-block="breadcrumb-006"] a:hover{color:var(--vibeui-breadcrumb-006-fg);text-decoration:underline;text-underline-offset:3px}
[data-vibeui-block="breadcrumb-006"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-006-accent);outline-offset:2px}
/* Заголовок отвечает «где я»: в крошках текущий уровень не повторяется. */
[data-vibeui-block="breadcrumb-006"] h1{
margin:0;font-size:clamp(1.25rem,2.5vw,1.75rem);line-height:1.15;
letter-spacing:-0.02em;font-weight:680;
}
[data-vibeui-block="breadcrumb-006"] [data-part="meta"]{
font-size:0.8125rem;line-height:1.4;color:var(--vibeui-breadcrumb-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Breadcrumb006Item[] = [
  { label: "Главная", href: "#" },
  { label: "Проекты", href: "#" },
  { label: "VibeUI", href: "#" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Шапка страницы: путь до родителя и заголовок вместо последней крошки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb006({
  items = DEFAULT_ITEMS,
  title = "Хлебные крошки",
  meta = "12 компонентов · обновлено сегодня",
  navLabel = "Хлебные крошки",
  background = "",
  accent,
  className,
  style,
  ...props
}: Breadcrumb006Props) {
  const palette = {
    ...(accent ? { "--vibeui-breadcrumb-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-breadcrumb-006-bg": background,
          "--vibeui-breadcrumb-006-pad": "0.75rem 1rem",
          "--vibeui-breadcrumb-006-radius": "0.75rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="breadcrumb"
        data-vibeui-block="breadcrumb-006"
        className={className}
        style={palette}
      >
        <nav aria-label={navLabel}>
          <ol>
            {items.map((item) => (
              <li key={item.label}>
                <a href={item.href ?? "#"}>{item.label}</a>
              </li>
            ))}
          </ol>
        </nav>
        <h1>{title}</h1>
        {meta ? <p data-part="meta">{meta}</p> : null}
      </div>
    </>
  )
}
