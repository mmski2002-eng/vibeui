import type { ComponentProps, CSSProperties } from "react"

export type Icontile014Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  count?: number
  max?: number
  disabled?: boolean
  tone?: "neutral" | "accent" | "success" | "warning" | "danger"
  /** Строка состояния под подписью: компонент несёт русскую, проект — свою. */
  stateText?: Record<string, string>
  /** Подпись бейджа для скринридера. {count} подставляется числом. */
  countLabel?: string
  /** Пусто — подложки нет, плитка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: бейдж-уведомление и состояние «выключено» не могут стоять
// на плитке одновременно — выключенный источник ничего не уведомляет. Поэтому
// disabled не просто гасит цвет, а прячет бейдж целиком и подменяет его
// перечёркнутым знаком колокольчика, а под подписью появляется отдельная
// текстовая строка состояния: одного обесцвечивания недостаточно, состояние
// обязано читаться и в чёрно-белом режиме.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// граница светлее фона, а не темнее, и плитка не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="icontile-014"]){
container-type:inline-size;
--vibeui-icontile-014-hue:262;
--vibeui-icontile-014-chroma:0.05;
--vibeui-icontile-014-size:2.75rem;
--vibeui-icontile-014-fg:light-dark(oklch(0.26 0.014 265),oklch(0.94 0.006 265));
--vibeui-icontile-014-muted:color-mix(in oklab,var(--vibeui-icontile-014-fg) 68%,transparent);
--vibeui-icontile-014-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.011 265));
--vibeui-icontile-014-badge:light-dark(oklch(0.58 0.21 25),oklch(0.66 0.19 25));
--vibeui-icontile-014-ring:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-icontile-014-off:light-dark(oklch(0.5 0.02 265),oklch(0.74 0.016 265));
--vibeui-icontile-014-surface:transparent;
--vibeui-icontile-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="icontile-014"]{color-scheme:dark}
[data-vibeui-block="icontile-014"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
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
background:light-dark(oklch(0.93 var(--vibeui-icontile-014-chroma) var(--vibeui-icontile-014-hue)),oklch(0.34 var(--vibeui-icontile-014-chroma) var(--vibeui-icontile-014-hue)));
color:light-dark(oklch(0.44 calc(var(--vibeui-icontile-014-chroma) * 4) var(--vibeui-icontile-014-hue)),oklch(0.87 calc(var(--vibeui-icontile-014-chroma) * 2) var(--vibeui-icontile-014-hue)));
}
[data-vibeui-block="icontile-014"] [data-part="tile"] > svg{width:52%;height:52%}
[data-vibeui-block="icontile-014"] [data-part="badge"]{
position:absolute;top:-0.3125rem;right:-0.3125rem;
display:grid;place-items:center;min-width:1.125rem;height:1.125rem;
padding:0 0.25rem;border-radius:999px;
background:var(--vibeui-icontile-014-badge);
box-shadow:0 0 0 2px var(--vibeui-icontile-014-ring);
font-size:0.6875rem;font-weight:700;line-height:1;color:oklch(0.99 0 0);
}
[data-vibeui-block="icontile-014"] [data-part="off"]{
position:absolute;inset:0;width:100%;height:100%;
color:var(--vibeui-icontile-014-off);
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
background:light-dark(oklch(0.93 0.008 265),oklch(0.33 0.008 265));
color:light-dark(oklch(0.6 0.008 265),oklch(0.72 0.008 265));
}
@container (max-width: 200px){
[data-vibeui-block="icontile-014"] [data-part="state"]{display:none}
}
`

const STATE_TEXT: Record<string, string> = {
  on: "Уведомления включены",
  off: "Уведомления выключены",
}

const COUNT_LABEL = "{count} новых уведомлений"

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
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
  stateText = STATE_TEXT,
  countLabel = COUNT_LABEL,
  background = "",
  className,
  style,
  ...props
}: Icontile014Props) {
  const clamped = Math.max(0, count)
  const display = clamped > max ? `${max}+` : String(clamped)
  const stateKey = disabled ? "off" : "on"
  const palette = {
    ...(background
      ? {
          "--vibeui-icontile-014-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-icontile-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="icon-tile"
        data-vibeui-block="icontile-014"
        data-tone={tone}
        data-disabled={disabled ? "true" : undefined}
        aria-disabled={disabled || undefined}
        className={className}
        style={palette}
      >
        <span data-part="tile">
          <BellIcon />
          {disabled && <OffIcon />}
          {!disabled && clamped > 0 && (
            <span
              data-part="badge"
              aria-label={countLabel.replace("{count}", display)}
            >
              {display}
            </span>
          )}
        </span>
        <span data-part="text">
          <span data-part="label">{label}</span>
          <span data-part="state">
            {stateText[stateKey] ?? STATE_TEXT[stateKey]}
          </span>
        </span>
      </div>
    </>
  )
}
