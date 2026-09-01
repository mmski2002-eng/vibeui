import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Icontile011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  name?: string
  status?: "connected" | "pending" | "disconnected"
  tone?: "neutral" | "accent" | "success" | "warning" | "danger"
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return "?"
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

const STATUS_LABEL: Record<
  NonNullable<Icontile011Props["status"]>,
  string
> = {
  connected: "Подключено",
  pending: "Ожидает подтверждения",
  disconnected: "Отключено",
}

// Идея компонента: логотип сервиса — не реальный бренд-знак, а монограмма из
// первых букв названия, посчитанная в рантайме. Так плитка не тянет за собой
// набор чужих svg-логотипов и работает с любым названием сервиса. Статус
// подключения продублирован дважды — цветом точки и текстом рядом, — потому
// что цвет точки один не читается людьми с нарушением цветовосприятия.
const STYLES = `
:where([data-vibeui-block="icontile-011"]){
container-type:inline-size;
--vibeui-icontile-011-hue:262;
--vibeui-icontile-011-chroma:0.05;
--vibeui-icontile-011-size:2.75rem;
--vibeui-icontile-011-fg:oklch(0.26 0.014 265);
--vibeui-icontile-011-muted:oklch(0.52 0.014 265);
--vibeui-icontile-011-border:oklch(0.9 0.006 265);
--vibeui-icontile-011-surface:oklch(1 0 0);
--vibeui-icontile-011-dot:oklch(0.6 0.16 152);
--vibeui-icontile-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="icontile-011"]{
display:flex;align-items:center;gap:0.875rem;min-width:0;
box-sizing:border-box;padding:0.75rem 1rem;
background:var(--vibeui-icontile-011-surface);
border:1px solid var(--vibeui-icontile-011-border);border-radius:0.875rem;
font-family:var(--vibeui-icontile-011-font);
}
[data-vibeui-block="icontile-011"] [data-part="logo"]{
display:grid;place-items:center;flex:none;
width:var(--vibeui-icontile-011-size);height:var(--vibeui-icontile-011-size);
border-radius:0.75rem;
background:oklch(0.93 var(--vibeui-icontile-011-chroma) var(--vibeui-icontile-011-hue));
color:oklch(0.4 calc(var(--vibeui-icontile-011-chroma) * 4) var(--vibeui-icontile-011-hue));
font-size:0.9375rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="icontile-011"] [data-part="text"]{
display:flex;flex-direction:column;gap:0.1875rem;min-width:0;flex:1 1 auto;
}
[data-vibeui-block="icontile-011"] [data-part="name"]{
display:block;margin:0;font-size:0.9375rem;font-weight:650;
color:var(--vibeui-icontile-011-fg);
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="icontile-011"] [data-part="status"]{
display:flex;align-items:center;gap:0.375rem;min-width:0;
font-size:0.8125rem;color:var(--vibeui-icontile-011-muted);
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="icontile-011"] [data-part="dot"]{
flex:none;width:0.5rem;height:0.5rem;border-radius:50%;
background:var(--vibeui-icontile-011-dot);
}
[data-vibeui-block="icontile-011"][data-tone="neutral"]{--vibeui-icontile-011-chroma:0.015}
[data-vibeui-block="icontile-011"][data-tone="success"]{--vibeui-icontile-011-hue:152}
[data-vibeui-block="icontile-011"][data-tone="warning"]{--vibeui-icontile-011-hue:75}
[data-vibeui-block="icontile-011"][data-tone="danger"]{--vibeui-icontile-011-hue:25}
[data-vibeui-block="icontile-011"][data-status="connected"]{--vibeui-icontile-011-dot:oklch(0.6 0.16 152)}
[data-vibeui-block="icontile-011"][data-status="pending"]{--vibeui-icontile-011-dot:oklch(0.68 0.14 75)}
[data-vibeui-block="icontile-011"][data-status="disconnected"]{--vibeui-icontile-011-dot:oklch(0.6 0.02 265)}
@container (max-width: 200px){
[data-vibeui-block="icontile-011"] [data-part="status"]{display:none}
}
`

/**
 * Плитка интеграции: монограмма сервиса, название и статус подключения
 * с точкой и текстом одновременно.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Icontile011({
  name = "Notion",
  status = "connected",
  tone = "accent",
  className,
  style,
  ...props
}: Icontile011Props) {
  return (
    <>
      <style href="vibeui-icontile-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="icontile-011"
        data-tone={tone}
        data-status={status}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="logo" aria-hidden="true">
          {getInitials(name)}
        </span>
        <span data-part="text">
          <span data-part="name">{name}</span>
          <span data-part="status">
            <span data-part="dot" aria-hidden="true" />
            {STATUS_LABEL[status]}
          </span>
        </span>
      </div>
    </>
  )
}
