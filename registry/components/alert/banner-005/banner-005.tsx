import type { ComponentProps, CSSProperties } from "react"

export type Banner005Props = Omit<ComponentProps<"div">, "children"> & {
  /** Израсходовано и включено в тариф: полоса считается из этих двух чисел. */
  used?: number
  limit?: number
  unit?: string
  planLabel?: string
  actionLabel?: string
  /** Хвост счётчика: «{limit}» и «{unit}» подставляются. */
  counterTemplate?: string
  /** Подпись полосы для скринридера: «{percent}» подставляется. */
  progressTemplate?: string
  /** Пояснение под полосой по состоянию: calm, tight, over. */
  noteText?: Record<string, string>
  /** Локаль форматирования чисел. */
  locale?: string
  /** Тон полосы в спокойном состоянии: tight и over переключаются сами. */
  tone?: string
  /** Подложка карточки. Пусто — остаётся собственная. */
  background?: string
}

// Идея компонента: полоса тарифного лимита, которая показывает цифру, а не
// пугает словами. Заполнение считается из двух чисел, и цвет переключается
// сам: до 90 процентов — спокойный, дальше — предупреждающий.
//
// Тема берётся из color-scheme окружения через light-dark(): тёмная ветка не
// инверсия светлой, дорожка и граница в ней светлее подложки.
const STYLES = `
:where([data-vibeui-block="banner-005"]){
--vibeui-banner-005-bg:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-banner-005-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-banner-005-muted:color-mix(in oklab,var(--vibeui-banner-005-fg) 68%,transparent);
--vibeui-banner-005-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-banner-005-track:light-dark(oklch(0.93 0 265),oklch(0.33 0 265));
--vibeui-banner-005-calm:light-dark(oklch(0.6 0.15 250),oklch(0.72 0.14 250));
--vibeui-banner-005-tone:var(--vibeui-banner-005-calm);
--vibeui-banner-005-on-tone:oklch(from var(--vibeui-banner-005-tone) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-banner-005-ratio:0;
--vibeui-banner-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="banner-005"]{color-scheme:dark}
[data-vibeui-block="banner-005"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;
font-family:var(--vibeui-banner-005-font);color:var(--vibeui-banner-005-fg);
}
[data-vibeui-block="banner-005"][data-state="tight"]{--vibeui-banner-005-tone:light-dark(oklch(0.68 0.15 75),oklch(0.8 0.15 78))}
[data-vibeui-block="banner-005"][data-state="over"]{--vibeui-banner-005-tone:light-dark(oklch(0.58 0.2 25),oklch(0.71 0.18 25))}
[data-vibeui-block="banner-005"] [data-part="shell"]{
display:grid;grid-template-columns:1fr auto;gap:0.5rem 1rem;align-items:center;
box-sizing:border-box;padding:0.9375rem 1.125rem;
border:1px solid var(--vibeui-banner-005-border);border-radius:1rem;
background:var(--vibeui-banner-005-bg);
}
[data-vibeui-block="banner-005"] [data-part="head"]{display:flex;align-items:baseline;gap:0.5rem;flex-wrap:wrap;min-width:0}
[data-vibeui-block="banner-005"] [data-part="plan"]{
flex:none;padding:0.0625rem 0.4375rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-banner-005-tone) 16%,transparent);
color:var(--vibeui-banner-005-tone);
font-size:0.6875rem;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;
}
[data-vibeui-block="banner-005"] [data-part="counter"]{font-size:0.9375rem;font-weight:640;font-variant-numeric:tabular-nums}
[data-vibeui-block="banner-005"] [data-part="counter"] span{color:var(--vibeui-banner-005-muted);font-weight:500}
/* Полоса считается из двух чисел: разметка не знает про проценты. */
[data-vibeui-block="banner-005"] [data-part="track"]{
grid-column:1 / -1;position:relative;overflow:hidden;
height:0.375rem;border-radius:9999px;background:var(--vibeui-banner-005-track);
}
[data-vibeui-block="banner-005"] [data-part="fill"]{
position:absolute;inset:0 auto 0 0;border-radius:inherit;
width:calc(var(--vibeui-banner-005-ratio) * 1%);
background:var(--vibeui-banner-005-tone);
transition:width .3s ease,background-color .3s ease;
}
[data-vibeui-block="banner-005"] [data-part="note"]{
grid-column:1 / -1;margin:0;font-size:0.875rem;line-height:1.45;color:var(--vibeui-banner-005-muted);
}
[data-vibeui-block="banner-005"] [data-part="action"]{
appearance:none;cursor:pointer;border:0;
min-height:2.125rem;padding:0.25rem 0.9375rem;display:inline-flex;align-items:center;justify-content:center;border-radius:0.625rem;
background:var(--vibeui-banner-005-tone);color:var(--vibeui-banner-005-on-tone);
font:inherit;font-size:0.875rem;font-weight:650;white-space:nowrap;
transition:filter .16s ease;
}
[data-vibeui-block="banner-005"] [data-part="action"]:hover{filter:brightness(1.08)}
[data-vibeui-block="banner-005"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-banner-005-tone);outline-offset:2px}
@container (max-width: 26rem){
[data-vibeui-block="banner-005"] [data-part="shell"]{grid-template-columns:1fr}
[data-vibeui-block="banner-005"] [data-part="action"]{width:100%}
}
@container (min-width: 32rem){
[data-vibeui-block="banner-005"] [data-part="shell"]{padding:1.0625rem 1.125rem}
[data-vibeui-block="banner-005"] [data-part="counter"]{font-size:1rem}
[data-vibeui-block="banner-005"] [data-part="note"]{font-size:0.9375rem}
[data-vibeui-block="banner-005"] [data-part="action"]{font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-005"] *{animation:none!important;transition:none!important}}
`

