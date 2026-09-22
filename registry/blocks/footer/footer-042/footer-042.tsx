import type { CSSProperties } from "react"
import { Footerlinks014 } from "@/registry/components/navigation/footerlinks-014/footerlinks-014"

export type Footer042Link = {
  label: string
  href: string
}

export type Footer042Column = {
  title: string
  links: readonly Footer042Link[]
}

export type Footer042Props = {
  brand?: string
  caption?: string
  /** Моно-строка статуса партии: «партия 2 · отгрузка 10 октября». */
  status?: string
  columns?: readonly Footer042Column[]
  legal?: readonly Footer042Link[]
  copyright?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал продуктового лендинга гаджета: гигантский контурный словесный
// знак на всю ширину (outline-текст через -webkit-text-stroke, обрезан
// снизу), над ним подпись и чип статуса партии с точкой-светом, колонки
// ссылок, внизу правовые ссылки и копирайт. При наведении на знак контур
// заливается.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-042"]){
--vibeui-footer-042-bg:light-dark(#ffffff,#0a0a0a);
--vibeui-footer-042-fg:light-dark(#111111,#f2ede4);
--vibeui-footer-042-accent:light-dark(#111111,#f2ede4);
--vibeui-footer-042-muted:color-mix(in oklab,var(--vibeui-footer-042-fg) 60%,var(--vibeui-footer-042-bg));
--vibeui-footer-042-line:color-mix(in oklab,var(--vibeui-footer-042-fg) 12%,transparent);
--vibeui-footer-042-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-042-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-042-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-042"]{color-scheme:dark}
:where([data-vibeui-block="footer-042"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-042"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-042"]{box-sizing:border-box;padding:4rem 0 0;overflow:hidden;background:var(--vibeui-footer-042-bg);color:var(--vibeui-footer-042-fg);font-family:var(--vibeui-footer-042-font);font-size:.95rem;line-height:1.5}
[data-vibeui-block="footer-042"] *{box-sizing:border-box}
[data-vibeui-block="footer-042"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="footer-042"] [data-part="top"]{display:grid;gap:2.5rem;padding-bottom:3rem;border-bottom:1px solid var(--vibeui-footer-042-line)}
[data-vibeui-block="footer-042"] [data-part="about"]{display:grid;gap:1rem;align-content:start}
[data-vibeui-block="footer-042"] [data-part="caption"]{margin:0;max-width:22rem;color:var(--vibeui-footer-042-muted)}
[data-vibeui-block="footer-042"] [data-part="status"]{display:inline-flex;align-items:center;gap:.5rem;width:fit-content;padding:.4rem .8rem;border-radius:999px;border:1px solid var(--vibeui-footer-042-line);font-family:var(--vibeui-footer-042-mono);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-footer-042-muted)}
[data-vibeui-block="footer-042"] [data-part="status"]::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-footer-042-accent);box-shadow:0 0 10px var(--vibeui-footer-042-accent);animation:vibeui-footer-042-pulse 2.4s ease-in-out infinite}
[data-vibeui-block="footer-042"] [data-part="columns"]{display:grid;gap:2rem;grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="footer-042"] a:focus-visible{outline:2px solid var(--vibeui-footer-042-accent);outline-offset:2px}
[data-vibeui-block="footer-042"] [data-part="bottom"]{display:flex;flex-wrap:wrap;gap:.6rem 1.5rem;justify-content:space-between;padding:1.4rem 0;font-size:.8rem;color:var(--vibeui-footer-042-muted)}
[data-vibeui-block="footer-042"] [data-part="legal"]{display:flex;flex-wrap:wrap;gap:.6rem 1.2rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-042"] [data-part="legal"] a{color:inherit;text-decoration:none}
[data-vibeui-block="footer-042"] [data-part="legal"] a:hover{color:var(--vibeui-footer-042-fg)}
[data-vibeui-block="footer-042"] [data-part="mark"]{display:block;margin:0 auto -.28em;max-width:84rem;padding:0 1.25rem;font-family:var(--vibeui-footer-042-display);font-weight:900;font-size:clamp(5rem,26cqi,22rem);line-height:1;letter-spacing:-.02em;text-transform:uppercase;text-align:center;color:transparent;-webkit-text-stroke:1px color-mix(in oklab,var(--vibeui-footer-042-fg) 45%,transparent);user-select:none;transition:color .5s,-webkit-text-stroke-color .5s}
[data-vibeui-block="footer-042"] [data-part="mark"]:hover{color:var(--vibeui-footer-042-accent);-webkit-text-stroke-color:var(--vibeui-footer-042-accent)}
@keyframes vibeui-footer-042-pulse{0%,100%{opacity:1}50%{opacity:.35}}
@container (min-width: 56rem){[data-vibeui-block="footer-042"] [data-part="top"]{grid-template-columns:1.2fr 2fr}[data-vibeui-block="footer-042"] [data-part="columns"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-042"] *{animation:none!important;transition:none!important}}`

const DEFAULT_COLUMNS: Footer042Column[] = [
  { title: "Продукт", links: [{ label: "Рассвет", href: "#dawn" }, { label: "Возможности", href: "#features" }, { label: "Устройство", href: "#inside" }, { label: "Характеристики", href: "#specs" }] },
  { title: "Покупка", links: [{ label: "Предзаказ", href: "#preorder" }, { label: "Доставка и гарантия", href: "#faq" }, { label: "Где посмотреть", href: "#stores" }, { label: "Для бизнеса", href: "#b2b" }] },
  { title: "Компания", links: [{ label: "О лаборатории", href: "#about" }, { label: "Прошивки", href: "#firmware" }, { label: "Поддержка", href: "#support" }, { label: "Telegram", href: "#tg" }] },
]

/** Подвал гаджета с гигантским контурным знаком и статусом партии. */
export function Footer042({
  brand = "Луч",
  caption = "Умная лампа-будильник. Собираем в Москве небольшими партиями, обновляем прошивку раз в месяц.",
  status = "партия 2 · отгрузка в октябре",
  columns = DEFAULT_COLUMNS,
  legal = [
    { label: "Оферта", href: "#offer" },
    { label: "Конфиденциальность", href: "#privacy" },
    { label: "Гарантия", href: "#warranty" },
  ],
  copyright = "© 2026 Лаборатория Луч",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer042Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-042-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-042-fg": ink } : null),
    ...(background ? { "--vibeui-footer-042-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-042" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-042" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="top">
            <div data-part="about">
              {status ? <span data-part="status">{status}</span> : null}
              {caption ? <p data-part="caption">{caption}</p> : null}
            </div>
            <div data-part="columns">
              {columns.map((column) => (
                <Footerlinks014 key={column.title} data-part="column" title={column.title} links={column.links} accent={accent} />
              ))}
            </div>
          </div>
          <div data-part="bottom">
            <span>{copyright}</span>
            {legal.length > 0 ? (
              <ul data-part="legal">
                {legal.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
        <span data-part="mark" aria-hidden="true">
          {brand}
        </span>
      </footer>
    </>
  )
}
