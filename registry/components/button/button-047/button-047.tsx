import type { ComponentProps, CSSProperties } from "react"

export type Button047Props = ComponentProps<"a"> & {
  href?: string
  /** Показывать домен назначения рядом с подписью. */
  showHost?: boolean
  /** Строка для скринридера: сам target о новой вкладке не сообщает. */
  newTabHint?: string
  accent?: string
  /** Поверхность ссылки. Пусто — своя, из палитры. */
  background?: string
}

// Идея компонента: ссылка, которая честно предупреждает об уходе с сайта.
// Домен вынимается из href прямо в разметку, значок «стрелка из рамки»
// нарисован гранями псевдоэлементов, а для скринридера к подписи добавлена
// скрытая строка «откроется в новой вкладке» — target сам по себе её не даёт.
const STYLES = `
:where([data-vibeui-block="button-047"]){
--vibeui-button-047-surface:light-dark(oklch(1 0 0),oklch(0.25 0.014 265));
--vibeui-button-047-border:light-dark(oklch(0.9 0.006 265),oklch(0.4 0.014 265));
--vibeui-button-047-fg:light-dark(oklch(0.26 0.02 265),oklch(0.93 0.008 265));
--vibeui-button-047-muted:color-mix(in oklab,var(--vibeui-button-047-fg) 68%,transparent);
--vibeui-button-047-accent:light-dark(oklch(0.5 0.16 245),oklch(0.75 0.13 245));
--vibeui-button-047-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-button-047-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-047"]{color-scheme:dark}
[data-vibeui-block="button-047"]{
position:relative;
display:inline-flex;align-items:center;gap:0.625rem;box-sizing:border-box;
height:2.5rem;padding:0 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-button-047-border);
background:var(--vibeui-button-047-surface);color:var(--vibeui-button-047-fg);
font-family:var(--vibeui-button-047-font);font-size:0.875rem;font-weight:600;line-height:1;
text-decoration:none;
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="button-047"]:hover{border-color:var(--vibeui-button-047-accent);color:var(--vibeui-button-047-accent)}
[data-vibeui-block="button-047"]:focus-visible{outline:2px solid var(--vibeui-button-047-accent);outline-offset:2px}
[data-vibeui-block="button-047"] [data-part="host"]{
font-family:var(--vibeui-button-047-mono);font-size:0.75rem;font-weight:500;
color:var(--vibeui-button-047-muted);
padding:0.1875rem 0.375rem;border-radius:0.3125rem;
background:color-mix(in oklab,var(--vibeui-button-047-accent) 8%,transparent);
}
/* Стрелка, выходящая из рамки: рамка — грани без правого верхнего угла. */
[data-vibeui-block="button-047"] [data-part="out"]{position:relative;flex:none;width:0.875rem;height:0.875rem}
[data-vibeui-block="button-047"] [data-part="out"]::before{
content:"";position:absolute;left:0;bottom:0;width:0.6875rem;height:0.6875rem;
box-sizing:border-box;border:1.5px solid currentColor;border-radius:0.1875rem;
border-top-color:transparent;border-right-color:transparent;
}
[data-vibeui-block="button-047"] [data-part="out"]::after{
content:"";position:absolute;right:0;top:0;width:0.5625rem;height:0.5625rem;
box-sizing:border-box;border:1.5px solid currentColor;border-left:0;border-bottom:0;
background:linear-gradient(45deg,transparent 46%,currentColor 46% 54%,transparent 54%);
}
[data-vibeui-block="button-047"] [data-part="out"]{transition:transform .18s cubic-bezier(0.16,1,0.3,1)}
[data-vibeui-block="button-047"]:hover [data-part="out"]{transform:translate(2px,-2px)}
[data-vibeui-block="button-047"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-047"] *{animation:none!important;transition:none!important}}
`

function hostOf(href: string) {
  try {
    return new URL(href).host.replace(/^www\./, "")
  } catch {
    return href.replace(/^https?:\/\//, "").split("/")[0]
  }
}

/**
 * Ветка темы для заданной поверхности. Без неё светлая заливка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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
 * Ссылка на внешний ресурс со значком выхода и доменом назначения.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button047({
  href = "https://ui.shadcn.com/docs",
  showHost = true,
  newTabHint = "(откроется в новой вкладке)",
  accent,
  background = "",
  className,
  style,
  children = "Документация shadcn",
  ...props
}: Button047Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-047-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-047-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-047" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        data-slot="button"
        data-vibeui-block="button-047"
        className={className}
        style={palette}
      >
        <span data-part="label">{children}</span>
        {showHost ? <span data-part="host">{hostOf(href)}</span> : null}
        <span data-part="out" aria-hidden="true" />
        <span data-part="sr">{newTabHint}</span>
      </a>
    </>
  )
}
