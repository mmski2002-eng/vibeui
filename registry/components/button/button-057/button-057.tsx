import type { ComponentProps, CSSProperties } from "react"

export type Button057Props = ComponentProps<"button"> & {
  /** Число просмотров: большие значения сокращаются до «тыс.» и «млн». */
  count?: number
  /** Динамика за период: столбики рисуются из этих значений. */
  trend?: number[]
  /** Сокращения разрядов: компонент несёт русские, проект подставляет свои. */
  unitText?: Record<string, string>
  /** Подсказка с полным числом. {count} подставляется отформатированным. */
  titleText?: string
  /** Локаль форматирования числа: разделители разрядов и дробной части. */
  locale?: string
  accent?: string
  /** Поверхность кнопки. Пусто — своя, из палитры. */
  background?: string
}

// Идея компонента: кнопка-показатель. Она открывает подробную статистику,
// но уже в свёрнутом виде несёт число и форму динамики — столбики нормируются
// по максимуму массива, поэтому одинаково читаются и на десятках, и на
// миллионах. Полное число остаётся в title и aria-label: сокращение врёт.
const STYLES = `
:where([data-vibeui-block="button-057"]){
--vibeui-button-057-surface:light-dark(oklch(1 0 0),oklch(0.24 0.014 265));
--vibeui-button-057-border:light-dark(oklch(0.9 0.006 265),oklch(0.41 0.014 265));
--vibeui-button-057-fg:light-dark(oklch(0.25 0.02 265),oklch(0.94 0.008 265));
--vibeui-button-057-muted:color-mix(in oklab,var(--vibeui-button-057-fg) 68%,transparent);
--vibeui-button-057-accent:light-dark(oklch(0.55 0.16 210),oklch(0.76 0.13 210));
--vibeui-button-057-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-057"]{color-scheme:dark}
[data-vibeui-block="button-057"]{
appearance:none;cursor:pointer;box-sizing:border-box;
display:inline-flex;align-items:center;gap:0.625rem;
height:2.75rem;padding:0 0.875rem;border-radius:0.75rem;
border:1px solid var(--vibeui-button-057-border);
background:var(--vibeui-button-057-surface);color:var(--vibeui-button-057-fg);
font-family:var(--vibeui-button-057-font);font-size:0.875rem;font-weight:600;line-height:1;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="button-057"]:hover:not(:disabled){
border-color:var(--vibeui-button-057-accent);
background:color-mix(in oklab,var(--vibeui-button-057-accent) 5%,var(--vibeui-button-057-surface));
}
[data-vibeui-block="button-057"]:focus-visible{outline:2px solid var(--vibeui-button-057-accent);outline-offset:2px}
[data-vibeui-block="button-057"]:disabled{cursor:not-allowed;opacity:.55}
/* Глаз: окружность-веко и зрачок. */
[data-vibeui-block="button-057"] [data-part="eye"]{position:relative;flex:none;width:1.125rem;height:1.125rem}
[data-vibeui-block="button-057"] [data-part="eye"]::before{
content:"";position:absolute;left:0;top:50%;width:1.125rem;height:0.75rem;
margin-top:-0.375rem;box-sizing:border-box;
border:1.5px solid var(--vibeui-button-057-accent);border-radius:0.5625rem 0.5625rem;
}
[data-vibeui-block="button-057"] [data-part="eye"]::after{
content:"";position:absolute;left:50%;top:50%;width:0.375rem;height:0.375rem;
margin:-0.1875rem 0 0 -0.1875rem;border-radius:50%;
background:var(--vibeui-button-057-accent);
}
[data-vibeui-block="button-057"] [data-part="count"]{
font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="button-057"] [data-part="unit"]{
color:var(--vibeui-button-057-muted);font-size:0.75rem;font-weight:500;
}
/* Столбики динамики: высота приходит из данных, ширина общая. */
[data-vibeui-block="button-057"] [data-part="spark"]{
display:flex;align-items:flex-end;gap:2px;height:1.125rem;margin-left:0.125rem;
}
[data-vibeui-block="button-057"] [data-part="spark"] i{
display:block;width:3px;border-radius:1.5px;
background:color-mix(in oklab,var(--vibeui-button-057-accent) 45%,transparent);
transition:background-color .16s ease;
}
[data-vibeui-block="button-057"] [data-part="spark"] i:last-child{background:var(--vibeui-button-057-accent)}
[data-vibeui-block="button-057"]:hover [data-part="spark"] i{background:var(--vibeui-button-057-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-057"] *{animation:none!important;transition:none!important}}
`

const UNIT_TEXT: Record<string, string> = {
  thousand: "тыс.",
  million: "млн",
}

// Разделитель дробной части приходит из локали, а не зашит запятой: иначе
// английская витрина показала бы «12,4K».
function compact(
  value: number,
  locale: string,
  unitText: Record<string, string>,
) {
  const fraction = (part: number) =>
    part.toLocaleString(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })

  if (value >= 1_000_000)
    return {
      text: fraction(value / 1_000_000),
      unit: unitText.million ?? UNIT_TEXT.million,
    }
  if (value >= 1000)
    return {
      text: fraction(value / 1000),
      unit: unitText.thousand ?? UNIT_TEXT.thousand,
    }

  return { text: value.toLocaleString(locale), unit: "" }
}

/**
 * Ветка темы для заданной поверхности. Без неё светлая заливка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Кнопка со счётчиком просмотров и столбиками динамики.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button057({
  count = 12400,
  trend = [3, 5, 4, 7, 6, 9, 8, 12],
  unitText = UNIT_TEXT,
  titleText = "{count} просмотров",
  locale = "ru-RU",
  accent,
  background = "",
  type = "button",
  className,
  style,
  children = "Просмотры",
  ...props
}: Button057Props) {
  const short = compact(count, locale, unitText)
  const peak = Math.max(1, ...trend)
  const full = count.toLocaleString(locale)

  const palette = {
    ...(accent ? { "--vibeui-button-057-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-057-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-057" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-057"
        className={className}
        style={palette}
        title={titleText.replace("{count}", full)}
        aria-label={`${children}: ${full}`}
      >
        <span data-part="eye" aria-hidden="true" />
        <span data-part="count" aria-hidden="true">
          {short.text}
        </span>
        {short.unit ? (
          <span data-part="unit" aria-hidden="true">
            {short.unit}
          </span>
        ) : null}
        <span data-part="spark" aria-hidden="true">
          {trend.map((value, index) => (
            <i
              key={index}
              style={{ height: `${Math.max(12, (value / peak) * 100)}%` }}
            />
          ))}
        </span>
      </button>
    </>
  )
}
