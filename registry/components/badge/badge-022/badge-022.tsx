import type { ComponentProps, CSSProperties } from "react"

export type Badge022Props = Omit<ComponentProps<"span">, "children"> & {
  unread?: number
  total?: number
  max?: number
  /** Доступное имя: {unread} и {total} подставляются числами. */
  labelText?: string
  accent?: string
  /** Пусто — счётчик держит собственный нейтральный фон. */
  background?: string
}

// Идея компонента: счётчик из двух половин. Слева непрочитанные с порогом
// «9+», справа общее число без порога, между ними перегородка. Одно число
// заставляет гадать — «двенадцать чего?»: пара «новые из всех» отвечает сразу
// и занимает столько же места. Когда новых нет, левая половина гаснет, но не
// исчезает — иначе плашка меняет ширину и дёргает соседей.
const STYLES = `
:where([data-vibeui-block="badge-022"]){
--vibeui-badge-022-bg:light-dark(oklch(0.97 0 265),oklch(0.27 0 265));
--vibeui-badge-022-border:light-dark(oklch(0.89 0 265),oklch(0.41 0 265));
--vibeui-badge-022-accent:light-dark(oklch(0.58 0.2 25),oklch(0.72 0.19 25));
--vibeui-badge-022-muted:light-dark(oklch(0.54 0 265),oklch(0.69 0 265));
--vibeui-badge-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-022"]{color-scheme:dark}
[data-vibeui-block="badge-022"]{
display:inline-flex;align-items:stretch;box-sizing:border-box;
height:1.5rem;
border:1px solid var(--vibeui-badge-022-border);border-radius:9999px;
background:var(--vibeui-badge-022-bg);
font-family:var(--vibeui-badge-022-font);font-size:0.75rem;line-height:1;
/* Табличные цифры: половины не должны переставать совпадать по ширине. */
font-variant-numeric:tabular-nums;vertical-align:middle;overflow:hidden;
}
[data-vibeui-block="badge-022"] [data-part="unread"],
[data-vibeui-block="badge-022"] [data-part="total"]{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.375rem;padding:0 0.5rem;
}
[data-vibeui-block="badge-022"] [data-part="unread"]{
color:var(--vibeui-badge-022-accent);font-weight:700;
/* Подмешиваем к собственному фону, а не к белому: в тёмной теме белая
   подложка вернула бы светлую половину на тёмной плашке. */
background:color-mix(in oklab,var(--vibeui-badge-022-accent) 14%,var(--vibeui-badge-022-bg));
}
[data-vibeui-block="badge-022"] [data-part="total"]{
color:var(--vibeui-badge-022-muted);font-weight:500;
border-left:1px solid var(--vibeui-badge-022-border);
}
/* Ноль новых: половина остаётся на месте, но перестаёт звать. */
[data-vibeui-block="badge-022"][data-empty="true"] [data-part="unread"]{
color:var(--vibeui-badge-022-muted);font-weight:500;background:transparent;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-022"] *{animation:none!important;transition:none!important}}
`

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
 * Счётчик из двух половин: новые с порогом «9+» и общее число.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge022({
  unread = 12,
  total = 48,
  max = 9,
  labelText = "{unread} новых из {total}",
  accent,
  background = "",
  className,
  style,
  ...props
}: Badge022Props) {
  const fresh = Math.max(0, Math.round(unread))
  const all = Math.max(fresh, Math.round(total))
  const shown = fresh > max ? `${max}+` : String(fresh)
  const label = labelText
    .replace("{unread}", String(fresh))
    .replace("{total}", String(all))

  const palette = {
    ...(accent ? { "--vibeui-badge-022-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-badge-022-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-022" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-022"
        data-empty={fresh === 0}
        className={className}
        style={palette}
        aria-label={label}
      >
        <span data-part="unread" aria-hidden="true">
          {shown}
        </span>
        <span data-part="total" aria-hidden="true">
          {all}
        </span>
      </span>
    </>
  )
}
