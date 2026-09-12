import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup005Props = Omit<ComponentProps<"form">, "children"> & {
  name?: string
  label?: string
  scopes?: string[]
  placeholder?: string
  /** Подпись кнопки отправки. */
  action?: string
  /** Подпись списка областей для чтения вслух. */
  scopeLabel?: string
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: область поиска выбирается до запроса, а не фильтруется
// после. Слева select «где искать», в середине поле, справа кнопка — три
// элемента в одной рамке. Такой порядок не случаен: сначала «где», потом
// «что», потом «найти» — сцепка читается как фраза. Форма настоящая, поэтому
// Enter в поле отправляет запрос без единого обработчика клавиш.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="inputgroup-005"]){
--vibeui-inputgroup-005-surface:transparent;
--vibeui-inputgroup-005-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-inputgroup-005-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-inputgroup-005-muted:color-mix(in oklab,var(--vibeui-inputgroup-005-fg) 68%,transparent);
--vibeui-inputgroup-005-field:light-dark(oklch(0.99 0 265),oklch(0.27 0 265));
--vibeui-inputgroup-005-fixed:light-dark(oklch(0.955 0 265),oklch(0.32 0 265));
--vibeui-inputgroup-005-border:light-dark(oklch(0.86 0 265),oklch(0.44 0 265));
--vibeui-inputgroup-005-accent:light-dark(oklch(0.275 0 0),oklch(0.895 0 0));
--vibeui-inputgroup-005-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0 275));
--vibeui-inputgroup-005-radius:999px;
--vibeui-inputgroup-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-005"]{color-scheme:dark}
[data-vibeui-block="inputgroup-005"]{
display:flex;flex-direction:column;gap:0.5rem;margin:0;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-005-surface);
border:1px solid var(--vibeui-inputgroup-005-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-005-font);color:var(--vibeui-inputgroup-005-fg);
}
[data-vibeui-block="inputgroup-005"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-005"] [data-part="title"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-005"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-005"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-005-border);
border-radius:0;margin-left:-1px;font:inherit;font-size:0.875rem;color:inherit;
}
/* Скруглены только концы сцепки — середина остаётся прямой. */
[data-vibeui-block="inputgroup-005"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-005-radius) 0 0 var(--vibeui-inputgroup-005-radius);
padding-left:1rem;
}
[data-vibeui-block="inputgroup-005"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-005-radius) var(--vibeui-inputgroup-005-radius) 0;
}
[data-vibeui-block="inputgroup-005"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-005"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-005-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-005-accent);
}
[data-vibeui-block="inputgroup-005"] select{
appearance:none;flex:none;cursor:pointer;
padding-right:1.5rem;
background:var(--vibeui-inputgroup-005-fixed);
font-weight:600;color:var(--vibeui-inputgroup-005-muted);
background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:calc(100% - 1rem) 50%,calc(100% - 0.7rem) 50%;
background-size:0.3rem 0.3rem,0.3rem 0.3rem;
background-repeat:no-repeat;
}
[data-vibeui-block="inputgroup-005"] input{
flex:1;min-width:0;padding:0 0.875rem;
background:var(--vibeui-inputgroup-005-field);
}
/* У type="search" WebKit рисует свой крестик — он встал бы вплотную к нашей
   кнопке «Найти» и читался как вторая кнопка сцепки. */
[data-vibeui-block="inputgroup-005"] input::-webkit-search-cancel-button{display:none}
[data-vibeui-block="inputgroup-005"] button{
appearance:none;flex:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;padding:0 1.125rem;
background:var(--vibeui-inputgroup-005-accent);
border-color:var(--vibeui-inputgroup-005-accent);
color:oklch(from var(--vibeui-inputgroup-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);font-weight:650;
transition:filter .16s ease;
}
[data-vibeui-block="inputgroup-005"] button:hover{filter:brightness(1.08)}
[data-vibeui-block="inputgroup-005"] button svg{width:0.9375rem;height:0.9375rem;display:block}
[data-vibeui-block="inputgroup-005"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-005-muted);
}
/* Специфичнее общего color:inherit у детей группы: кнопка на акценте держит свой контраст. */
[data-vibeui-block="inputgroup-005"] [data-part="group"] > button{color:oklch(from var(--vibeui-inputgroup-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-005"] *{animation:none!important;transition:none!important}}
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
 * Поиск с выбором области: select, поле и кнопка в одной сцепке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup005({
  name = "q",
  label = "Поиск по базе знаний",
  scopes = ["Везде", "В статьях", "В людях", "В задачах"],
  placeholder = "Что ищем?",
  action = "Найти",
  scopeLabel = "Где искать",
  hint = "Область уходит вместе с запросом — ссылку на результат можно сохранить.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup005Props) {
  const palette = {
    ...(accent ? { "--vibeui-inputgroup-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-005-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-005" precedence="medium">
        {STYLES}
      </style>
      <form
        {...props}
        role="search"
        data-slot="input-group"
        data-vibeui-block="inputgroup-005"
        className={className}
        style={palette}
      >
        <span data-part="title" id={`${name}-title`}>
          {label}
        </span>
        <div data-part="group">
          <select
            name={`${name}-scope`}
            aria-label={scopeLabel}
            defaultValue={scopes[0]}
          >
            {scopes.map((scope) => (
              <option key={scope} value={scope}>
                {scope}
              </option>
            ))}
          </select>
          <input
            name={name}
            type="search"
            placeholder={placeholder}
            aria-labelledby={`${name}-title`}
            aria-describedby={`${name}-hint`}
          />
          <button type="submit">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="7" cy="7" r="4.5" />
              <path d="m10.5 10.5 3 3" strokeLinecap="round" />
            </svg>
            {action}
          </button>
        </div>
        <p data-part="hint" id={`${name}-hint`}>
          {hint}
        </p>
      </form>
    </>
  )
}
