import type { ComponentProps, CSSProperties } from "react"

export type AiAnim002Cursor = {
  name: string
  you?: boolean
}

export type AiAnim002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  status?: string
  /** Ровно три курсора — под них рассчитаны траектории. */
  cursors?: AiAnim002Cursor[]
  accent?: string
  paused?: boolean
  /** false — имена курсоров скрыты, остаются только указатели. */
  showNames?: boolean
}

const DEFAULT_CURSORS: AiAnim002Cursor[] = [
  { name: "Вы", you: true },
  { name: "Аня" },
  { name: "Марк" },
]

const CURSOR = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M4 2.6 20.2 11a1 1 0 0 1-.1 1.83l-6.16 2.36-2.36 6.16A1 1 0 0 1 9.7 21.2L4 4.9V2.6Z" />
  </svg>
)

// Идея: общее полотно, по которому бродят курсоры коллег — каждый по своей
// замкнутой траектории (несколько точек translate в keyframes), с разной
// длительностью и задержкой, чтобы движение не выглядело синхронным. Курсор
// «Вы» несёт маленький аватар с инициалом рядом с указателем, у остальных —
// просто именная пилюля. Полотно — едва заметная точечная сетка, намёк на
// общий canvas без реального контента.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="ai-anim-002"]){
--vibeui-ai-anim-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-ai-anim-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-ai-anim-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-ai-anim-002-muted:color-mix(in oklab,var(--vibeui-ai-anim-002-fg) 58%,transparent);
--vibeui-ai-anim-002-border:light-dark(oklch(0.92 0 0),oklch(0.28 0 0));
--vibeui-ai-anim-002-accent:light-dark(oklch(0.58 0.19 265),oklch(0.75 0.16 265));
--vibeui-ai-anim-002-accent-fg:oklch(from var(--vibeui-ai-anim-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-ai-anim-002-c1:light-dark(oklch(0.62 0.19 25),oklch(0.72 0.17 25));
--vibeui-ai-anim-002-c2:light-dark(oklch(0.62 0.17 155),oklch(0.75 0.16 155));
--vibeui-ai-anim-002-live:oklch(0.72 0.19 145);
--vibeui-ai-anim-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-anim-002"]{color-scheme:dark}
[data-vibeui-block="ai-anim-002"]{
display:block;box-sizing:border-box;width:100%;max-width:22rem;margin:0;
color:var(--vibeui-ai-anim-002-fg);font-family:var(--vibeui-ai-anim-002-font);
}
[data-vibeui-block="ai-anim-002"] *{box-sizing:border-box}
[data-vibeui-block="ai-anim-002"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-ai-anim-002-border);
background:var(--vibeui-ai-anim-002-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="ai-anim-002"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.625rem 0.75rem;border-bottom:1px solid var(--vibeui-ai-anim-002-border);
}
[data-vibeui-block="ai-anim-002"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="ai-anim-002"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.3125rem;
font-size:0.625rem;font-weight:600;color:var(--vibeui-ai-anim-002-muted);
}
[data-vibeui-block="ai-anim-002"] [data-part="statusdot"]{
position:relative;width:0.375rem;height:0.375rem;border-radius:9999px;background:var(--vibeui-ai-anim-002-live);
}
[data-vibeui-block="ai-anim-002"] [data-part="statusdot"]::after{
content:"";position:absolute;inset:-3px;border-radius:9999px;
border:1px solid color-mix(in oklab,var(--vibeui-ai-anim-002-live) 55%,transparent);
animation:vibeui-ai-anim-002-ping 2.2s ease-out infinite;
}
[data-vibeui-block="ai-anim-002"] [data-part="canvas"]{
position:relative;height:12rem;margin:0.625rem;border-radius:0.75rem;overflow:hidden;
background-color:var(--vibeui-ai-anim-002-frame);
background-image:radial-gradient(var(--vibeui-ai-anim-002-border) 1px,transparent 1px);
background-size:16px 16px;
}
[data-vibeui-block="ai-anim-002"] [data-part="cursor"]{
position:absolute;top:0;left:0;display:flex;align-items:flex-start;gap:0.3125rem;
color:var(--vibeui-ai-anim-002-accent);
filter:drop-shadow(0 1px 1px oklch(0 0 0 / 0.25));
}
[data-vibeui-block="ai-anim-002"] [data-part="cursor"] svg{width:1rem;height:1rem;flex:none}
[data-vibeui-block="ai-anim-002"] [data-part="cursor"][data-index="0"]{
color:var(--vibeui-ai-anim-002-accent);
animation:vibeui-ai-anim-002-wander-0 9s ease-in-out infinite;
}
[data-vibeui-block="ai-anim-002"] [data-part="cursor"][data-index="1"]{
color:var(--vibeui-ai-anim-002-c1);
animation:vibeui-ai-anim-002-wander-1 11s ease-in-out infinite;
}
[data-vibeui-block="ai-anim-002"] [data-part="cursor"][data-index="2"]{
color:var(--vibeui-ai-anim-002-c2);
animation:vibeui-ai-anim-002-wander-2 7.5s ease-in-out infinite;
}
[data-vibeui-block="ai-anim-002"] [data-part="tag"]{
display:inline-flex;align-items:center;gap:0.25rem;flex:none;
padding:0.0625rem 0.375rem 0.0625rem 0.0625rem;border-radius:9999px;
background:currentColor;box-shadow:0 1px 2px oklch(0 0 0 / 0.2);
}
[data-vibeui-block="ai-anim-002"] [data-part="avatar"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-ai-anim-002-card);color:currentColor;
font-size:0.5rem;font-weight:750;
}
[data-vibeui-block="ai-anim-002"] [data-part="name"]{
font-size:0.5625rem;font-weight:650;color:var(--vibeui-ai-anim-002-accent-fg);white-space:nowrap;
}
[data-vibeui-block="ai-anim-002"][data-names="false"] [data-part="tag"]{display:none}
[data-vibeui-block="ai-anim-002"][data-paused="true"] [data-part="cursor"]{animation-play-state:paused}
@keyframes vibeui-ai-anim-002-wander-0{
0%{transform:translate(14px,26px)}
28%{transform:translate(196px,16px)}
55%{transform:translate(226px,118px)}
80%{transform:translate(70px,142px)}
100%{transform:translate(14px,26px)}
}
@keyframes vibeui-ai-anim-002-wander-1{
0%{transform:translate(180px,140px)}
30%{transform:translate(30px,110px)}
60%{transform:translate(90px,20px)}
85%{transform:translate(220px,60px)}
100%{transform:translate(180px,140px)}
}
@keyframes vibeui-ai-anim-002-wander-2{
0%{transform:translate(110px,60px)}
32%{transform:translate(220px,150px)}
62%{transform:translate(40px,150px)}
88%{transform:translate(60px,30px)}
100%{transform:translate(110px,60px)}
}
@keyframes vibeui-ai-anim-002-ping{0%{transform:scale(0.8);opacity:0.7}100%{transform:scale(1.9);opacity:0}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="ai-anim-002"] [data-part="cursor"]{animation:none}
[data-vibeui-block="ai-anim-002"] [data-part="cursor"][data-index="0"]{transform:translate(14px,26px)}
[data-vibeui-block="ai-anim-002"] [data-part="cursor"][data-index="1"]{transform:translate(180px,140px)}
[data-vibeui-block="ai-anim-002"] [data-part="cursor"][data-index="2"]{transform:translate(110px,60px)}
[data-vibeui-block="ai-anim-002"] [data-part="statusdot"]::after{animation:none;opacity:0}
}
`

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?"
}

/**
 * Общее полотно с живыми курсорами коллег: каждый бродит по своей замкнутой
 * траектории, курсор «Вы» несёт мини-аватар с инициалом. Один файл, ноль
 * зависимостей, собственная палитра, вся анимация на чистом CSS.
 */
export function AiAnim002({
  title = "Общий холст",
  status = "3 онлайн",
  cursors = DEFAULT_CURSORS,
  accent,
  paused = false,
  showNames = true,
  className,
  style,
  ...props
}: AiAnim002Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-anim-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const people = cursors.slice(0, 3)

  return (
    <>
      <style href="vibeui-ai-anim-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="ai-anim-002"
        data-slot="ai-presence"
        data-paused={paused ? "true" : undefined}
        data-names={showNames ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="title">{title}</p>
            <span data-part="status">
              <span data-part="statusdot" aria-hidden="true" />
              {status}
            </span>
          </div>
          <div data-part="canvas">
            {people.map((person, index) => (
              <div data-part="cursor" data-index={index} key={person.name}>
                {CURSOR}
                <span data-part="tag">
                  {person.you ? (
                    <span data-part="avatar" aria-hidden="true">
                      {initial(person.name)}
                    </span>
                  ) : null}
                  <span data-part="name">{person.name}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
