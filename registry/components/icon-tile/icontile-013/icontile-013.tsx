import type { ComponentProps, CSSProperties } from "react"

export type Icontile013Props = Omit<ComponentProps<"div">, "children"> & {
  icon?: "trophy" | "star" | "medal"
  label?: string
  tier?: "bronze" | "silver" | "gold"
  /** Названия ступеней: сам металл различается только оттенком. */
  tierText?: Record<NonNullable<Icontile013Props["tier"]>, string>
  /** Пусто — подложки нет, плитка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: лента под кругом — не одна фигура, а два одинаковых
// хвоста, вырезанных clip-path из общего прямоугольника и отражённых друг
// относительно друга через scaleX(-1). Так оба хвоста гарантированно
// симметричны при любом tier и любой ширине, а не подгоняются раздельно.
// Круг и лента окрашены от одной переменной оттенка --vibeui-icontile-013-hue,
// которую переключает tier, — металл достижения нигде не подбирается вручную.
//
// Тема берётся из color-scheme окружения через light-dark(): подпись темнеет
// и светлеет вместе со страницей, а собственной подложки у плитки нет.
const STYLES = `
/* Без container-type: плитка размером с содержимое, а контейнер отвязал бы её
   ширину от круга и подписи — во флексовом кадре осталось бы ноль. Подпись и
   так не растягивает плитку: max-width:12ch и многоточие. */
:where([data-vibeui-block="icontile-013"]){
--vibeui-icontile-013-hue:75;
--vibeui-icontile-013-size:3.5rem;
--vibeui-icontile-013-fg:light-dark(oklch(0.26 0.014 265),oklch(0.93 0.006 265));
--vibeui-icontile-013-bg:transparent;
--vibeui-icontile-013-pad:0;
--vibeui-icontile-013-radius:0;
--vibeui-icontile-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="icontile-013"]{color-scheme:dark}
[data-vibeui-block="icontile-013"]{
display:inline-flex;flex-direction:column;align-items:center;min-width:0;
box-sizing:border-box;
padding:var(--vibeui-icontile-013-pad);
background:var(--vibeui-icontile-013-bg);
border-radius:var(--vibeui-icontile-013-radius);
font-family:var(--vibeui-icontile-013-font);
}
[data-vibeui-block="icontile-013"] [data-part="badge"]{
position:relative;display:flex;flex-direction:column;align-items:center;
}
[data-vibeui-block="icontile-013"] [data-part="ribbon"]{
display:flex;justify-content:center;gap:0.375rem;margin-top:-0.5rem;
}
[data-vibeui-block="icontile-013"] [data-part="tail"]{
width:0.75rem;height:1.375rem;
/* Лента насыщенная в обеих темах: это металл награды, а не подложка. */
background:oklch(0.55 0.16 var(--vibeui-icontile-013-hue));
clip-path:polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%);
}
[data-vibeui-block="icontile-013"] [data-part="tail"][data-side="right"]{
transform:scaleX(-1);
}
[data-vibeui-block="icontile-013"] [data-part="circle"]{
position:relative;z-index:1;display:grid;place-items:center;flex:none;
width:var(--vibeui-icontile-013-size);height:var(--vibeui-icontile-013-size);
border-radius:50%;
background:light-dark(oklch(0.9 0.06 var(--vibeui-icontile-013-hue)),oklch(0.34 0.065 var(--vibeui-icontile-013-hue)));
color:light-dark(oklch(0.36 0.12 var(--vibeui-icontile-013-hue)),oklch(0.88 0.063 var(--vibeui-icontile-013-hue)));
box-shadow:inset 0 0 0 2px oklch(1 0 0 / 0.6);
}
[data-vibeui-block="icontile-013"] [data-part="circle"] svg{width:52%;height:52%}
[data-vibeui-block="icontile-013"] [data-part="sr"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="icontile-013"] [data-part="label"]{
display:block;margin:0.5rem 0 0;font-size:0.8125rem;font-weight:600;
color:var(--vibeui-icontile-013-fg);text-align:center;max-width:12ch;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="icontile-013"][data-tier="bronze"]{--vibeui-icontile-013-hue:35}
[data-vibeui-block="icontile-013"][data-tier="silver"]{--vibeui-icontile-013-hue:265}
[data-vibeui-block="icontile-013"][data-tier="gold"]{--vibeui-icontile-013-hue:75}
`

function Icontile013Icon({
  icon,
}: {
  icon: NonNullable<Icontile013Props["icon"]>
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

  if (icon === "star") {
    return (
      <svg {...shared}>
        <path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7L12 3Z" />
      </svg>
    )
  }

  if (icon === "medal") {
    return (
      <svg {...shared}>
        <circle cx="12" cy="15" r="6" />
        <path d="M9 9.5 6 3h3l3 5M15 9.5 18 3h-3l-3 5" />
      </svg>
    )
  }

  return (
    <svg {...shared}>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5H4v1a4 4 0 0 0 4 4M17 5h3v1a4 4 0 0 1-4 4" />
      <path d="M12 13v3M9 20h6M10 17h4v3h-4z" />
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
 * Плитка достижения: иконка в круге, симметричная лента из двух хвостов
 * под ним и подпись. Металл и цвет ленты выводятся из tier.
 * Один файл, ноль зависимостей, собственная палитра.
 */
const TIER_TEXT: Record<NonNullable<Icontile013Props["tier"]>, string> = {
  bronze: "бронза",
  silver: "серебро",
  gold: "золото",
}

export function Icontile013({
  icon = "trophy",
  label = "Первая интеграция",
  tier = "gold",
  tierText = TIER_TEXT,
  background = "",
  className,
  style,
  ...props
}: Icontile013Props) {
  // Поля появляются вместе с подложкой: без неё плитка лежит прямо на
  // странице, и лишние отступы по краям ей только мешают.
  const palette = {
    ...(background
      ? {
          "--vibeui-icontile-013-bg": background,
          "--vibeui-icontile-013-pad": "0.875rem 1.25rem",
          "--vibeui-icontile-013-radius": "0.875rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-icontile-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="icon-tile"
        data-vibeui-block="icontile-013"
        data-tier={tier}
        className={className}
        style={palette}
      >
        <span data-part="badge">
          <span data-part="circle">
            <Icontile013Icon icon={icon} />
            {/* Ступень различается только оттенком металла, поэтому её имя
                живёт в скрытой подписи: подпись под кругом называет само
                достижение, а ступень иначе осталась бы неназванной. */}
            <span data-part="sr">{tierText[tier]}</span>
          </span>
          <span data-part="ribbon" aria-hidden="true">
            <span data-part="tail" data-side="left" />
            <span data-part="tail" data-side="right" />
          </span>
        </span>
        <span data-part="label">{label}</span>
      </div>
    </>
  )
}
