import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup040Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  link?: string
  copyLabel?: string
  targets?: string[]
  label?: string
  accent?: string
}

// Идея компонента: группа шеринга, в которой самая частая цель — скопировать
// ссылку — занимает не значок, а всю ширину. Ссылка показана прямо в сцепке
// отдельной ячейкой: люди отправляют её глазами раньше, чем нажимают кнопку,
// и должны видеть, что именно уедет. Ячейка ссылки сжимается (min-width:0 и
// text-overflow), а кнопки-цели не сжимаются вовсе — иначе на узкой ширине
// первым пропал бы значок, а не текст, и группа перестала бы работать.
const STYLES = `
:where([data-vibeui-block="buttongroup-040"]){
--vibeui-buttongroup-040-surface:oklch(1 0 0);
--vibeui-buttongroup-040-fg:oklch(0.25 0.016 265);
--vibeui-buttongroup-040-muted:oklch(0.56 0.014 265);
--vibeui-buttongroup-040-border:oklch(0.88 0.008 265);
--vibeui-buttongroup-040-accent:oklch(0.5 0.16 265);
--vibeui-buttongroup-040-radius:0.625rem;
--vibeui-buttongroup-040-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-040"]{
box-sizing:border-box;display:flex;align-items:stretch;isolation:isolate;
width:100%;max-width:26rem;
border:1px solid var(--vibeui-buttongroup-040-border);
border-radius:var(--vibeui-buttongroup-040-radius);
background:var(--vibeui-buttongroup-040-surface);
overflow:hidden;
font-family:var(--vibeui-buttongroup-040-font);
}
[data-vibeui-block="buttongroup-040"] *{box-sizing:border-box}
/* Ячейка ссылки сжимается, кнопки — нет. */
[data-vibeui-block="buttongroup-040"] [data-part="link"]{
flex:1 1 auto;min-width:0;
display:flex;align-items:center;
height:2.5rem;padding:0 0.75rem;
color:var(--vibeui-buttongroup-040-muted);
font-size:0.8125rem;line-height:1;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="buttongroup-040"] button{
appearance:none;cursor:pointer;font:inherit;flex:none;
position:relative;z-index:0;
display:inline-flex;align-items:center;justify-content:center;gap:0.375rem;
height:2.5rem;padding:0 0.75rem;
border:0;border-inline-start:1px solid var(--vibeui-buttongroup-040-border);
background:var(--vibeui-buttongroup-040-surface);
color:var(--vibeui-buttongroup-040-fg);
font-size:0.8125rem;font-weight:650;line-height:1;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-040"] [data-part="target"]{width:2.5rem;padding:0}
[data-vibeui-block="buttongroup-040"] button:hover{background:oklch(0.965 0.005 265)}
[data-vibeui-block="buttongroup-040"] [data-part="copy"]{
background:oklch(0.97 0.02 265);color:var(--vibeui-buttongroup-040-accent);
}
[data-vibeui-block="buttongroup-040"] [data-part="copy"]:hover{background:oklch(0.94 0.035 265)}
[data-vibeui-block="buttongroup-040"] button:focus-visible{
z-index:1;outline:2px solid var(--vibeui-buttongroup-040-accent);outline-offset:-2px;
}
[data-vibeui-block="buttongroup-040"] svg{
width:1rem;height:1rem;
stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-040"] *{animation:none!important;transition:none!important}}
`

const ICONS: Record<string, { path: string; label: string }> = {
  mail: { path: "M3 6h18v12H3zM3 7l9 6 9-6", label: "Отправить письмом" },
  chat: {
    path: "M4 5h16v10H8l-4 4z",
    label: "Отправить сообщением",
  },
  qr: {
    path: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2z",
    label: "Показать QR-код",
  },
}

/**
 * Группа шеринга, где ссылка видна прямо в сцепке, а копирование — главное.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup040({
  link = "vibeui.dev/r/buttongroup-040",
  copyLabel = "Копировать",
  targets = ["mail", "chat", "qr"],
  label = "Поделиться ссылкой",
  accent,
  className,
  style,
  ...props
}: Buttongroup040Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-040-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-040" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="buttongroup-040"
        className={className}
        style={palette}
        role="group"
        aria-label={label}
      >
        <span data-part="link" title={link}>
          {link}
        </span>
        <button type="button" data-part="copy">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 9h11v11H9zM5 15H4V4h11v1" />
          </svg>
          {copyLabel}
        </button>
        {targets.map((target) => {
          const icon = ICONS[target] ?? ICONS.mail

          return (
            <button
              key={target}
              type="button"
              data-part="target"
              aria-label={icon.label}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={icon.path} />
              </svg>
            </button>
          )
        })}
      </div>
    </>
  )
}
