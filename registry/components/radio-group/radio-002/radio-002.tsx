import type { ComponentProps, CSSProperties } from "react"

export type Radio002Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  options?: string[]
  name?: string
  defaultValue?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: самая простая радиогруппа — только вопрос и варианты,
// без карточек и рамок. Кружок собран из appearance:none, а точка внутри —
// фон самого input'а, поэтому она не сдвигается при масштабе шрифта и
// наследует цвет акцента одной переменной.
//
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="radio-002"]){
--vibeui-radio-002-bg:transparent;
--vibeui-radio-002-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.006 265));
--vibeui-radio-002-muted:color-mix(in oklab,var(--vibeui-radio-002-fg) 68%,transparent);
--vibeui-radio-002-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-radio-002-ring:light-dark(oklch(0.72 0.012 265),oklch(0.52 0.014 265));
--vibeui-radio-002-accent:light-dark(oklch(0.55 0.19 262),oklch(0.74 0.16 262));
--vibeui-radio-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="radio-002"]{color-scheme:dark}
[data-vibeui-block="radio-002"]{
display:flex;flex-direction:column;
width:100%;max-width:18rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-radio-002-bg);
border:1px solid var(--vibeui-radio-002-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-002-font);color:var(--vibeui-radio-002-fg);
}
/* float + clear: легенда fieldset иначе садится на рамку, а следующие
   flex-дети начинают её обтекать. */
[data-vibeui-block="radio-002"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.625rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="radio-002"] [data-part="list"]{clear:both;display:flex;flex-direction:column;gap:0.625rem}
[data-vibeui-block="radio-002"] [data-part="option"]{
display:flex;align-items:center;gap:0.625rem;cursor:pointer;
font-size:0.875rem;line-height:1.35;
}
[data-vibeui-block="radio-002"] input{
appearance:none;-webkit-appearance:none;flex:none;margin:0;cursor:pointer;
width:1.125rem;height:1.125rem;border-radius:9999px;
border:1.5px solid var(--vibeui-radio-002-ring);
background:transparent;
transition:border-color .16s ease,background .16s ease;
}
/* Точка — фон самого input'а, а не отдельный узел: не съезжает при
   изменении размера шрифта и не требует лишнего span. Градиент, а не
   внутренняя тень: тени пришлось бы закрашивать зазор цветом подложки,
   а подложки у компонента по умолчанию нет. */
[data-vibeui-block="radio-002"] input:checked{
border-color:var(--vibeui-radio-002-accent);
background:radial-gradient(circle at 50% 50%,var(--vibeui-radio-002-accent) 0 0.21875rem,transparent 0.21875rem);
}
[data-vibeui-block="radio-002"] input:hover:not(:checked){border-color:var(--vibeui-radio-002-muted)}
[data-vibeui-block="radio-002"] input:focus-visible{outline:2px solid var(--vibeui-radio-002-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Электронная почта",
  "Телефонный звонок",
  "Сообщение в мессенджер",
]

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
 * Простая радиогруппа: вопрос и варианты, точка нарисована фоном кружка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio002({
  legend = "Как с вами связаться",
  options = DEFAULT_OPTIONS,
  name = "vibeui-radio-002",
  defaultValue = "Телефонный звонок",
  background = "",
  accent,
  className,
  style,
  ...props
}: Radio002Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-002" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="radio-group"
        data-vibeui-block="radio-002"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <form data-part="list">
          {options.map((option) => (
            <label key={option} data-part="option">
              <input
                type="radio"
                name={name}
                value={option}
                defaultChecked={option === defaultValue}
              />
              <span>{option}</span>
            </label>
          ))}
        </form>
      </fieldset>
    </>
  )
}
