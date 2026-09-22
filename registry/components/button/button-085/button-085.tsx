import type { ComponentProps, CSSProperties } from "react"

export type Button085Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  name?: string
  rate?: number
  note?: string
  fromLabel?: string
  currency?: string
  areaUnit?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function formatMoney(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

// Часть блока renovation-001, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-085"]){
--vibeui-button-085-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-085-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-button-085-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-085-line:color-mix(in oklab,var(--vibeui-button-085-fg) 16%,transparent);
--vibeui-button-085-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-button-085-muted:color-mix(in oklab,var(--vibeui-button-085-fg) 62%,var(--vibeui-button-085-bg));
--vibeui-button-085-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-085"]{color-scheme:dark}
[data-vibeui-block="button-085"]{box-sizing:border-box}
[data-vibeui-block="button-085"] *{box-sizing:border-box}
[data-vibeui-block="button-085"]{display:grid;gap:.25rem;width:100%;padding:.9rem 1rem;border:1px solid var(--vibeui-button-085-line);border-radius:.4rem;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;transition:border-color .2s,background .2s,transform .18s}
[data-vibeui-block="button-085"] b{font-family:var(--vibeui-button-085-display);font-weight:700;font-size:1.05rem;letter-spacing:-.01em}
[data-vibeui-block="button-085"] span{font-family:var(--vibeui-button-085-mono);font-size:.72rem;color:var(--vibeui-button-085-muted)}
[data-vibeui-block="button-085"]:hover{border-color:color-mix(in oklab,var(--vibeui-button-085-fg) 40%,transparent)}
[data-vibeui-block="button-085"][aria-checked="true"]{border-color:var(--vibeui-button-085-accent);background:color-mix(in oklab,var(--vibeui-button-085-accent) 14%,transparent);box-shadow:0 0 0 1px var(--vibeui-button-085-accent) inset}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-085"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-радио типа ремонта: название и ставка за м² с заметкой; выбран через aria-checked. */
export function Button085({
  name = "Косметический",
  rate = 8900,
  note = "Тип ремонта",
  fromLabel = "от",
  currency = "₽",
  areaUnit = "м²",
  accent,
  className,
  style,
  ...props
}: Button085Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-085-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-085" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-085" type="button" role="radio"
        className={className}
        style={palette}
      >
        <b>{name}</b>
        <span>
          {fromLabel} {formatMoney(rate)} {currency}/{areaUnit}{note ? ` · ${note}` : ""}
        </span>
      </button>
    </>
  )
}
