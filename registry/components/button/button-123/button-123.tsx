import type { ComponentProps, CSSProperties } from "react"

export type Button123Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  href?: string
  top?: string
  store?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока download-013, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-123"]){
--vibeui-button-123-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-123-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-button-123-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-button-123-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-123"]{color-scheme:dark}
[data-vibeui-block="button-123"]{box-sizing:border-box}
[data-vibeui-block="button-123"] *{box-sizing:border-box}
[data-vibeui-block="button-123"]{display:inline-grid;grid-template-columns:auto 1fr;align-items:center;gap:.6rem;padding:.55rem .9rem .55rem .7rem;border-radius:.8rem;background:var(--vibeui-button-123-fg);color:var(--vibeui-button-123-bg);text-decoration:none;line-height:1.1;transition:transform .18s,box-shadow .25s}
[data-vibeui-block="button-123"]:hover{transform:translateY(-2px);box-shadow:0 12px 30px -12px var(--vibeui-button-123-accent)}
[data-vibeui-block="button-123"]:focus-visible{outline:2px solid var(--vibeui-button-123-accent);outline-offset:2px}
[data-vibeui-block="button-123"] svg{width:1.5rem;height:1.5rem;grid-row:span 2}
[data-vibeui-block="button-123"] small{display:block;font-size:.62rem;opacity:.7}
[data-vibeui-block="button-123"] b{display:block;font-family:var(--vibeui-button-123-display);font-weight:700;font-size:.98rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-123"] *{animation:none!important;transition:none!important}}
`

/** Ссылка-бейдж магазина в блоке с QR-кодом: иконка, подпись и название. */
export function Button123({
  href = "#appstore",
  top = "Скачать в",
  store = "App Store",
  accent,
  className,
  style,
  ...props
}: Button123Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-123-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-123" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-123" href={href}
        className={className}
        style={palette}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
          <path d="M12 8v6M9.5 11.5 12 14l2.5-2.5M11 18.5h2" />
        </svg>
        <small>{top}</small>
        <b>{store}</b>
      </a>
    </>
  )
}
