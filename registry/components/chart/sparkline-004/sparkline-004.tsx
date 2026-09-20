import type { ComponentProps, CSSProperties } from "react"

export type Sparkline004Props = Omit<ComponentProps<"span">, "children"> & {
  /**
   * Исходы подряд: 1 — успех, −1 — провал, 0 — ничья или пропуск.
   * Имя не results: так называется устаревший HTML-атрибут, и типы React
   * сузили бы его до числа.
   */
  outcomes?: number[]
  label?: string
  /** Подписи в подвале: {wins}, {losses} и {total} подставляются. */
  summaryTemplate?: string
  /** Подпись для диктора: {label}, {wins}, {losses} и {total}. */
  ariaTemplate?: string
  /** Цвет успеха. Провал берёт свой цвет из палитры. */
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: ряд исходов, а не величин. Столбик вверх — получилось,
// вниз — нет, и вопрос к такому ряду один: как часто и где подряд. Высоту
// столбики не несут намеренно: любая разница в высоте читалась бы как
// «сильнее получилось», а такого смысла у исхода нет.
//
// Нулевая линия проходит посередине и отделяет успехи от провалов — без неё
// ряд превращается в набор чёрточек без опоры.
const STYLES = `
:where([data-vibeui-block="sparkline-004"]){
--vibeui-sparkline-004-bg:transparent;
--vibeui-sparkline-004-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-sparkline-004-muted:color-mix(in oklab,var(--vibeui-sparkline-004-fg) 62%,transparent);
--vibeui-sparkline-004-rule:light-dark(oklch(0.88 0 265),oklch(0.36 0 265));
--vibeui-sparkline-004-accent:light-dark(oklch(0.55 0.15 150),oklch(0.75 0.17 150));
--vibeui-sparkline-004-loss:light-dark(oklch(0.55 0.19 25),oklch(0.74 0.16 25));
--vibeui-sparkline-004-draw:color-mix(in oklab,var(--vibeui-sparkline-004-fg) 32%,transparent);
--vibeui-sparkline-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sparkline-004"]{color-scheme:dark}
[data-vibeui-block="sparkline-004"]{
display:inline-flex;flex-direction:column;gap:0.375rem;
min-width:min(100%,9rem);box-sizing:border-box;
background:var(--vibeui-sparkline-004-bg);
color:var(--vibeui-sparkline-004-fg);
font-family:var(--vibeui-sparkline-004-font);
}
[data-vibeui-block="sparkline-004"] *{box-sizing:border-box}
[data-vibeui-block="sparkline-004"] [data-part="label"]{
font-size:0.75rem;color:var(--vibeui-sparkline-004-muted);
}
/* Два ряда одинаковой высоты: верхний для успехов, нижний для провалов.
   Столбик просто занимает свой ряд, поэтому никаких сдвигов считать не нужно. */
[data-vibeui-block="sparkline-004"] [data-part="row"]{
position:relative;
display:grid;gap:2px 2px;
grid-template-columns:repeat(var(--vibeui-sparkline-004-count,16),minmax(0,1fr));
grid-template-rows:1fr 1fr;
block-size:1.75rem;
}
/* Нулевая линия: она отделяет успехи от провалов и держит ряд. */
[data-vibeui-block="sparkline-004"] [data-part="row"]::before{
content:"";position:absolute;inset-inline:0;inset-block-start:50%;
block-size:1px;background:var(--vibeui-sparkline-004-rule);
}
[data-vibeui-block="sparkline-004"] [data-part="mark"]{
display:block;border-radius:9999px;block-size:calc(100% - 2px);
/* Отметка у́же своей ячейки: столбик во всю ширину читается как квадрат,
   а ряд исходов должен оставаться рядом штрихов. */
inline-size:min(100%,0.4375rem);justify-self:center;
/* Отметки появляются по очереди слева направо: ряд читается как история
   запусков, а не как готовая картинка. */
animation:vibeui-sparkline-004-pop 0.4s cubic-bezier(0.2,0.8,0.2,1) both;
animation-delay:calc(var(--step,0) * 30ms);
}
/* Скруглённая пилюля с градиентом: успех гуще у нулевой линии и светлеет
   кверху, провал — зеркально. Ряд перестаёт быть частоколом. */
[data-vibeui-block="sparkline-004"] [data-part="mark"][data-kind="win"]{
grid-row:1;align-self:end;transform-origin:bottom;
background:linear-gradient(0deg,
var(--vibeui-sparkline-004-accent),
color-mix(in oklab,var(--vibeui-sparkline-004-accent) 55%,transparent));
box-shadow:0 0.125rem 0.375rem -0.125rem color-mix(in oklab,var(--vibeui-sparkline-004-accent) 45%,transparent);
}
[data-vibeui-block="sparkline-004"] [data-part="mark"][data-kind="loss"]{
grid-row:2;align-self:start;transform-origin:top;
background:linear-gradient(180deg,
var(--vibeui-sparkline-004-loss),
color-mix(in oklab,var(--vibeui-sparkline-004-loss) 55%,transparent));
box-shadow:0 -0.125rem 0.375rem -0.125rem color-mix(in oklab,var(--vibeui-sparkline-004-loss) 45%,transparent);
}
@keyframes vibeui-sparkline-004-pop{from{transform:scaleY(0.2);opacity:0}to{transform:scaleY(1);opacity:1}}
/* Ничья — короткая чёрточка на самой линии: пропуск в ряду выглядел бы
   как отсутствие данных, а это другой смысл. */
[data-vibeui-block="sparkline-004"] [data-part="mark"][data-kind="draw"]{
grid-row:1 / -1;align-self:center;block-size:3px;
background:var(--vibeui-sparkline-004-draw);
}
[data-vibeui-block="sparkline-004"] [data-part="foot"]{
display:flex;gap:0.75rem;
font-size:0.6875rem;color:var(--vibeui-sparkline-004-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="sparkline-004"] [data-part="wins"]{color:var(--vibeui-sparkline-004-accent);font-weight:650}
[data-vibeui-block="sparkline-004"] [data-part="losses"]{color:var(--vibeui-sparkline-004-loss);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sparkline-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OUTCOMES = [1, 1, -1, 1, 1, 1, -1, -1, 1, 0, 1, 1, 1, -1, 1, 1]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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

function fillTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/**
 * Ряд исходов: столбик вверх — получилось, вниз — нет.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sparkline004({
  outcomes = DEFAULT_OUTCOMES,
  label = "Ночные сборки",
  summaryTemplate = "{wins} успешных, {losses} упавших из {total}",
  ariaTemplate = "{label}: {wins} успешных и {losses} упавших из {total}.",
  accent,
  background = "",
  className,
  style,
  ...props
}: Sparkline004Props) {
  const wins = outcomes.filter((outcome) => outcome > 0).length
  const losses = outcomes.filter((outcome) => outcome < 0).length

  const palette = {
    "--vibeui-sparkline-004-count": String(outcomes.length),
    ...(accent ? { "--vibeui-sparkline-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sparkline-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const totals = { label, wins, losses, total: outcomes.length }

  return (
    <>
      <style href="vibeui-sparkline-004" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="sparkline"
        data-vibeui-block="sparkline-004"
        className={className}
        style={palette}
      >
        <span data-part="label">{label}</span>
        <span
          data-part="row"
          role="img"
          aria-label={fillTemplate(ariaTemplate, totals)}
        >
          {outcomes.map((outcome, index) => (
            <span
              key={`${index}-${outcome}`}
              data-part="mark"
              data-kind={outcome > 0 ? "win" : outcome < 0 ? "loss" : "draw"}
              // Колонка задаётся явно: при заданном ряде автоматическое
              // размещение расставило бы столбики не по порядку исходов.
              style={{ gridColumn: index + 1, "--step": index } as CSSProperties}
            />
          ))}
        </span>
        <span data-part="foot">
          <span>
            <span data-part="wins">{wins}</span> ·{" "}
            <span data-part="losses">{losses}</span>
          </span>
          <span>{fillTemplate(summaryTemplate, totals)}</span>
        </span>
      </span>
    </>
  )
}
