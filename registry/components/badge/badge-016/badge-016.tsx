import type { ComponentProps, CSSProperties } from "react"

export type Badge016Props = Omit<ComponentProps<"a">, "href"> & {
  href?: string
  hint?: string
  accent?: string
  /** Пусто — плашка держит собственный нейтральный фон. */
  background?: string
}

// Идея компонента: плашка-ссылка. Внешний адрес компонент определяет сам по
// схеме, сам ставит target и rel и сам дописывает в доступное имя, что
// откроется новая вкладка: иконка-стрелка видна зрячим, но скринридеру она
// ничего не говорит. Стрелка отъезжает при наведении — это подтверждение
// нажатия, поэтому движение выключается вместе с prefers-reduced-motion.
const STYLES = `
:where([data-vibeui-block="badge-016"]){
--vibeui-badge-016-bg:light-dark(oklch(0.97 0 265),oklch(0.27 0 265));
--vibeui-badge-016-bg-hover:light-dark(oklch(0.94 0 265),oklch(0.33 0 265));
--vibeui-badge-016-fg:light-dark(oklch(0.42 0.11 265),oklch(0.86 0.07 265));
--vibeui-badge-016-border:light-dark(oklch(0.9 0 265),oklch(0.42 0 265));
--vibeui-badge-016-ring:light-dark(oklch(0.55 0.16 265),oklch(0.74 0.14 265));
--vibeui-badge-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-016"]{color-scheme:dark}
[data-vibeui-block="badge-016"]{
display:inline-flex;align-items:center;gap:0.375rem;
box-sizing:border-box;height:1.75rem;padding:0 0.625rem 0 0.75rem;
border:1px solid var(--vibeui-badge-016-border);border-radius:9999px;
background:var(--vibeui-badge-016-bg);color:var(--vibeui-badge-016-fg);
font-family:var(--vibeui-badge-016-font);font-size:0.75rem;font-weight:600;line-height:1;
text-decoration:none;vertical-align:middle;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="badge-016"]:hover{
background:var(--vibeui-badge-016-bg-hover);
/* Подмешиваем к собственному фону, а не к белому: в тёмной теме белый
   оставил бы у наведённой ссылки светлую рамку неизвестно откуда. */
border-color:color-mix(in oklab,var(--vibeui-badge-016-ring) 40%,var(--vibeui-badge-016-bg));
}
[data-vibeui-block="badge-016"]:focus-visible{
outline:2px solid var(--vibeui-badge-016-ring);outline-offset:2px;
}
[data-vibeui-block="badge-016"] [data-part="arrow"]{
width:0.75rem;height:0.75rem;flex:none;
transition:transform .16s ease;
}
[data-vibeui-block="badge-016"]:hover [data-part="arrow"]{transform:translateX(1px)}
[data-vibeui-block="badge-016"][data-external="true"]:hover [data-part="arrow"]{transform:translate(1px,-1px)}
/* Подпись только для скринридера: визуально стрелка уже всё сказала. */
[data-vibeui-block="badge-016"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-016"] *{animation:none!important;transition:none!important}}
`

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
 * Плашка-ссылка: внешний адрес распознаётся сам и объявляется скринридеру.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge016({
  href = "https://example.com/changelog",
  hint = "откроется в новой вкладке",
  accent,
  background = "",
  className,
  style,
  children = "Список изменений",
  ...props
}: Badge016Props) {
  const external = /^https?:\/\//i.test(href)

  const palette = {
    ...(accent ? { "--vibeui-badge-016-ring": accent } : null),
    ...(background
      ? {
          "--vibeui-badge-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-016" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        href={href}
        data-slot="badge"
        data-vibeui-block="badge-016"
        data-external={external}
        className={className}
        style={palette}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
      >
        {children}
        {external ? <span data-part="sr"> ({hint})</span> : null}
        <svg
          data-part="arrow"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          {external ? (
            <path d="M5.5 10.5 10.5 5.5M6 5.5h4.5V10" />
          ) : (
            <path d="M3.5 8h9M9 4.5 12.5 8 9 11.5" />
          )}
        </svg>
      </a>
    </>
  )
}
