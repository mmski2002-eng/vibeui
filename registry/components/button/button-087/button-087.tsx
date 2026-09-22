import type { ComponentProps, CSSProperties } from "react"

export type Button087Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  urgency?: 1 | 2 | 3
  label?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока vet-003, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-087"]){
--vibeui-button-087-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-087-bad:#d1432f;
--vibeui-button-087-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-button-087-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-button-087-bg) 88%,#fff));
--vibeui-button-087-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-087-line:color-mix(in oklab,var(--vibeui-button-087-fg) 12%,transparent);
--vibeui-button-087-ok:#4f8f45;
--vibeui-button-087-warn:#d99a1e;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-087"]{color-scheme:dark}
[data-vibeui-block="button-087"]{box-sizing:border-box}
[data-vibeui-block="button-087"] *{box-sizing:border-box}
[data-vibeui-block="button-087"]{display:inline-flex;align-items:center;gap:.45rem;padding:.55rem .95rem;border:1px solid var(--vibeui-button-087-line);border-radius:999px;background:var(--vibeui-button-087-card);color:var(--vibeui-button-087-fg);font:inherit;font-size:.92rem;font-weight:500;cursor:pointer;transition:background .2s,color .2s,border-color .2s,transform .2s cubic-bezier(.34,1.56,.64,1)}
[data-vibeui-block="button-087"]::before{content:"";width:.55rem;height:.55rem;border-radius:50%;background:var(--vibeui-button-087-dot);flex-shrink:0;transition:transform .2s}
[data-vibeui-block="button-087"][data-level="1"]{--vibeui-button-087-dot:var(--vibeui-button-087-ok)}
[data-vibeui-block="button-087"][data-level="2"]{--vibeui-button-087-dot:var(--vibeui-button-087-warn)}
[data-vibeui-block="button-087"][data-level="3"]{--vibeui-button-087-dot:var(--vibeui-button-087-bad)}
[data-vibeui-block="button-087"]:hover{border-color:var(--vibeui-button-087-fg)}
[data-vibeui-block="button-087"][aria-pressed="true"]{background:var(--vibeui-button-087-fg);color:var(--vibeui-button-087-bg);border-color:transparent;transform:scale(1.04)}
[data-vibeui-block="button-087"][aria-pressed="true"]::before{transform:scale(1.3)}
[data-vibeui-block="button-087"]:focus-visible{outline:2px solid var(--vibeui-button-087-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-087"] *{animation:none!important;transition:none!important}}
`

/** Чип-переключатель симптома с уровнем срочности по data-level; выбран через aria-pressed. */
export function Button087({
  urgency,
  label = "Не ест второй день",
  accent,
  className,
  style,
  ...props
}: Button087Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-087-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-087" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-087" type="button" data-level={urgency}
        className={className}
        style={palette}
      >
        {label}
      </button>
    </>
  )
}
