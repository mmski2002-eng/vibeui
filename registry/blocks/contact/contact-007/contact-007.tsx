import type { CSSProperties, ReactNode } from "react"

type Contact007Item = {
  label: string
  description: string
  reply: string
  linkLabel: string
  href: string
  icon: "chat" | "mail" | "phone"
}

export type Contact007Props = {
  eyebrow?: string
  title?: string
  description?: string
  items?: Contact007Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Три канала связи равными карточками: назначение, обещанное время ответа и
// одно действие. Время ответа вынесено отдельной плашкой, а не спрятано в
// описании — именно оно решает, каким каналом воспользоваться.
const STYLES = `
:where([data-vibeui-block="contact-007"]){
--vibeui-contact-007-bg:transparent;
--vibeui-contact-007-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-contact-007-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-contact-007-muted:light-dark(oklch(0.5 0 0),oklch(0.71 0 0));
--vibeui-contact-007-border:light-dark(oklch(0.91 0 0),oklch(0.32 0 0));
--vibeui-contact-007-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-contact-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-007"]{color-scheme:dark}
[data-vibeui-block="contact-007"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-contact-007-bg);color:var(--vibeui-contact-007-ink);
font-family:var(--vibeui-contact-007-font);
}
[data-vibeui-block="contact-007"] [data-part="shell"]{max-width:70rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="contact-007"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-contact-007-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="contact-007"] [data-part="title"]{
margin:0;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="contact-007"] [data-part="description"]{
margin:0.875rem 0 0;max-width:52ch;color:var(--vibeui-contact-007-muted);
font-size:1rem;line-height:1.6;
}
[data-vibeui-block="contact-007"] [data-part="grid"]{display:grid;gap:1rem;margin:2rem 0 0;padding:0;list-style:none}
[data-vibeui-block="contact-007"] [data-part="card"]{
min-inline-size:0;display:flex;flex-direction:column;gap:0.875rem;
padding:1.5rem;border:1px solid var(--vibeui-contact-007-border);border-radius:1.125rem;
background:var(--vibeui-contact-007-card);
}
[data-vibeui-block="contact-007"] [data-part="icon"]{
width:2.75rem;height:2.75rem;border-radius:0.875rem;display:grid;place-items:center;
background:color-mix(in oklab,var(--vibeui-contact-007-accent) 12%,var(--vibeui-contact-007-card));
color:var(--vibeui-contact-007-accent);
}
[data-vibeui-block="contact-007"] [data-part="icon"] svg{width:1.375rem;height:1.375rem}
[data-vibeui-block="contact-007"] [data-part="name"]{margin:0;font-size:1.125rem;font-weight:650;letter-spacing:-0.01em}
[data-vibeui-block="contact-007"] [data-part="text"]{
margin:0;flex:1 1 auto;color:var(--vibeui-contact-007-muted);
font-size:0.9375rem;line-height:1.55;
}
[data-vibeui-block="contact-007"] [data-part="reply"]{
display:inline-flex;align-items:center;gap:0.4375rem;align-self:flex-start;
padding:0.3125rem 0.625rem;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-contact-007-accent) 9%,var(--vibeui-contact-007-card));
font-size:0.75rem;font-weight:650;letter-spacing:0.01em;
}
[data-vibeui-block="contact-007"] [data-part="reply"]::before{
content:"";width:0.4375rem;height:0.4375rem;border-radius:999px;flex:none;
background:var(--vibeui-contact-007-accent);
}
[data-vibeui-block="contact-007"] [data-part="link"]{
margin-top:0.25rem;padding-top:0.875rem;border-top:1px solid var(--vibeui-contact-007-border);
display:flex;align-items:center;gap:0.375rem;
color:var(--vibeui-contact-007-accent);font-size:0.9375rem;font-weight:650;text-decoration:none;
}
[data-vibeui-block="contact-007"] [data-part="link"]::after{content:"→";transition:translate 0.18s ease}
[data-vibeui-block="contact-007"] [data-part="link"]:hover{text-decoration:underline;text-underline-offset:0.25em}
[data-vibeui-block="contact-007"] [data-part="link"]:hover::after{translate:0.25rem 0}
[data-vibeui-block="contact-007"] [data-part="link"]:focus-visible{
outline:2px solid var(--vibeui-contact-007-accent);outline-offset:3px;border-radius:0.25rem;
}
@container (min-width: 40rem){
[data-vibeui-block="contact-007"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="contact-007"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-007"] *{animation:none!important;transition:none!important}}
`

const ICONS: Record<Contact007Item["icon"], ReactNode> = {
  chat: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.3 0-2.6-.3-3.7-.8L3 21l1.8-5.8A8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  ),
  mail: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  phone: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  ),
}

const DEFAULT_ITEMS: Contact007Item[] = [
  {
    label: "Чат",
    description:
      "Быстрые вопросы: установка блока, промокод, доступ к каталогу. Отвечает живой человек, не бот.",
    reply: "Отвечаем за 10 минут",
    linkLabel: "Написать в чат",
    href: "#chat",
    icon: "chat",
  },
  {
    label: "Почта",
    description:
      "Подробные вопросы: интеграция реестра, счета, партнёрство. Скриншоты и ссылки ускоряют ответ.",
    reply: "Отвечаем за 4 часа",
    linkLabel: "hello@vibeui.ru",
    href: "mailto:hello@vibeui.ru",
    icon: "mail",
  },
  {
    label: "Телефон",
    description:
      "Когда горит: сборка не выкатывается, а релиз сегодня. Говорим по-русски и по делу.",
    reply: "Пн–Пт, 10:00–19:00",
    linkLabel: "+7 495 120-45-90",
    href: "tel:+74951204590",
    icon: "phone",
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Три канала связи карточками: время ответа у каждого и одно действие. */
export function Contact007({
  eyebrow = "Контакты",
  title = "Выберите канал — мы уже на месте",
  description = "У каждого канала своё время ответа. Плашка под названием честная: цифры мы держим, а не обещаем.",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Contact007Props) {
  const palette = {
    ...(accent ? { "--vibeui-contact-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-contact-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contact-007" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="contact-007"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <p data-part="description">{description}</p>
          <ul data-part="grid">
            {items.map((item) => (
              <li key={item.label} data-part="card">
                <span data-part="icon" aria-hidden="true">
                  {ICONS[item.icon]}
                </span>
                <h3 data-part="name">{item.label}</h3>
                <p data-part="text">{item.description}</p>
                <span data-part="reply">{item.reply}</span>
                <a data-part="link" href={item.href}>
                  {item.linkLabel}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
