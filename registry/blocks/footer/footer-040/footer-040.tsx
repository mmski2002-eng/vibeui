import type { CSSProperties } from "react"

export type Footer040Link = {
  label: string
  href: string
}

export type Footer040Column = {
  title: string
  links: readonly Footer040Link[]
}

export type Footer040Props = {
  brand?: string
  caption?: string
  columns?: readonly Footer040Column[]
  legal?: readonly Footer040Link[]
  copyright?: string
  /** Моно-подпись справа внизу: город, версия. */
  note?: string
  topLabel?: string
  topHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал маркетплейса: сверху колонки ссылок с моно-заголовками и
// подпись, ниже — wordmark на всю ширину, размером в 22 % контейнера,
// с плотным трекингом, обрезанный по нижней кромке; акцентный квадрат-
// «слой» в углу буквы. Ссылки подчёркиваются линией, которая рисуется
// слева направо. Внизу моно-строка: копирайт, правовые ссылки, город и
// «наверх». Серверный компонент, без единого хука.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-040"]){
--vibeui-footer-040-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-footer-040-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-040-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-040-muted:color-mix(in oklab,var(--vibeui-footer-040-fg) 58%,var(--vibeui-footer-040-bg));
--vibeui-footer-040-line:color-mix(in oklab,var(--vibeui-footer-040-fg) 12%,transparent);
--vibeui-footer-040-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-040-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-040-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-040"]{color-scheme:dark}
:where([data-vibeui-block="footer-040"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-040"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-040"]{box-sizing:border-box;padding:4rem 0 1.5rem;background:var(--vibeui-footer-040-bg);color:var(--vibeui-footer-040-fg);font-family:var(--vibeui-footer-040-font);font-size:.92rem;line-height:1.5;border-top:1px solid var(--vibeui-footer-040-line);overflow:hidden}
[data-vibeui-block="footer-040"] *{box-sizing:border-box}
[data-vibeui-block="footer-040"] [data-part="shell"]{max-width:86rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="footer-040"] [data-part="top"]{display:grid;gap:2rem}
[data-vibeui-block="footer-040"] [data-part="caption"]{margin:0;max-width:22rem;color:var(--vibeui-footer-040-muted)}
[data-vibeui-block="footer-040"] [data-part="caption"] b{display:block;margin-bottom:.4rem;font-family:var(--vibeui-footer-040-display);font-weight:700;font-size:1.1rem;letter-spacing:-.03em;color:var(--vibeui-footer-040-fg)}
[data-vibeui-block="footer-040"] [data-part="columns"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.5rem 1rem}
[data-vibeui-block="footer-040"] [data-part="column"] h3{margin:0 0 .7rem;font-family:var(--vibeui-footer-040-mono);font-weight:500;font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-footer-040-muted)}
[data-vibeui-block="footer-040"] [data-part="column"] ul{margin:0;padding:0;list-style:none;display:grid;gap:.35rem}
[data-vibeui-block="footer-040"] [data-part="column"] a{position:relative;color:var(--vibeui-footer-040-fg);text-decoration:none;font-weight:500}
[data-vibeui-block="footer-040"] [data-part="column"] a::after{content:"";position:absolute;left:0;right:0;bottom:-.1rem;height:1px;background:var(--vibeui-footer-040-accent);transform:scaleX(0);transform-origin:left;transition:transform .25s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="footer-040"] [data-part="column"] a:hover::after{transform:scaleX(1)}
[data-vibeui-block="footer-040"] [data-part="word"]{position:relative;display:block;margin:3rem 0 0;font-family:var(--vibeui-footer-040-display);font-weight:800;font-size:clamp(5rem,22cqi,17rem);line-height:.78;letter-spacing:-.07em;white-space:nowrap;user-select:none}
[data-vibeui-block="footer-040"] [data-part="glyph"]{position:relative;display:inline-block}
[data-vibeui-block="footer-040"] [data-part="word"] i{position:absolute;left:calc(100% + .05em);bottom:.08em;width:.14em;height:.14em;border-radius:.02em;background:var(--vibeui-footer-040-accent)}
[data-vibeui-block="footer-040"] [data-part="bottom"]{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 1.4rem;margin:1.5rem 0 0;padding-top:1rem;border-top:1px solid var(--vibeui-footer-040-line);font-family:var(--vibeui-footer-040-mono);font-size:.68rem;color:var(--vibeui-footer-040-muted)}
[data-vibeui-block="footer-040"] [data-part="legal"]{display:flex;flex-wrap:wrap;gap:.3rem 1.2rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-040"] [data-part="bottom"] a{color:inherit;text-decoration:none;transition:color .2s}
[data-vibeui-block="footer-040"] [data-part="bottom"] a:hover{color:var(--vibeui-footer-040-fg)}
[data-vibeui-block="footer-040"] [data-part="note"]{margin-left:auto}
[data-vibeui-block="footer-040"] [data-part="up"]{display:inline-flex;align-items:center;gap:.3rem;height:1.8rem;padding:0 .7rem;border-radius:999px;border:1px solid var(--vibeui-footer-040-line)}
[data-vibeui-block="footer-040"] [data-part="up"]:hover{border-color:var(--vibeui-footer-040-fg)}
[data-vibeui-block="footer-040"] a:focus-visible{outline:2px solid var(--vibeui-footer-040-accent);outline-offset:2px}
@container (min-width: 48rem){[data-vibeui-block="footer-040"] [data-part="columns"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@container (min-width: 64rem){[data-vibeui-block="footer-040"] [data-part="top"]{grid-template-columns:minmax(0,1.2fr) minmax(0,2fr);gap:4rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-040"] *{animation:none!important;transition:none!important}}`

const DEFAULT_COLUMNS: Footer040Column[] = [
  { title: "Каталог", links: [{ label: "Шаблоны Figma", href: "#catalog" }, { label: "Шаблоны Notion", href: "#catalog" }, { label: "Иконки", href: "#catalog" }, { label: "Шрифты", href: "#catalog" }, { label: "Наборы", href: "#bundle" }] },
  { title: "Слой", links: [{ label: "Авторам", href: "#for-authors" }, { label: "Лицензии", href: "#licenses" }, { label: "Дропы", href: "#drops" }, { label: "Блог", href: "#blog" }] },
  { title: "Помощь", links: [{ label: "Оплата и возвраты", href: "#faq" }, { label: "Как скачать", href: "#faq" }, { label: "Написать", href: "#contact" }] },
]

/** Подвал с гигантским wordmark и колонками ссылок. */
export function Footer040({
  brand = "Слой",
  caption = "Маркетплейс дизайн-ассетов: шаблоны, иконки, шрифты от независимых авторов. 80 % цены — автору.",
  columns = DEFAULT_COLUMNS,
  legal = [{ label: "Условия", href: "#terms" }, { label: "Конфиденциальность", href: "#privacy" }, { label: "Оферта", href: "#offer" }],
  copyright = "© 2026 Слой",
  note = "Санкт-Петербург · v4.2",
  topLabel = "Наверх",
  topHref = "#top",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer040Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-040-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-040-fg": ink } : null),
    ...(background ? { "--vibeui-footer-040-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-040" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-040" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="top">
            <p data-part="caption">
              <b>{brand}</b>
              {caption}
            </p>
            <div data-part="columns">
              {columns.map((column) => (
                <nav key={column.title} data-part="column" aria-label={column.title}>
                  <h3>{column.title}</h3>
                  <ul>
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <a href={link.href}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>
          <span data-part="word" aria-hidden="true">
            <span data-part="glyph">
              {brand}
              <i />
            </span>
          </span>
          <div data-part="bottom">
            <span>{copyright}</span>
            {legal.length > 0 ? (
              <ul data-part="legal">
                {legal.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            ) : null}
            {note ? <span data-part="note">{note}</span> : null}
            {topLabel ? (
              <a data-part="up" href={topHref}>
                {topLabel} ↑
              </a>
            ) : null}
          </div>
        </div>
      </footer>
    </>
  )
}
