"use client"

import { useState, type CSSProperties, type FormEvent } from "react"

export type Empty020Props = {
  title?: string
  text?: string
  eta?: string
  placeholder?: string
  submitLabel?: string
  confirmText?: string
  onSubscribe?: (email: string) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: раздел в разработке — не ошибка и не пустой список,
// а обещание на будущее. Форма подписки даёт конкретное действие вместо
// пассивного «загляните позже», а после отправки карточка сама сообщает,
// что запрос принят, — повторно нажимать кнопку незачем.
const STYLES = `
:where([data-vibeui-block="empty-020"]){
--vibeui-empty-020-bg:oklch(1 0 0);
--vibeui-empty-020-fg:oklch(0.21 0.014 265);
--vibeui-empty-020-muted:oklch(0.55 0.014 265);
--vibeui-empty-020-border:oklch(0.91 0.006 265);
--vibeui-empty-020-accent:oklch(0.55 0.17 265);
--vibeui-empty-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="empty-020"]{
display:flex;flex-direction:column;align-items:center;gap:0.625rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:1.75rem 1.5rem;
text-align:center;
background:var(--vibeui-empty-020-bg);
border:1px solid var(--vibeui-empty-020-border);border-radius:1rem;
font-family:var(--vibeui-empty-020-font);color:var(--vibeui-empty-020-fg);
}
[data-vibeui-block="empty-020"] [data-part="mark"]{
width:2.5rem;height:2.5rem;color:var(--vibeui-empty-020-accent);
}
[data-vibeui-block="empty-020"] [data-part="eta"]{
display:inline-flex;padding:0.25rem 0.625rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-empty-020-accent) 10%,transparent);
color:var(--vibeui-empty-020-fg);font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="empty-020"] [data-part="title"]{margin:0.125rem 0 0;font-size:1.0625rem;font-weight:700;line-height:1.3}
[data-vibeui-block="empty-020"] [data-part="text"]{
margin:0;max-width:34ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-empty-020-muted);
}
[data-vibeui-block="empty-020"] [data-part="form"]{
display:flex;gap:0.5rem;width:100%;margin-top:0.5rem;
}
[data-vibeui-block="empty-020"] [data-part="field-label"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="empty-020"] [data-part="field"]{
flex:1;min-width:0;height:2.625rem;padding:0 0.875rem;border-radius:0.75rem;
border:1px solid var(--vibeui-empty-020-border);background:var(--vibeui-empty-020-bg);
color:var(--vibeui-empty-020-fg);font:inherit;font-size:0.875rem;
}
[data-vibeui-block="empty-020"] [data-part="field"]:focus-visible{
outline:2px solid var(--vibeui-empty-020-accent);outline-offset:1px;
}
[data-vibeui-block="empty-020"] [data-part="submit"]{
appearance:none;border:0;cursor:pointer;flex:none;
height:2.625rem;padding:0 1.125rem;border-radius:0.75rem;
background:var(--vibeui-empty-020-accent);color:oklch(0.99 0.01 265);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="empty-020"] [data-part="submit"]:focus-visible{
outline:2px solid var(--vibeui-empty-020-accent);outline-offset:2px;
}
[data-vibeui-block="empty-020"] [data-part="confirm"]{
display:flex;align-items:center;gap:0.5rem;margin-top:0.5rem;
padding:0.625rem 0.875rem;border-radius:0.75rem;
background:color-mix(in oklab,var(--vibeui-empty-020-accent) 10%,transparent);
font-size:0.8125rem;font-weight:650;color:var(--vibeui-empty-020-fg);
}
[data-vibeui-block="empty-020"] [data-part="confirm"] svg{
flex:none;width:1.125rem;height:1.125rem;color:var(--vibeui-empty-020-accent);
}
@container (max-width: 22rem){
[data-vibeui-block="empty-020"] [data-part="form"]{flex-direction:column}
[data-vibeui-block="empty-020"] [data-part="submit"]{width:100%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-020"] *{animation:none!important;transition:none!important}}
`

/**
 * Раздел в разработке: обещание срока, форма подписки на уведомление и
 * подтверждение после отправки. Один файл, клиентский компонент на
 * useState, без внешних зависимостей.
 */
export function Empty020({
  title = "Скоро здесь появится новый раздел",
  text = "Мы ещё дорабатываем эту часть. Оставьте почту — напишем, как только всё будет готово.",
  eta = "Ожидается в этом квартале",
  placeholder = "you@example.com",
  submitLabel = "Уведомить меня",
  confirmText = "Готово, напишем на почту, когда раздел откроется",
  onSubscribe,
  accent,
  className,
  style,
}: Empty020Props) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-empty-020-accent": accent } : null),
    ...style,
  } as CSSProperties

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (email.trim() === "") return
    onSubscribe?.(email.trim())
    setSubmitted(true)
  }

  return (
    <>
      <style href="vibeui-empty-020" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="empty-020"
        role="status"
        className={className}
        style={palette}
      >
        <svg
          data-part="mark"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" />
        </svg>
        <span data-part="eta">{eta}</span>
        <h3 data-part="title">{title}</h3>
        <p data-part="text">{text}</p>
        {submitted ? (
          <p data-part="confirm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <polyline points="5 13 10 18 19 7" />
            </svg>
            {confirmText}
          </p>
        ) : (
          <form data-part="form" onSubmit={handleSubmit}>
            <label data-part="field-label" htmlFor="empty-020-email">
              Электронная почта
            </label>
            <input
              id="empty-020-email"
              data-part="field"
              type="email"
              required
              placeholder={placeholder}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button type="submit" data-part="submit">
              {submitLabel}
            </button>
          </form>
        )}
      </div>
    </>
  )
}
