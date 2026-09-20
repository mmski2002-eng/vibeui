import type { ComponentProps, CSSProperties } from "react"

export type Collapsible006Props = Omit<
  ComponentProps<"details">,
  "children" | "title"
> & {
  title?: string
  people?: string[]
  visible?: number
  /** Доступная подпись кружка «+N». {count} — число скрытых участников. */
  restLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: свёртка, у которой в заголовке видно, сколько скрыто.
// Список участников почти всегда длиннее места, но «показать ещё» без числа
// не отвечает на главный вопрос — стоит ли разворачивать. Первые несколько
// имён остаются на виду, остальные сворачиваются в кружок «+N», и он же
// служит счётчиком. Инициалы берутся из имени, аватарки не нужны.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// по умолчанию нет, он темнеет вместе со страницей и не носит своей темы.
// Рамка кружка вынесена в отдельную переменную: подложка прозрачна, а эффект
// наложения в стеке держится именно на непрозрачном кольце.
const STYLES = `
:where([data-vibeui-block="collapsible-006"]){
--vibeui-collapsible-006-bg:transparent;
--vibeui-collapsible-006-ring:light-dark(oklch(1 0 0),oklch(0.19 0 265));
--vibeui-collapsible-006-chip:light-dark(oklch(1 0 0),oklch(0.27 0 265));
--vibeui-collapsible-006-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0 240));
--vibeui-collapsible-006-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-collapsible-006-muted:color-mix(in oklab,var(--vibeui-collapsible-006-fg) 68%,transparent);
--vibeui-collapsible-006-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-collapsible-006-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-collapsible-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="collapsible-006"]{color-scheme:dark}
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
border-radius:9999px;border:2px solid var(--vibeui-collapsible-006-ring);
background:color-mix(in oklab,var(--vibeui-collapsible-006-accent) 16%,var(--vibeui-collapsible-006-chip));
color:var(--vibeui-collapsible-006-accent);
font-size:0.625rem;font-weight:750;letter-spacing:0.01em;
}
/* Счётчик скрытых — это и есть ответ на вопрос «разворачивать ли». */
[data-vibeui-block="collapsible-006"] [data-part="chip"][data-rest="true"]{
background:var(--vibeui-collapsible-006-accent);color:oklch(from var(--vibeui-collapsible-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
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
 * Свёртка с подсчётом скрытых: первые участники на виду, остальные — за
 * кружком «+N». Один файл, ноль зависимостей, клиентского кода нет.
 */
export function Collapsible006({
  title = "Участники проекта",
  people = DEFAULT_PEOPLE,
  visible = 3,
  restLabel = "Ещё {count} участников",
  background = "",
  accent,
  className,
  style,
  ...props
}: Collapsible006Props) {
  const shown = people.slice(0, Math.max(0, visible))
  const hidden = people.slice(shown.length)

  // Кольцо кружка красится в подложку: задали фон — стек снова читается как
  // наложение, а не как слипшиеся круги.
  const palette = {
    ...(accent ? { "--vibeui-collapsible-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-collapsible-006-bg": background,
          "--vibeui-collapsible-006-ring": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-collapsible-006" precedence="medium">
        {STYLES}
      </style>
      <details
        {...props}
        data-slot="collapsible"
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
                aria-label={restLabel.replace("{count}", String(hidden.length))}
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
