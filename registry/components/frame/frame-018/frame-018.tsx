import type { ComponentProps, CSSProperties, ReactNode } from "react"

type Frame018Message = {
  text: string
  from: "me" | "them"
}

export type Frame018Props = Omit<ComponentProps<"figure">, "title"> & {
  contact?: string
  messages?: Frame018Message[]
  placeholder?: string
  caption?: string
  /** Подпись ленты сообщений; {name} подставляется именем собеседника. */
  feedLabel?: string
  /** Подпись поля ввода для вспомогательных технологий. */
  inputLabel?: string
  /** Подпись кнопки отправки для вспомогательных технологий. */
  sendLabel?: string
  accent?: string
  /** Пусто — подложки нет, кадр ложится на фон страницы. */
  background?: string
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
--vibeui-frame-018-bg:transparent;
--vibeui-frame-018-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-frame-018-muted:color-mix(in oklab,var(--vibeui-frame-018-fg) 68%,transparent);
--vibeui-frame-018-border:light-dark(oklch(0.89 0 265),oklch(0.4 0 265));
--vibeui-frame-018-them:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-frame-018-me:light-dark(oklch(0.55 0.14 39.8),oklch(0.62 0.15 39.8));
--vibeui-frame-018-me-fg:oklch(0.99 0 260);
--vibeui-frame-018-avatar:light-dark(oklch(0.55 0.14 39.8),oklch(0.62 0.15 39.8));
--vibeui-frame-018-avatar-fg:oklch(0.99 0 260);
--vibeui-frame-018-radius:0.875rem;
--vibeui-frame-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="frame-018"]{color-scheme:dark}
[data-vibeui-block="frame-018"]{
display:block;margin:0;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:26rem;box-sizing:border-box;
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
 * Кадр чата: заголовок с собеседником, лента пузырей сообщений и поле
 * ввода снизу. Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame018({
  contact = "Ева",
  messages = DEFAULT_MESSAGES,
  placeholder = "Сообщение…",
  caption = "Кадр чата: пузыри сообщений и поле ввода снизу",
  feedLabel = "Переписка с собеседником {name}",
  inputLabel = "Поле ввода сообщения (демо, не отправляет)",
  sendLabel = "Отправить сообщение (демо)",
  accent,
  background = "",
  children,
  className,
  style,
  ...props
}: Frame018Props) {
  const initial = contact.trim().charAt(0).toUpperCase() || "?"
  const palette = {
    ...(accent
      ? {
          "--vibeui-frame-018-me": accent,
          "--vibeui-frame-018-avatar": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-frame-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-018" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="frame"
        data-vibeui-block="frame-018"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="header">
            <span data-part="avatar" aria-hidden="true">
              {initial}
            </span>
            <p data-part="contact">{contact}</p>
          </div>
          <div
            data-part="feed"
            role="log"
            aria-label={feedLabel.replace("{name}", contact)}
          >
            {children ??
              messages.map((message, messageIndex) => (
                <p
                  key={messageIndex}
                  data-part="bubble"
                  data-from={message.from}
                >
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
              aria-label={inputLabel}
            />
            <button
              data-part="send"
              type="button"
              disabled
              aria-label={sendLabel}
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
