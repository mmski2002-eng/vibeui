"use client"

import { useId, useState, type CSSProperties, type FormEvent } from "react"

export type Empty020Props = {
  title?: string
  text?: string
  eta?: string
  placeholder?: string
  submitLabel?: string
  confirmText?: string
  /** Подпись поля почты: видна только скринридеру. */
  fieldLabel?: string
  onSubscribe?: (email: string) => void
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-empty-020-bg:transparent;
--vibeui-empty-020-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.006 265));
--vibeui-empty-020-muted:color-mix(in oklab,var(--vibeui-empty-020-fg) 68%,transparent);
--vibeui-empty-020-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-empty-020-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-empty-020-on-accent:light-dark(oklch(0.99 0.01 265),oklch(0.18 0.02 265));
--vibeui-empty-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="empty-020"]{color-scheme:dark}
[data-vibeui-block="empty-020"]{
display:flex;flex-direction:column;align-items:center;gap:0.625rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:26rem;box-sizing:border-box;padding:1.75rem 1.5rem;
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
border:1px solid var(--vibeui-empty-020-border);background:transparent;
color:var(--vibeui-empty-020-fg);font:inherit;font-size:0.875rem;
}
[data-vibeui-block="empty-020"] [data-part="field"]:focus-visible{
outline:2px solid var(--vibeui-empty-020-accent);outline-offset:1px;
}
[data-vibeui-block="empty-020"] [data-part="submit"]{
appearance:none;border:0;cursor:pointer;flex:none;
height:2.625rem;padding:0 1.125rem;border-radius:0.75rem;
background:var(--vibeui-empty-020-accent);color:var(--vibeui-empty-020-on-accent);
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
  fieldLabel = "Электронная почта",
  onSubscribe,
  background = "",
  accent,
  className,
  style,
}: Empty020Props) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const fieldId = useId()
  const palette = {
    ...(accent ? { "--vibeui-empty-020-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-empty-020-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="empty"
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
            <label data-part="field-label" htmlFor={fieldId}>
              {fieldLabel}
            </label>
            <input
              id={fieldId}
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
