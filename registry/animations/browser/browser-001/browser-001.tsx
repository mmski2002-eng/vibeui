import type { ComponentProps, CSSProperties } from "react"

export type Browser001Props = Omit<ComponentProps<"section">, "children"> & {
  url?: string
  accent?: string
  /** Скрывает нижний ряд из трёх плиток — короткая заглушка загрузки. */
  compact?: boolean
}

// Идея: окно браузера в состоянии загрузки страницы. Прогресс-полоска живёт
// внутри адресной строки — бежит слева направо и растворяется по кругу, как
// индикатор загрузки вкладки в Chrome/Safari. Тело страницы под ней затянуто
// skeleton-полосами с бегущим шиммером: контент ещё не пришёл.
const STYLES = `
:where([data-vibeui-block="browser-001"]){
--vibeui-browser-001-chrome:light-dark(oklch(0.97 0.003 265),oklch(0.24 0.008 265));
--vibeui-browser-001-page:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-browser-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-browser-001-muted:color-mix(in oklab,var(--vibeui-browser-001-fg) 60%,transparent);
--vibeui-browser-001-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-browser-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-browser-001-skeleton:light-dark(oklch(0.92 0 0),oklch(0.32 0 0));
--vibeui-browser-001-skeleton-strong:light-dark(oklch(0.86 0 0),oklch(0.4 0 0));
--vibeui-browser-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="browser-001"]{color-scheme:dark}
[data-vibeui-block="browser-001"]{
display:block;box-sizing:border-box;width:100%;max-width:22rem;margin:0;
font-family:var(--vibeui-browser-001-font);color:var(--vibeui-browser-001-fg);
}
[data-vibeui-block="browser-001"] *{box-sizing:border-box}
[data-vibeui-block="browser-001"] [data-part="window"]{
overflow:hidden;border-radius:0.875rem;border:1px solid var(--vibeui-browser-001-border);
background:var(--vibeui-browser-001-page);
box-shadow:0 1px 2px oklch(0 0 0 / 0.06),0 12px 28px -16px oklch(0 0 0 / 0.28);
}
[data-vibeui-block="browser-001"] [data-part="chrome"]{
display:flex;align-items:center;gap:0.625rem;padding:0.5625rem 0.75rem;
background:var(--vibeui-browser-001-chrome);border-bottom:1px solid var(--vibeui-browser-001-border);
}
[data-vibeui-block="browser-001"] [data-part="dots"]{display:flex;gap:0.3125rem;flex:none}
[data-vibeui-block="browser-001"] [data-part="dot"]{width:0.5rem;height:0.5rem;border-radius:9999px}
[data-vibeui-block="browser-001"] [data-part="dot"][data-c="red"]{background:#ff5f57}
[data-vibeui-block="browser-001"] [data-part="dot"][data-c="yellow"]{background:#febc2e}
[data-vibeui-block="browser-001"] [data-part="dot"][data-c="green"]{background:#28c840}
[data-vibeui-block="browser-001"] [data-part="address"]{
position:relative;overflow:hidden;flex:1 1 auto;min-width:0;
display:flex;align-items:center;gap:0.375rem;
padding:0.25rem 0.625rem;border-radius:9999px;
background:var(--vibeui-browser-001-page);border:1px solid var(--vibeui-browser-001-border);
}
[data-vibeui-block="browser-001"] [data-part="lock"]{flex:none;width:0.625rem;height:0.625rem;color:var(--vibeui-browser-001-muted)}
[data-vibeui-block="browser-001"] [data-part="url"]{
flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.6875rem;color:var(--vibeui-browser-001-muted);
}
[data-vibeui-block="browser-001"] [data-part="progress"]{
position:absolute;left:0;bottom:0;width:35%;height:2px;border-radius:9999px;
background:var(--vibeui-browser-001-accent);
animation:vibeui-browser-001-progress 2.4s ease-in-out infinite;
}
[data-vibeui-block="browser-001"] [data-part="page"]{display:flex;flex-direction:column;gap:0.75rem;padding:0.875rem}
[data-vibeui-block="browser-001"] [data-part="hero"]{
height:5.25rem;border-radius:0.625rem;
background:linear-gradient(90deg,var(--vibeui-browser-001-skeleton) 25%,var(--vibeui-browser-001-skeleton-strong) 37%,var(--vibeui-browser-001-skeleton) 63%);
background-size:400% 100%;animation:vibeui-browser-001-shimmer 1.8s ease-in-out infinite;
}
[data-vibeui-block="browser-001"] [data-part="lines"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="browser-001"] [data-part="skeleton"]{
height:0.5rem;border-radius:9999px;
background:linear-gradient(90deg,var(--vibeui-browser-001-skeleton) 25%,var(--vibeui-browser-001-skeleton-strong) 37%,var(--vibeui-browser-001-skeleton) 63%);
background-size:400% 100%;animation:vibeui-browser-001-shimmer 1.8s ease-in-out infinite;
}
[data-vibeui-block="browser-001"] [data-part="skeleton"][data-w="92"]{width:92%}
[data-vibeui-block="browser-001"] [data-part="skeleton"][data-w="78"]{width:78%}
[data-vibeui-block="browser-001"] [data-part="skeleton"][data-w="86"]{width:86%}
[data-vibeui-block="browser-001"] [data-part="skeleton"][data-w="55"]{width:55%}
[data-vibeui-block="browser-001"] [data-part="tiles"]{display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem}
[data-vibeui-block="browser-001"] [data-part="tile"]{
height:2.75rem;border-radius:0.5rem;
background:linear-gradient(90deg,var(--vibeui-browser-001-skeleton) 25%,var(--vibeui-browser-001-skeleton-strong) 37%,var(--vibeui-browser-001-skeleton) 63%);
background-size:400% 100%;animation:vibeui-browser-001-shimmer 1.8s ease-in-out infinite;
}
[data-vibeui-block="browser-001"] [data-part="tile"]:nth-child(2){animation-delay:0.15s}
[data-vibeui-block="browser-001"] [data-part="tile"]:nth-child(3){animation-delay:0.3s}
@keyframes vibeui-browser-001-progress{
0%{transform:translateX(-100%);opacity:1}
55%{transform:translateX(220%);opacity:1}
70%,100%{transform:translateX(220%);opacity:0}
}
@keyframes vibeui-browser-001-shimmer{0%{background-position:100% 0}100%{background-position:0 0}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="browser-001"] [data-part="progress"]{animation:none;opacity:0}
[data-vibeui-block="browser-001"] [data-part="hero"],
[data-vibeui-block="browser-001"] [data-part="skeleton"],
[data-vibeui-block="browser-001"] [data-part="tile"]{animation:none;background-position:0 0}
}
`

/**
 * Окно браузера в состоянии загрузки: прогресс в адресной строке и
 * skeleton-контент с бегущим шиммером. Один файл, ноль зависимостей,
 * собственная палитра.
 */
export function Browser001({
  url = "vibeui.ru/dashboard",
  accent,
  compact = false,
  className,
  style,
  ...props
}: Browser001Props) {
  const palette = {
    ...(accent ? { "--vibeui-browser-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-browser-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="browser-001"
        data-slot="browser-loading"
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
            <div data-part="address">
              <svg
                data-part="lock"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              <span data-part="url">{url}</span>
              <span data-part="progress" aria-hidden="true" />
            </div>
          </div>
          <div data-part="page">
            <div data-part="hero" aria-hidden="true" />
            <div data-part="lines" aria-hidden="true">
              <span data-part="skeleton" data-w="92" />
              <span data-part="skeleton" data-w="78" />
              <span data-part="skeleton" data-w="86" />
              <span data-part="skeleton" data-w="55" />
            </div>
            {compact ? null : (
              <div data-part="tiles" aria-hidden="true">
                <span data-part="tile" />
                <span data-part="tile" />
                <span data-part="tile" />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
