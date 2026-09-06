import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Search001Command = {
  label: string
  shortcut: string
  icon?: "search" | "settings" | "user" | "file" | "message"
}

export type Search001Group = {
  label: string
  commands: Search001Command[]
}

export type Search001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  query?: string
  groups?: Search001Group[]
  accent?: string
  /** false — запрос и строки видны сразу, без печати и въезда. */
  typing?: boolean
}

// Идея: командная палитра, где запрос печатается по буквам (steps(), как
// в chat-001), а под ней сгруппированные команды въезжают по очереди после
// того, как печать закончилась. Задержка каждой строки — не nth-child, а
// число из пропа --vibeui-search-001-row: группы вложены в разные <ul>, и
// нумерация nth-child внутри них сбросилась бы на каждой группе.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="search-001"]){
--vibeui-search-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-search-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-search-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-search-001-muted:color-mix(in oklab,var(--vibeui-search-001-fg) 58%,transparent);
--vibeui-search-001-border:light-dark(oklch(0.92 0 0),oklch(0.28 0 0));
--vibeui-search-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-search-001-accent-fg:oklch(from var(--vibeui-search-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-search-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="search-001"]{color-scheme:dark}
[data-vibeui-block="search-001"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-search-001-fg);font-family:var(--vibeui-search-001-font);
}
[data-vibeui-block="search-001"] *{box-sizing:border-box}
[data-vibeui-block="search-001"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-search-001-border);
background:var(--vibeui-search-001-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="search-001"] [data-part="field"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.6875rem 0.75rem;border-bottom:1px solid var(--vibeui-search-001-border);
}
[data-vibeui-block="search-001"] [data-part="field"] svg{
width:0.875rem;height:0.875rem;flex:none;color:var(--vibeui-search-001-muted);
}
[data-vibeui-block="search-001"] [data-part="query"]{
display:inline-flex;align-items:center;min-width:0;
font-size:0.8125rem;font-weight:550;
}
[data-vibeui-block="search-001"] [data-part="qtext"]{
display:inline-block;overflow:hidden;white-space:nowrap;
width:0;animation:vibeui-search-001-type 1s steps(var(--vibeui-search-001-chars,8),end) 0.2s 1 both;
}
[data-vibeui-block="search-001"][data-typing="false"] [data-part="qtext"]{width:auto;animation:none}
[data-vibeui-block="search-001"] [data-part="caret"]{
display:inline-block;flex:none;width:1px;height:0.9em;margin-left:1px;
background:currentColor;animation:vibeui-search-001-blink 0.9s step-end infinite;
}
[data-vibeui-block="search-001"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.75rem;padding:0.625rem;
}
[data-vibeui-block="search-001"] [data-part="glabel"]{
margin:0.125rem 0.375rem 0.125rem;
font-size:0.625rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-search-001-muted);
}
[data-vibeui-block="search-001"] [data-part="commands"]{
display:flex;flex-direction:column;gap:0.0625rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="search-001"] [data-part="row"]{
display:flex;align-items:center;gap:0.625rem;padding:0.4375rem 0.5rem;border-radius:0.625rem;
opacity:0;transform:translateY(4px);
animation:vibeui-search-001-rise 0.4s ease both;
animation-delay:calc(var(--vibeui-search-001-row,0) * 0.09s + 0.85s);
}
[data-vibeui-block="search-001"][data-typing="false"] [data-part="row"]{
animation-delay:calc(var(--vibeui-search-001-row,0) * 0.06s);
}
[data-vibeui-block="search-001"] [data-part="row"][data-active="true"]{
background:color-mix(in oklab,var(--vibeui-search-001-accent) 12%,transparent);
}
[data-vibeui-block="search-001"] [data-part="ricon"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.5rem;height:1.5rem;border-radius:0.5rem;
background:var(--vibeui-search-001-frame);color:var(--vibeui-search-001-muted);
}
[data-vibeui-block="search-001"] [data-part="row"][data-active="true"] [data-part="ricon"]{
color:var(--vibeui-search-001-accent);
}
[data-vibeui-block="search-001"] [data-part="ricon"] svg{width:0.8125rem;height:0.8125rem}
[data-vibeui-block="search-001"] [data-part="rlabel"]{
flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;font-weight:550;
}
[data-vibeui-block="search-001"] [data-part="kbd"]{
flex:none;display:inline-flex;align-items:center;gap:0.1875rem;
padding:0.125rem 0.375rem;border-radius:0.375rem;
font-size:0.625rem;font-weight:600;font-variant-numeric:tabular-nums;
color:var(--vibeui-search-001-muted);background:var(--vibeui-search-001-frame);
box-shadow:inset 0 0 0 1px var(--vibeui-search-001-border);
}
@keyframes vibeui-search-001-type{to{width:calc(var(--vibeui-search-001-chars,8) * 0.6em + 0.15rem)}}
@keyframes vibeui-search-001-blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes vibeui-search-001-rise{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="search-001"] [data-part="qtext"]{width:auto;animation:none}
[data-vibeui-block="search-001"] [data-part="caret"]{animation:none;opacity:0.6}
[data-vibeui-block="search-001"] [data-part="row"]{animation:none;opacity:1;transform:none}
}
`

const SEARCH = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const ICONS: Record<NonNullable<Search001Command["icon"]>, ReactNode> = {
  search: SEARCH,
  settings: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="8" cy="6" r="2" />
      <circle cx="16" cy="12" r="2" />
      <circle cx="10" cy="18" r="2" />
    </svg>
  ),
  user: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.2-3.8 4.2-6 7-6s5.8 2.2 7 6" />
    </svg>
  ),
  file: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
    </svg>
  ),
  message: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 5h16v11H8l-4 4z" />
    </svg>
  ),
}

const DEFAULT_GROUPS: Search001Group[] = [
  {
    label: "Навигация",
    commands: [
      { label: "Открыть настройки", shortcut: "Ctrl+,", icon: "settings" },
      { label: "Перейти в профиль", shortcut: "Ctrl+P", icon: "user" },
    ],
  },
  {
    label: "Действия",
    commands: [
      { label: "Создать проект", shortcut: "Ctrl+N", icon: "file" },
      { label: "Написать сообщение", shortcut: "Ctrl+M", icon: "message" },
    ],
  },
]

/**
 * Командная палитра: запрос печатается по буквам, сгруппированные команды
 * въезжают по очереди после печати. Один файл, ноль зависимостей,
 * собственная палитра.
 */
export function Search001({
  query = "настрой",
  groups = DEFAULT_GROUPS,
  accent,
  typing = true,
  className,
  style,
  ...props
}: Search001Props) {
  const palette = {
    ...(accent ? { "--vibeui-search-001-accent": accent } : null),
    "--vibeui-search-001-chars": query.length,
    ...style,
  } as CSSProperties

  // Сквозной номер строки для лесенки появления. Смещение группы считаем
  // заранее: менять счётчик по ходу разметки нельзя — рендер обязан быть
  // чистым, иначе повторный проход даст другие числа.
  const rowOffsets = groups.map((group, index) =>
    groups
      .slice(0, index)
      .reduce((sum, previous) => sum + previous.commands.length, 0),
  )

  return (
    <>
      <style href="vibeui-search-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="search-001"
        data-slot="search-command-palette"
        data-typing={typing ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="field">
            {SEARCH}
            <span data-part="query">
              <span data-part="qtext">{query}</span>
              {typing ? <span data-part="caret" aria-hidden="true" /> : null}
            </span>
          </div>
          <div data-part="list">
            {groups.map((group, groupIndex) => (
              <div key={group.label}>
                <p data-part="glabel">{group.label}</p>
                <ul data-part="commands">
                  {group.commands.map((command, index) => {
                    const rowStyle = {
                      "--vibeui-search-001-row": rowOffsets[groupIndex] + index,
                    } as CSSProperties

                    return (
                      <li
                        data-part="row"
                        data-active={index === 0 ? "true" : undefined}
                        style={rowStyle}
                        key={command.label}
                      >
                        <span data-part="ricon" aria-hidden="true">
                          {ICONS[command.icon ?? "file"]}
                        </span>
                        <span data-part="rlabel">{command.label}</span>
                        <span data-part="kbd">{command.shortcut}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
