import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Iconstack003Props = Omit<
  ComponentPropsWithoutRef<"details">,
  "children"
> & {
  names?: string[]
  max?: number
  label?: string
}

// Идея компонента: «+N» не тупик, а вход в полный список. Стопка лежит
// внутри summary, поэтому раскрытие работает на details без строчки
// клиентского кода и без состояния. Кому нужны остальные — раскрывает и
// читает имена; кому нет — видит компактную строку. Счётчик стоит слева от
// стопки, потому что справа он читается как ещё один участник.
const STYLES = `
:where([data-vibeui-block="iconstack-003"]){
--vibeui-iconstack-003-size:1.875rem;
--vibeui-iconstack-003-overlap:0.5625rem;
--vibeui-iconstack-003-surface:oklch(1 0 0);
--vibeui-iconstack-003-border:oklch(0.9 0.006 265);
--vibeui-iconstack-003-fg:oklch(0.26 0.014 265);
--vibeui-iconstack-003-muted:oklch(0.55 0.014 265);
--vibeui-iconstack-003-ring:oklch(0.55 0.17 262 / 60%);
--vibeui-iconstack-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: имена в раскрытом списке тёмные. */
[data-vibeui-block="iconstack-003"]{
display:inline-block;box-sizing:border-box;
min-width:14rem;padding:0.5rem 0.75rem;
background:var(--vibeui-iconstack-003-surface);
border:1px solid var(--vibeui-iconstack-003-border);border-radius:0.875rem;
font-family:var(--vibeui-iconstack-003-font);color:var(--vibeui-iconstack-003-fg);
}
[data-vibeui-block="iconstack-003"] summary{
display:flex;align-items:center;gap:0.625rem;cursor:pointer;list-style:none;
padding:0.25rem;margin:-0.25rem;border-radius:0.625rem;
}
[data-vibeui-block="iconstack-003"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="iconstack-003"] summary:focus-visible{outline:2px solid var(--vibeui-iconstack-003-ring);outline-offset:2px}
[data-vibeui-block="iconstack-003"] [data-part="stack"]{
display:inline-flex;flex-direction:row-reverse;justify-content:flex-end;flex:none;
}
[data-vibeui-block="iconstack-003"] [data-part="stack"] > *{
margin-right:calc(var(--vibeui-iconstack-003-overlap) * -1);
}
[data-vibeui-block="iconstack-003"] [data-part="stack"] > *:first-child{margin-right:0}
[data-vibeui-block="iconstack-003"] [data-part="face"],
[data-vibeui-block="iconstack-003"] [data-part="more"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;box-sizing:border-box;
width:var(--vibeui-iconstack-003-size);height:var(--vibeui-iconstack-003-size);
border-radius:9999px;border:2px solid var(--vibeui-iconstack-003-surface);
font-size:0.625rem;font-weight:700;line-height:1;
}
[data-vibeui-block="iconstack-003"] [data-part="face"]{
background:oklch(0.9 0.06 var(--vibeui-iconstack-003-hue,265));
color:oklch(0.36 0.12 var(--vibeui-iconstack-003-hue,265));
}
/* Счётчик слева от стопки: справа он читается как ещё один участник. */
[data-vibeui-block="iconstack-003"] [data-part="more"]{
background:oklch(0.28 0.014 265);color:oklch(0.99 0 0);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="iconstack-003"] [data-part="summary-text"]{
font-size:0.8125rem;color:var(--vibeui-iconstack-003-muted);
}
[data-vibeui-block="iconstack-003"] [data-part="chevron"]{
margin-left:auto;flex:none;font-size:0.6875rem;color:var(--vibeui-iconstack-003-muted);
transition:transform .16s ease;
}
[data-vibeui-block="iconstack-003"][open] [data-part="chevron"]{transform:rotate(180deg)}
[data-vibeui-block="iconstack-003"] ul{
list-style:none;margin:0.625rem 0 0;padding:0.625rem 0 0;
border-top:1px solid var(--vibeui-iconstack-003-border);
display:flex;flex-direction:column;gap:0.375rem;
font-size:0.8125rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="iconstack-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_NAMES = [
  "Анна Реброва",
  "Илья Мохов",
  "Ким Сон",
  "Пётр Гай",
  "Мария Лоза",
  "Олег Дин",
  "Ната Кир",
]

function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/**
 * Стопка со счётчиком «+N», раскрывающая полный список на details.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Iconstack003({
  names = DEFAULT_NAMES,
  max = 4,
  label = "участников",
  className,
  style,
  ...props
}: Iconstack003Props) {
  const shown = names.slice(0, max)
  const rest = names.length - shown.length

  return (
    <>
      <style href="vibeui-iconstack-003" precedence="medium">
        {STYLES}
      </style>
      <details
        {...props}
        data-vibeui-block="iconstack-003"
        className={className}
        style={style as CSSProperties}
      >
        <summary>
          <span data-part="stack" aria-hidden="true">
            {[...shown].reverse().map((name) => (
              <span
                key={name}
                data-part="face"
                style={
                  { "--vibeui-iconstack-003-hue": hue(name) } as CSSProperties
                }
              >
                {initials(name)}
              </span>
            ))}
            {rest > 0 ? <span data-part="more">+{rest}</span> : null}
          </span>
          <span data-part="summary-text">
            {names.length} {label}
          </span>
          <span data-part="chevron" aria-hidden="true">
            ▾
          </span>
        </summary>
        <ul>
          {names.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </details>
    </>
  )
}
