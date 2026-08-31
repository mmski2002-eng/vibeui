"use client"

import { useState } from "react"
import type { CSSProperties, KeyboardEvent } from "react"

export type Ai004Entry = {
  day: string
  role: "user" | "assistant"
  text: string
  time?: string
}

export type Ai004Props = {
  title?: string
  contextTitle?: string
  contextItems?: string[]
  entries?: Ai004Entry[]
  placeholder?: string
  onSend?: (text: string) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: рабочее окно длинного диалога, а не короткий виджет. Переписка
// разбита разделителями дней: без них история за неделю читается как одна
// каша. Над каждой репликой ассистента висит панель действий — «повторить»,
// «скопировать», «в задачу»; она появляется на hover и на клавиатурном
// фокусе, поэтому доступна и без мыши. Слева закреплён контекст задачи: то,
// что модель видит в каждом запросе, должно быть на глазах, иначе человек
// спорит с ответом, не понимая, откуда он взялся. Две колонки включаются
// от собственной ширины блока через container query.
const STYLES = `
:where([data-vibeui-block="ai-004"]){
--vibeui-ai-004-bg:oklch(0.99 0.002 265);
--vibeui-ai-004-card:oklch(1 0 0);
--vibeui-ai-004-fg:oklch(0.22 0.014 265);
--vibeui-ai-004-muted:oklch(0.54 0.014 265);
--vibeui-ai-004-border:oklch(0.91 0.006 265);
--vibeui-ai-004-bubble:oklch(0.97 0.003 265);
--vibeui-ai-004-accent:oklch(0.53 0.17 276);
--vibeui-ai-004-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="ai-004"]{
background:var(--vibeui-ai-004-bg);color:var(--vibeui-ai-004-fg);
font-family:var(--vibeui-ai-004-sans);
border:1px solid var(--vibeui-ai-004-border);border-radius:1.125rem;overflow:hidden;
}
[data-vibeui-block="ai-004"] *{box-sizing:border-box}
[data-vibeui-block="ai-004"] [data-part="shell"]{display:grid;gap:0}
[data-vibeui-block="ai-004"] [data-part="aside"]{
padding:1rem 1.125rem;border-bottom:1px solid var(--vibeui-ai-004-border);
background:var(--vibeui-ai-004-card);
}
[data-vibeui-block="ai-004"] h2{margin:0 0 0.75rem;font-size:0.9375rem;font-weight:680}
[data-vibeui-block="ai-004"] h3{
margin:0 0 0.5rem;font-size:0.6875rem;font-weight:650;
letter-spacing:0.08em;text-transform:uppercase;color:var(--vibeui-ai-004-muted);
}
[data-vibeui-block="ai-004"] [data-part="context"]{list-style:none;margin:0;padding:0;display:grid;gap:0.375rem}
[data-vibeui-block="ai-004"] [data-part="context"] li{
display:flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.5625rem;border-radius:0.625rem;
border:1px solid var(--vibeui-ai-004-border);
font-size:0.75rem;line-height:1.35;
}
[data-vibeui-block="ai-004"] [data-part="pin"]{
flex:none;width:0.375rem;height:0.375rem;border-radius:9999px;
background:var(--vibeui-ai-004-accent);
}
[data-vibeui-block="ai-004"] [data-part="thread"]{
display:flex;flex-direction:column;gap:0.75rem;
padding:1rem 1.125rem;max-height:24rem;overflow-y:auto;overscroll-behavior:contain;
}
/* Разделитель дня: история за неделю без него читается как одна каша. */
[data-vibeui-block="ai-004"] [data-part="day"]{
display:flex;align-items:center;gap:0.625rem;
font-size:0.6875rem;color:var(--vibeui-ai-004-muted);
}
[data-vibeui-block="ai-004"] [data-part="day"]::before,
[data-vibeui-block="ai-004"] [data-part="day"]::after{
content:"";flex:1 1 auto;height:1px;background:var(--vibeui-ai-004-border);
}
[data-vibeui-block="ai-004"] article{display:flex;flex-direction:column;gap:0.3125rem}
[data-vibeui-block="ai-004"] [data-role="user"]{align-items:flex-end}
[data-vibeui-block="ai-004"] [data-part="who"]{
font-size:0.6875rem;color:var(--vibeui-ai-004-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="ai-004"] [data-part="text"]{
margin:0;max-width:min(88%,40rem);padding:0.5625rem 0.8125rem;
border-radius:0.875rem;background:var(--vibeui-ai-004-card);
border:1px solid var(--vibeui-ai-004-border);
font-size:0.8125rem;line-height:1.55;
}
[data-vibeui-block="ai-004"] [data-role="user"] [data-part="text"]{
background:var(--vibeui-ai-004-bubble);border-color:transparent;
}
[data-vibeui-block="ai-004"] [data-part="tools"]{
display:flex;gap:0.25rem;opacity:0;transition:opacity .14s ease;
}
/* Панель действий доступна и с клавиатуры: focus-within, а не только hover. */
[data-vibeui-block="ai-004"] article:hover [data-part="tools"],
[data-vibeui-block="ai-004"] article:focus-within [data-part="tools"]{opacity:1}
[data-vibeui-block="ai-004"] [data-part="tools"] button{
appearance:none;cursor:pointer;background:none;color:var(--vibeui-ai-004-muted);
border:1px solid var(--vibeui-ai-004-border);border-radius:0.5rem;
height:1.625rem;padding:0 0.5rem;font:inherit;font-size:0.6875rem;
}
[data-vibeui-block="ai-004"] [data-part="tools"] button:hover{color:var(--vibeui-ai-004-fg)}
[data-vibeui-block="ai-004"] [data-part="composer"]{
display:flex;align-items:flex-end;gap:0.5rem;
padding:0.75rem 1.125rem 1rem;border-top:1px solid var(--vibeui-ai-004-border);
background:var(--vibeui-ai-004-card);
}
[data-vibeui-block="ai-004"] textarea{
flex:1 1 auto;min-width:0;resize:none;field-sizing:content;
min-height:2.375rem;max-height:7rem;padding:0.5625rem 0.75rem;
border:1px solid var(--vibeui-ai-004-border);border-radius:0.75rem;
background:var(--vibeui-ai-004-bg);color:inherit;
font:inherit;font-size:0.8125rem;line-height:1.45;
}
[data-vibeui-block="ai-004"] [data-part="send"]{
appearance:none;cursor:pointer;flex:none;border:0;
height:2.375rem;padding:0 1rem;border-radius:0.75rem;
background:var(--vibeui-ai-004-accent);color:oklch(1 0 0);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="ai-004"] [data-part="send"]:disabled{opacity:.45;cursor:default}
[data-vibeui-block="ai-004"] :focus-visible{outline:2px solid var(--vibeui-ai-004-accent);outline-offset:2px;border-radius:0.5rem}
@container (min-width: 46rem){
[data-vibeui-block="ai-004"] [data-part="shell"]{grid-template-columns:16rem 1fr}
[data-vibeui-block="ai-004"] [data-part="aside"]{
border-bottom:0;border-right:1px solid var(--vibeui-ai-004-border);grid-row:1 / span 2;
}
[data-vibeui-block="ai-004"] [data-part="thread"]{max-height:26rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CONTEXT = [
  "Бриф студии, 2 страницы",
  "Гайд по бренду: акцент #5B5BD6",
  "Каталог блоков VibeUI",
]

const DEFAULT_ENTRIES: Ai004Entry[] = [
  {
    day: "Вчера",
    role: "user",
    text: "Собери структуру лендинга под студию дизайна интерьеров.",
    time: "17:04",
  },
  {
    day: "Вчера",
    role: "assistant",
    text: "Предлагаю пять экранов: hero с фотографией проекта, услуги, галерея работ, тарифы на надзор и форма заявки. Галерею возьму из commerce, остальное — из marketing-блоков.",
    time: "17:04",
  },
  {
    day: "Сегодня",
    role: "user",
    text: "Галерея лишняя, вместо неё поставь отзывы клиентов.",
    time: "09:12",
  },
  {
    day: "Сегодня",
    role: "assistant",
    text: "Заменил: testimonials-001 с тремя карточками и указанием проекта. Порядок экранов сохранил, форму заявки оставил последней.",
    time: "09:12",
  },
]

/**
 * Рабочее окно диалога: закреплённый контекст, дни-разделители и действия
 * над репликой. Один файл, ноль зависимостей, собственная палитра.
 */
export function Ai004({
  title = "Диалог по проекту",
  contextTitle = "Контекст задачи",
  contextItems = DEFAULT_CONTEXT,
  entries = DEFAULT_ENTRIES,
  placeholder = "Уточните задачу или попросите переделать ответ",
  onSend,
  accent,
  className,
  style,
}: Ai004Props) {
  const [draft, setDraft] = useState("")

  const send = () => {
    const text = draft.trim()
    if (!text) return
    onSend?.(text)
    setDraft("")
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return
    event.preventDefault()
    send()
  }

  const palette = {
    ...(accent ? { "--vibeui-ai-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-ai-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-004"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <aside data-part="aside">
            <h2>{title}</h2>
            <h3>{contextTitle}</h3>
            <ul data-part="context">
              {contextItems.map((item) => (
                <li key={item}>
                  <span data-part="pin" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </aside>

          <div
            data-part="thread"
            role="log"
            aria-live="polite"
            aria-label="Переписка"
          >
            {entries.map((entry, index) => (
              <div key={`${entry.time}-${entry.text}`}>
                {entries[index - 1]?.day !== entry.day ? (
                  <p data-part="day">{entry.day}</p>
                ) : null}
                <article data-role={entry.role}>
                  <span data-part="who">
                    {entry.role === "user" ? "Вы" : "Ассистент"}
                    {entry.time ? ` · ${entry.time}` : ""}
                  </span>
                  <p data-part="text">{entry.text}</p>
                  {entry.role === "assistant" ? (
                    <div data-part="tools">
                      <button type="button">Повторить</button>
                      <button type="button">Скопировать</button>
                      <button type="button">В задачу</button>
                    </div>
                  ) : null}
                </article>
              </div>
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
              Отправить
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
