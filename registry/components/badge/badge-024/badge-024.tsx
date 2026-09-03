import type { ComponentProps, CSSProperties } from "react"

export type Badge024Props = Omit<ComponentProps<"div">, "children"> & {
  items?: string[]
  visible?: number
  label?: string
  /** Доступное имя хвоста: {count} и {label} подставляются в шаблон. */
  moreLabel?: string
  /** Подпись раскрытого хвоста. */
  lessText?: string
  accent?: string
  /** Пусто — плашки держат собственный нейтральный фон. */
  background?: string
}

// Идея компонента: группа плашек, хвост которой не просто сворачивается в
// «+4», а раскрывается по нажатию. Раскрытие держит нативный details: summary
// уже кнопка, уже фокусируется, уже объявляет состояние — клиентский
// обработчик и useState здесь не нужны, компонент остаётся серверным.
const STYLES = `
:where([data-vibeui-block="badge-024"]){
--vibeui-badge-024-bg:light-dark(oklch(0.97 0.004 265),oklch(0.27 0.009 265));
--vibeui-badge-024-fg:light-dark(oklch(0.32 0.014 265),oklch(0.92 0.007 265));
--vibeui-badge-024-border:light-dark(oklch(0.89 0.006 265),oklch(0.41 0.011 265));
--vibeui-badge-024-accent:light-dark(oklch(0.54 0.16 265),oklch(0.75 0.14 265));
--vibeui-badge-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-024"]{color-scheme:dark}
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
/* Подмешиваем к собственному фону плашек, а не к белому: в тёмной теме
   белый вернул бы светлое пятно под курсором. */
border-color:color-mix(in oklab,var(--vibeui-badge-024-accent) 45%,var(--vibeui-badge-024-bg));
background:color-mix(in oklab,var(--vibeui-badge-024-accent) 12%,var(--vibeui-badge-024-bg));
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
 * Группа плашек с переполнением «+N», которое раскрывается без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge024({
  items = DEFAULT_ITEMS,
  visible = 3,
  label = "Технологии",
  moreLabel = "Ещё {count} из списка «{label}»",
  lessText = "Свернуть",
  accent,
  background = "",
  className,
  style,
  ...props
}: Badge024Props) {
  const shown = items.slice(0, Math.max(1, Math.round(visible)))
  const rest = items.slice(shown.length)
  const moreText = moreLabel
    .replace("{count}", String(rest.length))
    .replace("{label}", label)

  const palette = {
    ...(accent ? { "--vibeui-badge-024-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-badge-024-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-024" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-024"
        className={className}
        style={palette}
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
            <summary aria-label={moreText}>
              <span data-part="rest">+{rest.length}</span>
              <span data-part="less">{lessText}</span>
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
