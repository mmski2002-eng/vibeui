import type { ComponentProps, CSSProperties } from "react"

export type Input033Props = Omit<ComponentProps<"div">, "children"> & {
  /** Имя поля для скринридера: видимой подписи у свёрнутого поля нет. */
  label?: string
  placeholder?: string
  /** Подсказка под полем; пусто — подсказки нет. */
  hint?: string
  /** Развёрнуть поле сразу, не дожидаясь курсора или фокуса. */
  expanded?: boolean
  /** Имя поля формы. */
  name?: string
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея компонента: поиск, который занимает место только когда им заняты.
// Свёрнутый — это кружок с лупой; под курсором или фокусом он разъезжается
// в полноценное поле, а с набранным текстом остаётся раскрытым и после
// потери фокуса. Всё это состояния CSS (:hover, :focus-within и
// :placeholder-shown), поэтому сценариев в компоненте нет.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте поле темнеет, а его граница светлеет.
const STYLES = `
:where([data-vibeui-block="input-033"]){
--vibeui-input-033-bg:transparent;
--vibeui-input-033-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-input-033-muted:color-mix(in oklab,var(--vibeui-input-033-fg) 62%,transparent);
--vibeui-input-033-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-input-033-field:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-input-033-accent:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-input-033-accent-text:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-input-033-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-033"]{color-scheme:dark}
[data-vibeui-block="input-033"]{
display:flex;flex-direction:column;gap:0.625rem;align-items:flex-start;
width:100%;max-width:20rem;box-sizing:border-box;
background:var(--vibeui-input-033-bg);color:var(--vibeui-input-033-fg);
font-family:var(--vibeui-input-033-font);
}
[data-vibeui-block="input-033"] *{box-sizing:border-box}
/* Свёрнутое поле — ровно кружок с лупой: ширина задана в rem, а не в
   процентах, поэтому она одинакова в любой колонке. */
[data-vibeui-block="input-033"] [data-part="field"]{
display:flex;align-items:center;gap:0.5rem;cursor:text;
width:3.25rem;max-width:100%;padding:0.6875rem 0.875rem;
border:1px solid var(--vibeui-input-033-border);border-radius:999px;
background:var(--vibeui-input-033-field);overflow:hidden;
transition:width .4s cubic-bezier(.22,1.2,.36,1),border-color .3s ease;
transition:width .4s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1),border-color .3s ease;
}
/* Три причины остаться раскрытым: курсор, фокус и набранный текст.
   Последняя держит поле открытым после того, как фокус ушёл. */
[data-vibeui-block="input-033"] [data-part="field"]:hover,
[data-vibeui-block="input-033"] [data-part="field"]:focus-within,
[data-vibeui-block="input-033"] [data-part="field"]:has(input:not(:placeholder-shown)),
[data-vibeui-block="input-033"][data-expanded="true"] [data-part="field"]{
width:100%;
}
[data-vibeui-block="input-033"] [data-part="field"]:hover{
border-color:color-mix(in oklab,var(--vibeui-input-033-fg) 30%,transparent);
}
[data-vibeui-block="input-033"] [data-part="field"]:focus-within{
border-color:var(--vibeui-input-033-accent);
outline:2px solid var(--vibeui-input-033-accent);outline-offset:2px;
}
[data-vibeui-block="input-033"] [data-part="icon"]{
display:grid;place-items:center;flex:none;
width:1.125rem;height:1.125rem;color:var(--vibeui-input-033-muted);
transition:color .3s ease;
}
[data-vibeui-block="input-033"] [data-part="icon"] svg{width:100%;height:100%;display:block}
[data-vibeui-block="input-033"] [data-part="field"]:focus-within [data-part="icon"]{
color:var(--vibeui-input-033-accent-text);
}
[data-vibeui-block="input-033"] input{
flex:1 1 auto;min-width:0;appearance:none;
margin:0;padding:0;border:0;outline:none;background:none;
font:inherit;font-size:0.875rem;line-height:1.4;color:var(--vibeui-input-033-fg);
}
[data-vibeui-block="input-033"] input::placeholder{color:var(--vibeui-input-033-muted)}
[data-vibeui-block="input-033"] input::-webkit-search-cancel-button{appearance:none}
[data-vibeui-block="input-033"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-input-033-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-033"] *{animation:none!important;transition:none!important}}
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
 * Поиск, свёрнутый до лупы: разъезжается под курсором и фокусом, остаётся
 * раскрытым с набранным текстом. Один файл, ноль зависимостей.
 */
export function Input033({
  label = "Поиск",
  placeholder = "Поиск по каталогу",
  hint = "Наведите курсор или поставьте фокус — поле развернётся.",
  expanded = false,
  name = "search",
  accent,
  background = "",
  className,
  style,
  ...props
}: Input033Props) {
  const palette = {
    ...(accent ? { "--vibeui-input-033-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-033-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-input-033" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input"
        data-vibeui-block="input-033"
        data-expanded={expanded ? "true" : "false"}
        className={className}
        style={palette}
      >
        <label data-part="field">
          <span data-part="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M16.5 16.5 21 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            type="search"
            name={name}
            aria-label={label}
            placeholder={placeholder}
          />
        </label>
        {hint ? <p data-part="hint">{hint}</p> : null}
      </div>
    </>
  )
}
