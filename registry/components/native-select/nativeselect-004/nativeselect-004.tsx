import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Nativeselect004Props = Omit<
  ComponentProps<"select">,
  "children" | "size" | "multiple"
> & {
  label?: string
  hint?: string
  options?: string[]
  /** Что отмечено сразу. По умолчанию — первый пункт списка. */
  defaultSelected?: string[]
  rows?: number
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: множественный select без объяснения не работает — с
// мышью нужен Ctrl, с клавиатуры Shift, и об этом никто не догадывается.
// Поэтому список раскрыт заранее (атрибут size), а под ним стоит строка,
// прямо называющая клавиши. Раскрытый список честнее закрытого: видно,
// что выбирать можно несколько.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// блока по умолчанию нет, а поле и границы получают свои пары светлот.
const STYLES = `
:where([data-vibeui-block="nativeselect-004"]){
--vibeui-nativeselect-004-bg:transparent;
--vibeui-nativeselect-004-line:light-dark(oklch(0.91 0 265),oklch(0.33 0 265));
--vibeui-nativeselect-004-field:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-nativeselect-004-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-nativeselect-004-muted:color-mix(in oklab,var(--vibeui-nativeselect-004-fg) 68%,transparent);
--vibeui-nativeselect-004-field-border:light-dark(oklch(0.85 0 265),oklch(0.42 0 265));
--vibeui-nativeselect-004-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-nativeselect-004-key-bg:light-dark(oklch(0.96 0 265),oklch(0.34 0 265));
--vibeui-nativeselect-004-radius:0.625rem;
--vibeui-nativeselect-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="nativeselect-004"]{color-scheme:dark}
[data-vibeui-block="nativeselect-004"]{
box-sizing:border-box;width:100%;max-width:22rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-nativeselect-004-bg);
border:1px solid var(--vibeui-nativeselect-004-line);
font-family:var(--vibeui-nativeselect-004-font);color:var(--vibeui-nativeselect-004-fg);
display:flex;flex-direction:column;gap:0.4375rem;
}
[data-vibeui-block="nativeselect-004"] label{
font-size:0.8125rem;font-weight:600;line-height:1.3;cursor:pointer;
}
/* Раскрытому списку appearance:none не нужен: стрелки у него нет, а
   собственная рамка и скругление задаются напрямую. */
[data-vibeui-block="nativeselect-004"] select{
box-sizing:border-box;width:100%;padding:0.25rem;
font:inherit;font-size:0.875rem;line-height:1.4;
color:var(--vibeui-nativeselect-004-fg);
background:var(--vibeui-nativeselect-004-field);
border:1px solid var(--vibeui-nativeselect-004-field-border);
border-radius:var(--vibeui-nativeselect-004-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="nativeselect-004"] select:focus-visible{
outline:none;border-color:var(--vibeui-nativeselect-004-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-nativeselect-004-accent) 22%,transparent);
}
[data-vibeui-block="nativeselect-004"] option{
padding:0.3125rem 0.4375rem;border-radius:0.375rem;
}
[data-vibeui-block="nativeselect-004"] option:checked{
background:color-mix(in oklab,var(--vibeui-nativeselect-004-accent) 16%,transparent);
color:var(--vibeui-nativeselect-004-fg);
}
[data-vibeui-block="nativeselect-004"] [data-part="hint"]{
margin:0;font-size:0.8125rem;line-height:1.5;
color:var(--vibeui-nativeselect-004-muted);
}
[data-vibeui-block="nativeselect-004"] kbd{
padding:0.0625rem 0.3125rem;border-radius:0.25rem;
background:var(--vibeui-nativeselect-004-key-bg);
border:1px solid var(--vibeui-nativeselect-004-field-border);
font-family:inherit;font-size:0.75rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="nativeselect-004"] *{animation:none!important;transition:none!important}}
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
 * Множественный нативный select с раскрытым списком и подсказкой о
 * клавишах выбора. Один файл, ноль зависимостей.
 */
export function Nativeselect004({
  label = "Языки интерфейса",
  hint = "Несколько — с зажатой клавишей, подряд — с Shift.",
  options = [
    "Русский",
    "English",
    "Deutsch",
    "Français",
    "Español",
    "Português",
  ],
  defaultSelected = options.slice(0, 1),
  rows = 5,
  background = "",
  accent,
  className,
  style,
  ...props
}: Nativeselect004Props) {
  const id = useId()
  const hintId = `${id}-hint`
  const palette = {
    ...(accent ? { "--vibeui-nativeselect-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-nativeselect-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-nativeselect-004" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="native-select"
        data-vibeui-block="nativeselect-004"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <select
          {...props}
          id={id}
          name="languages"
          multiple
          size={rows}
          defaultValue={defaultSelected}
          aria-describedby={hintId}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <p data-part="hint" id={hintId}>
          <kbd>Ctrl</kbd> / <kbd>Ctrl</kbd> {hint}
        </p>
      </div>
    </>
  )
}
