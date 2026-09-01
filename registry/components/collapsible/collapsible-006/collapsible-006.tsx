import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Collapsible006Props = Omit<
  ComponentPropsWithoutRef<"details">,
  "children" | "title"
> & {
  title?: string
  people?: string[]
  visible?: number
  accent?: string
}

// Идея компонента: свёртка, у которой в заголовке видно, сколько скрыто.
// Список участников почти всегда длиннее места, но «показать ещё» без числа
// не отвечает на главный вопрос — стоит ли разворачивать. Первые несколько
// имён остаются на виду, остальные сворачиваются в кружок «+N», и он же
// служит счётчиком. Инициалы берутся из имени, аватарки не нужны.
const STYLES = `
:where([data-vibeui-block="collapsible-006"]){
--vibeui-collapsible-006-bg:oklch(1 0 0);
--vibeui-collapsible-006-fg:oklch(0.24 0.014 265);
--vibeui-collapsible-006-muted:oklch(0.56 0.014 265);
--vibeui-collapsible-006-border:oklch(0.9 0.006 265);
--vibeui-collapsible-006-accent:oklch(0.55 0.17 240);
--vibeui-collapsible-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="collapsible-006"]{
display:block;box-sizing:border-box;width:100%;max-width:23rem;
background:var(--vibeui-collapsible-006-bg);color:var(--vibeui-collapsible-006-fg);
border:1px solid var(--vibeui-collapsible-006-border);border-radius:1rem;
font-family:var(--vibeui-collapsible-006-font);
}
[data-vibeui-block="collapsible-006"] summary{
display:flex;align-items:center;gap:0.75rem;
padding:0.8125rem 0.875rem;cursor:pointer;list-style:none;border-radius:1rem;
font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="collapsible-006"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="collapsible-006"] summary:focus-visible{outline:2px solid var(--vibeui-collapsible-006-accent);outline-offset:-2px}
[data-vibeui-block="collapsible-006"] [data-part="stack"]{
display:flex;margin-left:auto;padding-left:0.375rem;
}
[data-vibeui-block="collapsible-006"] [data-part="chip"]{
display:grid;place-items:center;
width:1.625rem;height:1.625rem;margin-left:-0.375rem;box-sizing:border-box;
border-radius:9999px;border:2px solid var(--vibeui-collapsible-006-bg);
background:color-mix(in oklab,var(--vibeui-collapsible-006-accent) 16%,oklch(1 0 0));
color:var(--vibeui-collapsible-006-accent);
font-size:0.625rem;font-weight:750;letter-spacing:0.01em;
}
/* Счётчик скрытых — это и есть ответ на вопрос «разворачивать ли». */
[data-vibeui-block="collapsible-006"] [data-part="chip"][data-rest="true"]{
background:var(--vibeui-collapsible-006-accent);color:oklch(1 0 0);
}
[data-vibeui-block="collapsible-006"][open] [data-part="chip"][data-rest="true"]{
background:var(--vibeui-collapsible-006-fg);
}
[data-vibeui-block="collapsible-006"] [data-part="list"]{
list-style:none;margin:0;padding:0.5rem 0.5rem 0.625rem;
border-top:1px solid var(--vibeui-collapsible-006-border);
display:flex;flex-direction:column;
}
[data-vibeui-block="collapsible-006"] [data-part="list"] li{
display:flex;align-items:center;gap:0.625rem;
padding:0.3125rem 0.375rem;border-radius:0.5rem;
font-size:0.8125rem;color:var(--vibeui-collapsible-006-muted);
}
[data-vibeui-block="collapsible-006"] [data-part="list"] li [data-part="chip"]{margin-left:0;border-color:transparent}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="collapsible-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PEOPLE = [
  "Анна Ким",
  "Борис Радов",
  "Вера Ильина",
  "Глеб Мостовой",
  "Дина Салих",
  "Егор Панин",
  "Жанна Тур",
  "Захар Лемешев",
]

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/**
 * Свёртка с подсчётом скрытых: первые участники на виду, остальные — за
 * кружком «+N». Один файл, ноль зависимостей, клиентского кода нет.
 */
export function Collapsible006({
  title = "Участники проекта",
  people = DEFAULT_PEOPLE,
  visible = 3,
  accent,
  className,
  style,
  ...props
}: Collapsible006Props) {
  const shown = people.slice(0, Math.max(0, visible))
  const hidden = people.slice(shown.length)

  const palette = {
    ...(accent ? { "--vibeui-collapsible-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-collapsible-006" precedence="medium">
        {STYLES}
      </style>
      <details
        {...props}
        data-vibeui-block="collapsible-006"
        className={className}
        style={palette}
      >
        <summary>
          {title}
          <span data-part="stack">
            {shown.map((person) => (
              <span key={person} data-part="chip" title={person}>
                {initials(person)}
              </span>
            ))}
            {hidden.length > 0 ? (
              <span
                data-part="chip"
                data-rest="true"
                aria-label={`Ещё ${hidden.length} участников`}
              >
                +{hidden.length}
              </span>
            ) : null}
          </span>
        </summary>
        {hidden.length > 0 ? (
          <ul data-part="list">
            {hidden.map((person) => (
              <li key={person}>
                <span data-part="chip">{initials(person)}</span>
                {person}
              </li>
            ))}
          </ul>
        ) : null}
      </details>
    </>
  )
}
