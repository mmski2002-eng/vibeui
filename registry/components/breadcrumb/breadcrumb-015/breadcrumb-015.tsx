import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Breadcrumb015Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  trail?: string[]
  currentLabel?: string
  loading?: boolean
  placeholderWidth?: number
  loadingText?: string
  accent?: string
}

// Идея компонента: путь известен из маршрута сразу, а имя последнего
// сегмента приходит из запроса. Вместо пустоты или прыжка вёрстки на
// последнем месте стоит полоса-скелетон заранее заданной ширины: строка
// крошек не меняет высоту и не смещает соседние блоки, когда имя приедет.
// Состояние объявлено через aria-busy и живую область, а не одним цветом.
const STYLES = `
:where([data-vibeui-block="breadcrumb-015"]){
--vibeui-breadcrumb-015-surface:oklch(1 0 0);
--vibeui-breadcrumb-015-surface-border:oklch(0.91 0.006 265);
--vibeui-breadcrumb-015-fg:oklch(0.26 0.016 265);
--vibeui-breadcrumb-015-muted:oklch(0.56 0.014 265);
--vibeui-breadcrumb-015-faint:oklch(0.78 0.01 265);
--vibeui-breadcrumb-015-bone:oklch(0.93 0.005 265);
--vibeui-breadcrumb-015-sheen:oklch(0.975 0.003 265);
--vibeui-breadcrumb-015-accent:oklch(0.55 0.17 265);
--vibeui-breadcrumb-015-width:10ch;
--vibeui-breadcrumb-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная светлая подложка: крошки — это тёмный текст, и на тёмной
   карточке каталога он обязан читаться без правки темы проекта. */
[data-vibeui-block="breadcrumb-015"]{
box-sizing:border-box;width:100%;max-width:34rem;
padding:0.5rem 0.75rem;
background:var(--vibeui-breadcrumb-015-surface);
border:1px solid var(--vibeui-breadcrumb-015-surface-border);border-radius:0.625rem;
font-family:var(--vibeui-breadcrumb-015-font);font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-breadcrumb-015-muted);
}
[data-vibeui-block="breadcrumb-015"] ol{
display:flex;flex-wrap:wrap;align-items:center;gap:0.4375rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="breadcrumb-015"] li{position:relative;display:inline-flex;align-items:center;gap:0.4375rem}
[data-vibeui-block="breadcrumb-015"] li + li::before{content:"/";color:var(--vibeui-breadcrumb-015-faint)}
[data-vibeui-block="breadcrumb-015"] a{color:inherit;text-decoration:none;border-radius:0.25rem}
[data-vibeui-block="breadcrumb-015"] a:hover{color:var(--vibeui-breadcrumb-015-fg);text-decoration:underline;text-underline-offset:3px}
[data-vibeui-block="breadcrumb-015"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-015-accent);outline-offset:2px}
[data-vibeui-block="breadcrumb-015"] [data-part="current"]{color:var(--vibeui-breadcrumb-015-fg);font-weight:600}
/* Место под имя занято заранее: ширина полосы задана в ch, поэтому она
   не зависит от размера шрифта родителя и строка не прыгает при загрузке. */
[data-vibeui-block="breadcrumb-015"] [data-part="skeleton"]{
display:inline-block;vertical-align:middle;
width:var(--vibeui-breadcrumb-015-width);height:0.75rem;border-radius:0.25rem;
background-color:var(--vibeui-breadcrumb-015-bone);
background-image:linear-gradient(
90deg,
var(--vibeui-breadcrumb-015-bone) 0%,
var(--vibeui-breadcrumb-015-sheen) 50%,
var(--vibeui-breadcrumb-015-bone) 100%);
background-size:220% 100%;background-repeat:no-repeat;
animation:vibeui-breadcrumb-015-sweep 1.4s linear infinite;
}
/* Пульсирующая точка перед полосой: без анимации состояние ещё читается
   формой, а вместе с ней — сразу видно, что ждём ответа. */
[data-vibeui-block="breadcrumb-015"] [data-part="dot"]{
width:0.375rem;height:0.375rem;border-radius:50%;
background:var(--vibeui-breadcrumb-015-accent);
animation:vibeui-breadcrumb-015-pulse 1.4s ease-in-out infinite;
}
[data-vibeui-block="breadcrumb-015"] [data-part="status"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
@keyframes vibeui-breadcrumb-015-sweep{
from{background-position:160% 0}
to{background-position:-60% 0}
}
@keyframes vibeui-breadcrumb-015-pulse{
0%,100%{opacity:.35;transform:scale(.85)}
50%{opacity:1;transform:scale(1)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TRAIL = ["Каталог", "Поставщики", "Партии"]

/**
 * Путь известен сразу, имя последнего сегмента подгружается: место
 * под него занимает скелетон. Один файл, ноль зависимостей, своя палитра.
 */
export function Breadcrumb015({
  trail = DEFAULT_TRAIL,
  currentLabel = "Партия A-1180",
  loading = true,
  placeholderWidth = 10,
  loadingText = "Загружаем название",
  accent,
  className,
  style,
  ...props
}: Breadcrumb015Props) {
  const palette = {
    "--vibeui-breadcrumb-015-width": `${placeholderWidth}ch`,
    ...(accent ? { "--vibeui-breadcrumb-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-015" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="breadcrumb-015"
        aria-label="Хлебные крошки"
        className={className}
        style={palette}
      >
        <ol>
          {trail.map((label) => (
            <li key={label}>
              <a href="#">{label}</a>
            </li>
          ))}
          <li aria-busy={loading || undefined}>
            {loading ? (
              <>
                <span data-part="dot" aria-hidden="true" />
                <span data-part="skeleton" aria-hidden="true" />
              </>
            ) : (
              <span data-part="current" aria-current="page">
                {currentLabel}
              </span>
            )}
            <span data-part="status" role="status">
              {loading ? loadingText : ""}
            </span>
          </li>
        </ol>
      </nav>
    </>
  )
}
