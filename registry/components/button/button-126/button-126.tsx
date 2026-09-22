import type { ComponentProps, CSSProperties } from "react"

export type Button126Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  runningLabel?: string
  runLabel?: string
  phase?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока ai-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-126"]){
--vibeui-button-126-a2:color-mix(in oklab,var(--vibeui-button-126-accent) 40%,#a855f7);
--vibeui-button-126-a3:color-mix(in oklab,var(--vibeui-button-126-accent) 30%,#f472b6);
--vibeui-button-126-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-126-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-button-126-on-accent:oklch(from var(--vibeui-button-126-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-126"]{color-scheme:dark}
[data-vibeui-block="button-126"]{box-sizing:border-box}
[data-vibeui-block="button-126"] *{box-sizing:border-box}
@keyframes vibeui-button-126-thinking{to{background-position:300% 0}}
@keyframes vibeui-button-126-spin{to{transform:rotate(360deg)}}
@keyframes vibeui-button-126-sheen{to{left:100%}}
[data-vibeui-block="button-126"]{position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:.5rem;padding:.8rem 1.3rem;border:0;border-radius:.9rem;background:var(--vibeui-button-126-accent);color:var(--vibeui-button-126-on-accent);font:inherit;font-weight:600;cursor:pointer;transition:filter .3s,transform .4s var(--vibeui-button-126-ease),box-shadow .4s;will-change:transform}
[data-vibeui-block="button-126"]:hover{filter:brightness(1.08);box-shadow:0 12px 30px -12px var(--vibeui-button-126-accent)}
[data-vibeui-block="button-126"]:disabled{cursor:progress}
[data-vibeui-block="button-126"] svg{width:1em;height:1em}
[data-vibeui-block="button-126"][data-busy="true"]{background:linear-gradient(110deg,var(--vibeui-button-126-accent),var(--vibeui-button-126-a2),var(--vibeui-button-126-a3),var(--vibeui-button-126-accent));background-size:300% 100%;animation:vibeui-button-126-thinking 1.4s linear infinite;box-shadow:0 0 30px -6px var(--vibeui-button-126-a2)}
[data-vibeui-block="button-126"][data-busy="true"] svg{animation:vibeui-button-126-spin 1.1s linear infinite}
[data-vibeui-block="button-126"][data-busy="true"]::after{content:"";position:absolute;left:-40%;top:0;bottom:0;width:40%;background:linear-gradient(90deg,transparent,rgb(255 255 255 / .45),transparent);animation:vibeui-button-126-sheen 1s linear infinite}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-126"] *{animation:none!important;transition:none!important}}
`

/** Кнопка запуска с искрой: занята по data-busy, подпись меняется на «выполняется». */
export function Button126({
  runningLabel = "Думаю…",
  runLabel = "Сделать сводку",
  phase = "idle",
  accent,
  className,
  style,
  ...props
}: Button126Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-126-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-126" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-126" type="button" data-busy={phase === "busy"} disabled={phase === "busy" || phase === "typing"}
        className={className}
        style={palette}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10Z" />
        </svg>
        {phase === "busy" || phase === "typing" ? runningLabel : runLabel}
      </button>
    </>
  )
}
