import type { ComponentProps, CSSProperties } from "react"

export type Card172Row = {
  id: string
  time: string
  event: string
  source: string
  weight: number
}

export type Card172Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  countText?: string
  rows?: Card172Row[]
  progressLabel?: string
  percent?: number
  visible?: Card172Row[]
  accent?: string
  className?: string
  style?: CSSProperties
}

const EVENTS = [
  "Заказ оплачен",
  "Возврат оформлен",
  "Скидка применена",
  "Чек аннулирован",
  "Заказ собран",
  "Доставка назначена",
]

const SOURCES = ["касса-1", "касса-2", "терминал", "самовывоз", "маркетплейс"]

const DEFAULT_ROWS: Card172Row[] = Array.from(
  { length: 48 },
  (_, index) => ({
    id: `l${index + 1}`,
    time: `12:${String(59 - index).padStart(2, "0")}`,
    event: EVENTS[index % EVENTS.length],
    source: SOURCES[index % SOURCES.length],
    weight: 120 + ((index * 37) % 880),
  }),
)

// Часть блока datagrid-025, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-172"]){
--vibeui-card-172-accent:light-dark(oklch(0.28 0 0),oklch(0.903 0 0));
--vibeui-card-172-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-card-172-dur-2:180ms;
--vibeui-card-172-muted:color-mix(in oklab,var(--vibeui-card-172-fg) 68%,transparent);
--vibeui-card-172-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-172"]{color-scheme:dark}
[data-vibeui-block="card-172"]{box-sizing:border-box}
[data-vibeui-block="card-172"] *{box-sizing:border-box}
[data-vibeui-block="card-172"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem 0.625rem;border-bottom:1px solid var(--vibeui-card-172-border);}
[data-vibeui-block="card-172"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="card-172"] [data-part="count"]{margin:0;font-size:0.75rem;color:var(--vibeui-card-172-muted)}
[data-vibeui-block="card-172"] [data-part="track"]{flex:0 0 100%;height:0.25rem;border-radius:999px;margin-top:0.125rem;
background:var(--vibeui-card-172-border);overflow:hidden;}
[data-vibeui-block="card-172"] [data-part="fill"]{display:block;height:100%;border-radius:999px;
width:var(--vibeui-datagrid-025-progress,0%);background:var(--vibeui-card-172-accent);
transition:width var(--vibeui-card-172-dur-2) ease;color:oklch(from var(--vibeui-card-172-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-172"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Бесконечная прокрутка»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card172({
  heading = "Лента событий кассы",
  countText = "Загружено {shown} из {total}",
  rows = DEFAULT_ROWS,
  progressLabel = "Доля загруженных строк",
  percent = 0,
  visible = [],
  accent,
  className,
  style,
  ...props
}: Card172Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-172-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-172" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-172"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <p data-part="count" role="status" aria-live="polite">
          {countText
            .replace("{shown}", String(visible.length))
            .replace("{total}", String(rows.length))}
        </p>
        <span
          data-part="track"
          role="progressbar"
          aria-label={progressLabel}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span data-part="fill" />
        </span>
      </div>
    </>
  )
}
