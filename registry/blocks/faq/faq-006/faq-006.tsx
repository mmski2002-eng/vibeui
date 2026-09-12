import type { CSSProperties } from "react"

type Faq006Item = {
  question: string
  answer: string
}

type Faq006Channel = {
  label: string
  detail: string
  href: string
}

export type Faq006Props = {
  title?: string
  items?: Faq006Item[]
  helpTitle?: string
  helpText?: string
  channels?: Faq006Channel[]
  /** Подпись карточки помощи для скринридера. */
  helpLabel?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Вопросы с карточкой «не нашли ответ». Карточка стоит не после списка,
// а рядом с ним и на широкой раскладке залипает: человек, который не нашёл
// свой вопрос, не должен долистывать до конца, чтобы узнать, куда писать.
// Каналы связи — ссылки с пояснением, а не одна кнопка «Связаться».
//
// Тема приходит из color-scheme окружения через light-dark(): подложки у
// секции по умолчанию нет, она темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="faq-006"]){
--vibeui-faq-006-bg:transparent;
--vibeui-faq-006-card:light-dark(oklch(1 0 0),oklch(0.25 0.014 200));
--vibeui-faq-006-ink:light-dark(oklch(0.21 0.016 200),oklch(0.95 0.006 200));
--vibeui-faq-006-muted:light-dark(oklch(0.49 0.016 200),oklch(0.72 0.013 200));
--vibeui-faq-006-border:light-dark(oklch(0.9 0.008 200),oklch(0.35 0.014 200));
--vibeui-faq-006-accent:light-dark(oklch(0.28 0 0),oklch(0.903 0 0));
--vibeui-faq-006-accent-fg:oklch(from var(--vibeui-faq-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-faq-006-shadow:light-dark(oklch(0.2 0 0 / 70%),oklch(0 0 0 / 55%));
--vibeui-faq-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-006"]{color-scheme:dark}
[data-vibeui-block="faq-006"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-006-bg);color:var(--vibeui-faq-006-ink);
font-family:var(--vibeui-faq-006-font);
}
[data-vibeui-block="faq-006"] [data-part="shell"]{
display:grid;gap:2rem;
max-width:76rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="faq-006"] [data-part="title"]{
margin:0 0 1.25rem;max-width:18ch;
font-size:clamp(1.625rem,5cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="faq-006"] [data-part="item"]{border-top:1px solid var(--vibeui-faq-006-border)}
[data-vibeui-block="faq-006"] [data-part="item"]:last-of-type{border-bottom:1px solid var(--vibeui-faq-006-border)}
[data-vibeui-block="faq-006"] [data-part="item"] summary{
cursor:pointer;list-style:none;position:relative;
padding:1rem 2rem 1rem 0;
font-size:1rem;font-weight:600;line-height:1.4;
}
[data-vibeui-block="faq-006"] [data-part="item"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="faq-006"] [data-part="item"] summary::after{
content:"";position:absolute;right:0.375rem;top:1.3125rem;width:0.5rem;height:0.5rem;
border-right:2px solid var(--vibeui-faq-006-accent);border-bottom:2px solid var(--vibeui-faq-006-accent);
transform:rotate(45deg);
transition:transform .18s ease;
}
[data-vibeui-block="faq-006"] [data-part="item"][open] summary::after{transform:rotate(-135deg)}
[data-vibeui-block="faq-006"] [data-part="item"] summary:focus-visible{outline:2px solid var(--vibeui-faq-006-accent);outline-offset:-2px}
[data-vibeui-block="faq-006"] [data-part="answer"]{
margin:0;padding:0 2rem 1.25rem 0;max-width:60ch;
color:var(--vibeui-faq-006-muted);font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="faq-006"] [data-part="help"]{
align-self:start;
padding:1.5rem;border:1px solid var(--vibeui-faq-006-border);border-radius:1.25rem;
background:var(--vibeui-faq-006-card);
box-shadow:0 24px 50px -44px var(--vibeui-faq-006-shadow);
}
[data-vibeui-block="faq-006"] [data-part="help-title"]{
margin:0;font-size:1.125rem;font-weight:680;letter-spacing:-0.015em;
}
[data-vibeui-block="faq-006"] [data-part="help-text"]{
margin:0.5rem 0 1.25rem;color:var(--vibeui-faq-006-muted);font-size:0.9375rem;line-height:1.55;
}
[data-vibeui-block="faq-006"] [data-part="channels"]{display:grid;gap:0.5rem}
[data-vibeui-block="faq-006"] [data-part="channel"]{
display:block;padding:0.75rem 0.875rem;border-radius:0.875rem;
border:1px solid var(--vibeui-faq-006-border);
color:inherit;text-decoration:none;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="faq-006"] [data-part="channel"]:hover{
border-color:var(--vibeui-faq-006-accent);
background:color-mix(in oklab,var(--vibeui-faq-006-accent) 7%,transparent);
}
[data-vibeui-block="faq-006"] [data-part="channel"] strong{display:block;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="faq-006"] [data-part="channel"] span{display:block;margin-top:0.125rem;color:var(--vibeui-faq-006-muted);font-size:0.8125rem;line-height:1.4}
[data-vibeui-block="faq-006"] a:focus-visible,
[data-vibeui-block="faq-006"] summary:focus-visible{outline:2px solid var(--vibeui-faq-006-accent);outline-offset:2px}
@container (min-width: 52rem){
[data-vibeui-block="faq-006"] [data-part="shell"]{grid-template-columns:1.7fr 1fr;gap:3.5rem;padding:4.5rem 2rem}
[data-vibeui-block="faq-006"] [data-part="help"]{position:sticky;top:1.5rem}
[data-vibeui-block="faq-006"] [data-part="item"] summary{font-size:1.0625rem;padding-block:1.125rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Faq006Item[] = [
  {
    question: "Нужно ли устанавливать что-то на компьютер?",
    answer:
      "Нет, сервис работает в браузере. Приложение есть только для телефона и нужно ради уведомлений, не ради работы.",
  },
  {
    question: "Кто видит мои файлы?",
    answer:
      "Только участники проекта, которых вы добавили. Сотрудники поддержки не имеют доступа к содержимому без вашего явного разрешения в тикете.",
  },
  {
    question: "Можно ли работать без интернета?",
    answer:
      "Черновики сохраняются локально и уходят на сервер, когда связь вернётся. Совместное редактирование в офлайне недоступно.",
  },
  {
    question: "Как выгрузить всё, что накопилось?",
    answer:
      "В настройках есть выгрузка архивом: файлы в исходных форматах и таблицы в CSV. Готовится несколько минут, ссылка приходит на почту.",
  },
  {
    question: "Что будет, если сотрудник уволится?",
    answer:
      "Администратор отзывает доступ, а всё созданное остаётся в проекте и переходит к тому, кого назначите владельцем.",
  },
]

const DEFAULT_CHANNELS: Faq006Channel[] = [
  {
    label: "Написать в поддержку",
    detail: "Отвечаем за 15 минут в рабочие часы",
    href: "#support",
  },
  {
    label: "Позвонить",
    detail: "+7 495 000-11-22, будни с 9:00 до 19:00",
    href: "tel:+74950001122",
  },
  {
    label: "Заказать демонстрацию",
    detail: "Полчаса с инженером, показываем на ваших данных",
    href: "#demo",
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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

/** Вопросы с карточкой «не нашли ответ»: контакты рядом со списком, не после. */
export function Faq006({
  title = "Частые вопросы о работе сервиса",
  items = DEFAULT_ITEMS,
  helpTitle = "Не нашли ответ?",
  helpText = "Спросите живого человека. Мы не пересылаем вопросы по отделам: кто ответил первым, тот и доводит до решения.",
  channels = DEFAULT_CHANNELS,
  helpLabel = "Связаться с поддержкой",
  background = "",
  accent,
  className,
  style,
}: Faq006Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-faq-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-006"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="list">
            <h2 data-part="title">{title}</h2>
            {items.map((item) => (
              <details key={item.question} data-part="item">
                <summary>{item.question}</summary>
                <p data-part="answer">{item.answer}</p>
              </details>
            ))}
          </div>
          <aside data-part="help" aria-label={helpLabel}>
            <h3 data-part="help-title">{helpTitle}</h3>
            <p data-part="help-text">{helpText}</p>
            <div data-part="channels">
              {channels.map((channel) => (
                <a key={channel.href} data-part="channel" href={channel.href}>
                  <strong>{channel.label}</strong>
                  <span>{channel.detail}</span>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
