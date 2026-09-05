import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Notifications002Item = {
  label: string
  /** Вторая строка под заголовком: короткая деталь события. */
  detail?: string
  /** Относительное время: «2 мин», «1 ч» и т. п. */
  meta: string
  type?: "message" | "success" | "star" | "follow" | "alert"
  unread?: boolean
}

export type Notifications002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  /** Пилюля справа от заголовка: сколько всего непрочитанных. */
  unreadLabel?: string
  items?: Notifications002Item[]
  accent?: string
  /** Нижние строки растворяются к краю карточки. */
  fadeOut?: boolean
  /** false — строки один раз въезжают и застывают, без повторов. */
  loop?: boolean
}

// Идея: лента уведомлений, где строки поочерёдно въезжают снизу с
// затуханием. По умолчанию цикл бесконечный — строки уходят вверх и
// возвращаются с отрицательной задержкой по индексу (тот же приём, что и
// бегущие пакеты в connections-001), поэтому лента выглядит непрерывно
// живой. Непрочитанные строки помечены точкой и тонированным фоном —
// состояние читается не только текстом.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="notifications-002"]){
--vibeui-notifications-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-notifications-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-notifications-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-notifications-002-muted:color-mix(in oklab,var(--vibeui-notifications-002-fg) 60%,transparent);
--vibeui-notifications-002-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-notifications-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-notifications-002-accent-fg:oklch(from var(--vibeui-notifications-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-notifications-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="notifications-002"]{color-scheme:dark}
[data-vibeui-block="notifications-002"]{
display:block;box-sizing:border-box;width:100%;max-width:21rem;margin:0;
color:var(--vibeui-notifications-002-fg);font-family:var(--vibeui-notifications-002-font);
}
[data-vibeui-block="notifications-002"] *{box-sizing:border-box}
[data-vibeui-block="notifications-002"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-notifications-002-border);
background:var(--vibeui-notifications-002-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="notifications-002"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-notifications-002-border);
}
[data-vibeui-block="notifications-002"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="notifications-002"] [data-part="badge"]{
flex:none;display:inline-flex;align-items:center;height:1.125rem;padding:0 0.4375rem;
border-radius:9999px;font-size:0.5625rem;font-weight:650;
color:var(--vibeui-notifications-002-accent);
background:color-mix(in oklab,var(--vibeui-notifications-002-accent) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-notifications-002-accent) 22%,transparent);
}
[data-vibeui-block="notifications-002"] [data-part="list"]{
display:flex;flex-direction:column;margin:0;padding:0.375rem 0;list-style:none;
}
[data-vibeui-block="notifications-002"][data-fade="true"] [data-part="list"]{
-webkit-mask-image:linear-gradient(to bottom,#000 55%,transparent 100%);
mask-image:linear-gradient(to bottom,#000 55%,transparent 100%);
}
[data-vibeui-block="notifications-002"] [data-part="row"]{
position:relative;display:flex;align-items:flex-start;gap:0.625rem;
padding:0.5625rem 0.875rem;
animation:vibeui-notifications-002-cycle 5.5s ease-in-out infinite;
}
[data-vibeui-block="notifications-002"][data-loop="false"] [data-part="row"]{
animation:vibeui-notifications-002-enter 0.5s ease-out both;
}
[data-vibeui-block="notifications-002"] [data-part="row"][data-unread="true"]{
background:color-mix(in oklab,var(--vibeui-notifications-002-accent) 6%,transparent);
}
[data-vibeui-block="notifications-002"] [data-part="icon"]{
flex:none;display:flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;border-radius:0.625rem;margin-top:0.0625rem;
color:var(--vibeui-notifications-002-accent);
background:color-mix(in oklab,var(--vibeui-notifications-002-accent) 14%,transparent);
}
[data-vibeui-block="notifications-002"] [data-part="icon"] svg{width:0.875rem;height:0.875rem}
[data-vibeui-block="notifications-002"] [data-part="body"]{flex:1;min-width:0}
[data-vibeui-block="notifications-002"] [data-part="top"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="notifications-002"] [data-part="label"]{
min-width:0;font-size:0.75rem;font-weight:550;line-height:1.4;
}
[data-vibeui-block="notifications-002"] [data-part="meta"]{
flex:none;font-size:0.625rem;font-weight:550;font-variant-numeric:tabular-nums;
color:var(--vibeui-notifications-002-muted);white-space:nowrap;
}
[data-vibeui-block="notifications-002"] [data-part="detail"]{
display:block;margin-top:0.125rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.6875rem;line-height:1.4;color:var(--vibeui-notifications-002-muted);
}
[data-vibeui-block="notifications-002"] [data-part="dot"]{
flex:none;align-self:center;width:0.375rem;height:0.375rem;border-radius:9999px;
background:var(--vibeui-notifications-002-accent);
}
@keyframes vibeui-notifications-002-cycle{
0%{opacity:0;transform:translateY(10px)}
10%,78%{opacity:1;transform:translateY(0)}
100%{opacity:0;transform:translateY(-8px)}
}
@keyframes vibeui-notifications-002-enter{
from{opacity:0;transform:translateY(10px)}
to{opacity:1;transform:translateY(0)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="notifications-002"] [data-part="row"]{animation:none;opacity:1;transform:none}
}
`

const MESSAGE = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const SUCCESS = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const STAR = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </svg>
)

const FOLLOW = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 21a8 8 0 0 1 13.292-6" />
    <circle cx="10" cy="8" r="5" />
    <path d="M19 16v6" />
    <path d="M22 19h-6" />
  </svg>
)

const ALERT = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
)

const ICONS: Record<NonNullable<Notifications002Item["type"]>, ReactNode> = {
  message: MESSAGE,
  success: SUCCESS,
  star: STAR,
  follow: FOLLOW,
  alert: ALERT,
}

const DEFAULT_ITEMS: Notifications002Item[] = [
  {
    type: "message",
    label: "Анна оставила комментарий",
    detail: "«Отличная работа над релизом!»",
    meta: "2 мин",
    unread: true,
  },
  {
    type: "success",
    label: "Сборка прошла успешно",
    detail: "main → production",
    meta: "18 мин",
    unread: true,
  },
  {
    type: "star",
    label: "Игорь отметил проект избранным",
    meta: "1 ч",
    unread: true,
  },
  {
    type: "follow",
    label: "Новый подписчик — Мария",
    meta: "3 ч",
  },
  {
    type: "alert",
    label: "Истекает срок действия токена",
    detail: "Обновите ключ API до пятницы",
    meta: "1 д",
  },
]

/**
 * Лента уведомлений: иконка типа события, текст и время у каждой строки,
 * непрочитанные — точкой и тонированным фоном. Строки поочерёдно въезжают
 * снизу с затуханием. Один файл, ноль зависимостей, собственная палитра.
 */
export function Notifications002({
  title = "Уведомления",
  unreadLabel = "3 новых",
  items = DEFAULT_ITEMS,
  accent,
  fadeOut = false,
  loop = true,
  className,
  style,
  ...props
}: Notifications002Props) {
  const palette = {
    ...(accent ? { "--vibeui-notifications-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-notifications-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="notifications-002"
        data-slot="notifications-list"
        data-fade={fadeOut ? "true" : undefined}
        data-loop={loop ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="title">{title}</p>
            {unreadLabel ? <span data-part="badge">{unreadLabel}</span> : null}
          </div>
          <ul data-part="list">
            {items.map((item, index) => {
              const delay = loop
                ? `${-index * 0.42}s`
                : `${index * 0.09}s`

              return (
                <li
                  data-part="row"
                  data-unread={item.unread ? "true" : undefined}
                  key={item.label}
                  style={{ animationDelay: delay }}
                >
                  <span data-part="icon" aria-hidden="true">
                    {ICONS[item.type ?? "message"]}
                  </span>
                  <div data-part="body">
                    <div data-part="top">
                      <span data-part="label">{item.label}</span>
                      <span data-part="meta">{item.meta}</span>
                    </div>
                    {item.detail ? (
                      <span data-part="detail">{item.detail}</span>
                    ) : null}
                  </div>
                  {item.unread ? (
                    <span data-part="dot" aria-hidden="true" />
                  ) : null}
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
