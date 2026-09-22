import type { CSSProperties } from "react"
import { Card146 } from "@/registry/components/card/card-146/card-146"

export type Comparison016Row = {
  label: string
  /** Значение новой версии и прошлой — как текст. */
  current: string
  previous: string
  /** Заполнение полосок 0–100: новая и прошлая. */
  currentBar?: number
  previousBar?: number
  /** Появилось только в новой версии. */
  isNew?: boolean
}

export type Comparison016Props = {
  eyebrow?: string
  title?: string
  lede?: string
  currentName?: string
  currentNote?: string
  previousName?: string
  previousNote?: string
  rows?: readonly Comparison016Row[]
  /** aria таблицы и метка «новое». */
  tableLabel?: string
  newLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Сравнение новой версии гаджета с прошлой: строки-характеристики, в
// каждой две полоски-отношения — прошлая версия приглушённая, новая
// акцентная — и значения моно. Полоски вырастают при загрузке (scaleX
// с задержкой по строке), новые функции помечены «новое», у колонки новой
// версии акцентная рамка. На узком — строка складывается в карточку.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="comparison-016"]){
--vibeui-comparison-016-bg:light-dark(#ffffff,#0a0a0a);
--vibeui-comparison-016-fg:light-dark(#111111,#f2ede4);
--vibeui-comparison-016-accent:light-dark(#111111,#f2ede4);
--vibeui-comparison-016-on-accent:oklch(from var(--vibeui-comparison-016-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-comparison-016-muted:color-mix(in oklab,var(--vibeui-comparison-016-fg) 60%,var(--vibeui-comparison-016-bg));
--vibeui-comparison-016-line:color-mix(in oklab,var(--vibeui-comparison-016-fg) 12%,transparent);
--vibeui-comparison-016-glass:color-mix(in oklab,var(--vibeui-comparison-016-fg) 5%,transparent);
--vibeui-comparison-016-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-comparison-016-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-comparison-016-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="comparison-016"]{color-scheme:dark}
:where([data-vibeui-block="comparison-016"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="comparison-016"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="comparison-016"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-comparison-016-bg);color:var(--vibeui-comparison-016-fg);font-family:var(--vibeui-comparison-016-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="comparison-016"] *{box-sizing:border-box}
[data-vibeui-block="comparison-016"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="comparison-016"] [data-part="head"]{max-width:44rem;margin:0 0 2.5rem}
[data-vibeui-block="comparison-016"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-comparison-016-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-comparison-016-accent)}
[data-vibeui-block="comparison-016"] [data-part="title"]{margin:0;font-family:var(--vibeui-comparison-016-display);font-weight:900;font-size:clamp(2rem,5.4cqi,4rem);line-height:1;letter-spacing:-.03em;text-wrap:balance}
[data-vibeui-block="comparison-016"] [data-part="lede"]{margin:1rem 0 0;max-width:34rem;font-size:1.05rem;color:var(--vibeui-comparison-016-muted)}
[data-vibeui-block="comparison-016"] [data-part="table"]{display:grid;gap:.6rem}
[data-vibeui-block="comparison-016"] [data-part="legend"]{display:none;grid-template-columns:1.2fr 1fr 1fr;gap:1rem;padding:0 1.2rem .6rem}
[data-vibeui-block="comparison-016"] [data-part="legend"] div{display:grid;gap:.15rem}
[data-vibeui-block="comparison-016"] [data-part="legend"] b{font-family:var(--vibeui-comparison-016-display);font-weight:700;font-size:1.05rem}
[data-vibeui-block="comparison-016"] [data-part="legend"] span{font-family:var(--vibeui-comparison-016-mono);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-comparison-016-muted)}
@keyframes vibeui-comparison-016-in{from{opacity:0;transform:translateY(.8rem)}}
@keyframes vibeui-comparison-016-grow{from{transform:scaleX(0)}}
@container (min-width: 52rem){[data-vibeui-block="comparison-016"] [data-part="legend"]{display:grid}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="comparison-016"] *{animation:none!important;transition:none!important}}`

const DEFAULT_ROWS: Comparison016Row[] = [
  { label: "Яркость", current: "1 200 лм", previous: "800 лм", currentBar: 100, previousBar: 66 },
  { label: "Температура света", current: "2700–6500 K", previous: "2700–4000 K", currentBar: 100, previousBar: 34 },
  { label: "Длина рассвета", current: "5–60 мин", previous: "30 мин", currentBar: 100, previousBar: 50 },
  { label: "Динамик", current: "5 Вт, 360°", previous: "2 Вт", currentBar: 100, previousBar: 40 },
  { label: "Датчики", current: "CO₂, влажность, свет, тепло", previous: "только свет", currentBar: 100, previousBar: 25 },
  { label: "Управление жестом", current: "хлопок, касание", previous: "—", currentBar: 100, previousBar: 0, isNew: true },
  { label: "Matter / Thread", current: "есть", previous: "—", currentBar: 100, previousBar: 0, isNew: true },
  { label: "Шум", current: "0 дБ", previous: "18 дБ (вентилятор)", currentBar: 100, previousBar: 30 },
]

/** Сравнение с прошлой версией: полоски-отношения и метки «новое». */
export function Comparison016({
  eyebrow = "Сравнение",
  title = "Что изменилось со времён первого Луча",
  lede = "Мы разобрали 3 400 отзывов на первую версию. Всё, что просили, — здесь. Всё, на что жаловались, — нет.",
  currentName = "Луч 2",
  currentNote = "2026 · партия 2",
  previousName = "Луч 1",
  previousNote = "2023 · снят с производства",
  rows = DEFAULT_ROWS,
  tableLabel = "{current} против {previous}",
  newLabel = "новое",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Comparison016Props) {
  const palette = {
    ...(accent ? { "--vibeui-comparison-016-accent": accent } : null),
    ...(ink ? { "--vibeui-comparison-016-fg": ink } : null),
    ...(background ? { "--vibeui-comparison-016-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-comparison-016" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="comparison-016" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="table" role="table" aria-label={tableLabel.replace("{current}", currentName).replace("{previous}", previousName)}>
            <div data-part="legend" role="row" aria-hidden="true">
              <div />
              <div data-current="">
                <b>{currentName}</b>
                <span>{currentNote}</span>
              </div>
              <div>
                <b>{previousName}</b>
                <span>{previousNote}</span>
              </div>
            </div>
            {rows.map((row, index) => (
              <Card146 key={row.label} data-part="row" label={row.label} isNew={row.isNew} current={row.current} currentBar={row.currentBar} previous={row.previous} previousBar={row.previousBar} newLabel={newLabel} currentName={currentName} previousName={previousName} style={{ ["--vibeui-comparison-016-i" as string]: index }} accent={accent} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
