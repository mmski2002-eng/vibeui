import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Icontile014Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  count?: number
  max?: number
  disabled?: boolean
  tone?: "neutral" | "accent" | "success" | "warning" | "danger"
}

// Идея компонента: бейдж-уведомление и состояние «выключено» не могут стоять
// на плитке одновременно — выключенный источник ничего не уведомляет. Поэтому
// disabled не просто гасит цвет, а прячет бейдж целиком и подменяет его
// перечёркнутым знаком колокольчика, а под подписью появляется отдельная
// текстовая строка состояния: одного обесцвечивания недостаточно, состояние
// обязано читаться и в чёрно-белом режиме.
const STYLES = `
:where([data-vibeui-block="icontile-014"]){
container-type:inline-size;
--vibeui-icontile-014-hue:262;
--vibeui-icontile-014-chroma:0.05;
--vibeui-icontile-014-size:2.75rem;
--vibeui-icontile-014-fg:oklch(0.26 0.014 265);
--vibeui-icontile-014-muted:oklch(0.52 0.014 265);
--vibeui-icontile-014-border:oklch(0.9 0.006 265);
--vibeui-icontile-014-surface:oklch(1 0 0);
--vibeui-icontile-014-badge:oklch(0.58 0.21 25);
--vibeui-icontile-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="icontile-014"]{
display:flex;align-items:center;gap:0.875rem;min-width:0;
box-sizing:border-box;padding:0.75rem 1rem;
background:var(--vibeui-icontile-014-surface);
border:1px solid var(--vibeui-icontile-014-border);border-radius:0.875rem;
font-family:var(--vibeui-icontile-014-font);
}
[data-vibeui-block="icontile-014"] [data-part="tile"]{
position:relative;display:grid;place-items:center;flex:none;
width:var(--vibeui-icontile-014-size);height:var(--vibeui-icontile-014-size);
border-radius:0.75rem;
background:oklch(0.93 var(--vibeui-icontile-014-chroma) var(--vibeui-icontile-014-hue));
color:oklch(0.44 calc(var(--vibeui-icontile-014-chroma) * 4) var(--vibeui-icontile-014-hue));
}
[data-vibeui-block="icontile-014"] [data-part="tile"] > svg{width:52%;height:52%}
[data-vibeui-block="icontile-014"] [data-part="badge"]{
position:absolute;top:-0.3125rem;right:-0.3125rem;
display:grid;place-items:center;min-width:1.125rem;height:1.125rem;
padding:0 0.25rem;border-radius:999px;
background:var(--vibeui-icontile-014-badge);
box-shadow:0 0 0 2px var(--vibeui-icontile-014-surface);
font-size:0.6875rem;font-weight:700;line-height:1;color:oklch(0.99 0 0);
}
[data-vibeui-block="icontile-014"] [data-part="off"]{
position:absolute;inset:0;width:100%;height:100%;color:oklch(0.5 0.02 265);
}
[data-vibeui-block="icontile-014"] [data-part="text"]{
display:flex;flex-direction:column;gap:0.125rem;min-width:0;flex:1 1 auto;
}
[data-vibeui-block="icontile-014"] [data-part="label"]{
display:block;margin:0;font-size:0.9375rem;font-weight:650;
color:var(--vibeui-icontile-014-fg);
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="icontile-014"] [data-part="state"]{
display:block;margin:0;font-size:0.8125rem;color:var(--vibeui-icontile-014-muted);
}
[data-vibeui-block="icontile-014"][data-tone="neutral"]{--vibeui-icontile-014-chroma:0.015}
[data-vibeui-block="icontile-014"][data-tone="success"]{--vibeui-icontile-014-hue:152}
[data-vibeui-block="icontile-014"][data-tone="warning"]{--vibeui-icontile-014-hue:75}
[data-vibeui-block="icontile-014"][data-tone="danger"]{--vibeui-icontile-014-hue:25}
[data-vibeui-block="icontile-014"][data-disabled="true"]{opacity:0.6}
[data-vibeui-block="icontile-014"][data-disabled="true"] [data-part="tile"]{
background:oklch(0.93 0.008 265);color:oklch(0.6 0.008 265);
}
@container (max-width: 200px){
[data-vibeui-block="icontile-014"] [data-part="state"]{display:none}
}
`

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  )
}

function OffIcon() {
  return (
    <svg
      data-part="off"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="4" y1="4" x2="20" y2="20" />
    </svg>
  )
}

/**
 * Плитка уведомлений с бейджем-счётчиком и честным состоянием «выключено»:
 * при disabled бейдж прячется, а колокольчик перечёркивается.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Icontile014({
  label = "Комментарии",
  count = 5,
  max = 99,
  disabled = false,
  tone = "accent",
  className,
  style,
  ...props
}: Icontile014Props) {
  const clamped = Math.max(0, count)
  const display = clamped > max ? `${max}+` : String(clamped)

  return (
    <>
      <style href="vibeui-icontile-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="icontile-014"
        data-tone={tone}
        data-disabled={disabled ? "true" : undefined}
        aria-disabled={disabled || undefined}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="tile">
          <BellIcon />
          {disabled && <OffIcon />}
          {!disabled && clamped > 0 && (
            <span data-part="badge" aria-label={`${display} новых уведомлений`}>
              {display}
            </span>
          )}
        </span>
        <span data-part="text">
          <span data-part="label">{label}</span>
          <span data-part="state">
            {disabled ? "Уведомления выключены" : "Уведомления включены"}
          </span>
        </span>
      </div>
    </>
  )
}
