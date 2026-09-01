import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

type Frame018Message = {
  text: string
  from: "me" | "them"
}

export type Frame018Props = Omit<ComponentPropsWithoutRef<"figure">, "title"> & {
  contact?: string
  messages?: Frame018Message[]
  placeholder?: string
  caption?: string
  children?: ReactNode
}

const DEFAULT_MESSAGES: Frame018Message[] = [
  { from: "them", text: "Привет! Макет чата почти готов." },
  { from: "me", text: "Отлично, скинь превью, когда будет время." },
  { from: "them", text: "Уже собираю кадр — пузыри и поле ввода." },
]

// Идея компонента: кадр чата — заголовок с собеседником, лента пузырей
// сообщений и поле ввода снизу. Своё сообщение и чужое различаются не
// только цветом, но и стороной выравнивания и формой хвостика пузыря —
// так смысл читается и без цвета. Поле ввода и кнопка отправки — настоящие
// disabled input и button: это честно сообщает вспомогательным технологиям,
// что перед ними макет, а не рабочая форма, и не требует клиентского JS.
const STYLES = `
:where([data-vibeui-block="frame-018"]){
--vibeui-frame-018-bg:oklch(1 0 0);
--vibeui-frame-018-fg:oklch(0.24 0.014 265);
--vibeui-frame-018-muted:oklch(0.55 0.014 265);
--vibeui-frame-018-border:oklch(0.89 0.006 265);
--vibeui-frame-018-them:oklch(0.96 0.004 265);
--vibeui-frame-018-me:oklch(0.55 0.14 260);
--vibeui-frame-018-me-fg:oklch(0.99 0.004 260);
--vibeui-frame-018-avatar:oklch(0.55 0.14 260);
--vibeui-frame-018-avatar-fg:oklch(0.99 0.004 260);
--vibeui-frame-018-radius:0.875rem;
--vibeui-frame-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="frame-018"]{
display:block;margin:0;width:100%;max-width:26rem;box-sizing:border-box;
font-family:var(--vibeui-frame-018-font);color:var(--vibeui-frame-018-fg);
}
[data-vibeui-block="frame-018"] *{box-sizing:border-box}
[data-vibeui-block="frame-018"] [data-part="shell"]{
display:flex;flex-direction:column;overflow:hidden;
background:var(--vibeui-frame-018-bg);
border:1px solid var(--vibeui-frame-018-border);
border-radius:var(--vibeui-frame-018-radius);
}
[data-vibeui-block="frame-018"] [data-part="header"]{
display:flex;align-items:center;gap:0.625rem;
flex:none;padding:0.75rem 1rem;
border-bottom:1px solid var(--vibeui-frame-018-border);
}
[data-vibeui-block="frame-018"] [data-part="avatar"]{
display:grid;place-items:center;flex:none;
width:2rem;height:2rem;border-radius:9999px;
background:var(--vibeui-frame-018-avatar);
color:var(--vibeui-frame-018-avatar-fg);
font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="frame-018"] [data-part="contact"]{
margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.875rem;font-weight:700;
}
[data-vibeui-block="frame-018"] [data-part="feed"]{
display:flex;flex-direction:column;gap:0.5rem;
padding:0.875rem 1rem;min-height:11rem;
}
[data-vibeui-block="frame-018"] [data-part="feed"] > *{max-width:78%}
[data-vibeui-block="frame-018"] [data-part="bubble"]{
margin:0;padding:0.5rem 0.75rem;
font-size:0.8125rem;line-height:1.45;
border-radius:1rem;
}
[data-vibeui-block="frame-018"] [data-part="bubble"][data-from="them"]{
align-self:flex-start;
background:var(--vibeui-frame-018-them);
color:var(--vibeui-frame-018-fg);
border-bottom-left-radius:0.25rem;
}
[data-vibeui-block="frame-018"] [data-part="bubble"][data-from="me"]{
align-self:flex-end;
background:var(--vibeui-frame-018-me);
color:var(--vibeui-frame-018-me-fg);
border-bottom-right-radius:0.25rem;
}
[data-vibeui-block="frame-018"] [data-part="composer"]{
display:flex;align-items:center;gap:0.5rem;
flex:none;padding:0.625rem 0.75rem;
border-top:1px solid var(--vibeui-frame-018-border);
}
[data-vibeui-block="frame-018"] [data-part="input"]{
flex:1 1 auto;min-width:0;
padding:0.5rem 0.875rem;border-radius:9999px;
border:1px solid var(--vibeui-frame-018-border);
background:var(--vibeui-frame-018-them);
color:var(--vibeui-frame-018-muted);
font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="frame-018"] [data-part="send"]{
display:grid;place-items:center;flex:none;
width:2.25rem;height:2.25rem;border-radius:9999px;
background:var(--vibeui-frame-018-me);
border:0;padding:0;
}
[data-vibeui-block="frame-018"] [data-part="send"] [data-part="triangle"]{
display:block;width:0;height:0;margin-left:0.1rem;
border-top:0.35rem solid transparent;
border-bottom:0.35rem solid transparent;
border-left:0.55rem solid var(--vibeui-frame-018-me-fg);
}
[data-vibeui-block="frame-018"] figcaption{
padding:0.625rem 1rem 0;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-frame-018-muted);
}
@container (max-width: 20rem){
[data-vibeui-block="frame-018"] [data-part="feed"] > *{max-width:88%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-018"] *{animation:none!important;transition:none!important}}
`

/**
 * Кадр чата: заголовок с собеседником, лента пузырей сообщений и поле
 * ввода снизу. Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame018({
  contact = "Ева",
  messages = DEFAULT_MESSAGES,
  placeholder = "Сообщение…",
  caption = "Кадр чата: пузыри сообщений и поле ввода снизу",
  children,
  className,
  style,
  ...props
}: Frame018Props) {
  const initial = contact.trim().charAt(0).toUpperCase() || "?"

  return (
    <>
      <style href="vibeui-frame-018" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="frame-018"
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="shell">
          <div data-part="header">
            <span data-part="avatar" aria-hidden="true">
              {initial}
            </span>
            <p data-part="contact">{contact}</p>
          </div>
          <div data-part="feed" role="log" aria-label={`Переписка с собеседником ${contact}`}>
            {children ??
              messages.map((message, messageIndex) => (
                <p key={messageIndex} data-part="bubble" data-from={message.from}>
                  {message.text}
                </p>
              ))}
          </div>
          <div data-part="composer">
            <input
              data-part="input"
              type="text"
              value={placeholder}
              disabled
              aria-label="Поле ввода сообщения (демо, не отправляет)"
            />
            <button
              data-part="send"
              type="button"
              disabled
              aria-label="Отправить сообщение (демо)"
            >
              <span data-part="triangle" aria-hidden="true" />
            </button>
          </div>
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}
