import type { ComponentProps, CSSProperties } from "react"

export type Icontile007Props = Omit<ComponentProps<"div">, "children"> & {
  icon?: "spark" | "bolt" | "shield"
  title?: string
  description?: string
  tone?: "neutral" | "accent" | "success" | "warning" | "danger"
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: подпись и описание живут в одну строку рядом с плиткой,
// а не карточкой в несколько строк. Описание обрезано многоточием, а не
// переносится — иначе список таких строк "дышит" разной высотой. На узком
// контейнере описание прячется совсем: два текста, которым не хватает места,
// наползают друг на друга хуже, чем один укороченный заголовок.
const STYLES = `
:where([data-vibeui-block="icontile-007"]){
container-type:inline-size;
--vibeui-icontile-007-hue:262;
--vibeui-icontile-007-chroma:0.05;
--vibeui-icontile-007-size:2.75rem;
--vibeui-icontile-007-fg:light-dark(oklch(0.26 0.014 265),oklch(0.93 0.006 265));
--vibeui-icontile-007-muted:color-mix(in oklab,var(--vibeui-icontile-007-fg) 68%,transparent);
--vibeui-icontile-007-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.008 265));
--vibeui-icontile-007-surface:transparent;
--vibeui-icontile-007-fill:light-dark(oklch(0.93 var(--vibeui-icontile-007-chroma) var(--vibeui-icontile-007-hue)),oklch(0.34 calc(var(--vibeui-icontile-007-chroma) * 1.2) var(--vibeui-icontile-007-hue)));
--vibeui-icontile-007-mark:light-dark(oklch(0.44 calc(var(--vibeui-icontile-007-chroma) * 4) var(--vibeui-icontile-007-hue)),oklch(0.87 calc(var(--vibeui-icontile-007-chroma) * 2.2) var(--vibeui-icontile-007-hue)));
--vibeui-icontile-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="icontile-007"]{color-scheme:dark}
[data-vibeui-block="icontile-007"]{
display:flex;align-items:center;gap:0.875rem;min-width:0;
box-sizing:border-box;padding:0.75rem 1rem;
background:var(--vibeui-icontile-007-surface);
border:1px solid var(--vibeui-icontile-007-border);border-radius:0.875rem;
font-family:var(--vibeui-icontile-007-font);
}
[data-vibeui-block="icontile-007"] [data-part="tile"]{
display:grid;place-items:center;flex:none;
width:var(--vibeui-icontile-007-size);height:var(--vibeui-icontile-007-size);
border-radius:0.75rem;
background:var(--vibeui-icontile-007-fill);
color:var(--vibeui-icontile-007-mark);
}
[data-vibeui-block="icontile-007"] [data-part="tile"] svg{width:52%;height:52%}
[data-vibeui-block="icontile-007"] [data-part="text"]{
display:flex;flex-direction:column;gap:0.125rem;min-width:0;flex:1 1 auto;
}
[data-vibeui-block="icontile-007"] [data-part="title"]{
display:block;margin:0;font-size:0.9375rem;font-weight:650;
color:var(--vibeui-icontile-007-fg);
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="icontile-007"] [data-part="description"]{
display:block;margin:0;font-size:0.8125rem;color:var(--vibeui-icontile-007-muted);
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="icontile-007"][data-tone="neutral"]{--vibeui-icontile-007-chroma:0.015}
[data-vibeui-block="icontile-007"][data-tone="success"]{--vibeui-icontile-007-hue:152}
[data-vibeui-block="icontile-007"][data-tone="warning"]{--vibeui-icontile-007-hue:75}
[data-vibeui-block="icontile-007"][data-tone="danger"]{--vibeui-icontile-007-hue:25}
@container (max-width: 220px){
[data-vibeui-block="icontile-007"] [data-part="description"]{display:none}
}
`

function Icontile007Icon({
  icon,
}: {
  icon: NonNullable<Icontile007Props["icon"]>
}) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  }

  if (icon === "bolt") {
    return (
      <svg {...shared}>
        <path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" />
      </svg>
    )
  }

  if (icon === "shield") {
    return (
      <svg {...shared}>
        <path d="M12 3 19 6v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3Z" />
      </svg>
    )
  }

  return (
    <svg {...shared}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  )
}

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
 * Плитка с подписью и описанием в одну строку: описание обрезается
 * многоточием, а на узком контейнере прячется совсем.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Icontile007({
  icon = "spark",
  title = "Быстрый старт",
  description = "Установите пакет и подключите провайдер темы за одну команду",
  tone = "accent",
  background = "",
  className,
  style,
  ...props
}: Icontile007Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-icontile-007-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-icontile-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="icon-tile"
        data-vibeui-block="icontile-007"
        data-tone={tone}
        className={className}
        style={palette}
      >
        <span data-part="tile">
          <Icontile007Icon icon={icon} />
        </span>
        <span data-part="text">
          <span data-part="title">{title}</span>
          <span data-part="description">{description}</span>
        </span>
      </div>
    </>
  )
}
