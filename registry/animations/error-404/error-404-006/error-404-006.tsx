import type { ComponentProps, CSSProperties } from "react"

export type Error404006Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  /** Цвет стрелки-указателя. */
  accent?: string
  /** Пусто — тёмная подложка по умолчанию. */
  background?: string
}

// Пиксельные цифры, над которыми дрожит стрелка «вниз, в кроличью нору»:
// цифры собраны из клеток 5×7 сеткой CSS, клетки вспыхивают по очереди,
// как экран старого терминала. Рисунок задан строками-масками.
const STYLES = `
:where([data-vibeui-block="error-404-006"]){
--vibeui-error-404-006-bg:light-dark(oklch(0.97 0.004 280),oklch(0.17 0.008 280));
--vibeui-error-404-006-fg:light-dark(oklch(0.18 0 0),oklch(0.97 0 0));
--vibeui-error-404-006-muted:light-dark(oklch(0.5 0 0),oklch(0.68 0.01 280));
--vibeui-error-404-006-accent:oklch(0.65 0.2 40);
--vibeui-error-404-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-404-006"]{color-scheme:dark}
[data-vibeui-block="error-404-006"]{
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;box-sizing:border-box;min-height:26rem;padding:3rem 1.25rem;text-align:center;
background:var(--vibeui-error-404-006-bg);color:var(--vibeui-error-404-006-fg);font-family:var(--vibeui-error-404-006-font);
}
[data-vibeui-block="error-404-006"] [data-part="pointer"]{
display:grid;grid-template-columns:repeat(3,0.5rem);grid-auto-rows:0.5rem;
animation:vibeui-error-404-006-hop 1.2s cubic-bezier(.5,0,.5,1) infinite;
}
[data-vibeui-block="error-404-006"] [data-part="pointer"] i{background:var(--vibeui-error-404-006-accent)}
[data-vibeui-block="error-404-006"] [data-part="digits"]{display:flex;gap:min(2.5cqi,1rem);margin:0}
[data-vibeui-block="error-404-006"] [data-part="digit"]{display:grid;grid-template-columns:repeat(5,var(--vibeui-error-404-006-cell));grid-auto-rows:var(--vibeui-error-404-006-cell);gap:2px}
[data-vibeui-block="error-404-006"]{--vibeui-error-404-006-cell:min(2.6cqi,0.8rem)}
[data-vibeui-block="error-404-006"] [data-part="cell"][data-on]{
background:var(--vibeui-error-404-006-fg);
animation:vibeui-error-404-006-flick 3.2s steps(1) var(--vibeui-error-404-006-delay) infinite;
}
@keyframes vibeui-error-404-006-hop{0%,100%{transform:translateY(0)}50%{transform:translateY(0.5rem)}}
@keyframes vibeui-error-404-006-flick{0%,92%{opacity:1}94%{opacity:.25}96%{opacity:1}}
[data-vibeui-block="error-404-006"] [data-part="title"]{margin:0.5rem 0 0;font-size:0.9375rem;font-weight:500}
[data-vibeui-block="error-404-006"] [data-part="text"]{margin:0;color:var(--vibeui-error-404-006-muted);font-size:0.875rem;max-width:26rem}
[data-vibeui-block="error-404-006"] [data-part="action"]{
margin-top:0.5rem;padding:0.5rem 1rem;border:1px solid color-mix(in oklab,var(--vibeui-error-404-006-fg) 22%,transparent);border-radius:0.375rem;color:inherit;text-decoration:none;font-size:0.875rem;
transition:border-color .2s ease;
}
[data-vibeui-block="error-404-006"] [data-part="action"]:hover{border-color:var(--vibeui-error-404-006-accent)}
[data-vibeui-block="error-404-006"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-error-404-006-accent);outline-offset:3px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="error-404-006"] *{animation:none!important;transition:none!important}}
[data-vibeui-block="error-404-006"]{width:100%}
`

const GLYPHS: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00110", "01000", "10000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
}

const POINTER = ["010", "010", "111", "010"]

export function Error404006({
  code = "404",
  title = "Вы провалились в кроличью нору.",
  description = "Даже мы не знаем, куда ведёт эта.",
  actionLabel = "Выбраться на главную",
  actionHref = "/",
  accent,
  background,
  className,
  style,
  ...props
}: Error404006Props) {
  const palette = {
    ...(accent ? { "--vibeui-error-404-006-accent": accent } : null),
    ...(background ? { "--vibeui-error-404-006-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-006" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-404-006"
        data-slot="not-found"
        className={className}
        style={palette}
      >
        <span data-part="pointer" aria-hidden="true">
          {POINTER.join("")
            .split("")
            .map((bit, index) => (bit === "1" ? <i key={index} /> : <span key={index} />))}
        </span>
        <h1 data-part="digits" aria-label={code}>
          {code.split("").map((character, digit) => (
            <span key={digit} data-part="digit" aria-hidden="true">
              {(GLYPHS[character] ?? GLYPHS["0"])
                .join("")
                .split("")
                .map((bit, index) => (
                  <span
                    key={index}
                    data-part="cell"
                    data-on={bit === "1" || undefined}
                    style={
                      {
                        "--vibeui-error-404-006-delay": `${-((index * 7 + digit * 13) % 32) / 10}s`,
                      } as CSSProperties
                    }
                  />
                ))}
            </span>
          ))}
        </h1>
        <p data-part="title">{title}</p>
        <p data-part="text">{description}</p>
        <a data-part="action" href={actionHref}>
          {actionLabel}
        </a>
      </section>
    </>
  )
}
