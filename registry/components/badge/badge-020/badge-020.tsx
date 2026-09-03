import type { ComponentProps, CSSProperties } from "react"

export type Badge020Props = Omit<ComponentProps<"span">, "children"> & {
  days?: number
  warnAt?: number
  /** Формулировки состояний: {days} подставляется числом со словом. */
  stateText?: Record<string, string>
  /** Формы слова «день» по ключам Intl.PluralRules. */
  dayForms?: Record<string, string>
  /** Локаль склонения и форматирования числа. */
  locale?: string
  /** Пусто — плашка держит собственную заливку состояния. */
  background?: string
}

// Идея компонента: срок, у которого меняется не только тон, но и формулировка.
// «Ещё 21 день», «истекает через 3 дня», «истекает сегодня» и «просрочено на
// 2 дня» — четыре разные фразы, поэтому состояние понятно и в чёрно-белом
// списке, и вслух в скринридере. Число склоняется по русским правилам:
// «1 день», «3 дня», «11 дней».
const STYLES = `
:where([data-vibeui-block="badge-020"]){
--vibeui-badge-020-hue:265;
--vibeui-badge-020-chroma:0.02;
--vibeui-badge-020-bg:light-dark(oklch(0.97 calc(var(--vibeui-badge-020-chroma) * 0.4) var(--vibeui-badge-020-hue)),oklch(0.28 calc(var(--vibeui-badge-020-chroma) * 0.7) var(--vibeui-badge-020-hue)));
--vibeui-badge-020-fg:light-dark(oklch(0.36 var(--vibeui-badge-020-chroma) var(--vibeui-badge-020-hue)),oklch(0.92 calc(var(--vibeui-badge-020-chroma) * 0.5) var(--vibeui-badge-020-hue)));
--vibeui-badge-020-border:light-dark(oklch(0.89 calc(var(--vibeui-badge-020-chroma) * 0.6) var(--vibeui-badge-020-hue)),oklch(0.42 calc(var(--vibeui-badge-020-chroma) * 0.9) var(--vibeui-badge-020-hue)));
--vibeui-badge-020-mark:light-dark(oklch(0.55 calc(var(--vibeui-badge-020-chroma) * 1.4) var(--vibeui-badge-020-hue)),oklch(0.76 calc(var(--vibeui-badge-020-chroma) * 1.1) var(--vibeui-badge-020-hue)));
--vibeui-badge-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-020"]{color-scheme:dark}
[data-vibeui-block="badge-020"]{
display:inline-flex;align-items:center;gap:0.375rem;
box-sizing:border-box;height:1.75rem;padding:0 0.6875rem;
border:1px solid var(--vibeui-badge-020-border);border-radius:9999px;
background:var(--vibeui-badge-020-bg);color:var(--vibeui-badge-020-fg);
font-family:var(--vibeui-badge-020-font);font-size:0.75rem;font-weight:600;line-height:1;
font-variant-numeric:tabular-nums;vertical-align:middle;
}
[data-vibeui-block="badge-020"][data-state="soon"]{--vibeui-badge-020-hue:75;--vibeui-badge-020-chroma:0.09}
[data-vibeui-block="badge-020"][data-state="today"]{--vibeui-badge-020-hue:50;--vibeui-badge-020-chroma:0.14}
[data-vibeui-block="badge-020"][data-state="expired"]{--vibeui-badge-020-hue:25;--vibeui-badge-020-chroma:0.16}
[data-vibeui-block="badge-020"] [data-part="icon"]{
width:0.875rem;height:0.875rem;flex:none;color:var(--vibeui-badge-020-mark);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-020"] *{animation:none!important;transition:none!important}}
`

/** Формулировки по умолчанию — русские: установленный файл не меняет язык. */
const STATE_TEXT: Record<string, string> = {
  expired: "Просрочено на {days}",
  today: "Истекает сегодня",
  soon: "Истекает через {days}",
  calm: "Ещё {days}",
}

/** Склонение считает Intl: правила языка не зашиты в компонент. */
const DAY_FORMS: Record<string, string> = {
  one: "день",
  few: "дня",
  many: "дней",
  other: "дня",
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
 * Неверная локаль из пропа не должна ронять страницу-хост: Intl бросает на
 * ней RangeError, поэтому неразбираемое значение откатываем на дефолтное.
 */
function safeLocale(value: string, fallback: string) {
  try {
    Intl.PluralRules.supportedLocalesOf(value)
    return value
  } catch {
    return fallback
  }
}

/**
 * Плашка срока: тон и формулировка меняются по порогу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge020({
  days = 3,
  warnAt = 7,
  stateText = STATE_TEXT,
  dayForms = DAY_FORMS,
  locale = "ru",
  background = "",
  className,
  style,
  ...props
}: Badge020Props) {
  const left = Math.round(days)
  const overdue = Math.abs(left)

  const state =
    left < 0
      ? "expired"
      : left === 0
        ? "today"
        : left <= warnAt
          ? "soon"
          : "calm"

  const rule = new Intl.PluralRules(safeLocale(locale, "ru")).select(overdue)
  const counted = `${overdue} ${dayForms[rule] ?? dayForms.other ?? ""}`.trim()
  const template = stateText[state] ?? STATE_TEXT[state]
  const text = template.replace("{days}", counted)

  const palette = {
    ...(background
      ? {
          "--vibeui-badge-020-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-020" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-020"
        data-state={state}
        className={className}
        style={palette}
      >
        <svg
          data-part="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 7v5.2l3.2 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        {text}
      </span>
    </>
  )
}
