import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge008Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  version?: string
  channel?: "stable" | "beta" | "alpha"
}

// Идея компонента: номер версии рядом с названием. Цифры — моноширинным
// шрифтом, иначе «v1.11.0» и «v1.9.0» выглядят разной длины и прыгают при
// обновлении. Канал приписан словом: у беты и альфы разная цена ошибки, и
// одним цветом их путают.
const STYLES = `
:where([data-vibeui-block="badge-008"]){
--vibeui-badge-008-bg:oklch(0.96 0.004 265);
--vibeui-badge-008-fg:oklch(0.36 0.014 265);
--vibeui-badge-008-border:oklch(0.89 0.006 265);
--vibeui-badge-008-channel:oklch(0.55 0.014 265);
--vibeui-badge-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-badge-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="badge-008"]{
display:inline-flex;align-items:stretch;
height:1.5rem;overflow:hidden;
border:1px solid var(--vibeui-badge-008-border);border-radius:0.375rem;
background:var(--vibeui-badge-008-bg);color:var(--vibeui-badge-008-fg);
font-size:0.6875rem;line-height:1;vertical-align:middle;
}
[data-vibeui-block="badge-008"][data-channel="beta"]{--vibeui-badge-008-channel:oklch(0.6 0.16 265)}
[data-vibeui-block="badge-008"][data-channel="alpha"]{--vibeui-badge-008-channel:oklch(0.6 0.18 25)}
/* Версия моноширинным: пропорциональные цифры дёргают плашку при обновлении. */
[data-vibeui-block="badge-008"] [data-part="version"]{
display:inline-flex;align-items:center;padding:0 0.4375rem;
font-family:var(--vibeui-badge-008-mono);font-weight:600;letter-spacing:-0.01em;
}
[data-vibeui-block="badge-008"] [data-part="channel"]{
display:inline-flex;align-items:center;padding:0 0.4375rem;
border-left:1px solid var(--vibeui-badge-008-border);
background:color-mix(in oklab,var(--vibeui-badge-008-channel) 14%,oklch(1 0 0));
color:var(--vibeui-badge-008-channel);
font-family:var(--vibeui-badge-008-font);font-weight:700;
letter-spacing:0.04em;text-transform:uppercase;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-008"] *{animation:none!important;transition:none!important}}
`

/**
 * Номер версии с каналом: моноширинные цифры и подпись словом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge008({
  version = "v2.4.0",
  channel = "beta",
  className,
  style,
  ...props
}: Badge008Props) {
  return (
    <>
      <style href="vibeui-badge-008" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-008"
        data-channel={channel}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="version">{version}</span>
        {channel === "stable" ? null : (
          <span data-part="channel">{channel}</span>
        )}
      </span>
    </>
  )
}
