import type { ComponentProps, CSSProperties } from "react"

export type Radio005Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  /** До пяти сегментов: под каждый номер в CSS заведено своё правило сдвига. */
  options?: string[]
  name?: string
  defaultValue?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: горизонтальный переключатель режимов — форма, в которой
// варианты сравниваются глазом за один взгляд. Подложка выбранного сегмента
// не перерисовывается, а переезжает: одна плашка под всеми кнопками,
// сдвиг считает CSS через :has(), поэтому анимация есть, а состояния в JS нет.
//
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="radio-005"]){
--vibeui-radio-005-bg:transparent;
--vibeui-radio-005-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-radio-005-muted:color-mix(in oklab,var(--vibeui-radio-005-fg) 68%,transparent);
--vibeui-radio-005-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-radio-005-rail:light-dark(oklch(0.96 0 265),oklch(0.29 0 265));
--vibeui-radio-005-accent:light-dark(oklch(0.55 0.19 262),oklch(0.68 0.17 262));
--vibeui-radio-005-on-accent:light-dark(oklch(1 0 0),oklch(0.16 0 262));
--vibeui-radio-005-shadow:light-dark(oklch(0.2 0 265 / 22%),oklch(0 0 0 / 45%));
--vibeui-radio-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-radio-005-count:3;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="radio-005"]{color-scheme:dark}
[data-vibeui-block="radio-005"]{
display:flex;flex-direction:column;
width:100%;max-width:22rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-radio-005-bg);
border:1px solid var(--vibeui-radio-005-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-005-font);color:var(--vibeui-radio-005-fg);
}
[data-vibeui-block="radio-005"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.5rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-radio-005-muted);
}
[data-vibeui-block="radio-005"] [data-part="group"]{
clear:both;position:relative;display:grid;
grid-template-columns:repeat(var(--vibeui-radio-005-count),1fr);
padding:0.1875rem;border-radius:0.625rem;
background:var(--vibeui-radio-005-rail);
}
/* Плашка одна на всю группу и переезжает по сегментам: перекрашивание
   каждой кнопки по отдельности не даёт этого движения. */
[data-vibeui-block="radio-005"] [data-part="indicator"]{
position:absolute;left:0.1875rem;top:0.1875rem;bottom:0.1875rem;
width:calc((100% - 0.375rem) / var(--vibeui-radio-005-count));
border-radius:0.5rem;background:var(--vibeui-radio-005-accent);
box-shadow:0 1px 3px var(--vibeui-radio-005-shadow);
transition:transform .2s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="radio-005"] [data-part="group"]:has(label:nth-of-type(1) input:checked) [data-part="indicator"]{transform:translateX(0)}
[data-vibeui-block="radio-005"] [data-part="group"]:has(label:nth-of-type(2) input:checked) [data-part="indicator"]{transform:translateX(100%)}
[data-vibeui-block="radio-005"] [data-part="group"]:has(label:nth-of-type(3) input:checked) [data-part="indicator"]{transform:translateX(200%)}
[data-vibeui-block="radio-005"] [data-part="group"]:has(label:nth-of-type(4) input:checked) [data-part="indicator"]{transform:translateX(300%)}
[data-vibeui-block="radio-005"] [data-part="group"]:has(label:nth-of-type(5) input:checked) [data-part="indicator"]{transform:translateX(400%)}
[data-vibeui-block="radio-005"] [data-part="seg"]{
position:relative;z-index:1;display:grid;place-items:center;
min-height:2rem;padding:0 0.5rem;border-radius:0.5rem;cursor:pointer;
font-size:0.8125rem;font-weight:600;color:var(--vibeui-radio-005-muted);
transition:color .2s ease;
}
[data-vibeui-block="radio-005"] [data-part="seg"]:has(input:checked){color:var(--vibeui-radio-005-on-accent)}
[data-vibeui-block="radio-005"] [data-part="seg"]:has(input:focus-visible){outline:2px solid var(--vibeui-radio-005-accent);outline-offset:2px}
/* Радио спрятано визуально, но не от клавиатуры: стрелки по-прежнему
   переключают группу, а Tab заводит в неё фокус. */
[data-vibeui-block="radio-005"] input{
position:absolute;width:1px;height:1px;margin:0;
clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = ["День", "Неделя", "Месяц"]

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
 * Сегментированная радиогруппа: подложка переезжает на CSS через :has().
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio005({
  legend = "Период отчёта",
  options = DEFAULT_OPTIONS,
  name = "vibeui-radio-005",
  defaultValue = "Неделя",
  background = "",
  accent,
  className,
  style,
  ...props
}: Radio005Props) {
  const palette = {
    "--vibeui-radio-005-count": String(options.length),
    ...(accent ? { "--vibeui-radio-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-005" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="radio-group"
        data-vibeui-block="radio-005"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <form data-part="group">
          <span data-part="indicator" aria-hidden="true" />
          {options.map((option) => (
            <label key={option} data-part="seg">
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
