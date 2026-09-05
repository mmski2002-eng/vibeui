import type { ComponentProps, CSSProperties } from "react"

export type AiAnim003Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  promptText?: string
  modelName?: string
  tokenLabel?: string
  /** Итоговое число токенов: промежуточные значения на счётчике считаются от него. */
  tokenCount?: number
  accent?: string
  /** false — промпт показывается сразу, без печати и курсора. */
  streaming?: boolean
}

const SPARK = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6Z" />
  </svg>
)

const CHEVRON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

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

// Идея: широкий composer промпта, где текст печатается по буквам (тот же
// приём steps(), что и в chat-001), а под полем — панель с пилюлей модели и
// счётчиком токенов. Счётчик — не настоящий JS-счётчик, а стопка чисел друг
// на друге в общей grid-ячейке: каждое проявляется opacity-кейфреймом в свою
// долю общего цикла, синхронизированную с печатью текста, и последнее
// значение держится до конца цикла — выглядит как растущий счётчик.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="ai-anim-003"]){
--vibeui-ai-anim-003-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-ai-anim-003-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-ai-anim-003-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-ai-anim-003-muted:color-mix(in oklab,var(--vibeui-ai-anim-003-fg) 56%,transparent);
--vibeui-ai-anim-003-border:light-dark(oklch(0.92 0 0),oklch(0.28 0 0));
--vibeui-ai-anim-003-accent:light-dark(oklch(0.57 0.18 300),oklch(0.75 0.15 300));
--vibeui-ai-anim-003-accent-fg:oklch(from var(--vibeui-ai-anim-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-ai-anim-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-ai-anim-003-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-anim-003"]{color-scheme:dark}
[data-vibeui-block="ai-anim-003"]{
display:block;box-sizing:border-box;width:100%;max-width:26rem;margin:0;
color:var(--vibeui-ai-anim-003-fg);font-family:var(--vibeui-ai-anim-003-font);
}
[data-vibeui-block="ai-anim-003"] *{box-sizing:border-box}
[data-vibeui-block="ai-anim-003"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-ai-anim-003-border);
background:var(--vibeui-ai-anim-003-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="ai-anim-003"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.625rem 0.875rem;border-bottom:1px solid var(--vibeui-ai-anim-003-border);
}
[data-vibeui-block="ai-anim-003"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="ai-anim-003"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.25rem;height:1.125rem;padding:0 0.4375rem;
border-radius:9999px;font-size:0.5625rem;font-weight:650;
color:var(--vibeui-ai-anim-003-accent);
background:color-mix(in oklab,var(--vibeui-ai-anim-003-accent) 14%,transparent);
}
[data-vibeui-block="ai-anim-003"] [data-part="badge"] svg{width:0.625rem;height:0.625rem}
[data-vibeui-block="ai-anim-003"] [data-part="field"]{
display:flex;align-items:center;min-height:2.75rem;padding:0.875rem;
font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="ai-anim-003"] [data-part="stream"]{
display:inline-block;overflow:hidden;white-space:nowrap;vertical-align:bottom;
width:0;animation:vibeui-ai-anim-003-type 4.5s steps(28,end) infinite;
}
[data-vibeui-block="ai-anim-003"][data-streaming="false"] [data-part="stream"]{width:auto;animation:none}
[data-vibeui-block="ai-anim-003"] [data-part="caret"]{
display:inline-block;flex:none;width:2px;height:1em;margin-left:2px;
background:var(--vibeui-ai-anim-003-accent);animation:vibeui-ai-anim-003-blink 0.9s step-end infinite;
}
[data-vibeui-block="ai-anim-003"][data-streaming="false"] [data-part="caret"]{display:none}
[data-vibeui-block="ai-anim-003"] [data-part="toolbar"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.625rem 0.75rem;border-top:1px solid var(--vibeui-ai-anim-003-border);
background:var(--vibeui-ai-anim-003-frame);
}
[data-vibeui-block="ai-anim-003"] [data-part="left"]{display:flex;align-items:center;gap:0.5rem;min-width:0}
[data-vibeui-block="ai-anim-003"] [data-part="model"]{
display:inline-flex;align-items:center;gap:0.3125rem;flex:none;
padding:0.25rem 0.5rem;border-radius:9999px;border:1px solid var(--vibeui-ai-anim-003-border);
background:var(--vibeui-ai-anim-003-card);font-size:0.6875rem;font-weight:600;
}
[data-vibeui-block="ai-anim-003"] [data-part="model"] svg:first-child{width:0.6875rem;height:0.6875rem;color:var(--vibeui-ai-anim-003-accent)}
[data-vibeui-block="ai-anim-003"] [data-part="model"] svg:last-child{width:0.625rem;height:0.625rem;color:var(--vibeui-ai-anim-003-muted)}
[data-vibeui-block="ai-anim-003"] [data-part="tokens"]{
display:inline-flex;align-items:baseline;gap:0.25rem;flex:none;
font-size:0.6875rem;color:var(--vibeui-ai-anim-003-muted);
}
[data-vibeui-block="ai-anim-003"] [data-part="counter"]{
display:inline-grid;font-family:var(--vibeui-ai-anim-003-mono);
font-variant-numeric:tabular-nums;font-weight:650;color:var(--vibeui-ai-anim-003-fg);
}
[data-vibeui-block="ai-anim-003"] [data-part="counter"] span{
grid-area:1/1;opacity:0;animation-duration:4.5s;animation-timing-function:steps(1,end);animation-iteration-count:infinite;
}
[data-vibeui-block="ai-anim-003"] [data-part="counter"] span[data-index="0"]{animation-name:vibeui-ai-anim-003-count-0}
[data-vibeui-block="ai-anim-003"] [data-part="counter"] span[data-index="1"]{animation-name:vibeui-ai-anim-003-count-1}
[data-vibeui-block="ai-anim-003"] [data-part="counter"] span[data-index="2"]{animation-name:vibeui-ai-anim-003-count-2}
[data-vibeui-block="ai-anim-003"] [data-part="counter"] span[data-index="3"]{animation-name:vibeui-ai-anim-003-count-3}
[data-vibeui-block="ai-anim-003"][data-streaming="false"] [data-part="counter"] span{animation:none;opacity:0}
[data-vibeui-block="ai-anim-003"][data-streaming="false"] [data-part="counter"] span:last-child{opacity:1}
[data-vibeui-block="ai-anim-003"] [data-part="send"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.75rem;height:1.75rem;border-radius:9999px;
background:var(--vibeui-ai-anim-003-accent);color:var(--vibeui-ai-anim-003-accent-fg);
}
[data-vibeui-block="ai-anim-003"] [data-part="send"] svg{width:0.875rem;height:0.875rem}
@keyframes vibeui-ai-anim-003-type{
0%{width:0}
50%{width:calc(var(--vibeui-ai-anim-003-chars,20) * 0.58em + 0.2rem)}
92%{width:calc(var(--vibeui-ai-anim-003-chars,20) * 0.58em + 0.2rem)}
100%{width:0}
}
@keyframes vibeui-ai-anim-003-blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes vibeui-ai-anim-003-count-0{0%{opacity:1}6%{opacity:1}9%{opacity:0}100%{opacity:0}}
@keyframes vibeui-ai-anim-003-count-1{0%,9%{opacity:0}11%{opacity:1}24%{opacity:1}27%{opacity:0}100%{opacity:0}}
@keyframes vibeui-ai-anim-003-count-2{0%,27%{opacity:0}29%{opacity:1}46%{opacity:1}49%{opacity:0}100%{opacity:0}}
@keyframes vibeui-ai-anim-003-count-3{0%,49%{opacity:0}51%{opacity:1}97%{opacity:1}100%{opacity:0}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="ai-anim-003"] [data-part="stream"]{width:auto;animation:none}
[data-vibeui-block="ai-anim-003"] [data-part="caret"]{animation:none;opacity:0.6}
[data-vibeui-block="ai-anim-003"] [data-part="counter"] span{animation:none;opacity:0}
[data-vibeui-block="ai-anim-003"] [data-part="counter"] span:last-child{opacity:1}
}
`

/**
 * Composer промпта: текст печатается по буквам с мигающим курсором, снизу —
 * пилюля модели и счётчик токенов, растущий стопкой значений в такт печати.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function AiAnim003({
  title = "Новый промпт",
  promptText = "Сравни выручку за Q2 и Q3 и выдели аномалии",
  modelName = "Nova Pro",
  tokenLabel = "токенов",
  tokenCount = 128,
  accent,
  streaming = true,
  className,
  style,
  ...props
}: AiAnim003Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-anim-003-accent": accent } : null),
    "--vibeui-ai-anim-003-chars": promptText.length,
    ...style,
  } as CSSProperties

  const counts = [
    0,
    Math.max(1, Math.round(tokenCount * 0.33)),
    Math.max(1, Math.round(tokenCount * 0.74)),
    tokenCount,
  ]

  return (
    <>
      <style href="vibeui-ai-anim-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="ai-anim-003"
        data-slot="ai-prompt-box"
        data-streaming={streaming ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="title">{title}</p>
            <span data-part="badge">
              {SPARK}
              Composer
            </span>
          </div>
          <div data-part="field">
            <span data-part="stream">{promptText}</span>
            <span data-part="caret" aria-hidden="true" />
          </div>
          <div data-part="toolbar">
            <div data-part="left">
              <span data-part="model">
                {SPARK}
                {modelName}
                {CHEVRON}
              </span>
              <span data-part="tokens">
                <span data-part="counter" aria-hidden="true">
                  {counts.map((count, index) => (
                    <span data-index={index} key={index}>
                      {count}
                    </span>
                  ))}
                </span>
                {tokenLabel}
              </span>
            </div>
            <span data-part="send" aria-hidden="true">
              {SEND}
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
