import type { CSSProperties } from "react"

export type Navmenu005Entry = {
  label: string
  hint?: string
  shotTitle?: string
  shotText?: string
  href?: string
}

export type Navmenu005Props = {
  entries?: Navmenu005Entry[]
  triggerLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: меню, у которого справа живёт превью. Наведение или фокус на
// строке показывает свою картинку — и всё это на :has(), без состояния и без JS.
// Картинки нарисованы градиентами по оттенку из подписи: меню остаётся одним
// файлом, не тянет за собой ассеты и не ждёт загрузки изображений.
const STYLES = `
:where([data-vibeui-block="navmenu-005"]){
--vibeui-navmenu-005-bg:oklch(1 0 0);
--vibeui-navmenu-005-fg:oklch(0.22 0.014 265);
--vibeui-navmenu-005-muted:oklch(0.55 0.014 265);
--vibeui-navmenu-005-border:oklch(0.91 0.006 265);
--vibeui-navmenu-005-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-navmenu-005-accent:oklch(0.55 0.2 262);
--vibeui-navmenu-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="navmenu-005"]{
box-sizing:border-box;width:100%;max-width:40rem;
font-family:var(--vibeui-navmenu-005-font);color:var(--vibeui-navmenu-005-fg);
}
[data-vibeui-block="navmenu-005"] [data-part="bar"]{
box-sizing:border-box;padding:0.375rem;
display:flex;align-items:center;gap:0.125rem;
background:var(--vibeui-navmenu-005-bg);
border:1px solid var(--vibeui-navmenu-005-border);border-radius:0.75rem;
anchor-name:--vibeui-navmenu-005-bar;
}
[data-vibeui-block="navmenu-005"] [data-part="trigger"],
[data-vibeui-block="navmenu-005"] [data-part="plain"]{
appearance:none;border:0;background:none;cursor:pointer;text-decoration:none;
display:inline-flex;align-items:center;height:2rem;padding:0 0.75rem;
border-radius:0.5rem;font:inherit;font-size:0.875rem;color:inherit;
}
[data-vibeui-block="navmenu-005"] [data-part="trigger"]:hover,
[data-vibeui-block="navmenu-005"] [data-part="plain"]:hover{background:var(--vibeui-navmenu-005-hover)}
[data-vibeui-block="navmenu-005"] [data-part="trigger"]:focus-visible,
[data-vibeui-block="navmenu-005"] [data-part="plain"]:focus-visible{outline:2px solid var(--vibeui-navmenu-005-accent);outline-offset:-2px}
[data-vibeui-block="navmenu-005"] [data-part="panel"]{
position:fixed;inset:auto;margin:0;
width:min(36rem,92vw);padding:0.625rem;box-sizing:border-box;
display:grid;grid-template-columns:minmax(10rem,1fr) minmax(10rem,1fr);gap:0.625rem;
background:var(--vibeui-navmenu-005-bg);color:var(--vibeui-navmenu-005-fg);
border:1px solid var(--vibeui-navmenu-005-border);border-radius:0.875rem;
font-family:var(--vibeui-navmenu-005-font);
box-shadow:0 24px 48px -24px oklch(0.2 0.03 265 / 40%);
}
@supports (anchor-name: --a){
[data-vibeui-block="navmenu-005"] [data-part="panel"]{
position-anchor:--vibeui-navmenu-005-bar;
position-area:bottom span-right;margin-top:0.5rem;
position-try-fallbacks:flip-block;
}
}
[data-vibeui-block="navmenu-005"] [data-part="list"]{margin:0;padding:0;list-style:none;display:grid;gap:0.125rem;align-content:start}
[data-vibeui-block="navmenu-005"] [data-part="link"]{
display:block;padding:0.5rem;border-radius:0.5rem;text-decoration:none;color:inherit;
}
[data-vibeui-block="navmenu-005"] [data-part="link"]:hover{background:var(--vibeui-navmenu-005-hover)}
[data-vibeui-block="navmenu-005"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-navmenu-005-accent);outline-offset:-2px}
[data-vibeui-block="navmenu-005"] [data-part="name"]{display:block;font-size:0.875rem;font-weight:550}
[data-vibeui-block="navmenu-005"] [data-part="hint"]{display:block;margin-top:0.0625rem;font-size:0.75rem;color:var(--vibeui-navmenu-005-muted)}
[data-vibeui-block="navmenu-005"] [data-part="stage"]{position:relative;min-height:11rem;border-radius:0.75rem;overflow:hidden}
/* Превью лежат стопкой: показывается то, чья строка под курсором или в фокусе. */
[data-vibeui-block="navmenu-005"] [data-part="shot"]{
position:absolute;inset:0;opacity:0;
display:flex;flex-direction:column;justify-content:flex-end;gap:0.25rem;
padding:0.875rem;box-sizing:border-box;
background:
radial-gradient(120% 80% at 20% 15%,oklch(1 0 0 / 70%),transparent 62%),
linear-gradient(150deg,oklch(0.92 0.08 var(--vibeui-navmenu-005-hue)),oklch(0.86 0.11 calc(var(--vibeui-navmenu-005-hue) + 40)));
border:1px solid var(--vibeui-navmenu-005-border);border-radius:0.75rem;
transition:opacity .18s ease;
}
[data-vibeui-block="navmenu-005"] [data-part="shot-title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="navmenu-005"] [data-part="shot-text"]{margin:0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-navmenu-005-muted)}
[data-vibeui-block="navmenu-005"] [data-part="panel"]:not(:has([data-part="link"]:hover)):not(:has([data-part="link"]:focus-visible)) [data-part="shot"][data-index="0"]{opacity:1}
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="0"]:hover) [data-part="shot"][data-index="0"],
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="0"]:focus-visible) [data-part="shot"][data-index="0"]{opacity:1}
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="1"]:hover) [data-part="shot"][data-index="1"],
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="1"]:focus-visible) [data-part="shot"][data-index="1"]{opacity:1}
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="2"]:hover) [data-part="shot"][data-index="2"],
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="2"]:focus-visible) [data-part="shot"][data-index="2"]{opacity:1}
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="3"]:hover) [data-part="shot"][data-index="3"],
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="3"]:focus-visible) [data-part="shot"][data-index="3"]{opacity:1}
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="4"]:hover) [data-part="shot"][data-index="4"],
[data-vibeui-block="navmenu-005"] [data-part="panel"]:has([data-part="link"][data-index="4"]:focus-visible) [data-part="shot"][data-index="4"]{opacity:1}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navmenu-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: Navmenu005Entry[] = [
  {
    label: "Редактор",
    hint: "Блоки, сетка, типографика",
    shotTitle: "Холст и блоки",
    shotText: "Страница собирается перетаскиванием, без вёрстки руками.",
  },
  {
    label: "Аналитика",
    hint: "Источники и воронки",
    shotTitle: "Отчёт за неделю",
    shotText: "Видно, откуда приходят и где отваливаются.",
  },
  {
    label: "Формы",
    hint: "Заявки и уведомления",
    shotTitle: "Заявки",
    shotText: "Каждое обращение уходит в почту и в таблицу.",
  },
  {
    label: "Домены",
    hint: "Адреса и сертификаты",
    shotTitle: "Свой адрес",
    shotText: "Сертификат выпускается и продлевается сам.",
  },
]

/**
 * Оттенок картинки берётся из подписи: превью узнаётся по цвету и не требует
 * ни одного файла изображения.
 */
function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0) ?? 0
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

/**
 * Меню с превью: наведение на ссылку показывает свою картинку справа.
 * Один файл, ноль зависимостей, собственная палитра, клиентского JS нет.
 */
export function Navmenu005({
  entries = DEFAULT_ENTRIES,
  triggerLabel = "Возможности",
  accent,
  className,
  style,
}: Navmenu005Props) {
  const palette = {
    ...(accent ? { "--vibeui-navmenu-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  const shown = entries.slice(0, 5)

  return (
    <>
      <style href="vibeui-navmenu-005" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-vibeui-block="navmenu-005"
        aria-label="Основная навигация"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <button
            type="button"
            data-part="trigger"
            aria-haspopup="true"
            popoverTarget="vibeui-navmenu-005-panel"
          >
            {triggerLabel}
          </button>
          <a data-part="plain" href="#">
            Цены
          </a>
          <a data-part="plain" href="#">
            Блог
          </a>
        </div>
        <div
          id="vibeui-navmenu-005-panel"
          data-part="panel"
          popover="auto"
          aria-label={triggerLabel}
        >
          <ul data-part="list">
            {shown.map((entry, index) => (
              <li key={entry.label}>
                <a data-part="link" data-index={index} href={entry.href ?? "#"}>
                  <span data-part="name">{entry.label}</span>
                  {entry.hint ? (
                    <span data-part="hint">{entry.hint}</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
          <div data-part="stage" aria-hidden="true">
            {shown.map((entry, index) => (
              <div
                key={entry.label}
                data-part="shot"
                data-index={index}
                style={
                  {
                    "--vibeui-navmenu-005-hue": `${hue(entry.label)}`,
                  } as CSSProperties
                }
              >
                <p data-part="shot-title">{entry.shotTitle ?? entry.label}</p>
                <p data-part="shot-text">{entry.shotText ?? entry.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}
