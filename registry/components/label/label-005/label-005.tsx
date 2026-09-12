import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Label005Props = Omit<ComponentProps<"fieldset">, "children"> & {
  legend?: string
  hint?: string
  options?: string[]
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: у группы переключателей своя подпись, и это не <label>.
// Обычный <label> подписывает одно поле; вопрос «как доставить» относится
// ко всем сразу, поэтому он живёт в <legend> внутри <fieldset> — скринридер
// повторяет его перед каждым вариантом, и человек не теряет вопрос.
const STYLES = `
:where([data-vibeui-block="label-005"]){
--vibeui-label-005-surface:transparent;
--vibeui-label-005-surface-border:light-dark(oklch(0.91 0 265),oklch(0.33 0 265));
--vibeui-label-005-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-label-005-muted:color-mix(in oklab,var(--vibeui-label-005-fg) 68%,transparent);
--vibeui-label-005-item-border:light-dark(oklch(0.88 0 265),oklch(0.38 0 265));
--vibeui-label-005-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-label-005-radius:0.625rem;
--vibeui-label-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="label-005"]{color-scheme:dark}
[data-vibeui-block="label-005"]{
box-sizing:border-box;width:100%;max-width:24rem;
margin:0;padding:1rem;
background:var(--vibeui-label-005-surface);
border:1px solid var(--vibeui-label-005-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-label-005-font);color:var(--vibeui-label-005-fg);
}
/* float:left + width:100% снимает с <legend> его особую раскладку внутри
   рамки. Плата за это — следующие дети начинают обтекать заголовок,
   поэтому оболочка ниже принудительно сбрасывает обтекание. */
[data-vibeui-block="label-005"] legend{
float:left;width:100%;padding:0;margin:0;
font-size:0.875rem;font-weight:600;line-height:1.3;
}
[data-vibeui-block="label-005"] [data-part="hint"]{
clear:both;margin:0.25rem 0 0;
font-size:0.8125rem;line-height:1.45;color:var(--vibeui-label-005-muted);
}
[data-vibeui-block="label-005"] [data-part="shell"]{
clear:both;display:flex;flex-direction:column;gap:0.5rem;margin-top:0.75rem;
}
[data-vibeui-block="label-005"] [data-part="item"]{
display:flex;align-items:center;gap:0.625rem;cursor:pointer;
padding:0.5625rem 0.75rem;
border:1px solid var(--vibeui-label-005-item-border);
border-radius:var(--vibeui-label-005-radius);
font-size:0.9375rem;line-height:1.35;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="label-005"] [data-part="item"]:has(input:checked){
border-color:var(--vibeui-label-005-accent);
background:color-mix(in oklab,var(--vibeui-label-005-accent) 8%,transparent);
}
[data-vibeui-block="label-005"] [data-part="item"]:has(input:focus-visible){
outline:2px solid var(--vibeui-label-005-accent);outline-offset:2px;
}
[data-vibeui-block="label-005"] input{
appearance:none;-webkit-appearance:none;flex:none;margin:0;
width:1.0625rem;height:1.0625rem;border-radius:50%;
border:1.5px solid var(--vibeui-label-005-item-border);
background:var(--vibeui-label-005-surface);cursor:inherit;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="label-005"] input:checked{
border-color:var(--vibeui-label-005-accent);
box-shadow:inset 0 0 0 0.25rem var(--vibeui-label-005-accent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="label-005"] *{animation:none!important;transition:none!important}}
`

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

/**
 * Подпись группы полей на <legend>: вопрос относится ко всем вариантам
 * сразу и читается перед каждым. Один файл, ноль зависимостей.
 */
export function Label005({
  legend = "Как доставить заказ",
  hint = "Способ можно поменять до того, как курьер выехал.",
  options = ["Курьером до двери", "В пункт выдачи", "Почтой России"],
  background = "",
  accent,
  className,
  style,
  ...props
}: Label005Props) {
  const id = useId()
  const hintId = `${id}-hint`
  const palette = {
    ...(accent ? { "--vibeui-label-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-label-005-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-label-005" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="label"
        data-vibeui-block="label-005"
        className={className}
        style={palette}
        aria-describedby={hintId}
      >
        <legend>{legend}</legend>
        <p data-part="hint" id={hintId}>
          {hint}
        </p>
        <div data-part="shell">
          {options.map((option, index) => (
            <label data-part="item" key={option}>
              <input
                type="radio"
                name={`${id}-delivery`}
                value={option}
                defaultChecked={index === 0}
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}
