import type { ComponentProps, CSSProperties } from "react"

export type Chat002Message = {
  text: string
  /** "them" — собеседник слева, "me" — вы справа. */
  author?: "me" | "them"
}

export type Chat002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  avatarImage?: string
  title?: string
  status?: string
  messages?: Chat002Message[]
  /** Индикатор «печатает…» из трёх точек после последней реплики. */
  typing?: boolean
  accent?: string
}

// Идея: переписка двух собеседников — пузыри поднимаются снизу вверх и
// проявляются по очереди (stagger rise+fade при загрузке), у собеседника
// слева — круглая аватарка с инициалом, у вас справа — акцентный пузырь без
// аватарки. После последней реплики может держаться индикатор «печатает…» —
// три точки, пульсирующие вразнобой по кругу.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="chat-002"]){
--vibeui-chat-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-chat-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-chat-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-chat-002-muted:color-mix(in oklab,var(--vibeui-chat-002-fg) 58%,transparent);
--vibeui-chat-002-border:light-dark(oklch(0.92 0 0),oklch(0.28 0 0));
--vibeui-chat-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-chat-002-accent-fg:oklch(from var(--vibeui-chat-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-chat-002-bubble:light-dark(oklch(0.955 0 265),oklch(0.27 0 265));
--vibeui-chat-002-live:oklch(0.72 0.19 145);
--vibeui-chat-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chat-002"]{color-scheme:dark}
[data-vibeui-block="chat-002"]{
display:block;box-sizing:border-box;width:100%;max-width:21rem;margin:0;
color:var(--vibeui-chat-002-fg);font-family:var(--vibeui-chat-002-font);
}
[data-vibeui-block="chat-002"] *{box-sizing:border-box}
[data-vibeui-block="chat-002"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-chat-002-border);
background:var(--vibeui-chat-002-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="chat-002"] [data-part="head"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.625rem 0.75rem;border-bottom:1px solid var(--vibeui-chat-002-border);
background:var(--vibeui-chat-002-frame);border-radius:1rem 1rem 0 0;
}
[data-vibeui-block="chat-002"] [data-part="head-avatar"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.5rem;height:1.5rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-chat-002-accent) 22%,transparent);
color:var(--vibeui-chat-002-accent);font-size:0.625rem;font-weight:700;
}
[data-vibeui-block="chat-002"] [data-part="head-copy"]{min-width:0;flex:1}
[data-vibeui-block="chat-002"] [data-part="title"]{
margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="chat-002"] [data-part="status"]{
display:flex;align-items:center;gap:0.3125rem;
font-size:0.625rem;color:var(--vibeui-chat-002-muted);
}
[data-vibeui-block="chat-002"] [data-part="dot"]{
position:relative;width:0.375rem;height:0.375rem;flex:none;border-radius:9999px;
background:var(--vibeui-chat-002-live);
}
[data-vibeui-block="chat-002"] [data-part="dot"]::after{
content:"";position:absolute;inset:-2px;border-radius:9999px;
border:1px solid color-mix(in oklab,var(--vibeui-chat-002-live) 55%,transparent);
animation:vibeui-chat-002-ping 2.2s ease-out infinite;
}
[data-vibeui-block="chat-002"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.5rem;padding:0.875rem 0.75rem;
}
[data-vibeui-block="chat-002"] [data-part="row"]{
display:flex;align-items:flex-end;gap:0.5rem;
animation:vibeui-chat-002-rise 0.5s cubic-bezier(0.22,1,0.36,1) both;
}
[data-vibeui-block="chat-002"] [data-part="row"]:nth-child(1){animation-delay:0.05s}
[data-vibeui-block="chat-002"] [data-part="row"]:nth-child(2){animation-delay:0.32s}
[data-vibeui-block="chat-002"] [data-part="row"]:nth-child(3){animation-delay:0.59s}
[data-vibeui-block="chat-002"] [data-part="row"]:nth-child(4){animation-delay:0.86s}
[data-vibeui-block="chat-002"] [data-part="row"]:nth-child(5){animation-delay:1.13s}
[data-vibeui-block="chat-002"] [data-author="me"]{justify-content:flex-end}
[data-vibeui-block="chat-002"] [data-part="avatar"]{
position:relative;display:flex;align-items:center;justify-content:center;flex:none;
width:1.375rem;height:1.375rem;border-radius:9999px;
color:var(--vibeui-chat-002-accent);font-size:0.5625rem;font-weight:700;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="chat-002"] [data-part="avatar"][data-empty="true"]{background:color-mix(in oklab,var(--vibeui-chat-002-accent) 18%,transparent);}
[data-vibeui-block="chat-002"] [data-part="avatar"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;
}
[data-vibeui-block="chat-002"] [data-part="bubble"]{
max-width:74%;padding:0.5rem 0.75rem;border-radius:0.875rem;
font-size:0.75rem;line-height:1.45;
}
[data-vibeui-block="chat-002"] [data-author="them"] [data-part="bubble"]{
background:var(--vibeui-chat-002-bubble);color:var(--vibeui-chat-002-fg);
border-bottom-left-radius:0.25rem;
}
[data-vibeui-block="chat-002"] [data-author="me"] [data-part="bubble"]{
background:var(--vibeui-chat-002-accent);color:oklch(from var(--vibeui-chat-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
border-bottom-right-radius:0.25rem;
}
[data-vibeui-block="chat-002"] [data-part="typing"]{
display:inline-flex;align-items:center;gap:0.1875rem;
padding:0.5625rem 0.6875rem;border-radius:0.875rem;border-bottom-left-radius:0.25rem;
background:var(--vibeui-chat-002-bubble);
}
[data-vibeui-block="chat-002"] [data-part="typing"] span{
width:0.3125rem;height:0.3125rem;border-radius:9999px;
background:var(--vibeui-chat-002-muted);
animation:vibeui-chat-002-bounce 1.1s ease-in-out infinite;
}
[data-vibeui-block="chat-002"] [data-part="typing"] span:nth-child(2){animation-delay:0.15s}
[data-vibeui-block="chat-002"] [data-part="typing"] span:nth-child(3){animation-delay:0.3s}
@keyframes vibeui-chat-002-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes vibeui-chat-002-bounce{0%,60%,100%{transform:translateY(0);opacity:0.5}30%{transform:translateY(-3px);opacity:1}}
@keyframes vibeui-chat-002-ping{0%{transform:scale(0.8);opacity:0.7}100%{transform:scale(1.9);opacity:0}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chat-002"] [data-part="row"]{animation:none}
[data-vibeui-block="chat-002"] [data-part="typing"] span{animation:none;opacity:0.7}
[data-vibeui-block="chat-002"] [data-part="dot"]::after{animation:none;opacity:0}
}
`

const DEFAULT_MESSAGES: Chat002Message[] = [
  { text: "Привет! Готов созвониться в 15:00?", author: "them" },
  { text: "Да, буду вовремя", author: "me" },
  { text: "Отлично, скину ссылку на встречу", author: "them" },
]

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?"
}

/**
 * Переписка двух собеседников: пузыри поднимаются по очереди снизу вверх,
 * после последней реплики может держаться индикатор «печатает…» из трёх
 * пульсирующих точек. Один файл, ноль зависимостей, собственная палитра.
 */
export function Chat002({
  title = "Аня Соколова",
  avatarImage = "",
  status = "в сети",
  messages = DEFAULT_MESSAGES,
  typing = true,
  accent,
  className,
  style,
  ...props
}: Chat002Props) {
  const palette = {
    ...(accent ? { "--vibeui-chat-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chat-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="chat-002"
        data-slot="chat-bubbles"
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <span data-part="head-avatar" aria-hidden="true">
              {initial(title)}
            </span>
            <div data-part="head-copy">
              <p data-part="title">{title}</p>
              <span data-part="status">
                <span data-part="dot" aria-hidden="true" />
                {status}
              </span>
            </div>
          </div>
          <div data-part="list">
            {messages.map((message) => {
              const author = message.author ?? "them"

              return (
                <div
                  data-part="row"
                  data-author={author}
                  key={`${author}-${message.text}`}
                >
                  {author === "them" ? (
                    <span
                      data-part="avatar"
                      data-empty={avatarImage ? undefined : "true"}
                      aria-hidden="true"
                    >
                      {avatarImage ? (
                        <img
                          src={avatarImage}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                      ) : null}
                      {initial(title)}
                    </span>
                  ) : null}
                  <div data-part="bubble">{message.text}</div>
                </div>
              )
            })}
            {typing ? (
              <div data-part="row" data-author="them">
                <span data-part="avatar" aria-hidden="true">
                  {initial(title)}
                </span>
                <span data-part="typing" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
