import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Banner007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  title?: string
  /** Дата в человеческом виде: «14 сентября». */
  date?: string
  from?: string
  to?: string
  /** Машиночитаемое значение для <time datetime>. */
  datetime?: string
  note?: string
}

// Идея компонента: полоса плановых работ, у которой время — главный герой.
// Слева отдельным блоком стоит окно недоступности, справа объяснение; время
// размечено тегом <time>, поэтому его понимает не только человек.
const STYLES = `
:where([data-vibeui-block="banner-007"]){
--vibeui-banner-007-bg:oklch(0.98 0.012 285);
--vibeui-banner-007-fg:oklch(0.26 0.04 285);
--vibeui-banner-007-muted:oklch(0.48 0.04 285);
--vibeui-banner-007-border:oklch(0.88 0.03 285);
--vibeui-banner-007-slot:oklch(0.94 0.04 285);
--vibeui-banner-007-accent:oklch(0.5 0.14 290);
--vibeui-banner-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="banner-007"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-banner-007-font);color:var(--vibeui-banner-007-fg);
}
[data-vibeui-block="banner-007"] [data-part="shell"]{
display:flex;align-items:stretch;gap:0.9375rem;
box-sizing:border-box;padding:0.875rem 1rem;
border:1px solid var(--vibeui-banner-007-border);border-radius:1rem;
background:var(--vibeui-banner-007-bg);
}
/* Окно недоступности вынесено в отдельный блок: это главная величина. */
[data-vibeui-block="banner-007"] [data-part="slot"]{
flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;
min-width:5.5rem;padding:0.5rem 0.75rem;box-sizing:border-box;
border-radius:0.75rem;background:var(--vibeui-banner-007-slot);
text-align:center;
}
[data-vibeui-block="banner-007"] [data-part="date"]{font-size:0.75rem;color:var(--vibeui-banner-007-muted)}
[data-vibeui-block="banner-007"] [data-part="range"]{
font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="banner-007"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;justify-content:center;min-width:0}
[data-vibeui-block="banner-007"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;line-height:1.35}
[data-vibeui-block="banner-007"] [data-part="note"]{margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-banner-007-muted)}
[data-vibeui-block="banner-007"] [data-part="note"] b{color:var(--vibeui-banner-007-accent);font-weight:650}
@container (max-width: 26rem){
[data-vibeui-block="banner-007"] [data-part="shell"]{flex-direction:column;gap:0.75rem}
[data-vibeui-block="banner-007"] [data-part="slot"]{align-items:flex-start;text-align:left;width:100%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-007"] *{animation:none!important;transition:none!important}}
`

/**
 * Полоса плановых работ с окном недоступности, размеченным тегом time.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner007({
  title = "Плановые работы с базой данных",
  date = "14 сентября",
  from = "02:00",
  to = "04:30",
  datetime = "2026-09-14T02:00",
  note = "Каталог останется доступен только на чтение. Публикация и загрузка файлов не сработают.",
  className,
  style,
  ...props
}: Banner007Props) {
  return (
    <>
      <style href="vibeui-banner-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="banner-007"
        role="note"
        aria-label={`${title}: ${date}, с ${from} до ${to}`}
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="shell">
          <time data-part="slot" dateTime={datetime}>
            <span data-part="date">{date}</span>
            <span data-part="range">
              {from}–{to}
            </span>
          </time>
          <div data-part="text">
            <p data-part="title">{title}</p>
            <p data-part="note">{note}</p>
          </div>
        </div>
      </div>
    </>
  )
}
