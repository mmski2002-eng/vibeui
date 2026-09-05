import type { ComponentProps, CSSProperties } from "react"

export type Tooltip009Props = Omit<ComponentProps<"div">, "children"> & {
  tip?: string
  /** Задержка появления в секундах: защита от случайного пролёта курсора. */
  delay?: number
  labels?: string[]
  /** Пояснение под строкой кнопок: {delay} подставляется числом. */
  note?: string
  /** Показать подсказку средней кнопки принудительно: онбординг, отладка, витрина. */
  open?: boolean
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: подсказка появляется с задержкой, а прячется мгновенно.
// Задержка стоит только в правиле :hover, а базовое правило её обнуляет —
// поэтому пролёт курсора по строке кнопок не устраивает мигание подсказок.
const STYLES = `
:where([data-vibeui-block="tooltip-009"]){
--vibeui-tooltip-009-bg:transparent;
--vibeui-tooltip-009-fg:light-dark(oklch(0.25 0.014 265),oklch(0.93 0.005 265));
--vibeui-tooltip-009-muted:color-mix(in oklab,var(--vibeui-tooltip-009-fg) 68%,transparent);
--vibeui-tooltip-009-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-tooltip-009-face:light-dark(oklch(0.98 0.003 265),oklch(0.29 0.012 265));
--vibeui-tooltip-009-tip:light-dark(oklch(0.24 0.014 265),oklch(0.36 0.014 265));
--vibeui-tooltip-009-accent:light-dark(oklch(0.57 0.17 265),oklch(0.72 0.16 265));
--vibeui-tooltip-009-delay:0.5s;
--vibeui-tooltip-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tooltip-009"]{color-scheme:dark}
[data-vibeui-block="tooltip-009"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:24rem;box-sizing:border-box;
padding:1.5rem 1.125rem 1.125rem;
border:1px solid var(--vibeui-tooltip-009-border);border-radius:1rem;
background:var(--vibeui-tooltip-009-bg);color:var(--vibeui-tooltip-009-fg);
font-family:var(--vibeui-tooltip-009-font);
}
[data-vibeui-block="tooltip-009"] [data-part="row"]{display:flex;gap:0.5rem;flex-wrap:wrap}
[data-vibeui-block="tooltip-009"] [data-part="item"]{position:relative;display:inline-flex}
[data-vibeui-block="tooltip-009"] [data-part="button"]{
appearance:none;cursor:pointer;
height:2.125rem;padding:0 0.8125rem;border-radius:0.625rem;
border:1px solid var(--vibeui-tooltip-009-border);
background:var(--vibeui-tooltip-009-face);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:620;
}
[data-vibeui-block="tooltip-009"] [data-part="button"]:focus-visible{outline:2px solid var(--vibeui-tooltip-009-accent);outline-offset:2px}
/* Базовое правило: скрытие без задержки. */
[data-vibeui-block="tooltip-009"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.5rem);left:50%;z-index:20;
width:max-content;max-width:12rem;
padding:0.375rem 0.5625rem;border-radius:0.5rem;
/* Обе ветки --tip тёмные — плашка подсказки тёмная всегда, поэтому подпись светлая без light-dark(). */
background:var(--vibeui-tooltip-009-tip);color:oklch(0.98 0.002 265);
font-size:0.75rem;line-height:1.4;
pointer-events:none;opacity:0;
transform:translate(-50%,0.25rem);
transition:opacity .12s ease 0s,transform .12s ease 0s;
}
[data-vibeui-block="tooltip-009"] [data-part="tip"]::after{
content:"";position:absolute;left:50%;bottom:-0.1875rem;
width:0.5rem;height:0.5rem;margin-left:-0.25rem;
background:inherit;transform:rotate(45deg);
}
/* Задержка живёт только в открытом состоянии: появление ждёт, уход — нет. */
[data-vibeui-block="tooltip-009"] [data-part="item"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-009"] [data-part="item"]:focus-within [data-part="tip"]{
opacity:1;transform:translate(-50%,0);
transition-delay:var(--vibeui-tooltip-009-delay);
}
/* Витринный режим: раскрыта ровно одна подсказка — три сразу перекрыли бы
   друг друга. Средняя кнопка выбрана потому, что её плашка помещается внутрь
   карточки, у крайних она вылезла бы за край. Задержки здесь нет: показ
   не по наведению. */
[data-vibeui-block="tooltip-009"][data-open="true"] [data-part="item"]:nth-of-type(2) [data-part="tip"]{
opacity:1;transform:translate(-50%,0);transition-delay:0s;
}
[data-vibeui-block="tooltip-009"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-tooltip-009-muted);
}
[data-vibeui-block="tooltip-009"] [data-part="note"] b{color:var(--vibeui-tooltip-009-fg);font-weight:650;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LABELS = ["Копировать", "Дублировать", "Архивировать"]

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
 * Подсказка с задержкой появления и мгновенным скрытием.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip009({
  tip = "Действие над выбранной строкой",
  delay = 0.5,
  labels = DEFAULT_LABELS,
  open = false,
  note = "Задержка появления — {delay} с. Проведите курсором по строке: подсказки не мигают, потому что скрытие происходит без задержки.",
  background = "",
  className,
  style,
  ...props
}: Tooltip009Props) {
  const [noteBefore, noteAfter] = note.split("{delay}")
  const palette = {
    "--vibeui-tooltip-009-delay": `${delay}s`,
    ...(background
      ? {
          "--vibeui-tooltip-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tooltip-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tooltip"
        data-vibeui-block="tooltip-009"
        data-open={open || undefined}
        className={className}
        style={palette}
      >
        <div data-part="row">
          {labels.map((label, index) => (
            <span data-part="item" key={label}>
              <button
                data-part="button"
                type="button"
                aria-describedby={`vibeui-tooltip-009-${index}`}
              >
                {label}
              </button>
              <span
                data-part="tip"
                role="tooltip"
                id={`vibeui-tooltip-009-${index}`}
              >
                {tip}
              </span>
            </span>
          ))}
        </div>
        <p data-part="note">
          {noteBefore}
          <b>{delay}</b>
          {noteAfter}
        </p>
      </div>
    </>
  )
}
