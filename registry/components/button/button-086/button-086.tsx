import type { ComponentProps, CSSProperties } from "react"

export type Button086Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  name?: string
  area?: string
  kindText?: string
  weeks?: number
  weekShort?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока renovation-003, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-086"]){
--vibeui-button-086-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-086-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-button-086-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-button-086-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-086-line:color-mix(in oklab,var(--vibeui-button-086-fg) 16%,transparent);
--vibeui-button-086-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-button-086-muted:color-mix(in oklab,var(--vibeui-button-086-fg) 62%,var(--vibeui-button-086-bg));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-086"]{color-scheme:dark}
[data-vibeui-block="button-086"]{box-sizing:border-box}
[data-vibeui-block="button-086"] *{box-sizing:border-box}
[data-vibeui-block="button-086"]{display:grid;gap:.2rem;min-width:13rem;padding:.9rem 1rem;border:1px solid var(--vibeui-button-086-line);border-radius:.4rem;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;transition:border-color .2s,background .2s,transform .18s}
[data-vibeui-block="button-086"] b{font-family:var(--vibeui-button-086-display);font-weight:700;font-size:1rem;letter-spacing:-.01em;line-height:1.2}
[data-vibeui-block="button-086"] span{font-family:var(--vibeui-button-086-mono);font-size:.7rem;color:var(--vibeui-button-086-muted)}
[data-vibeui-block="button-086"]:hover{border-color:color-mix(in oklab,var(--vibeui-button-086-fg) 40%,transparent)}
[data-vibeui-block="button-086"][aria-selected="true"]{border-color:var(--vibeui-button-086-fg);background:var(--vibeui-button-086-fg);color:var(--vibeui-button-086-bg)}
[data-vibeui-block="button-086"][aria-selected="true"] span{color:color-mix(in oklab,var(--vibeui-button-086-bg) 70%,var(--vibeui-button-086-fg))}
[data-vibeui-block="button-086"]:focus-visible{outline:2px solid var(--vibeui-button-086-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-086"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-вкладка объекта до/после: название и подпись; активна через aria-selected. */
export function Button086({
  name = "Двушка на Ленинском",
  area = "62 м²",
  kindText = "Капитальный",
  weeks,
  weekShort = "нед",
  accent,
  className,
  style,
  ...props
}: Button086Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-086-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-086" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-086" type="button" role="tab"
        className={className}
        style={palette}
      >
        <b>{name}</b>
        <span>
          {[area, kindText, weeks ? `${weeks} ${weekShort}` : null].filter(Boolean).join(" · ")}
        </span>
      </button>
    </>
  )
}
