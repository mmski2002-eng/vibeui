import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  actions?: string[]
  danger?: string
  warning?: string
  label?: string
  accent?: string
}

// Идея компонента: обычные действия над записью стоят одной сцепкой, а
// необратимое вынесено за неё — свой отступ, своя рамка, свой цвет. Разрыв
// здесь не украшение: «Удалить» вплотную к «Дублировать» ловит промах курсора
// и промах пальца. Предупреждение о необратимости лежит текстом и связано
// через aria-describedby, поэтому его читают вслух вместе с именем кнопки,
// а не только видят по красному цвету.
const STYLES = `
:where([data-vibeui-block="buttongroup-011"]){
--vibeui-buttongroup-011-surface:oklch(1 0 0);
--vibeui-buttongroup-011-fg:oklch(0.27 0.016 265);
--vibeui-buttongroup-011-muted:oklch(0.52 0.014 265);
--vibeui-buttongroup-011-border:oklch(0.88 0.008 265);
--vibeui-buttongroup-011-hover:oklch(0.96 0.004 265);
--vibeui-buttongroup-011-accent:oklch(0.55 0.17 265);
--vibeui-buttongroup-011-danger:oklch(0.55 0.19 25);
--vibeui-buttongroup-011-danger-soft:oklch(0.96 0.03 25);
--vibeui-buttongroup-011-danger-border:oklch(0.86 0.07 25);
--vibeui-buttongroup-011-radius:0.625rem;
--vibeui-buttongroup-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-011"]{
box-sizing:border-box;display:inline-flex;align-items:center;gap:1.25rem;
font-family:var(--vibeui-buttongroup-011-font);
}
[data-vibeui-block="buttongroup-011"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-011"] [data-part="safe"]{display:inline-flex;isolation:isolate}
[data-vibeui-block="buttongroup-011"] button{
appearance:none;cursor:pointer;font:inherit;
position:relative;z-index:0;
display:inline-flex;align-items:center;justify-content:center;
height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-buttongroup-011-border);
background:var(--vibeui-buttongroup-011-surface);
color:var(--vibeui-buttongroup-011-fg);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-011"] [data-part="safe"] button{margin-inline-start:-1px}
[data-vibeui-block="buttongroup-011"] [data-part="safe"] button:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-011-radius);
border-end-start-radius:var(--vibeui-buttongroup-011-radius);
}
[data-vibeui-block="buttongroup-011"] [data-part="safe"] button:last-child{
border-start-end-radius:var(--vibeui-buttongroup-011-radius);
border-end-end-radius:var(--vibeui-buttongroup-011-radius);
}
[data-vibeui-block="buttongroup-011"] [data-part="safe"] button:hover{z-index:1;background:var(--vibeui-buttongroup-011-hover)}
[data-vibeui-block="buttongroup-011"] [data-part="safe"] button:focus-visible{
z-index:2;
outline:2px solid var(--vibeui-buttongroup-011-accent);outline-offset:1px;
}
/* Опасная кнопка вне сцепки: отдельная рамка, отдельное скругление,
   свой отступ — промахнуться по ней соседним движением нельзя. */
[data-vibeui-block="buttongroup-011"] [data-part="danger"]{
gap:0.4375rem;border-radius:var(--vibeui-buttongroup-011-radius);
border-color:var(--vibeui-buttongroup-011-danger-border);
color:var(--vibeui-buttongroup-011-danger);
}
[data-vibeui-block="buttongroup-011"] [data-part="danger"]:hover{
background:var(--vibeui-buttongroup-011-danger-soft);
border-color:var(--vibeui-buttongroup-011-danger);
}
[data-vibeui-block="buttongroup-011"] [data-part="danger"]:focus-visible{
outline:2px solid var(--vibeui-buttongroup-011-danger);outline-offset:2px;
}
[data-vibeui-block="buttongroup-011"] [data-part="danger"] svg{width:0.9375rem;height:0.9375rem}
[data-vibeui-block="buttongroup-011"] [data-part="warning"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ACTIONS = ["Правка", "Дублировать"]

/**
 * Действия над записью: сцепка обычных и вынесенное необратимое.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup011({
  actions = DEFAULT_ACTIONS,
  danger = "Удалить",
  warning = "Действие необратимо: запись и её версии будут стёрты",
  label = "Действия над записью",
  accent,
  className,
  style,
  ...props
}: Buttongroup011Props) {
  const warningId = "vibeui-buttongroup-011-warning"

  const palette = {
    ...(accent ? { "--vibeui-buttongroup-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="buttongroup-011"
        role="group"
        aria-label={label}
        className={className}
        style={palette}
      >
        <span data-part="safe">
          {actions.map((action) => (
            <button key={action} type="button">
              {action}
            </button>
          ))}
        </span>
        <button type="button" data-part="danger" aria-describedby={warningId}>
          <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path
              d="M3.5 5h11M7.5 5V3.5h3V5M5 5l.7 9.3c0 .4.4.7.8.7h5c.4 0 .8-.3.8-.7L13 5M7.6 8v4.3M10.4 8v4.3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {danger}
        </button>
        <span id={warningId} data-part="warning">
          {warning}
        </span>
      </div>
    </>
  )
}
