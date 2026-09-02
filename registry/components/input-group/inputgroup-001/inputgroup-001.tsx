import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup001Props = Omit<
  ComponentPropsWithoutRef<"form">,
  "children"
> & {
  name?: string
  label?: string
  action?: string
  placeholder?: string
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: поле и кнопка — одна сцепка, а не два элемента рядом.
// Общая рамка собирается из схлопнутых границ: у соседей отрицательный
// margin, поэтому между ними одна линия, а не две. Фокусный элемент
// поднимается z-index'ом — иначе сосед срезает половину обводки. Обёртка —
// настоящий <form>, поэтому Enter в поле отправляет без обработчиков.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="inputgroup-001"]){
--vibeui-inputgroup-001-surface:transparent;
--vibeui-inputgroup-001-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.011 265));
--vibeui-inputgroup-001-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-inputgroup-001-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-inputgroup-001-field:light-dark(oklch(0.99 0.002 265),oklch(0.27 0.013 265));
--vibeui-inputgroup-001-border:light-dark(oklch(0.86 0.008 265),oklch(0.44 0.013 265));
--vibeui-inputgroup-001-accent:light-dark(oklch(0.52 0.19 265),oklch(0.7 0.16 265));
--vibeui-inputgroup-001-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.02 265));
--vibeui-inputgroup-001-radius:0.75rem;
--vibeui-inputgroup-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-001"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-001-surface);
border:1px solid var(--vibeui-inputgroup-001-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-001-font);color:var(--vibeui-inputgroup-001-fg);
margin:0;
}
[data-vibeui-block="inputgroup-001"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-001"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-001"] [data-part="group"]{display:flex;align-items:stretch}
/* Схлопнутые границы: соседи делят одну линию. */
[data-vibeui-block="inputgroup-001"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-001-border);
border-radius:0;margin-left:-1px;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="inputgroup-001"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-001-radius) 0 0 var(--vibeui-inputgroup-001-radius);
}
[data-vibeui-block="inputgroup-001"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-001-radius) var(--vibeui-inputgroup-001-radius) 0;
}
/* Фокус поднимает элемент над соседом, иначе обводку срезает. */
[data-vibeui-block="inputgroup-001"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-001"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-001-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-001-accent);
}
[data-vibeui-block="inputgroup-001"] input{
flex:1;min-width:0;padding:0 0.875rem;
background:var(--vibeui-inputgroup-001-field);color:inherit;
}
[data-vibeui-block="inputgroup-001"] button{
flex:none;padding:0 1rem;cursor:pointer;font-weight:650;
background:var(--vibeui-inputgroup-001-accent);
border-color:var(--vibeui-inputgroup-001-accent);
color:var(--vibeui-inputgroup-001-on-accent);
transition:filter .16s ease;
}
[data-vibeui-block="inputgroup-001"] button:hover{filter:brightness(1.08)}
[data-vibeui-block="inputgroup-001"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-001-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-001"] *{animation:none!important;transition:none!important}}
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
 * Сцепка «поле + кнопка» с общей рамкой: подписка одним движением.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup001({
  name = "email",
  label = "Письма о новых компонентах",
  action = "Подписаться",
  placeholder = "name@company.com",
  hint = "Раз в две недели. Отписаться можно из любого письма.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup001Props) {
  const palette = {
    ...(accent ? { "--vibeui-inputgroup-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-001-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-001" precedence="medium">
        {STYLES}
      </style>
      <form
        {...props}
        data-vibeui-block="inputgroup-001"
        className={className}
        style={palette}
      >
        <label htmlFor={`${name}-field`}>{label}</label>
        <div data-part="group">
          <input
            id={`${name}-field`}
            name={name}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder={placeholder}
            aria-describedby={`${name}-hint`}
          />
          <button type="submit">{action}</button>
        </div>
        <p data-part="hint" id={`${name}-hint`}>
          {hint}
        </p>
      </form>
    </>
  )
}
