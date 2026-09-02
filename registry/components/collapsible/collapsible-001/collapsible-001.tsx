import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Collapsible001Props = Omit<
  ComponentPropsWithoutRef<"details">,
  "children" | "title"
> & {
  title?: string
  hint?: string
  text?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: самая простая свёртка — один <details> без единой строки
// клиентского кода. Состояние живёт в разметке, поэтому раскрытие работает
// до гидратации, попадает в поиск по странице и печатается развёрнутым.
// Значок нарисован двумя гранями квадрата: подменять символ на ± не нужно.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// по умолчанию нет, он темнеет вместе со страницей и не носит своей темы.
const STYLES = `
:where([data-vibeui-block="collapsible-001"]){
--vibeui-collapsible-001-bg:transparent;
--vibeui-collapsible-001-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-collapsible-001-muted:light-dark(oklch(0.56 0.014 265),oklch(0.7 0.012 265));
--vibeui-collapsible-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-collapsible-001-accent:light-dark(oklch(0.55 0.19 262),oklch(0.74 0.16 262));
--vibeui-collapsible-001-radius:0.875rem;
--vibeui-collapsible-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="collapsible-001"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;
background:var(--vibeui-collapsible-001-bg);color:var(--vibeui-collapsible-001-fg);
border:1px solid var(--vibeui-collapsible-001-border);
border-radius:var(--vibeui-collapsible-001-radius);
font-family:var(--vibeui-collapsible-001-font);
}
[data-vibeui-block="collapsible-001"] summary{
display:flex;align-items:center;gap:0.625rem;
padding:0.8125rem 0.875rem;cursor:pointer;list-style:none;
border-radius:var(--vibeui-collapsible-001-radius);
font-size:0.875rem;font-weight:650;line-height:1.3;
}
[data-vibeui-block="collapsible-001"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="collapsible-001"] summary:hover{background:color-mix(in oklab,var(--vibeui-collapsible-001-accent) 6%,transparent)}
[data-vibeui-block="collapsible-001"] summary:focus-visible{outline:2px solid var(--vibeui-collapsible-001-accent);outline-offset:-2px}
[data-vibeui-block="collapsible-001"] [data-part="hint"]{
margin-left:auto;font-size:0.75rem;font-weight:500;color:var(--vibeui-collapsible-001-muted);
}
/* Значок — две грани квадрата: поворот честнее подмены символа. */
[data-vibeui-block="collapsible-001"] [data-part="mark"]{
flex:none;width:0.4375rem;height:0.4375rem;
border-right:2px solid var(--vibeui-collapsible-001-muted);
border-bottom:2px solid var(--vibeui-collapsible-001-muted);
transform:rotate(-45deg);transform-origin:60% 60%;
transition:transform .18s ease;
}
[data-vibeui-block="collapsible-001"] [data-part="mark"]:only-child{margin-left:auto}
[data-vibeui-block="collapsible-001"][open] [data-part="mark"]{transform:rotate(45deg)}
[data-vibeui-block="collapsible-001"] [data-part="body"]{
margin:0;padding:0 0.875rem 0.875rem;
border-top:1px solid var(--vibeui-collapsible-001-border);
padding-top:0.75rem;
font-size:0.8125rem;line-height:1.55;color:var(--vibeui-collapsible-001-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="collapsible-001"] *{animation:none!important;transition:none!important}}
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
 * Базовая свёртка на нативном details: состояние в разметке, клиентского
 * кода нет. Один файл, ноль зависимостей, собственная палитра.
 */
export function Collapsible001({
  title = "Как устанавливается компонент",
  hint = "30 секунд",
  text = "Скопируйте команду из карточки, выполните её в корне проекта — файл ляжет в components/vibeui и сразу заработает: внешних зависимостей у него нет.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Collapsible001Props) {
  const palette = {
    ...(accent ? { "--vibeui-collapsible-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-collapsible-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-collapsible-001" precedence="medium">
        {STYLES}
      </style>
      <details
        {...props}
        data-vibeui-block="collapsible-001"
        className={className}
        style={palette}
      >
        <summary>
          {title}
          {hint ? <span data-part="hint">{hint}</span> : null}
          <span data-part="mark" aria-hidden="true" />
        </summary>
        <p data-part="body">{text}</p>
      </details>
    </>
  )
}
