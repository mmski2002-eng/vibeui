import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge024Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  items?: string[]
  visible?: number
  label?: string
}

// Идея компонента: группа плашек, хвост которой не просто сворачивается в
// «+4», а раскрывается по нажатию. Раскрытие держит нативный details: summary
// уже кнопка, уже фокусируется, уже объявляет состояние — клиентский
// обработчик и useState здесь не нужны, компонент остаётся серверным.
const STYLES = `
:where([data-vibeui-block="badge-024"]){
--vibeui-badge-024-bg:oklch(0.97 0.004 265);
--vibeui-badge-024-fg:oklch(0.32 0.014 265);
--vibeui-badge-024-border:oklch(0.89 0.006 265);
--vibeui-badge-024-accent:oklch(0.54 0.16 265);
--vibeui-badge-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="badge-024"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
max-width:100%;
font-family:var(--vibeui-badge-024-font);
}
[data-vibeui-block="badge-024"] [data-part="item"]{
display:inline-flex;align-items:center;box-sizing:border-box;
height:1.625rem;padding:0 0.625rem;
border:1px solid var(--vibeui-badge-024-border);border-radius:9999px;
background:var(--vibeui-badge-024-bg);color:var(--vibeui-badge-024-fg);
font-size:0.75rem;font-weight:500;line-height:1;white-space:nowrap;
}
/* details сам становится flex-контейнером: summary и хвост — его элементы,
   поэтому раскрытые плашки встают в тот же ряд, а не блоком под ним. */
[data-vibeui-block="badge-024"] [data-part="more"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;min-width:0;
}
[data-vibeui-block="badge-024"] summary{
display:inline-flex;align-items:center;gap:0.25rem;
box-sizing:border-box;height:1.625rem;padding:0 0.625rem;
border:1px dashed var(--vibeui-badge-024-border);border-radius:9999px;
background:transparent;color:var(--vibeui-badge-024-accent);
font-size:0.75rem;font-weight:700;line-height:1;
font-variant-numeric:tabular-nums;cursor:pointer;list-style:none;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="badge-024"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="badge-024"] summary:hover{
border-color:color-mix(in oklab,var(--vibeui-badge-024-accent) 45%,oklch(1 0 0));
background:color-mix(in oklab,var(--vibeui-badge-024-accent) 8%,oklch(1 0 0));
}
[data-vibeui-block="badge-024"] summary:focus-visible{
outline:2px solid var(--vibeui-badge-024-accent);outline-offset:2px;
}
[data-vibeui-block="badge-024"] [data-part="less"]{display:none}
[data-vibeui-block="badge-024"] [data-part="more"][open] [data-part="less"]{display:inline}
[data-vibeui-block="badge-024"] [data-part="more"][open] [data-part="rest"]{display:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-024"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS = [
  "TypeScript",
  "React",
  "Tailwind",
  "PostgreSQL",
  "Redis",
  "Docker",
  "Playwright",
]

/**
 * Группа плашек с переполнением «+N», которое раскрывается без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge024({
  items = DEFAULT_ITEMS,
  visible = 3,
  label = "Технологии",
  className,
  style,
  ...props
}: Badge024Props) {
  const shown = items.slice(0, Math.max(1, Math.round(visible)))
  const rest = items.slice(shown.length)

  return (
    <>
      <style href="vibeui-badge-024" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="badge-024"
        className={className}
        style={style as CSSProperties}
        role="group"
        aria-label={label}
      >
        {shown.map((item) => (
          <span key={item} data-part="item">
            {item}
          </span>
        ))}
        {rest.length > 0 ? (
          <details data-part="more">
            <summary aria-label={`Ещё ${rest.length} из списка «${label}»`}>
              <span data-part="rest">+{rest.length}</span>
              <span data-part="less">Свернуть</span>
            </summary>
            {rest.map((item) => (
              <span key={item} data-part="item">
                {item}
              </span>
            ))}
          </details>
        ) : null}
      </div>
    </>
  )
}
