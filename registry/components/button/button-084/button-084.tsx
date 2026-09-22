import type { ComponentProps, CSSProperties } from "react"

export type Button084Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  state?: string
  hour?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока auto-004, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-084"]){
--vibeui-button-084-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-084-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-084-glass:color-mix(in oklab,var(--vibeui-button-084-fg) 5%,transparent);
--vibeui-button-084-line:color-mix(in oklab,var(--vibeui-button-084-fg) 12%,transparent);
--vibeui-button-084-muted:color-mix(in oklab,var(--vibeui-button-084-fg) 60%,var(--vibeui-button-084-bg));
--vibeui-button-084-on-accent:oklch(from var(--vibeui-button-084-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-button-084-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-084"]{color-scheme:dark}
[data-vibeui-block="button-084"]{box-sizing:border-box}
[data-vibeui-block="button-084"] *{box-sizing:border-box}
@keyframes vibeui-button-084-pulse{50%{opacity:.4}}
[data-vibeui-block="button-084"]{position:relative;height:2.6rem;border-radius:.6rem;border:1px solid var(--vibeui-button-084-line);background:transparent;color:var(--vibeui-button-084-fg);font:inherit;font-size:.78rem;font-weight:500;cursor:pointer;transition:background .2s,border-color .2s,transform .2s}
[data-vibeui-block="button-084"]:hover{border-color:var(--vibeui-button-084-accent);transform:translateY(-1px)}
[data-vibeui-block="button-084"][data-state="busy"],[data-vibeui-block="button-084"][data-state="past"],[data-vibeui-block="button-084"][data-state="closed"]{cursor:not-allowed;color:var(--vibeui-button-084-muted);border-style:dashed;transform:none}
[data-vibeui-block="button-084"][data-state="busy"]::after{content:"";position:absolute;left:.6rem;right:.6rem;top:50%;height:1px;background:currentColor;transform:rotate(-12deg)}
[data-vibeui-block="button-084"][data-state="past"],[data-vibeui-block="button-084"][data-state="closed"]{opacity:.35;border-color:transparent;background:var(--vibeui-button-084-glass)}
[data-vibeui-block="button-084"][data-state="skeleton"]{background:var(--vibeui-button-084-glass);border-color:transparent;cursor:default;animation:vibeui-button-084-pulse 1.4s ease-in-out infinite}
[data-vibeui-block="button-084"][aria-pressed="true"]{background:var(--vibeui-button-084-accent);border-color:var(--vibeui-button-084-accent);color:var(--vibeui-button-084-on-accent);font-weight:700;box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-button-084-accent) 25%,transparent)}
[data-vibeui-block="button-084"]:focus-visible{outline:2px solid var(--vibeui-button-084-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-084"] *{animation:none!important;transition:none!important}}
`

/** Кнопка слота записи в сетке: свободен, занят, выбран или закрыт по data-state. */
export function Button084({
  state = "Слот записи",
  hour,
  accent,
  className,
  style,
  ...props
}: Button084Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-084-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-084" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-084" type="button" data-state={state} disabled={state === "skeleton"}
        className={className}
        style={palette}
      >
        {state === "closed" ? "—" : state === "skeleton" ? "" : `${hour}:00`}
      </button>
    </>
  )
}
