"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Auth027Admin = {
  name: string
  role: string
}

export type Auth027Props = {
  title?: string
  resource?: string
  needed?: string
  admins?: Auth027Admin[]
  submit?: string
  /** Учётная запись, под которой вошли. */
  account?: string
  /** Пояснение под заголовком; {account} подставляется учётной записью. */
  lead?: string
  /** Текущая роль вошедшего. */
  role?: string
  /** Заголовок таблицы фактов. */
  factsTitle?: string
  /** Подпись строки с адресом страницы. */
  resourceLabel?: string
  /** Подпись строки с требуемым правом. */
  neededLabel?: string
  /** Подпись строки с текущей ролью. */
  roleLabel?: string
  /** Заголовок списка администраторов. */
  adminsTitle?: string
  /** Подпись поля причины. */
  reasonLabel?: string
  /** Подсказка в поле причины. */
  reasonPlaceholder?: string
  /** Сообщение после отправки запроса. */
  sentText?: string
  /** Ссылка на общий каталог. */
  backText?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: «нет доступа» как рабочий экран, а не тупик. Обычная страница
// 403 сообщает только запрет, и человек идёт искать нужного человека в чатах.
// Здесь названы три вещи, которых там нет: что именно закрыто, какое право
// требуется и кто конкретно может его выдать — с именами и ролями. Поле
// «зачем» не формальность: запрос без причины администратор откладывает,
// потому что не может его оценить, и доступ выдаётся к вечеру следующего дня.
// После отправки экран не подменяется другим: та же карточка сообщает, что
// запрос ушёл, — так человек видит, что его действие сработало, и не жмёт
// кнопку повторно.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственной подложки.
//
// Демонстрация интерфейса: запрос никуда не отправляется, права проверяет сервер.
const STYLES = `
:where([data-vibeui-block="auth-027"]){
--vibeui-auth-027-bg:transparent;
--vibeui-auth-027-card:light-dark(oklch(1 0 0),oklch(0.22 0.013 265));
--vibeui-auth-027-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-auth-027-muted:light-dark(oklch(0.54 0.014 265),oklch(0.71 0.012 265));
--vibeui-auth-027-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-auth-027-accent:light-dark(oklch(0.5 0.13 250),oklch(0.76 0.12 252));
--vibeui-auth-027-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.02 252));
--vibeui-auth-027-warn:light-dark(oklch(0.6 0.15 70),oklch(0.81 0.13 75));
--vibeui-auth-027-warn-soft:light-dark(oklch(0.6 0.15 70 / 14%),oklch(0.81 0.13 75 / 18%));
--vibeui-auth-027-ok:light-dark(oklch(0.55 0.13 152),oklch(0.78 0.12 152));
--vibeui-auth-027-ok-soft:light-dark(oklch(0.55 0.13 152 / 10%),oklch(0.78 0.12 152 / 16%));
--vibeui-auth-027-soft:light-dark(oklch(0.55 0.02 265 / 5%),oklch(0.82 0.02 265 / 8%));
--vibeui-auth-027-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-027"]{color-scheme:dark}
[data-vibeui-block="auth-027"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-027-bg);color:var(--vibeui-auth-027-fg);
font-family:var(--vibeui-auth-027-sans);
}
[data-vibeui-block="auth-027"] *{box-sizing:border-box}
[data-vibeui-block="auth-027"] [data-part="shell"]{
width:100%;max-width:24rem;margin:0 auto;padding:1.5rem;
background:var(--vibeui-auth-027-card);
border:1px solid var(--vibeui-auth-027-border);border-radius:1rem;
}
@container (min-width: 46rem){
[data-vibeui-block="auth-027"] [data-part="shell"]{max-width:38rem;padding:2rem}
[data-vibeui-block="auth-027"] [data-part="cols"]{display:grid;grid-template-columns:1.1fr 1fr;gap:1.5rem;align-items:start}
}
[data-vibeui-block="auth-027"] [data-part="head"]{display:flex;gap:0.75rem;margin-bottom:1.125rem}
[data-vibeui-block="auth-027"] [data-part="glyph"]{
flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:2.5rem;height:2.5rem;border-radius:0.75rem;
background:var(--vibeui-auth-027-warn-soft);color:var(--vibeui-auth-027-warn);
font-size:1.125rem;line-height:1;
}
[data-vibeui-block="auth-027"] h2{margin:0 0 0.25rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-027"] [data-part="lead"]{margin:0;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-027-muted)}
[data-vibeui-block="auth-027"] h3{margin:0 0 0.5rem;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--vibeui-auth-027-muted)}
[data-vibeui-block="auth-027"] [data-part="facts"]{list-style:none;margin:0 0 1.25rem;padding:0;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="auth-027"] [data-part="fact"]{
display:flex;justify-content:space-between;gap:0.75rem;
padding:0.5rem 0.6875rem;border-radius:0.625rem;
background:var(--vibeui-auth-027-soft);font-size:0.8125rem;
}
[data-vibeui-block="auth-027"] [data-part="fkey"]{color:var(--vibeui-auth-027-muted)}
[data-vibeui-block="auth-027"] [data-part="fval"]{font-weight:650;text-align:right}
[data-vibeui-block="auth-027"] [data-part="admins"]{list-style:none;margin:0 0 1.25rem;padding:0;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="auth-027"] [data-part="admin"]{display:flex;align-items:center;gap:0.625rem;font-size:0.8125rem}
[data-vibeui-block="auth-027"] [data-part="face"]{
flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:1.875rem;height:1.875rem;border-radius:9999px;
background:oklch(0.89 0.06 var(--vibeui-auth-027-hue));
color:oklch(0.34 0.11 var(--vibeui-auth-027-hue));
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="auth-027"] [data-part="aname"]{font-weight:650}
[data-vibeui-block="auth-027"] [data-part="arole"]{font-size:0.75rem;color:var(--vibeui-auth-027-muted)}
[data-vibeui-block="auth-027"] label{display:block;margin-bottom:0.3125rem;font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-027"] textarea{
width:100%;min-height:5rem;padding:0.5rem 0.75rem;resize:vertical;
border:1px solid var(--vibeui-auth-027-border);border-radius:0.625rem;
background:var(--vibeui-auth-027-card);color:inherit;font:inherit;font-size:0.875rem;line-height:1.5;
}
[data-vibeui-block="auth-027"] textarea:focus-visible{outline:2px solid var(--vibeui-auth-027-accent);outline-offset:1px;border-color:var(--vibeui-auth-027-accent)}
[data-vibeui-block="auth-027"] [data-part="submit"]{
width:100%;margin-top:0.75rem;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.625rem;padding:0.375rem 1rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-027-accent);color:var(--vibeui-auth-027-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
transition:opacity .16s ease;
}
[data-vibeui-block="auth-027"] [data-part="submit"]:disabled{cursor:not-allowed;opacity:.45}
[data-vibeui-block="auth-027"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-027-accent);outline-offset:2px}
[data-vibeui-block="auth-027"] [data-part="sent"]{
margin:0;padding:0.875rem;border-radius:0.75rem;
background:var(--vibeui-auth-027-ok-soft);color:var(--vibeui-auth-027-ok);
font-size:0.8125rem;line-height:1.5;font-weight:600;
}
[data-vibeui-block="auth-027"] [data-part="back"]{display:inline-block;margin-top:1rem;font-size:0.8125rem;color:var(--vibeui-auth-027-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-027"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ADMINS: Auth027Admin[] = [
  { name: "Пётр Гай", role: "владелец проекта" },
  { name: "Лиза Ким", role: "администратор доступа" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Экран «нет доступа» с запросом прав: что закрыто, какое право нужно,
 * кто его выдаёт и поле «зачем». Один файл, ноль зависимостей.
 */
export function Auth027({
  title = "Доступ закрыт",
  resource = "Каталог «Мера» / приватные блоки",
  needed = "Право «Читатель приватных блоков»",
  admins = DEFAULT_ADMINS,
  submit = "Запросить доступ",
  account = "anna@vibeui.ru",
  lead = "Вы вошли как {account}, но у этой учётной записи нет прав на страницу. Это не ошибка входа — аккаунт в порядке.",
  role = "Читатель",
  factsTitle = "Что закрыто",
  resourceLabel = "Страница",
  neededLabel = "Нужно право",
  roleLabel = "Ваша роль сейчас",
  adminsTitle = "Кто выдаёт",
  reasonLabel = "Зачем нужен доступ",
  reasonPlaceholder = "Например: собираю лендинг для клиента, нужны приватные блоки студии.",
  sentText = "Запрос отправлен обоим администраторам. Обычно отвечают в течение рабочего дня — придёт письмо, повторять не нужно.",
  backText = "Вернуться в общий каталог",
  background = "",
  accent,
  className,
  style,
}: Auth027Props) {
  const [reason, setReason] = useState("")
  const [sent, setSent] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-auth-027-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-027-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-027" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-027"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <span data-part="glyph" aria-hidden="true">
              ⛔
            </span>
            <div>
              <h2>{title}</h2>
              <p data-part="lead">{lead.replace("{account}", account)}</p>
            </div>
          </div>

          <div data-part="cols">
            <div>
              <h3>{factsTitle}</h3>
              <ul data-part="facts">
                <li data-part="fact">
                  <span data-part="fkey">{resourceLabel}</span>
                  <span data-part="fval">{resource}</span>
                </li>
                <li data-part="fact">
                  <span data-part="fkey">{neededLabel}</span>
                  <span data-part="fval">{needed}</span>
                </li>
                <li data-part="fact">
                  <span data-part="fkey">{roleLabel}</span>
                  <span data-part="fval">{role}</span>
                </li>
              </ul>

              <h3>{adminsTitle}</h3>
              <ul data-part="admins">
                {admins.map((admin) => (
                  <li
                    key={admin.name}
                    data-part="admin"
                    style={
                      {
                        "--vibeui-auth-027-hue": `${hue(admin.name)}`,
                      } as CSSProperties
                    }
                  >
                    <span data-part="face" aria-hidden="true">
                      {admin.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </span>
                    <span>
                      <span data-part="aname">{admin.name}</span>{" "}
                      <span data-part="arole">— {admin.role}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {sent ? (
                <p data-part="sent" role="status">
                  {sentText}
                </p>
              ) : (
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    setSent(true)
                  }}
                >
                  <label htmlFor="vibeui-auth-027-reason">{reasonLabel}</label>
                  <textarea
                    id="vibeui-auth-027-reason"
                    name="reason"
                    placeholder={reasonPlaceholder}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                  />
                  <button
                    type="submit"
                    data-part="submit"
                    disabled={reason.trim().length < 10}
                  >
                    {submit}
                  </button>
                </form>
              )}

              <a data-part="back" href="#">
                {backText}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