/** Пояснение под полосой: русские строки по умолчанию, проект ставит свои. */
const NOTE_TEXT: Record<string, string> = {
  calm: "Лимит обновится первого числа. До этого момента остаток не переносится.",
  /* У «почти исчерпан» свой текст: иначе это состояние отличалось бы от
     спокойного только цветом полосы и до скринридера не доходило. */
  tight:
    "Лимит почти исчерпан: осталось меньше десятой части. Обновится первого числа.",
  over: "Лимит исчерпан: новые запросы отклоняются до начала следующего периода.",
}

function fill(template: string, values: Record<string, string>): string {
  return template.replace(
    /\{(\w+)\}/g,
    (placeholder, key: string) => values[key] ?? placeholder,
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
 * Полоса тарифного лимита: заполнение из двух чисел и кнопка апгрейда.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner005({
  used = 9200,
  limit = 10000,
  unit = "запросов",
  planLabel = "Тариф «Старт»",
  actionLabel = "Повысить тариф",
  counterTemplate = "из {limit} {unit}",
  progressTemplate = "Израсходовано {percent} процентов лимита",
  noteText = NOTE_TEXT,
  locale = "ru-RU",
  tone,
  background = "",
  className,
  style,
  ...props
}: Banner005Props) {
  const safeLimit = limit > 0 ? limit : 1
  const ratio = Math.min(100, Math.round((used / safeLimit) * 100))
  const state = used >= safeLimit ? "over" : ratio >= 90 ? "tight" : "calm"
  const palette = {
    "--vibeui-banner-005-ratio": ratio,
    ...(tone ? { "--vibeui-banner-005-calm": tone } : null),
    ...(background
      ? {
          "--vibeui-banner-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-banner-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="banner"
        data-vibeui-block="banner-005"
        data-state={state}
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="head">
            <span data-part="plan">{planLabel}</span>
            <span data-part="counter">
              {used.toLocaleString(locale)}{" "}
              <span>
                {fill(counterTemplate, {
                  limit: limit.toLocaleString(locale),
                  unit,
                })}
              </span>
            </span>
          </div>
          <button data-part="action" type="button">
            {actionLabel}
          </button>
          <div
            data-part="track"
            role="progressbar"
            aria-valuenow={ratio}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={fill(progressTemplate, { percent: String(ratio) })}
          >
            <span data-part="fill" />
          </div>
          <p data-part="note">{noteText[state] ?? NOTE_TEXT[state]}</p>
        </div>
      </div>
    </>
  )
}
