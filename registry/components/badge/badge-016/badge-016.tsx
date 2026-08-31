import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge016Props = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href?: string
  hint?: string
}

// Идея компонента: плашка-ссылка. Внешний адрес компонент определяет сам по
// схеме, сам ставит target и rel и сам дописывает в доступное имя, что
// откроется новая вкладка: иконка-стрелка видна зрячим, но скринридеру она
// ничего не говорит. Стрелка отъезжает при наведении — это подтверждение
// нажатия, поэтому движение выключается вместе с prefers-reduced-motion.
const STYLES = `
:where([data-vibeui-block="badge-016"]){
--vibeui-badge-016-bg:oklch(0.97 0.008 265);
--vibeui-badge-016-bg-hover:oklch(0.94 0.018 265);
--vibeui-badge-016-fg:oklch(0.42 0.11 265);
--vibeui-badge-016-border:oklch(0.9 0.02 265);
--vibeui-badge-016-ring:oklch(0.55 0.16 265);
--vibeui-badge-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
border-color:color-mix(in oklab,var(--vibeui-badge-016-ring) 40%,oklch(1 0 0));
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
 * Плашка-ссылка: внешний адрес распознаётся сам и объявляется скринридеру.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge016({
  href = "https://example.com/changelog",
  hint = "откроется в новой вкладке",
  className,
  style,
  children = "Список изменений",
  ...props
}: Badge016Props) {
  const external = /^https?:\/\//i.test(href)

  return (
    <>
      <style href="vibeui-badge-016" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        href={href}
        data-vibeui-block="badge-016"
        data-external={external}
        className={className}
        style={style as CSSProperties}
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
