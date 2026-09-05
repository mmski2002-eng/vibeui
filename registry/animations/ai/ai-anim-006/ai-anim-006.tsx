import type { ComponentProps, CSSProperties } from "react"

export type AiAnim006Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  listeningLabel?: string
  thinkingLabel?: string
  speakingLabel?: string
  accent?: string
  paused?: boolean
  /** false — подпись текущего состояния скрыта, остаётся только сфера. */
  labels?: boolean
}

// Идея: голосовой orb циклически проходит три состояния в одном общем
// таймлайне 9с (по 3с на состояние): слушает — вокруг сферы пульсирует
// кольцо звуковых волн; думает — три точки вращаются по орбите; говорит —
// эквалайзер из столбиков колышется внутри кольца. Все три группы элементов
// всегда в разметке, видимость каждой задаётся собственным opacity-кейфреймом
// с окном на треть цикла, а сама сфера мягко пульсирует и меняет оттенок —
// тот же приём фазовых окон, что и в ai-anim-001 и ai-anim-005.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="ai-anim-006"]){
--vibeui-ai-anim-006-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-ai-anim-006-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-ai-anim-006-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-ai-anim-006-muted:color-mix(in oklab,var(--vibeui-ai-anim-006-fg) 56%,transparent);
--vibeui-ai-anim-006-border:light-dark(oklch(0.92 0 0),oklch(0.28 0 0));
--vibeui-ai-anim-006-accent:light-dark(oklch(0.6 0.19 290),oklch(0.75 0.16 290));
--vibeui-ai-anim-006-accent2:light-dark(oklch(0.68 0.17 220),oklch(0.78 0.14 220));
--vibeui-ai-anim-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-anim-006"]{color-scheme:dark}
[data-vibeui-block="ai-anim-006"]{
display:block;box-sizing:border-box;width:100%;max-width:18rem;margin:0;
color:var(--vibeui-ai-anim-006-fg);font-family:var(--vibeui-ai-anim-006-font);
}
[data-vibeui-block="ai-anim-006"] *{box-sizing:border-box}
[data-vibeui-block="ai-anim-006"] [data-part="card"]{
display:flex;flex-direction:column;align-items:center;gap:0.75rem;
padding:1.75rem 1.25rem;border-radius:1rem;border:1px solid var(--vibeui-ai-anim-006-border);
background:var(--vibeui-ai-anim-006-card);box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="ai-anim-006"] [data-part="stage"]{
position:relative;width:7.5rem;height:7.5rem;display:flex;align-items:center;justify-content:center;
}
[data-vibeui-block="ai-anim-006"] [data-part="orb"]{
position:relative;width:3.75rem;height:3.75rem;border-radius:9999px;
background:radial-gradient(circle at 32% 28%,color-mix(in oklab,var(--vibeui-ai-anim-006-accent2) 70%,white 10%),var(--vibeui-ai-anim-006-accent) 65%,color-mix(in oklab,var(--vibeui-ai-anim-006-accent) 70%,black 20%) 100%);
box-shadow:0 0 1.25rem color-mix(in oklab,var(--vibeui-ai-anim-006-accent) 55%,transparent);
animation:vibeui-ai-anim-006-breathe 3.2s ease-in-out infinite;
}
[data-vibeui-block="ai-anim-006"] [data-part="rings"]{
position:absolute;inset:0;opacity:0;animation:vibeui-ai-anim-006-listen 9s ease-in-out infinite;
}
[data-vibeui-block="ai-anim-006"] [data-part="ring"]{
position:absolute;inset:0;margin:auto;width:3.75rem;height:3.75rem;border-radius:9999px;
border:1.5px solid color-mix(in oklab,var(--vibeui-ai-anim-006-accent) 60%,transparent);
animation:vibeui-ai-anim-006-ripple 2.1s ease-out infinite;
}
[data-vibeui-block="ai-anim-006"] [data-part="ring"][data-index="1"]{animation-delay:0.7s}
[data-vibeui-block="ai-anim-006"] [data-part="ring"][data-index="2"]{animation-delay:1.4s}
[data-vibeui-block="ai-anim-006"] [data-part="thinking"]{
position:absolute;inset:0;opacity:0;animation:vibeui-ai-anim-006-think 9s ease-in-out infinite;
}
[data-vibeui-block="ai-anim-006"] [data-part="orbit"]{
position:absolute;inset:0;animation:vibeui-ai-anim-006-spin 2.4s linear infinite;
}
[data-vibeui-block="ai-anim-006"] [data-part="dot"]{
position:absolute;top:50%;left:50%;width:0.375rem;height:0.375rem;margin:-0.1875rem;
border-radius:9999px;background:var(--vibeui-ai-anim-006-accent2);
transform:translateY(-2.25rem);
}
[data-vibeui-block="ai-anim-006"] [data-part="dot"][data-index="1"]{transform:rotate(120deg) translateY(-2.25rem)}
[data-vibeui-block="ai-anim-006"] [data-part="dot"][data-index="2"]{transform:rotate(240deg) translateY(-2.25rem)}
[data-vibeui-block="ai-anim-006"] [data-part="speaking"]{
position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:0.1875rem;
opacity:0;animation:vibeui-ai-anim-006-speak 9s ease-in-out infinite;
}
[data-vibeui-block="ai-anim-006"] [data-part="bar"]{
width:0.1875rem;height:0.5rem;border-radius:9999px;background:var(--vibeui-ai-anim-006-accent2);
animation:vibeui-ai-anim-006-bounce 0.9s ease-in-out infinite;
}
[data-vibeui-block="ai-anim-006"] [data-part="bar"]:nth-child(1){animation-delay:0s}
[data-vibeui-block="ai-anim-006"] [data-part="bar"]:nth-child(2){animation-delay:0.15s}
[data-vibeui-block="ai-anim-006"] [data-part="bar"]:nth-child(3){animation-delay:0.3s}
[data-vibeui-block="ai-anim-006"] [data-part="bar"]:nth-child(4){animation-delay:0.45s}
[data-vibeui-block="ai-anim-006"] [data-part="bar"]:nth-child(5){animation-delay:0.6s}
[data-vibeui-block="ai-anim-006"] [data-part="statuswrap"]{display:grid;justify-items:center;min-height:1.25rem}
[data-vibeui-block="ai-anim-006"] [data-part="statustext"]{
grid-area:1/1;margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;opacity:0;
}
[data-vibeui-block="ai-anim-006"] [data-part="statustext"][data-index="0"]{animation:vibeui-ai-anim-006-listen 9s ease-in-out infinite}
[data-vibeui-block="ai-anim-006"] [data-part="statustext"][data-index="1"]{animation:vibeui-ai-anim-006-think 9s ease-in-out infinite}
[data-vibeui-block="ai-anim-006"] [data-part="statustext"][data-index="2"]{animation:vibeui-ai-anim-006-speak 9s ease-in-out infinite}
[data-vibeui-block="ai-anim-006"] [data-part="srtitle"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip:rect(0 0 0 0);white-space:nowrap;border:0;
}
[data-vibeui-block="ai-anim-006"][data-labels="false"] [data-part="statuswrap"]{display:none}
[data-vibeui-block="ai-anim-006"][data-paused="true"] *{animation-play-state:paused!important}
@keyframes vibeui-ai-anim-006-breathe{
0%,100%{transform:scale(1)}
16.5%{transform:scale(1.08)}
50%{transform:scale(0.98);filter:hue-rotate(0deg)}
66.5%{transform:scale(1.1)}
100%{transform:scale(1)}
}
@keyframes vibeui-ai-anim-006-ripple{
0%{transform:scale(1);opacity:0.7}
100%{transform:scale(1.75);opacity:0}
}
@keyframes vibeui-ai-anim-006-spin{to{transform:rotate(360deg)}}
@keyframes vibeui-ai-anim-006-bounce{
0%,100%{transform:scaleY(1)}
50%{transform:scaleY(2.6)}
}
@keyframes vibeui-ai-anim-006-listen{
0%,2%{opacity:0}
5%,30%{opacity:1}
33%,100%{opacity:0}
}
@keyframes vibeui-ai-anim-006-think{
0%,35%{opacity:0}
38%,63%{opacity:1}
66%,100%{opacity:0}
}
@keyframes vibeui-ai-anim-006-speak{
0%,68%{opacity:0}
71%,96%{opacity:1}
99%,100%{opacity:0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="ai-anim-006"] [data-part="orb"]{animation:none}
[data-vibeui-block="ai-anim-006"] [data-part="ring"]{animation:none;opacity:0}
[data-vibeui-block="ai-anim-006"] [data-part="orbit"]{animation:none}
[data-vibeui-block="ai-anim-006"] [data-part="bar"]{animation:none}
[data-vibeui-block="ai-anim-006"] [data-part="rings"],
[data-vibeui-block="ai-anim-006"] [data-part="thinking"],
[data-vibeui-block="ai-anim-006"] [data-part="speaking"],
[data-vibeui-block="ai-anim-006"] [data-part="statustext"]{animation:none;opacity:0}
[data-vibeui-block="ai-anim-006"] [data-part="rings"]{opacity:1}
[data-vibeui-block="ai-anim-006"] [data-part="statustext"][data-index="0"]{opacity:1}
}
`

/**
 * Голосовой orb, циклически проходящий состояния «слушаю → думаю →
 * говорю»: кольца звуковых волн, вращающиеся точки и эквалайзер живут в
 * одном таймлайне и сменяют друг друга по фазе. Один файл, ноль
 * зависимостей, собственная палитра, вся анимация на чистом CSS.
 */
export function AiAnim006({
  title = "Голосовой ассистент",
  listeningLabel = "Слушаю…",
  thinkingLabel = "Думаю…",
  speakingLabel = "Говорю…",
  accent,
  paused = false,
  labels = true,
  className,
  style,
  ...props
}: AiAnim006Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-anim-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-ai-anim-006" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="ai-anim-006"
        data-slot="ai-voice-orb"
        data-paused={paused ? "true" : undefined}
        data-labels={labels ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <p data-part="srtitle">{title}</p>
          <div data-part="stage">
            <span data-part="rings" aria-hidden="true">
              <span data-part="ring" data-index="0" />
              <span data-part="ring" data-index="1" />
              <span data-part="ring" data-index="2" />
            </span>
            <span data-part="thinking" aria-hidden="true">
              <span data-part="orbit">
                <span data-part="dot" data-index="0" />
                <span data-part="dot" data-index="1" />
                <span data-part="dot" data-index="2" />
              </span>
            </span>
            <span data-part="speaking" aria-hidden="true">
              <span data-part="bar" />
              <span data-part="bar" />
              <span data-part="bar" />
              <span data-part="bar" />
              <span data-part="bar" />
            </span>
            <span data-part="orb" aria-hidden="true" />
          </div>
          <div data-part="statuswrap" aria-hidden="true">
            <p data-part="statustext" data-index="0">
              {listeningLabel}
            </p>
            <p data-part="statustext" data-index="1">
              {thinkingLabel}
            </p>
            <p data-part="statustext" data-index="2">
              {speakingLabel}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
