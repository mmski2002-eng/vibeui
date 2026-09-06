import type { ComponentProps, CSSProperties } from "react"

export type Browser002Props = Omit<ComponentProps<"section">, "children"> & {
  url?: string
  accent?: string
  /** Мягкое покачивание тени окна и дыхание карточки внутри. */
  float?: boolean
}

// Идея: минималистичная рамка окна браузера-контейнер для чужого скриншота
// или демо-интерфейса. Внутри — условная заглушка-карточка вместо реального
// слота, чтобы item оставался самодостаточным. Анимация категории здесь
// тихая: окно едва заметно покачивает тень, а карточка внутри дышит
// масштабом — рамка выглядит живой, не отвлекая от содержимого.
const STYLES = `
:where([data-vibeui-block="browser-002"]){
--vibeui-browser-002-chrome:light-dark(oklch(0.97 0 265),oklch(0.24 0 265));
--vibeui-browser-002-page:light-dark(oklch(0.99 0 265),oklch(0.19 0 265));
--vibeui-browser-002-card:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-browser-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-browser-002-muted:color-mix(in oklab,var(--vibeui-browser-002-fg) 58%,transparent);
--vibeui-browser-002-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-browser-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-browser-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="browser-002"]{color-scheme:dark}
[data-vibeui-block="browser-002"]{
display:block;box-sizing:border-box;width:100%;max-width:22rem;margin:0;
font-family:var(--vibeui-browser-002-font);color:var(--vibeui-browser-002-fg);
}
[data-vibeui-block="browser-002"] *{box-sizing:border-box}
[data-vibeui-block="browser-002"] [data-part="window"]{
overflow:hidden;border-radius:0.875rem;border:1px solid var(--vibeui-browser-002-border);
background:var(--vibeui-browser-002-page);
box-shadow:0 1px 2px oklch(0 0 0 / 0.06),0 14px 30px -18px oklch(0 0 0 / 0.32);
animation:vibeui-browser-002-float 6s ease-in-out infinite;
}
[data-vibeui-block="browser-002"][data-float="false"] [data-part="window"]{animation:none}
[data-vibeui-block="browser-002"] [data-part="chrome"]{
display:flex;align-items:center;gap:0.625rem;padding:0.5625rem 0.75rem;
background:var(--vibeui-browser-002-chrome);border-bottom:1px solid var(--vibeui-browser-002-border);
}
[data-vibeui-block="browser-002"] [data-part="dots"]{display:flex;gap:0.3125rem;flex:none}
[data-vibeui-block="browser-002"] [data-part="dot"]{width:0.5rem;height:0.5rem;border-radius:9999px}
[data-vibeui-block="browser-002"] [data-part="dot"][data-c="red"]{background:#ff5f57}
[data-vibeui-block="browser-002"] [data-part="dot"][data-c="yellow"]{background:#febc2e}
[data-vibeui-block="browser-002"] [data-part="dot"][data-c="green"]{background:#28c840}
[data-vibeui-block="browser-002"] [data-part="url"]{
flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
padding:0.25rem 0.625rem;border-radius:9999px;
background:var(--vibeui-browser-002-card);border:1px solid var(--vibeui-browser-002-border);
font-size:0.6875rem;color:var(--vibeui-browser-002-muted);
}
[data-vibeui-block="browser-002"] [data-part="stage"]{
display:flex;align-items:center;justify-content:center;padding:1.75rem 1.25rem;min-height:9rem;
}
[data-vibeui-block="browser-002"] [data-part="card"]{
width:100%;max-width:14rem;padding:1rem;border-radius:0.75rem;
background:var(--vibeui-browser-002-card);border:1px solid var(--vibeui-browser-002-border);
box-shadow:0 10px 24px -14px oklch(0 0 0 / 0.35);
animation:vibeui-browser-002-pulse 6s ease-in-out infinite;
}
[data-vibeui-block="browser-002"][data-float="false"] [data-part="card"]{animation:none}
[data-vibeui-block="browser-002"] [data-part="badge"]{
display:block;width:1.75rem;height:1.75rem;border-radius:0.5rem;
background:var(--vibeui-browser-002-accent);margin-bottom:0.75rem;
}
[data-vibeui-block="browser-002"] [data-part="line"]{
display:block;height:0.5rem;border-radius:9999px;background:var(--vibeui-browser-002-border);margin-top:0.5rem;
}
[data-vibeui-block="browser-002"] [data-part="line"][data-w="70"]{width:70%}
[data-vibeui-block="browser-002"] [data-part="line"][data-w="45"]{width:45%}
@keyframes vibeui-browser-002-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes vibeui-browser-002-pulse{0%,100%{transform:scale(1);opacity:0.94}50%{transform:scale(1.02);opacity:1}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="browser-002"] [data-part="window"],
[data-vibeui-block="browser-002"] [data-part="card"]{animation:none}
}
`

/**
 * Минималистичная рамка окна браузера-контейнер для скриншота или демо.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Browser002({
  url = "vibeui.ru/preview",
  accent,
  float = true,
  className,
  style,
  ...props
}: Browser002Props) {
  const palette = {
    ...(accent ? { "--vibeui-browser-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-browser-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="browser-002"
        data-slot="browser-frame"
        data-float={float ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="window">
          <div data-part="chrome">
            <span data-part="dots" aria-hidden="true">
              <span data-part="dot" data-c="red" />
              <span data-part="dot" data-c="yellow" />
              <span data-part="dot" data-c="green" />
            </span>
            <span data-part="url">{url}</span>
          </div>
          <div data-part="stage">
            <div data-part="card" aria-hidden="true">
              <span data-part="badge" />
              <span data-part="line" data-w="70" />
              <span data-part="line" data-w="45" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
