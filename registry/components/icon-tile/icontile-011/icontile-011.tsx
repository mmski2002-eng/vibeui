import type { ComponentProps, CSSProperties } from "react"

export type Icontile011Props = Omit<ComponentProps<"div">, "children"> & {
  name?: string
  status?: "connected" | "pending" | "disconnected"
  /** Подписи статусов: компонент несёт русские, проект подставляет свои. */
  statusText?: Record<string, string>
  tone?: "neutral" | "accent" | "success" | "warning" | "danger"
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return "?"
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

const STATUS_LABEL: Record<string, string> = {
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
--vibeui-icontile-011-fg:light-dark(oklch(0.26 0 265),oklch(0.93 0 265));
--vibeui-icontile-011-muted:color-mix(in oklab,var(--vibeui-icontile-011-fg) 68%,transparent);
--vibeui-icontile-011-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-icontile-011-surface:transparent;
--vibeui-icontile-011-dot:light-dark(oklch(0.6 0.16 39.8),oklch(0.74 0.16 39.8));
--vibeui-icontile-011-fill:light-dark(oklch(0.93 var(--vibeui-icontile-011-chroma) var(--vibeui-icontile-011-hue)),oklch(0.34 calc(var(--vibeui-icontile-011-chroma) * 1.2) var(--vibeui-icontile-011-hue)));
--vibeui-icontile-011-mark:light-dark(oklch(0.4 calc(var(--vibeui-icontile-011-chroma) * 4) var(--vibeui-icontile-011-hue)),oklch(0.88 calc(var(--vibeui-icontile-011-chroma) * 2.2) var(--vibeui-icontile-011-hue)));
--vibeui-icontile-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="icontile-011"]{color-scheme:dark}
[data-vibeui-block="icontile-011"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
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
background:var(--vibeui-icontile-011-fill);
color:var(--vibeui-icontile-011-mark);
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
[data-vibeui-block="icontile-011"][data-status="connected"]{--vibeui-icontile-011-dot:light-dark(oklch(0.6 0.16 152),oklch(0.74 0.16 152))}
[data-vibeui-block="icontile-011"][data-status="pending"]{--vibeui-icontile-011-dot:light-dark(oklch(0.68 0.14 75),oklch(0.83 0.14 75))}
[data-vibeui-block="icontile-011"][data-status="disconnected"]{--vibeui-icontile-011-dot:light-dark(oklch(0.6 0 265),oklch(0.62 0 265))}
@container (max-width: 200px){
[data-vibeui-block="icontile-011"] [data-part="status"]{display:none}
}
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
 * Плитка интеграции: монограмма сервиса, название и статус подключения
 * с точкой и текстом одновременно.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Icontile011({
  name = "Notion",
  status = "connected",
  statusText = STATUS_LABEL,
  tone = "accent",
  background = "",
  className,
  style,
  ...props
}: Icontile011Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-icontile-011-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-icontile-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="icon-tile"
        data-vibeui-block="icontile-011"
        data-tone={tone}
        data-status={status}
        className={className}
        style={palette}
      >
        <span data-part="logo" aria-hidden="true">
          {getInitials(name)}
        </span>
        <span data-part="text">
          <span data-part="name">{name}</span>
          <span data-part="status">
            <span data-part="dot" aria-hidden="true" />
            {statusText[status] ?? STATUS_LABEL[status]}
          </span>
        </span>
      </div>
    </>
  )
}
