import type { ComponentProps, CSSProperties } from "react"

export type Icontile008CategoryIcon =
  "code" | "design" | "chart" | "rocket" | "shield" | "spark"

export type Icontile008Category = {
  label: string
  icon: Icontile008CategoryIcon
  count?: number
}

export type Icontile008Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Icontile008Category[]
  /** Подпись счётчика: {count} подставляется числом. */
  countText?: string
  /** Пусто — подложки нет, плитки лежат прямо на фоне страницы. */
  background?: string
}

const ICON_HUE: Record<Icontile008CategoryIcon, number> = {
  code: 262,
  design: 300,
  chart: 152,
  rocket: 25,
  shield: 200,
  spark: 75,
}

const DEFAULT_ITEMS: Icontile008Category[] = [
  { label: "Разработка", icon: "code", count: 24 },
  { label: "Дизайн", icon: "design", count: 12 },
  { label: "Аналитика", icon: "chart", count: 8 },
  { label: "Продукт", icon: "rocket", count: 5 },
  { label: "Безопасность", icon: "shield", count: 3 },
  { label: "Идеи", icon: "spark", count: 17 },
]

// Идея компонента: сетка плиток-категорий, где число колонок набирается
// auto-fit от доступной ширины, а не от окна браузера — в узкой боковой
// панели и на всю ширину страницы получаем разное число колонок. Ховер
// поднимает плитку и красит рамку сразу двумя признаками — тенью и сдвигом,
// а не одним цветом, поэтому наведение видно и в чёрно-белом режиме. Каждая
// категория держит свой оттенок плитки-иконки — так ряд не превращается в
// одноцветный список.
const STYLES = `
:where([data-vibeui-block="icontile-008"]){
--vibeui-icontile-008-fg:light-dark(oklch(0.26 0 265),oklch(0.93 0 265));
--vibeui-icontile-008-muted:color-mix(in oklab,var(--vibeui-icontile-008-fg) 68%,transparent);
--vibeui-icontile-008-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-icontile-008-surface:transparent;
--vibeui-icontile-008-hover-surface:light-dark(oklch(0.97 0 262),oklch(0.3 0 262));
--vibeui-icontile-008-hover-border:light-dark(oklch(0.78 0 262),oklch(0.52 0.05 262));
--vibeui-icontile-008-shadow:light-dark(oklch(0.3 0.05 262 / 55%),oklch(0.05 0 262 / 75%));
--vibeui-icontile-008-ring:light-dark(oklch(0.55 0.15 262),oklch(0.74 0.14 262));
--vibeui-icontile-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="icontile-008"]{color-scheme:dark}
/* Число колонок набирает auto-fit, а не контейнерные запросы: container-type
   отвязал бы ширину сетки от содержимого, и в кадре, который меряет компонент
   по содержимому, она схлопнулась бы в ноль. min-width — нижняя граница той
   же ширины: без неё auto-fit при неопределённой ширине даёт одну колонку и
   сетка вытягивается в столбик. */
[data-vibeui-block="icontile-008"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;min-width:17rem;font-family:var(--vibeui-icontile-008-font);
}
[data-vibeui-block="icontile-008"] [data-part="grid"]{
display:grid;gap:0.75rem;grid-template-columns:repeat(auto-fit,minmax(8rem,1fr));
}
[data-vibeui-block="icontile-008"] [data-part="item"]{
appearance:none;cursor:pointer;text-align:left;
display:flex;flex-direction:column;align-items:flex-start;gap:0.625rem;
box-sizing:border-box;width:100%;padding:1rem;
background:var(--vibeui-icontile-008-surface);
border:1px solid var(--vibeui-icontile-008-border);border-radius:1rem;
font:inherit;color:inherit;
transition:transform 0.16s ease,box-shadow 0.16s ease,background-color 0.16s ease,border-color 0.16s ease;
}
[data-vibeui-block="icontile-008"] [data-part="item"]:hover{
transform:translateY(-2px);
background:var(--vibeui-icontile-008-hover-surface);
border-color:var(--vibeui-icontile-008-hover-border);
box-shadow:0 10px 24px -16px var(--vibeui-icontile-008-shadow);
}
[data-vibeui-block="icontile-008"] [data-part="item"]:focus-visible{
outline:2px solid var(--vibeui-icontile-008-ring);outline-offset:2px;
}
[data-vibeui-block="icontile-008"] [data-part="icon"]{
display:grid;place-items:center;flex:none;
width:2.5rem;height:2.5rem;border-radius:0.75rem;
background:light-dark(oklch(0.93 0.045 var(--vibeui-icontile-008-item-hue)),oklch(0.34 0.055 var(--vibeui-icontile-008-item-hue)));
color:light-dark(oklch(0.44 0.18 var(--vibeui-icontile-008-item-hue)),oklch(0.87 0.1 var(--vibeui-icontile-008-item-hue)));
}
[data-vibeui-block="icontile-008"] [data-part="icon"] svg{width:55%;height:55%}
[data-vibeui-block="icontile-008"] [data-part="label"]{
font-size:0.875rem;font-weight:650;color:var(--vibeui-icontile-008-fg);
}
[data-vibeui-block="icontile-008"] [data-part="count"]{
margin:0;font-size:0.75rem;color:var(--vibeui-icontile-008-muted);
font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="icontile-008"] [data-part="item"]{transition:none!important}
[data-vibeui-block="icontile-008"] [data-part="item"]:hover{transform:none}
}
`

function Icontile008Icon({ icon }: { icon: Icontile008CategoryIcon }) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  }

  switch (icon) {
    case "design":
      return (
        <svg {...shared}>
          <path d="M4 20 6 14 16 4a2.5 2.5 0 0 1 3.5 3.5L9.5 17.5 4 20Z" />
          <path d="M13.5 6.5 17.5 10.5" />
        </svg>
      )
    case "chart":
      return (
        <svg {...shared}>
          <path d="M5 20V10M12 20V4M19 20v-7" />
        </svg>
      )
    case "rocket":
      return (
        <svg {...shared}>
          <path d="M12 2c3 2 5 6 5 10 0 2-1 4-2 5l-3 3-3-3c-1-1-2-3-2-5 0-4 2-8 5-10Z" />
          <path d="M9 15 6 18M15 15l3 3" />
        </svg>
      )
    case "shield":
      return (
        <svg {...shared}>
          <path d="M12 3 19 6v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3Z" />
        </svg>
      )
    case "spark":
      return (
        <svg {...shared}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
        </svg>
      )
    default:
      return (
        <svg {...shared}>
          <path d="M8 5 2 12l6 7M16 5l6 7-6 7" />
        </svg>
      )
  }
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
 * Сетка плиток-категорий: число колонок от ширины контейнера, ховер поднимает
 * плитку тенью и сдвигом, у каждой категории свой оттенок иконки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Icontile008({
  items = DEFAULT_ITEMS,
  countText = "{count} компонентов",
  background = "",
  className,
  style,
  ...props
}: Icontile008Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-icontile-008-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-icontile-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="icon-tile"
        data-vibeui-block="icontile-008"
        className={className}
        style={palette}
      >
        <div data-part="grid">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              data-part="item"
              style={
                {
                  "--vibeui-icontile-008-item-hue": ICON_HUE[item.icon],
                } as CSSProperties
              }
            >
              <span data-part="icon">
                <Icontile008Icon icon={item.icon} />
              </span>
              <span data-part="label">{item.label}</span>
              {item.count !== undefined ? (
                <span data-part="count">
                  {countText.replace("{count}", String(item.count))}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
