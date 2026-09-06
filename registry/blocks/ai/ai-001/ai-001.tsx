"use client"

import { useState } from "react"
import type { CSSProperties, KeyboardEvent } from "react"

export type Ai001Message = {
  role: "user" | "assistant"
  text: string
  time?: string
}

export type Ai001Props = {
  title?: string
  status?: string
  messages?: Ai001Message[]
  suggestions?: string[]
  placeholder?: string
  /** Подпись автора реплики: компонент несёт русские, проект подставляет свои. */
  roleText?: Record<string, string>
  /** Название ленты для скринридера. */
  logLabel?: string
  sendText?: string
  hint?: string
  onSend?: (text: string) => void
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: окно чата с ассистентом. Лента объявлена role="log" с
// aria-live="polite": ответ должен быть услышан, но не перебивать набор.
// Enter отправляет, Shift+Enter переносит строку — привычка из мессенджеров,
// и без неё в поле нельзя написать абзац. Поле растёт вместе с текстом до
// потолка в несколько строк: сначала растягивается, потом прокручивается.
const STYLES = `
:where([data-vibeui-block="ai-001"]){
--vibeui-ai-001-bg:transparent;
--vibeui-ai-001-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-ai-001-muted:light-dark(oklch(0.55 0 265),oklch(0.69 0 265));
--vibeui-ai-001-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-ai-001-user:light-dark(oklch(0.55 0.2 39.8),oklch(0.56 0.18 39.8));
--vibeui-ai-001-user-fg:oklch(1 0 0);
--vibeui-ai-001-bubble:light-dark(oklch(0.97 0 265),oklch(0.29 0 265));
--vibeui-ai-001-field:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-ai-001-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.18 39.8));
--vibeui-ai-001-on-accent:oklch(0.15 0.02 39.8);
--vibeui-ai-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-001"]{color-scheme:dark}
[data-vibeui-block="ai-001"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:flex;flex-direction:column;box-sizing:border-box;overflow:hidden;
background:var(--vibeui-ai-001-bg);
border:1px solid var(--vibeui-ai-001-border);border-radius:1rem;
font-family:var(--vibeui-ai-001-sans);color:var(--vibeui-ai-001-fg);
}
[data-vibeui-block="ai-001"] *{box-sizing:border-box}
[data-vibeui-block="ai-001"] [data-part="head"]{
display:flex;align-items:center;gap:0.625rem;
min-height:3rem;padding:0 0.875rem;
border-bottom:1px solid var(--vibeui-ai-001-border);
}
[data-vibeui-block="ai-001"] [data-part="mark"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1.75rem;height:1.75rem;border-radius:0.625rem;
background:var(--vibeui-ai-001-accent);color:var(--vibeui-ai-001-on-accent);
font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="ai-001"] h2{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="ai-001"] [data-part="status"]{margin:0;font-size:0.75rem;color:var(--vibeui-ai-001-muted)}
/* Лента — role="log" с polite: ответ услышан, но не перебивает набор. */
[data-vibeui-block="ai-001"] [data-part="log"]{
display:flex;flex-direction:column;gap:0.625rem;
padding:0.875rem;height:17rem;overflow-y:auto;overscroll-behavior:contain;
}
[data-vibeui-block="ai-001"] [data-part="row"]{display:flex}
[data-vibeui-block="ai-001"] [data-role="user"]{justify-content:flex-end}
[data-vibeui-block="ai-001"] [data-part="bubble"]{
max-width:min(85%,32rem);padding:0.5rem 0.75rem;
border-radius:0.875rem;font-size:0.8125rem;line-height:1.5;
background:var(--vibeui-ai-001-bubble);
}
[data-vibeui-block="ai-001"] [data-role="user"] [data-part="bubble"]{
background:var(--vibeui-ai-001-user);color:var(--vibeui-ai-001-user-fg);
border-bottom-right-radius:0.3125rem;
}
[data-vibeui-block="ai-001"] [data-role="assistant"] [data-part="bubble"]{border-bottom-left-radius:0.3125rem}
[data-vibeui-block="ai-001"] [data-part="time"]{
display:block;margin-top:0.25rem;font-size:0.625rem;opacity:.7;
}
[data-vibeui-block="ai-001"] [data-part="chips"]{
display:flex;flex-wrap:wrap;gap:0.375rem;padding:0 0.875rem 0.625rem;
}
[data-vibeui-block="ai-001"] [data-part="chip"]{
appearance:none;cursor:pointer;
height:1.875rem;padding:0 0.625rem;border-radius:9999px;
border:1px solid var(--vibeui-ai-001-border);background:none;color:inherit;
font:inherit;font-size:0.75rem;
}
[data-vibeui-block="ai-001"] [data-part="chip"]:hover{background:var(--vibeui-ai-001-bubble)}
[data-vibeui-block="ai-001"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-ai-001-accent);outline-offset:2px}
[data-vibeui-block="ai-001"] [data-part="composer"]{
display:flex;align-items:flex-end;gap:0.5rem;
padding:0.625rem 0.875rem;border-top:1px solid var(--vibeui-ai-001-border);
}
/* Поле растёт до потолка, дальше прокручивается: абзац не выталкивает кнопку. */
[data-vibeui-block="ai-001"] textarea{
flex:1 1 auto;min-width:0;resize:none;
min-height:2.25rem;max-height:6rem;padding:0.5rem 0.75rem;
border:1px solid var(--vibeui-ai-001-border);border-radius:0.75rem;
background:var(--vibeui-ai-001-field);color:inherit;
font:inherit;font-size:0.8125rem;line-height:1.4;
field-sizing:content;
}
[data-vibeui-block="ai-001"] textarea:focus-visible{outline:2px solid var(--vibeui-ai-001-accent);outline-offset:1px}
[data-vibeui-block="ai-001"] [data-part="send"]{
appearance:none;cursor:pointer;flex:none;
height:2.25rem;padding:0 0.875rem;border:0;border-radius:0.75rem;
background:var(--vibeui-ai-001-accent);color:var(--vibeui-ai-001-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="ai-001"] [data-part="send"]:disabled{opacity:.5;cursor:default}
[data-vibeui-block="ai-001"] [data-part="send"]:focus-visible{outline:2px solid var(--vibeui-ai-001-accent);outline-offset:2px}
[data-vibeui-block="ai-001"] [data-part="hint"]{
margin:0;padding:0 0.875rem 0.75rem;font-size:0.6875rem;color:var(--vibeui-ai-001-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MESSAGES: Ai001Message[] = [
  {
    role: "user",
    text: "Нужна страница тарифов: три плана, годовая скидка и FAQ снизу.",
    time: "10:41",
  },
  {
    role: "assistant",
    text: "Возьму pricing-001 для планов и faq-001 для вопросов. Годовую скидку сделаю переключателем над карточками — так видно оба варианта цены.",
    time: "10:41",
  },
  {
    role: "user",
    text: "Давай. Только акцент фиолетовый.",
    time: "10:42",
  },
  {
    role: "assistant",
    text: "Готово: оба блока приняли акцент через проп accent, менять тему проекта не пришлось.",
    time: "10:42",
  },
]

const DEFAULT_SUGGESTIONS = [
  "Собрать лендинг",
  "Показать похожие блоки",
  "Объяснить установку",
]

const DEFAULT_ROLE_TEXT: Record<string, string> = {
  user: "Вы",
  assistant: "Ассистент",
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
 * Окно чата с ассистентом: лента, подсказки и поле с Enter на отправку.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Ai001({
  title = "Ассистент каталога",
  status = "Отвечает обычно за пару секунд",
  messages = DEFAULT_MESSAGES,
  suggestions = DEFAULT_SUGGESTIONS,
  placeholder = "Опишите, что нужно собрать",
  roleText = DEFAULT_ROLE_TEXT,
  logLabel = "Переписка",
  sendText = "Отправить",
  hint = "Enter отправляет, Shift + Enter переносит строку.",
  onSend,
  accent,
  background = "",
  className,
  style,
}: Ai001Props) {
  const [draft, setDraft] = useState("")

  const send = () => {
    const text = draft.trim()
    if (!text) return
    onSend?.(text)
    setDraft("")
  }

  // Enter отправляет, Shift+Enter переносит строку: привычка из мессенджеров.
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return
    event.preventDefault()
    send()
  }

  const palette = {
    ...(accent ? { "--vibeui-ai-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-ai-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-ai-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-001"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <span data-part="mark" aria-hidden="true">
            AI
          </span>
          <div>
            <h2>{title}</h2>
            <p data-part="status">{status}</p>
          </div>
        </header>

        <div
          data-part="log"
          role="log"
          aria-live="polite"
          aria-label={logLabel}
        >
          {messages.map((message) => (
            <div
              key={`${message.time}-${message.text}`}
              data-part="row"
              data-role={message.role}
            >
              <p data-part="bubble">
                {message.text}
                {message.time ? (
                  <span data-part="time">
                    {roleText[message.role] ?? DEFAULT_ROLE_TEXT[message.role]}{" "}
                    · {message.time}
                  </span>
                ) : null}
              </p>
            </div>
          ))}
        </div>

        <div data-part="chips">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              data-part="chip"
              onClick={() => setDraft(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div data-part="composer">
          <textarea
            rows={1}
            value={draft}
            placeholder={placeholder}
            aria-label={placeholder}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
          />
          <button
            type="button"
            data-part="send"
            disabled={draft.trim() === ""}
            onClick={send}
          >
            {sendText}
          </button>
        </div>
        <p data-part="hint">{hint}</p>
      </section>
    </>
  )
}
