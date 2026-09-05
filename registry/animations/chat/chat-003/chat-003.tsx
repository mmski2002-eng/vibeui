import type { ComponentProps, CSSProperties } from "react"

export type Chat003Reply = {
  author: string
  text: string
  meta?: string
}

export type Chat003Reaction = {
  emoji: string
  count: number
}

export type Chat003Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  author?: string
  meta?: string
  message?: string
  replies?: Chat003Reply[]
  reactions?: Chat003Reaction[]
  accent?: string
  /** false — пилюли реакций скрыты. */
  showReactions?: boolean
  /** false — вертикальная линия треда убрана, ответы просто с отступом. */
  threadLine?: boolean
}

// Идея: тред обсуждения — корневое сообщение с пилюлями реакций и вложенные
// ответы, связанные вертикальной линией слева. Реакции всплывают (pop-scale
// с перелётом) по очереди, ответы въезжают снизу вверх со своим стаггером —
// два независимых, но согласованных по времени появления.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="chat-003"]){
--vibeui-chat-003-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-chat-003-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-chat-003-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-chat-003-muted:color-mix(in oklab,var(--vibeui-chat-003-fg) 58%,transparent);
--vibeui-chat-003-border:light-dark(oklch(0.92 0 0),oklch(0.28 0 0));
--vibeui-chat-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-chat-003-accent-fg:oklch(from var(--vibeui-chat-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-chat-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chat-003"]{color-scheme:dark}
[data-vibeui-block="chat-003"]{
display:block;box-sizing:border-box;width:100%;max-width:22rem;margin:0;
color:var(--vibeui-chat-003-fg);font-family:var(--vibeui-chat-003-font);
}
[data-vibeui-block="chat-003"] *{box-sizing:border-box}
[data-vibeui-block="chat-003"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-chat-003-border);
background:var(--vibeui-chat-003-card);padding:0.875rem 0.75rem;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="chat-003"] [data-part="root"]{display:flex;gap:0.625rem}
[data-vibeui-block="chat-003"] [data-part="avatar"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.75rem;height:1.75rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-chat-003-accent) 18%,transparent);
color:var(--vibeui-chat-003-accent);font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="chat-003"] [data-size="sm"]{width:1.375rem;height:1.375rem;font-size:0.5625rem}
[data-vibeui-block="chat-003"] [data-part="body"]{min-width:0;flex:1}
[data-vibeui-block="chat-003"] [data-part="top"]{
display:flex;align-items:baseline;gap:0.375rem;min-width:0;
}
[data-vibeui-block="chat-003"] [data-part="author"]{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="chat-003"] [data-part="meta"]{
flex:none;font-size:0.625rem;color:var(--vibeui-chat-003-muted);
}
[data-vibeui-block="chat-003"] [data-part="text"]{
margin:0.1875rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-chat-003-fg);
}
[data-vibeui-block="chat-003"] [data-part="reactions"]{
display:flex;flex-wrap:wrap;gap:0.3125rem;margin-top:0.5rem;
}
[data-vibeui-block="chat-003"] [data-part="reaction"]{
display:inline-flex;align-items:center;gap:0.25rem;
padding:0.1875rem 0.5rem;border-radius:9999px;
border:1px solid var(--vibeui-chat-003-border);
background:var(--vibeui-chat-003-frame);
font-size:0.625rem;font-weight:650;color:var(--vibeui-chat-003-muted);
animation:vibeui-chat-003-pop 0.42s cubic-bezier(0.34,1.56,0.64,1) both;
}
[data-vibeui-block="chat-003"] [data-part="reaction"]:nth-child(1){animation-delay:0.5s}
[data-vibeui-block="chat-003"] [data-part="reaction"]:nth-child(2){animation-delay:0.62s}
[data-vibeui-block="chat-003"] [data-part="reaction"]:nth-child(3){animation-delay:0.74s}
[data-vibeui-block="chat-003"] [data-part="reaction"]:nth-child(4){animation-delay:0.86s}
[data-vibeui-block="chat-003"] [data-part="emoji"]{font-size:0.75rem;line-height:1}
[data-vibeui-block="chat-003"] [data-part="replies"]{
display:flex;flex-direction:column;gap:0.625rem;
margin:0.75rem 0 0 0.875rem;padding-left:0.9375rem;
border-left:1px solid var(--vibeui-chat-003-border);
}
[data-vibeui-block="chat-003"] [data-line="false"]{border-left-color:transparent}
[data-vibeui-block="chat-003"] [data-part="reply"]{
display:flex;gap:0.5rem;
animation:vibeui-chat-003-rise 0.46s cubic-bezier(0.22,1,0.36,1) both;
}
[data-vibeui-block="chat-003"] [data-part="reply"]:nth-child(1){animation-delay:0.15s}
[data-vibeui-block="chat-003"] [data-part="reply"]:nth-child(2){animation-delay:0.34s}
[data-vibeui-block="chat-003"] [data-part="reply"]:nth-child(3){animation-delay:0.53s}
[data-vibeui-block="chat-003"] [data-part="reply"]:nth-child(4){animation-delay:0.72s}
@keyframes vibeui-chat-003-pop{from{opacity:0;transform:scale(0.4)}to{opacity:1;transform:scale(1)}}
@keyframes vibeui-chat-003-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chat-003"] [data-part="reaction"]{animation:none}
[data-vibeui-block="chat-003"] [data-part="reply"]{animation:none}
}
`

const DEFAULT_REPLIES: Chat003Reply[] = [
  {
    author: "Игорь Петров",
    text: "Выглядит отлично, только тень снизу тяжеловата",
    meta: "1 ч",
  },
  {
    author: "Марина Волкова",
    text: "Ок, сделаю мягче",
    meta: "45 мин",
  },
]

const DEFAULT_REACTIONS: Chat003Reaction[] = [
  { emoji: "👍", count: 4 },
  { emoji: "🎉", count: 2 },
  { emoji: "👀", count: 1 },
]

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?"
}

/**
 * Тред обсуждения: корневое сообщение с реакциями и вложенные ответы на
 * вертикальной линии. Реакции всплывают по очереди, ответы въезжают снизу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chat003({
  author = "Марина Волкова",
  meta = "2 ч назад",
  message = "Обновила макет карточки — добавила тени и поправила отступы. Гляньте, пожалуйста.",
  replies = DEFAULT_REPLIES,
  reactions = DEFAULT_REACTIONS,
  accent,
  showReactions = true,
  threadLine = true,
  className,
  style,
  ...props
}: Chat003Props) {
  const palette = {
    ...(accent ? { "--vibeui-chat-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chat-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="chat-003"
        data-slot="chat-thread"
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="root">
            <span data-part="avatar" aria-hidden="true">
              {initial(author)}
            </span>
            <div data-part="body">
              <div data-part="top">
                <span data-part="author">{author}</span>
                <span data-part="meta">{meta}</span>
              </div>
              <p data-part="text">{message}</p>
              {showReactions && reactions.length > 0 ? (
                <div data-part="reactions">
                  {reactions.map((reaction) => (
                    <span data-part="reaction" key={reaction.emoji}>
                      <span data-part="emoji" aria-hidden="true">
                        {reaction.emoji}
                      </span>
                      {reaction.count}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          {replies.length > 0 ? (
            <div data-part="replies" data-line={threadLine ? undefined : "false"}>
              {replies.map((reply) => (
                <div data-part="reply" key={`${reply.author}-${reply.text}`}>
                  <span data-part="avatar" data-size="sm" aria-hidden="true">
                    {initial(reply.author)}
                  </span>
                  <div data-part="body">
                    <div data-part="top">
                      <span data-part="author">{reply.author}</span>
                      {reply.meta ? (
                        <span data-part="meta">{reply.meta}</span>
                      ) : null}
                    </div>
                    <p data-part="text">{reply.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
