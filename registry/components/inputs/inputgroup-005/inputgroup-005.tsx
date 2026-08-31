import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup005Props = Omit<
  ComponentPropsWithoutRef<"form">,
  "children"
> & {
  name?: string
  label?: string
  scopes?: string[]
  placeholder?: string
  accent?: string
}

// Идея компонента: область поиска выбирается до запроса, а не фильтруется
// после. Слева select «где искать», в середине поле, справа кнопка — три
// элемента в одной рамке. Такой порядок не случаен: сначала «где», потом
// «что», потом «найти» — сцепка читается как фраза. Форма настоящая, поэтому
// Enter в поле отправляет запрос без единого обработчика клавиш.
const STYLES = `
:where([data-vibeui-block="inputgroup-005"]){
--vibeui-inputgroup-005-surface:oklch(1 0 0);
--vibeui-inputgroup-005-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-005-fg:oklch(0.23 0.014 265);
--vibeui-inputgroup-005-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-005-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-005-fixed:oklch(0.955 0.004 265);
--vibeui-inputgroup-005-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-005-accent:oklch(0.5 0.18 275);
--vibeui-inputgroup-005-radius:999px;
--vibeui-inputgroup-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
[data-vibeui-block="inputgroup-005"] button{
appearance:none;flex:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;padding:0 1.125rem;
background:var(--vibeui-inputgroup-005-accent);
border-color:var(--vibeui-inputgroup-005-accent);
color:oklch(1 0 0);font-weight:650;
transition:filter .16s ease;
}
[data-vibeui-block="inputgroup-005"] button:hover{filter:brightness(1.08)}
[data-vibeui-block="inputgroup-005"] button svg{width:0.9375rem;height:0.9375rem;display:block}
[data-vibeui-block="inputgroup-005"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-005-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-005"] *{animation:none!important;transition:none!important}}
`

/**
 * Поиск с выбором области: select, поле и кнопка в одной сцепке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup005({
  name = "q",
  label = "Поиск по базе знаний",
  scopes = ["Везде", "В статьях", "В людях", "В задачах"],
  placeholder = "Что ищем?",
  accent,
  className,
  style,
  ...props
}: Inputgroup005Props) {
  const palette = {
    ...(accent ? { "--vibeui-inputgroup-005-accent": accent } : null),
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
            aria-label="Где искать"
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
            Найти
          </button>
        </div>
        <p data-part="hint" id={`${name}-hint`}>
          Область уходит вместе с запросом — ссылку на результат можно
          сохранить.
        </p>
      </form>
    </>
  )
}
