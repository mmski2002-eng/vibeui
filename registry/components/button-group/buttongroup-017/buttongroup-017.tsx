import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup017Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  question?: string
  yesLabel?: string
  noLabel?: string
  yesHint?: string
  noHint?: string
  defaultValue?: "yes" | "no"
  name?: string
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: ответ «да / нет» как пара сегментов, а не как switch.
// Switch честен только тогда, когда «выключено» — это отсутствие действия;
// в анкете оба ответа равнозначны, и вариант должен быть виден целиком.
// Подложка переезжает без JS: трек ловит через :has, какой из двух radio
// отмечен, и сдвигает единственный thumb. Пояснение под группой тоже
// меняется правилами CSS — оба текста лежат в разметке, показан один.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-017"]){
--vibeui-buttongroup-017-surface:transparent;
--vibeui-buttongroup-017-track:light-dark(oklch(0.955 0 265),oklch(0.28 0 265));
--vibeui-buttongroup-017-fg:light-dark(oklch(0.25 0 265),oklch(0.94 0 265));
--vibeui-buttongroup-017-muted:color-mix(in oklab,var(--vibeui-buttongroup-017-fg) 68%,transparent);
--vibeui-buttongroup-017-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-buttongroup-017-accent:light-dark(oklch(0.287 0 0),oklch(0.881 0 0));
--vibeui-buttongroup-017-deny:light-dark(oklch(0.3 0 0),oklch(0.883 0 0));
--vibeui-buttongroup-017-on-thumb:oklch(0.99 0 265);
--vibeui-buttongroup-017-thumb:var(--vibeui-buttongroup-017-accent);
--vibeui-buttongroup-017-radius:0.5rem;
--vibeui-buttongroup-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-017"]{color-scheme:dark}
[data-vibeui-block="buttongroup-017"]{
box-sizing:border-box;display:block;width:100%;max-width:20rem;
margin:0;padding:0.875rem;
border:1px solid var(--vibeui-buttongroup-017-border);border-radius:0.875rem;
background:var(--vibeui-buttongroup-017-surface);
font-family:var(--vibeui-buttongroup-017-font);
}
[data-vibeui-block="buttongroup-017"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-017"] legend{
padding:0;margin:0 0 0.625rem;float:left;width:100%;clear:both;
color:var(--vibeui-buttongroup-017-fg);
font-size:0.8125rem;font-weight:650;line-height:1.35;
}
[data-vibeui-block="buttongroup-017"] [data-part="track"]{
position:relative;display:grid;grid-template-columns:1fr 1fr;clear:both;
padding:0.1875rem;
border-radius:calc(var(--vibeui-buttongroup-017-radius) + 0.1875rem);
background:var(--vibeui-buttongroup-017-track);
}
[data-vibeui-block="buttongroup-017"] [data-part="thumb"]{
position:absolute;top:0.1875rem;bottom:0.1875rem;left:0.1875rem;
width:calc((100% - 0.375rem) / 2);
border-radius:var(--vibeui-buttongroup-017-radius);
background:var(--vibeui-buttongroup-017-thumb);
transition:translate .2s cubic-bezier(.2,.7,.3,1),background-color .2s ease;
}
/* Трек сам решает, где стоит подложка: JS для двух вариантов не нужен. */
[data-vibeui-block="buttongroup-017"] [data-part="track"]:has([data-part="option"]:nth-of-type(2) input:checked) [data-part="thumb"]{
translate:100% 0;
--vibeui-buttongroup-017-thumb:var(--vibeui-buttongroup-017-deny);
}
[data-vibeui-block="buttongroup-017"] [data-part="option"]{
position:relative;z-index:1;
display:inline-flex;align-items:center;justify-content:center;gap:0.375rem;
height:2.125rem;
color:var(--vibeui-buttongroup-017-muted);
font-size:0.8125rem;font-weight:650;line-height:1;cursor:pointer;
transition:color .18s ease;
}
[data-vibeui-block="buttongroup-017"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="buttongroup-017"] [data-part="option"]:has(input:checked){
color:var(--vibeui-buttongroup-017-on-thumb);
}
[data-vibeui-block="buttongroup-017"] [data-part="option"]:has(input:focus-visible){
outline:2px solid var(--vibeui-buttongroup-017-fg);outline-offset:2px;
border-radius:var(--vibeui-buttongroup-017-radius);
}
[data-vibeui-block="buttongroup-017"] [data-part="hint"]{
margin:0.5rem 0 0;min-height:1.125rem;
color:var(--vibeui-buttongroup-017-muted);
font-size:0.75rem;line-height:1.4;
}
[data-vibeui-block="buttongroup-017"] [data-part="hint"] span{display:none}
[data-vibeui-block="buttongroup-017"]:has([data-part="option"]:nth-of-type(1) input:checked) [data-part="hint"] [data-when="yes"]{display:inline}
[data-vibeui-block="buttongroup-017"]:has([data-part="option"]:nth-of-type(2) input:checked) [data-part="hint"] [data-when="no"]{display:inline}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-017"] *{animation:none!important;transition:none!important}}
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
 * Ответ «да / нет» парой сегментов с переезжающей подложкой без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup017({
  question = "Присылать отчёт на почту каждый понедельник?",
  yesLabel = "Да",
  noLabel = "Нет",
  yesHint = "Письмо придёт в 9:00 по вашему времени.",
  noHint = "Отчёт останется доступен только в интерфейсе.",
  defaultValue = "yes",
  name = "buttongroup-017",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup017Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-017-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-017-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-017" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-017"
        className={className}
        style={palette}
      >
        <legend>{question}</legend>
        <form data-part="track">
          <span data-part="thumb" aria-hidden="true" />
          <label data-part="option">
            <input
              type="radio"
              name={name}
              value="yes"
              defaultChecked={defaultValue === "yes"}
            />
            {yesLabel}
          </label>
          <label data-part="option">
            <input
              type="radio"
              name={name}
              value="no"
              defaultChecked={defaultValue === "no"}
            />
            {noLabel}
          </label>
        </form>
        <p data-part="hint">
          <span data-when="yes">{yesHint}</span>
          <span data-when="no">{noHint}</span>
        </p>
      </fieldset>
    </>
  )
}
