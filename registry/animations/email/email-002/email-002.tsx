import type { ComponentProps, CSSProperties } from "react"

export type Email002Message = {
  name: string
  preview: string
  time: string
  unread?: boolean
}

export type Email002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  /** Пилюля справа от заголовка: счётчик непрочитанных. */
  badge?: string
  messages?: Email002Message[]
  accent?: string
  /** Письма въезжают по очереди при появлении. */
  stagger?: boolean
  /** Точка непрочитанного мягко пульсирует. */
  pulseUnread?: boolean
}

// Идея: список писем — аватар-инициалы отправителя, имя, превью текста и
// время; непрочитанные выделены жирным именем и акцентной точкой слева,
// которая мягко пульсирует. Строки въезжают по очереди при появлении
// (stagger rise), как домино сверху вниз.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="email-002"]){
--vibeui-email-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-email-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-email-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-email-002-muted:color-mix(in oklab,var(--vibeui-email-002-fg) 58%,transparent);
--vibeui-email-002-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-email-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-email-002-accent-fg:oklch(from var(--vibeui-email-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-email-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="email-002"]{color-scheme:dark}
[data-vibeui-block="email-002"]{
display:block;box-sizing:border-box;width:100%;max-width:21rem;margin:0;
color:var(--vibeui-email-002-fg);font-family:var(--vibeui-email-002-font);
}
[data-vibeui-block="email-002"] *{box-sizing:border-box}
[data-vibeui-block="email-002"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-email-002-border);
background:var(--vibeui-email-002-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
overflow:hidden;
}
[data-vibeui-block="email-002"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.75rem;border-bottom:1px solid var(--vibeui-email-002-border);
}
[data-vibeui-block="email-002"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="email-002"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
height:1rem;min-width:1rem;padding:0 0.3125rem;border-radius:9999px;
font-size:0.5625rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-email-002-accent);
background:color-mix(in oklab,var(--vibeui-email-002-accent) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-email-002-accent) 22%,transparent);
}
[data-vibeui-block="email-002"] [data-part="list"]{
display:flex;flex-direction:column;margin:0;padding:0.375rem;list-style:none;
}
[data-vibeui-block="email-002"] [data-part="row"]{
display:flex;align-items:flex-start;gap:0.625rem;padding:0.5rem 0.375rem;
border-radius:0.75rem;
animation:vibeui-email-002-rise 0.5s cubic-bezier(0.22,1,0.36,1) both;
}
[data-vibeui-block="email-002"] [data-part="row"]:nth-child(1){animation-delay:0.05s}
[data-vibeui-block="email-002"] [data-part="row"]:nth-child(2){animation-delay:0.24s}
[data-vibeui-block="email-002"] [data-part="row"]:nth-child(3){animation-delay:0.43s}
[data-vibeui-block="email-002"] [data-part="row"]:nth-child(4){animation-delay:0.62s}
[data-vibeui-block="email-002"] [data-part="row"]:nth-child(5){animation-delay:0.81s}
[data-vibeui-block="email-002"][data-stagger="false"] [data-part="row"]{animation:none}
[data-vibeui-block="email-002"] [data-part="dot"]{
position:relative;flex:none;width:0.375rem;height:0.375rem;margin-top:0.5rem;
border-radius:9999px;background:transparent;
}
[data-vibeui-block="email-002"] [data-part="row"][data-unread="true"] [data-part="dot"]{
background:var(--vibeui-email-002-accent);
}
[data-vibeui-block="email-002"] [data-part="ping"]{
position:absolute;inset:0;border-radius:9999px;background:var(--vibeui-email-002-accent);
animation:vibeui-email-002-ping 2s ease-out infinite;
}
[data-vibeui-block="email-002"][data-pulse="false"] [data-part="ping"]{display:none}
[data-vibeui-block="email-002"] [data-part="avatar"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.75rem;height:1.75rem;border-radius:9999px;
color:var(--vibeui-email-002-accent);font-size:0.625rem;font-weight:700;
}
[data-vibeui-block="email-002"] [data-part="avatar"][data-tone="0"]{background:color-mix(in oklab,var(--vibeui-email-002-accent) 16%,transparent)}
[data-vibeui-block="email-002"] [data-part="avatar"][data-tone="1"]{background:color-mix(in oklab,var(--vibeui-email-002-accent) 24%,transparent)}
[data-vibeui-block="email-002"] [data-part="avatar"][data-tone="2"]{background:color-mix(in oklab,var(--vibeui-email-002-accent) 32%,transparent)}
[data-vibeui-block="email-002"] [data-part="avatar"][data-tone="3"]{background:color-mix(in oklab,var(--vibeui-email-002-accent) 40%,transparent)}
[data-vibeui-block="email-002"] [data-part="body"]{flex:1;min-width:0}
[data-vibeui-block="email-002"] [data-part="top"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="email-002"] [data-part="name"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;font-weight:500;color:var(--vibeui-email-002-fg);
}
[data-vibeui-block="email-002"] [data-part="row"][data-unread="true"] [data-part="name"]{font-weight:700}
[data-vibeui-block="email-002"] [data-part="time"]{
flex:none;font-size:0.625rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-email-002-muted);white-space:nowrap;
}
[data-vibeui-block="email-002"] [data-part="preview"]{
display:block;margin-top:0.125rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.6875rem;line-height:1.4;color:var(--vibeui-email-002-muted);
}
@keyframes vibeui-email-002-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes vibeui-email-002-ping{0%{transform:scale(1);opacity:0.55}100%{transform:scale(2.4);opacity:0}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="email-002"] [data-part="row"]{animation:none}
[data-vibeui-block="email-002"] [data-part="ping"]{animation:none;opacity:0}
}
`

const DEFAULT_MESSAGES: Email002Message[] = [
  {
    name: "Анна Смирнова",
    preview: "Отправила финальный вариант презентации на утверждение",
    time: "9:41",
    unread: true,
  },
  {
    name: "Игорь Петров",
    preview: "Готов созвониться в любое время после обеда",
    time: "9:12",
    unread: true,
  },
  {
    name: "Marketing Team",
    preview: "Еженедельная сводка метрик и охватов кампании",
    time: "Вчера",
  },
  {
    name: "Ольга Ким",
    preview: "Спасибо за быстрый ответ, распишу детали ниже",
    time: "Вчера",
  },
  {
    name: "GitHub",
    preview: "Новый pull request ждёт вашего ревью в репозитории",
    time: "Пн",
    unread: true,
  },
]

function initials(name: string) {
  const parts = name.trim().split(/\s+/)

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return (parts[0][0] + parts[1][0]).toUpperCase()
}

/**
 * Список писем: инициалы отправителя, имя, превью и время; непрочитанные —
 * жирным именем и пульсирующей акцентной точкой слева. Строки въезжают по
 * очереди при появлении. Один файл, ноль зависимостей, своя палитра.
 */
export function Email002({
  title = "Входящие",
  badge = "3 новых",
  messages = DEFAULT_MESSAGES,
  accent,
  stagger = true,
  pulseUnread = true,
  className,
  style,
  ...props
}: Email002Props) {
  const palette = {
    ...(accent ? { "--vibeui-email-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-email-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="email-002"
        data-slot="email-inbox"
        data-stagger={stagger ? undefined : "false"}
        data-pulse={pulseUnread ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="gtitle">{title}</p>
            {badge ? <span data-part="badge">{badge}</span> : null}
          </div>
          <ul data-part="list">
            {messages.map((message, index) => (
              <li
                data-part="row"
                data-unread={message.unread ? "true" : undefined}
                key={message.name + message.time}
              >
                <span data-part="dot" aria-hidden="true">
                  {message.unread ? <span data-part="ping" /> : null}
                </span>
                <span
                  data-part="avatar"
                  data-tone={String(index % 4)}
                  aria-hidden="true"
                >
                  {initials(message.name)}
                </span>
                <div data-part="body">
                  <div data-part="top">
                    <span data-part="name">{message.name}</span>
                    <span data-part="time">{message.time}</span>
                  </div>
                  <span data-part="preview">{message.preview}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
