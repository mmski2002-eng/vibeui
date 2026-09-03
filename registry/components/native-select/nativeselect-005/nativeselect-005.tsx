import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Nativeselect005Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  options?: string[]
  secondLabel?: string
  secondOptions?: string[]
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: в строке фильтров select не должен выглядеть полем
// формы. Рамка снята и появляется только на наведении и фокусе, ширина
// поля равна тексту выбранного пункта, подпись стоит слева в той же
// строке. Список при этом остаётся системным: на телефоне открывается
// привычное колесо, а не самодельное меню, которое едет при масштабе.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// строки по умолчанию нет, а границы и заливка наведения получают свои
// пары светлот.
const STYLES = `
:where([data-vibeui-block="nativeselect-005"]){
--vibeui-nativeselect-005-bg:transparent;
--vibeui-nativeselect-005-line:light-dark(oklch(0.91 0.006 265),oklch(0.33 0.012 265));
--vibeui-nativeselect-005-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.004 265));
--vibeui-nativeselect-005-muted:color-mix(in oklab,var(--vibeui-nativeselect-005-fg) 68%,transparent);
--vibeui-nativeselect-005-hover:light-dark(oklch(1 0 0),oklch(0.3 0.012 265));
--vibeui-nativeselect-005-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-nativeselect-005-radius:0.5rem;
--vibeui-nativeselect-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="nativeselect-005"]{color-scheme:dark}
[data-vibeui-block="nativeselect-005"]{
box-sizing:border-box;width:100%;max-width:32rem;
display:flex;flex-wrap:wrap;align-items:center;gap:0.25rem 1rem;
padding:0.5rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-nativeselect-005-bg);
border:1px solid var(--vibeui-nativeselect-005-line);
font-family:var(--vibeui-nativeselect-005-font);color:var(--vibeui-nativeselect-005-fg);
}
[data-vibeui-block="nativeselect-005"] [data-part="pair"]{
display:inline-flex;align-items:center;gap:0.25rem;min-width:0;
}
[data-vibeui-block="nativeselect-005"] label{
font-size:0.8125rem;line-height:1.3;color:var(--vibeui-nativeselect-005-muted);
cursor:pointer;white-space:nowrap;
}
[data-vibeui-block="nativeselect-005"] [data-part="field"]{
position:relative;display:inline-flex;min-width:0;
}
/* Ширина поля равна тексту: width:auto у select берётся по самому
   длинному пункту, поэтому «тихий» фильтр не растягивает строку. */
[data-vibeui-block="nativeselect-005"] select{
appearance:none;-webkit-appearance:none;
box-sizing:border-box;width:auto;max-width:100%;height:1.75rem;
padding:0 1.375rem 0 0.375rem;
font:inherit;font-size:0.8125rem;font-weight:500;line-height:1.2;
color:var(--vibeui-nativeselect-005-fg);
background:transparent;border:1px solid transparent;
border-radius:var(--vibeui-nativeselect-005-radius);
cursor:pointer;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="nativeselect-005"] select:hover{
background:var(--vibeui-nativeselect-005-hover);
border-color:var(--vibeui-nativeselect-005-line);
}
[data-vibeui-block="nativeselect-005"] select:focus-visible{
outline:2px solid var(--vibeui-nativeselect-005-accent);outline-offset:1px;
background:var(--vibeui-nativeselect-005-hover);
}
[data-vibeui-block="nativeselect-005"] option{color:var(--vibeui-nativeselect-005-fg)}
/* Chrome рисует свой индикатор поверх appearance:none — гасим, стрелка своя. */
[data-vibeui-block="nativeselect-005"] select::-webkit-calendar-picker-indicator{display:none}
[data-vibeui-block="nativeselect-005"] [data-part="arrow"]{
position:absolute;right:0.5rem;top:50%;pointer-events:none;
width:0.3125rem;height:0.3125rem;
border-right:1.5px solid var(--vibeui-nativeselect-005-muted);
border-bottom:1.5px solid var(--vibeui-nativeselect-005-muted);
translate:0 -0.1875rem;rotate:45deg;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="nativeselect-005"] *{animation:none!important;transition:none!important}}
`

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
 * Компактные нативные select'ы в строке фильтров: без рамки, шириной по
 * тексту, с подписями слева. Один файл, ноль зависимостей.
 */
export function Nativeselect005({
  label = "Сортировка",
  options = ["по дате", "по имени", "по размеру"],
  secondLabel = "Показывать",
  secondOptions = ["все", "только мои", "в архиве"],
  background = "",
  accent,
  className,
  style,
  ...props
}: Nativeselect005Props) {
  const id = useId()
  const palette = {
    ...(accent ? { "--vibeui-nativeselect-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-nativeselect-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-nativeselect-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="native-select"
        data-vibeui-block="nativeselect-005"
        className={className}
        style={palette}
      >
        <span data-part="pair">
          <label htmlFor={`${id}-sort`}>{label}</label>
          <span data-part="field">
            <select id={`${id}-sort`} name="sort">
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span data-part="arrow" aria-hidden="true" />
          </span>
        </span>
        <span data-part="pair">
          <label htmlFor={`${id}-scope`}>{secondLabel}</label>
          <span data-part="field">
            <select id={`${id}-scope`} name="scope">
              {secondOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span data-part="arrow" aria-hidden="true" />
          </span>
        </span>
      </div>
    </>
  )
}
