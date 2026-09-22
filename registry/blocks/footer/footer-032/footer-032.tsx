import type { CSSProperties } from "react"
import { Footerlinks007 } from "@/registry/components/navigation/footerlinks-007/footerlinks-007"

export type Footer032Link = {
  label: string
  href: string
}

export type Footer032Column = {
  title: string
  links: readonly Footer032Link[]
}

export type Footer032Props = {
  brand?: string
  caption?: string
  /** Строка статуса: «Все системы работают». Пусто — не показывать. */
  status?: string
  statusHref?: string
  columns?: readonly Footer032Column[]
  socials?: readonly Footer032Link[]
  legal?: readonly Footer032Link[]
  copyright?: string
  navLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал AI-сервиса: сверху аврора-линия, лого с искрой и подпись, чип
// статуса с зелёной точкой-пульсом («все системы работают»), три колонки
// ссылок, соцсети, внизу правовые ссылки и копирайт. Под всем — гигантский
// контурный водяной знак бренда, обрезанный низом подвала. Колонки и бренд
// проявляются каскадом на scroll-driven animation-timeline: view() с
// фолбэком «видно всегда»; ссылки подчёркиваются линией, которая
// вырастает от левого края. На узком колонки в две, на широком — бренд
// слева, колонки справа.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-032"]){
--vibeui-footer-032-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-footer-032-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-032-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-032-muted:color-mix(in oklab,var(--vibeui-footer-032-fg) 60%,var(--vibeui-footer-032-bg));
--vibeui-footer-032-line:color-mix(in oklab,var(--vibeui-footer-032-fg) 12%,transparent);
--vibeui-footer-032-glass:color-mix(in oklab,var(--vibeui-footer-032-fg) 6%,transparent);
--vibeui-footer-032-ok:#22c55e;
--vibeui-footer-032-aurora:linear-gradient(90deg,transparent,var(--vibeui-footer-032-accent),color-mix(in oklab,var(--vibeui-footer-032-accent) 40%,#a855f7),color-mix(in oklab,var(--vibeui-footer-032-accent) 30%,#f472b6),transparent);
--vibeui-footer-032-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-footer-032-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-032-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-032-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-032"]{color-scheme:dark}
:where([data-vibeui-block="footer-032"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-032"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-032"]{box-sizing:border-box;position:relative;overflow:hidden;padding:4rem 0 2rem;background:var(--vibeui-footer-032-bg);color:var(--vibeui-footer-032-fg);font-family:var(--vibeui-footer-032-font);font-size:.92rem;line-height:1.5}
[data-vibeui-block="footer-032"]::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--vibeui-footer-032-aurora);opacity:.7}
[data-vibeui-block="footer-032"] *{box-sizing:border-box}
[data-vibeui-block="footer-032"] [data-part="ghost"]{position:absolute;left:50%;bottom:-.28em;transform:translateX(-50%);margin:0;font-family:var(--vibeui-footer-032-display);font-weight:800;font-size:clamp(5rem,22cqi,18rem);line-height:1;letter-spacing:-.05em;white-space:nowrap;color:transparent;-webkit-text-stroke:1px color-mix(in oklab,var(--vibeui-footer-032-fg) 16%,transparent);pointer-events:none;user-select:none}
[data-vibeui-block="footer-032"] [data-part="ghost"]::after{content:attr(data-text);position:absolute;inset:0;-webkit-text-stroke:0;background:var(--vibeui-footer-032-aurora);-webkit-background-clip:text;background-clip:text;color:transparent;opacity:.12}
[data-vibeui-block="footer-032"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="footer-032"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.5rem;font-family:var(--vibeui-footer-032-display);font-weight:800;font-size:1.25rem;letter-spacing:-.02em}
[data-vibeui-block="footer-032"] [data-part="brand"] svg{width:1.1rem;height:1.1rem;color:var(--vibeui-footer-032-accent);transition:transform .6s var(--vibeui-footer-032-ease)}
[data-vibeui-block="footer-032"] [data-part="brand"]:hover svg{transform:rotate(180deg) scale(1.2)}
[data-vibeui-block="footer-032"] [data-part="caption"]{margin:.8rem 0 0;max-width:20rem;color:var(--vibeui-footer-032-muted)}
[data-vibeui-block="footer-032"] [data-part="status"]{display:inline-flex;align-items:center;gap:.5rem;margin:1.2rem 0 0;padding:.4rem .8rem;border-radius:999px;background:var(--vibeui-footer-032-glass);border:1px solid var(--vibeui-footer-032-line);font-family:var(--vibeui-footer-032-mono);font-size:.72rem;color:var(--vibeui-footer-032-fg);text-decoration:none}
[data-vibeui-block="footer-032"] [data-part="status"] i{position:relative;width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-footer-032-ok)}
[data-vibeui-block="footer-032"] [data-part="status"] i::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:2px solid var(--vibeui-footer-032-ok);opacity:0;animation:vibeui-footer-032-pulse 2s ease-out infinite}
[data-vibeui-block="footer-032"] [data-part="columns"]{display:grid;gap:2rem;grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="footer-032"] [data-part="bottom"]{display:flex;flex-wrap:wrap;align-items:center;gap:.8rem 1.5rem;padding-top:1.5rem;border-top:1px solid var(--vibeui-footer-032-line);font-size:.8rem;color:var(--vibeui-footer-032-muted)}
[data-vibeui-block="footer-032"] [data-part="legal"]{display:flex;flex-wrap:wrap;gap:1.2rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-032"] [data-part="legal"] a{color:inherit;text-decoration:none}
[data-vibeui-block="footer-032"] [data-part="legal"] a:hover{color:var(--vibeui-footer-032-fg)}
[data-vibeui-block="footer-032"] [data-part="socials"]{display:flex;gap:.5rem;margin:0 0 0 auto;padding:0;list-style:none}
[data-vibeui-block="footer-032"] [data-part="socials"] a{display:inline-flex;align-items:center;height:2rem;padding:0 .7rem;border-radius:999px;border:1px solid var(--vibeui-footer-032-line);color:var(--vibeui-footer-032-fg);text-decoration:none;font-size:.78rem;transition:border-color .3s,color .3s,transform .4s var(--vibeui-footer-032-ease),box-shadow .3s}
[data-vibeui-block="footer-032"] [data-part="socials"] a:hover{border-color:var(--vibeui-footer-032-accent);color:var(--vibeui-footer-032-accent);transform:translateY(-2px);box-shadow:0 8px 20px -10px var(--vibeui-footer-032-accent)}
[data-vibeui-block="footer-032"] [data-part="status"]{transition:border-color .3s,transform .4s var(--vibeui-footer-032-ease)}
[data-vibeui-block="footer-032"] [data-part="status"]:hover{border-color:var(--vibeui-footer-032-ok);transform:translateY(-2px)}
[data-vibeui-block="footer-032"] a:focus-visible{outline:2px solid var(--vibeui-footer-032-accent);outline-offset:2px}
@keyframes vibeui-footer-032-pulse{0%{transform:scale(.6);opacity:.8}100%{transform:scale(1.8);opacity:0}}
@keyframes vibeui-footer-032-up{from{opacity:0;translate:0 16px}to{opacity:1;translate:0 0}}
@supports (animation-timeline: view()){
[data-vibeui-block="footer-032"] [data-part="shell"]>div:first-child,[data-vibeui-block="footer-032"] [data-part="bottom"]{animation:vibeui-footer-032-up linear both;animation-timeline:view();animation-range:entry 0% entry 70%}
[data-vibeui-block="footer-032"] [data-part="ghost"]{animation:vibeui-footer-032-up linear both;animation-timeline:view();animation-range:entry -50% entry 100%}
}
@container (min-width: 44rem){[data-vibeui-block="footer-032"] [data-part="columns"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@container (min-width: 60rem){[data-vibeui-block="footer-032"] [data-part="shell"]{grid-template-columns:minmax(0,1.2fr) minmax(0,2fr);align-items:start}[data-vibeui-block="footer-032"] [data-part="bottom"]{grid-column:1/-1}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-032"] *{animation:none!important;transition:none!important}}`

const DEFAULT_COLUMNS: Footer032Column[] = [
  { title: "Продукт", links: [{ label: "Как работает", href: "#how" }, { label: "Интеграции", href: "#integrations" }, { label: "Цены", href: "#pricing" }, { label: "Что нового", href: "#changelog" }] },
  { title: "Компания", links: [{ label: "О нас", href: "#about" }, { label: "Блог", href: "#blog" }, { label: "Вакансии", href: "#jobs" }, { label: "Контакты", href: "#contact" }] },
  { title: "Помощь", links: [{ label: "Документация", href: "#docs" }, { label: "API", href: "#api" }, { label: "Безопасность", href: "#security" }, { label: "Поддержка", href: "#support" }] },
]

/** Подвал AI-сервиса со статусом систем и колонками ссылок. */
export function Footer032({
  brand = "Сводка",
  caption = "AI, который слушает созвоны и раскладывает решения по местам.",
  status = "Все системы работают",
  statusHref = "#status",
  columns = DEFAULT_COLUMNS,
  socials = [{ label: "Telegram", href: "#" }, { label: "X", href: "#" }, { label: "GitHub", href: "#" }],
  legal = [{ label: "Конфиденциальность", href: "#privacy" }, { label: "Условия", href: "#terms" }, { label: "Обработка данных", href: "#dpa" }],
  copyright = "© 2026 Сводка",
  navLabel = "Разделы сайта",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer032Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-032-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-032-fg": ink } : null),
    ...(background ? { "--vibeui-footer-032-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-032" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-032" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <p data-part="ghost" data-text={brand} aria-hidden="true">
          {brand}
        </p>
        <div data-part="shell">
          <div>
            <div data-part="brand">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10Z" />
              </svg>
              {brand}
            </div>
            {caption ? <p data-part="caption">{caption}</p> : null}
            {status ? (
              <a data-part="status" href={statusHref}>
                <i aria-hidden="true" />
                {status}
              </a>
            ) : null}
          </div>
          <nav data-part="columns" aria-label={navLabel}>
            {columns.map((column) => (
              <Footerlinks007 key={column.title} data-part="column" title={column.title} links={column.links} accent={accent} />
            ))}
          </nav>
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
            {socials.length > 0 ? (
              <ul data-part="socials">
                {socials.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </footer>
    </>
  )
}
