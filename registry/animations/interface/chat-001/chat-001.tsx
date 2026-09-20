import type { ComponentProps, CSSProperties } from "react"

export type Chat001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  /** Пилюля справа от заголовка: статус или имя модели. */
  badge?: string
  userMessage?: string
  /** Ответ ассистента: печатается по буквам слева направо. */
  assistantMessage?: string
  placeholder?: string
  accent?: string
  /** false — ответ показывается сразу, без печати и курсора. */
  streaming?: boolean
}

// Идея: чат с ИИ, где ответ ассистента печатается по буквам — ширина строки
// раскрывается ступенями (steps()) до величины, посчитанной из длины текста
// в ch, а в конце мигает текстовый курсор. Сообщение пользователя — отдельным
// пузырём справа, под лентой — неактивная строка ввода промпта. Точка статуса
// в шапке дышит кольцом, обозначая, что ассистент на связи.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="chat-001"]){
--vibeui-chat-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-chat-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-chat-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-chat-001-muted:color-mix(in oklab,var(--vibeui-chat-001-fg) 58%,transparent);
--vibeui-chat-001-border:light-dark(oklch(0.92 0 0),oklch(0.28 0 0));
--vibeui-chat-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-chat-001-accent-fg:oklch(from var(--vibeui-chat-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-chat-001-bubble:light-dark(oklch(0.955 0 265),oklch(0.27 0 265));
--vibeui-chat-001-live:oklch(0.72 0.19 145);
--vibeui-chat-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chat-001"]{color-scheme:dark}
[data-vibeui-block="chat-001"]{
display:block;box-sizing:border-box;width:100%;max-width:22rem;margin:0;
color:var(--vibeui-chat-001-fg);font-family:var(--vibeui-chat-001-font);
}
[data-vibeui-block="chat-001"] *{box-sizing:border-box}
[data-vibeui-block="chat-001"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-chat-001-border);
background:var(--vibeui-chat-001-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="chat-001"] [data-part="head"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.625rem 0.75rem;border-bottom:1px solid var(--vibeui-chat-001-border);
background:var(--vibeui-chat-001-frame);
}
[data-vibeui-block="chat-001"] [data-part="status"]{
position:relative;width:0.5rem;height:0.5rem;flex:none;border-radius:9999px;
background:var(--vibeui-chat-001-live);
}
[data-vibeui-block="chat-001"] [data-part="status"]::after{
content:"";position:absolute;inset:-3px;border-radius:9999px;
border:1px solid color-mix(in oklab,var(--vibeui-chat-001-live) 55%,transparent);
animation:vibeui-chat-001-ping 2.2s ease-out infinite;
}
[data-vibeui-block="chat-001"] [data-part="title"]{
margin:0;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="chat-001"] [data-part="badge"]{
flex:none;display:inline-flex;align-items:center;height:1.125rem;padding:0 0.4375rem;
border-radius:9999px;font-size:0.5625rem;font-weight:650;
color:var(--vibeui-chat-001-accent);
background:color-mix(in oklab,var(--vibeui-chat-001-accent) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-chat-001-accent) 22%,transparent);
}
[data-vibeui-block="chat-001"] [data-part="thread"]{
display:flex;flex-direction:column;gap:0.5rem;padding:0.875rem 0.75rem;
}
[data-vibeui-block="chat-001"] [data-part="row"]{display:flex}
[data-vibeui-block="chat-001"] [data-row="user"]{justify-content:flex-end}
[data-vibeui-block="chat-001"] [data-row="assistant"]{justify-content:flex-start}
[data-vibeui-block="chat-001"] [data-part="bubble"]{
max-width:85%;min-width:0;padding:0.5rem 0.75rem;border-radius:0.875rem;
font-size:0.75rem;line-height:1.45;
}
[data-vibeui-block="chat-001"] [data-row="user"] [data-part="bubble"]{
background:var(--vibeui-chat-001-accent);color:oklch(from var(--vibeui-chat-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
border-bottom-right-radius:0.25rem;
}
[data-vibeui-block="chat-001"] [data-row="assistant"] [data-part="bubble"]{
display:flex;align-items:flex-end;
background:var(--vibeui-chat-001-bubble);color:var(--vibeui-chat-001-fg);
border-bottom-left-radius:0.25rem;
}
[data-vibeui-block="chat-001"] [data-part="stream"]{
display:inline-block;overflow:hidden;white-space:nowrap;vertical-align:bottom;
width:0;animation:vibeui-chat-001-type 2.2s steps(24,end) 0.3s 1 both;
}
[data-vibeui-block="chat-001"][data-streaming="false"] [data-part="stream"]{width:auto;animation:none}
[data-vibeui-block="chat-001"] [data-part="caret"]{
display:inline-block;flex:none;width:2px;height:0.85em;margin-left:2px;
background:currentColor;animation:vibeui-chat-001-blink 0.9s step-end infinite;
}
[data-vibeui-block="chat-001"] [data-part="composer"]{
display:flex;align-items:center;gap:0.5rem;
margin:0 0.75rem 0.75rem;padding:0.5rem 0.5rem 0.5rem 0.8125rem;
border:1px solid var(--vibeui-chat-001-border);border-radius:9999px;
background:var(--vibeui-chat-001-frame);
}
[data-vibeui-block="chat-001"] [data-part="field"]{
flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;color:var(--vibeui-chat-001-muted);
}
[data-vibeui-block="chat-001"] [data-part="send"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.5rem;height:1.5rem;border-radius:9999px;
background:var(--vibeui-chat-001-accent);color:oklch(from var(--vibeui-chat-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="chat-001"] [data-part="send"] svg{width:0.75rem;height:0.75rem}
@keyframes vibeui-chat-001-type{to{width:calc(var(--vibeui-chat-001-chars,20) * 0.6em + 0.2rem)}}
@keyframes vibeui-chat-001-blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes vibeui-chat-001-ping{0%{transform:scale(0.8);opacity:0.7}100%{transform:scale(1.9);opacity:0}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chat-001"] [data-part="stream"]{width:auto;animation:none}
[data-vibeui-block="chat-001"] [data-part="caret"]{animation:none;opacity:0.6}
[data-vibeui-block="chat-001"] [data-part="status"]::after{animation:none;opacity:0}
}
`

const SEND = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 12h15" />
    <path d="m14 5 7 7-7 7" />
  </svg>
)

/**
 * Чат с ИИ: ответ ассистента печатается по буквам с мигающим курсором,
 * сообщение пользователя — пузырём справа, снизу строка ввода промпта.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chat001({
  title = "Ассистент",
  badge = "В сети",
  userMessage = "Помоги ускорить запрос к базе данных",
  assistantMessage = "Конечно, разберу его по шагам",
  placeholder = "Спросите что-нибудь…",
  accent,
  streaming = true,
  className,
  style,
  ...props
}: Chat001Props) {
  const palette = {
    ...(accent ? { "--vibeui-chat-001-accent": accent } : null),
    "--vibeui-chat-001-chars": assistantMessage.length,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chat-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="chat-001"
        data-slot="chat-ai-chat"
        data-streaming={streaming ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <span data-part="status" aria-hidden="true" />
            <p data-part="title">{title}</p>
            {badge ? <span data-part="badge">{badge}</span> : null}
          </div>
          <div data-part="thread">
            <div data-part="row" data-row="user">
              <div data-part="bubble">{userMessage}</div>
            </div>
            <div data-part="row" data-row="assistant">
              <div data-part="bubble">
                <span data-part="stream">{assistantMessage}</span>
                {streaming ? (
                  <span data-part="caret" aria-hidden="true" />
                ) : null}
              </div>
            </div>
          </div>
          <div data-part="composer">
            <span data-part="field">{placeholder}</span>
            <span data-part="send" aria-hidden="true">
              {SEND}
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
