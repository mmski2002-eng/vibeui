import type { CSSProperties } from "react"
import { Footerlinks013 } from "@/registry/components/navigation/footerlinks-013/footerlinks-013"

export type Footer041Link = {
  label: string
  href: string
}

export type Footer041Column = {
  title: string
  links: readonly Footer041Link[]
}

export type Footer041Props = {
  brand?: string
  caption?: string
  /** Подпись лампочки статуса: «все системы работают». Пусто — без неё. */
  status?: string
  statusHref?: string
  columns?: readonly Footer041Column[]
  /** Моно-строка «билд»: версия, регион, дата. */
  build?: readonly string[]
  legal?: readonly Footer041Link[]
  copyright?: string
  /** aria колонок и списка сборки. */
  navLabel?: string
  buildLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал API-сервиса: моно-лого с булавкой, подпись, лампочка статуса с
// пульсом и ссылкой на статус-панель, три колонки ссылок с префиксом «//»
// у заголовков, внизу моно-строка билда (версия · регион · дата) чипами,
// правовые ссылки и копирайт. Верхняя граница — тонкая линия с акцентным
// бликом посередине. Без JS.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-041"]){
--vibeui-footer-041-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-footer-041-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-041-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-041-on-accent:oklch(from var(--vibeui-footer-041-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-footer-041-muted:color-mix(in oklab,var(--vibeui-footer-041-fg) 60%,var(--vibeui-footer-041-bg));
--vibeui-footer-041-line:color-mix(in oklab,var(--vibeui-footer-041-fg) 12%,transparent);
--vibeui-footer-041-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-041-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-041"]{color-scheme:dark}
:where([data-vibeui-block="footer-041"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-041"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-041"]{box-sizing:border-box;position:relative;padding:4rem 0 2rem;background:var(--vibeui-footer-041-bg);color:var(--vibeui-footer-041-fg);font-family:var(--vibeui-footer-041-display);font-size:.92rem;line-height:1.5}
[data-vibeui-block="footer-041"]::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:linear-gradient(90deg,var(--vibeui-footer-041-line),var(--vibeui-footer-041-accent),var(--vibeui-footer-041-line))}
[data-vibeui-block="footer-041"] *{box-sizing:border-box}
[data-vibeui-block="footer-041"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="footer-041"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.55rem;font-family:var(--vibeui-footer-041-mono);font-weight:600;font-size:1.05rem;letter-spacing:-.02em}
[data-vibeui-block="footer-041"] [data-part="mark"]{display:grid;place-items:center;width:1.6rem;height:1.6rem;border-radius:.4rem;background:var(--vibeui-footer-041-accent);color:var(--vibeui-footer-041-on-accent)}
[data-vibeui-block="footer-041"] [data-part="mark"] svg{width:1rem;height:1rem}
[data-vibeui-block="footer-041"] [data-part="caption"]{margin:.8rem 0 0;max-width:22rem;color:var(--vibeui-footer-041-muted)}
[data-vibeui-block="footer-041"] [data-part="status"]{display:inline-flex;align-items:center;gap:.5rem;margin:1.2rem 0 0;padding:.35rem .7rem;border:1px solid var(--vibeui-footer-041-line);border-radius:999px;font-family:var(--vibeui-footer-041-mono);font-size:.72rem;color:var(--vibeui-footer-041-muted);text-decoration:none;transition:color .2s,border-color .2s}
[data-vibeui-block="footer-041"] [data-part="status"]:hover{color:var(--vibeui-footer-041-fg);border-color:var(--vibeui-footer-041-fg)}
[data-vibeui-block="footer-041"] [data-part="lamp"]{position:relative;width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-footer-041-accent);box-shadow:0 0 8px var(--vibeui-footer-041-accent)}
[data-vibeui-block="footer-041"] [data-part="lamp"]::after{content:"";position:absolute;inset:-.25rem;border-radius:50%;border:1px solid var(--vibeui-footer-041-accent);animation:vibeui-footer-041-ping 2.2s ease-out infinite}
[data-vibeui-block="footer-041"] [data-part="cols"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.5rem}
[data-vibeui-block="footer-041"] a:focus-visible{outline:2px solid var(--vibeui-footer-041-accent);outline-offset:2px}
[data-vibeui-block="footer-041"] [data-part="bottom"]{display:grid;gap:1rem;padding-top:1.5rem;border-top:1px solid var(--vibeui-footer-041-line);font-size:.78rem;color:var(--vibeui-footer-041-muted)}
[data-vibeui-block="footer-041"] [data-part="build"]{display:flex;flex-wrap:wrap;gap:.4rem;margin:0;padding:0;list-style:none;font-family:var(--vibeui-footer-041-mono);font-size:.68rem}
[data-vibeui-block="footer-041"] [data-part="build"] li{padding:.2rem .5rem;border:1px solid var(--vibeui-footer-041-line);border-radius:.35rem}
[data-vibeui-block="footer-041"] [data-part="legal"]{display:flex;flex-wrap:wrap;gap:.4rem 1.2rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-041"] [data-part="legal"] a{color:inherit;text-decoration:none;transition:color .2s}
[data-vibeui-block="footer-041"] [data-part="legal"] a:hover{color:var(--vibeui-footer-041-fg)}
[data-vibeui-block="footer-041"] [data-part="copy"]{margin:0}
@keyframes vibeui-footer-041-ping{0%{transform:scale(.6);opacity:.9}100%{transform:scale(2.2);opacity:0}}
@container (min-width: 44rem){[data-vibeui-block="footer-041"] [data-part="cols"]{grid-template-columns:repeat(3,minmax(0,1fr))}[data-vibeui-block="footer-041"] [data-part="bottom"]{grid-template-columns:auto 1fr auto;align-items:center}[data-vibeui-block="footer-041"] [data-part="legal"]{justify-content:center}}
@container (min-width: 60rem){[data-vibeui-block="footer-041"] [data-part="shell"]{grid-template-columns:minmax(0,1.2fr) minmax(0,2fr);column-gap:4rem}[data-vibeui-block="footer-041"] [data-part="bottom"]{grid-column:1/-1}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-041"] *{animation:none!important;transition:none!important}}`

const DEFAULT_COLUMNS: Footer041Column[] = [
  { title: "Продукт", links: [{ label: "Эндпоинты", href: "#endpoints" }, { label: "Цены", href: "#pricing" }, { label: "Статус", href: "#status" }, { label: "Changelog", href: "#changelog" }] },
  { title: "Разработчикам", links: [{ label: "Документация", href: "#docs" }, { label: "SDK и примеры", href: "#sdk" }, { label: "Песочница", href: "#sandbox" }, { label: "Лимиты и ошибки", href: "#limits" }] },
  { title: "Компания", links: [{ label: "О нас", href: "#about" }, { label: "Поддержка", href: "#support" }, { label: "Договор и SLA", href: "#sla" }, { label: "Telegram-канал", href: "#tg" }] },
]

/** Подвал API-сервиса с лампочкой статуса и строкой билда. */
export function Footer041({
  brand = "geokod",
  caption = "API геокодирования, маршрутов и подсказок адресов. Оплата за запросы, первые 10 000 в месяц — бесплатно.",
  status = "все системы работают",
  statusHref = "#status",
  columns = DEFAULT_COLUMNS,
  build = ["v2.4.0", "msk-1", "build 2026-09-19"],
  legal = [{ label: "Конфиденциальность", href: "#privacy" }, { label: "Оферта", href: "#terms" }, { label: "Обработка данных", href: "#dpa" }],
  copyright = "© 2026 Геокод",
  navLabel = "Разделы сайта",
  buildLabel = "Сборка",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer041Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-041-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-041-fg": ink } : null),
    ...(background ? { "--vibeui-footer-041-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-041" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-041" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            <div data-part="brand">
              <span data-part="mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s-6-5.2-6-11a6 6 0 0 1 12 0c0 5.8-6 11-6 11Z" />
                  <circle cx="12" cy="10" r="2" />
                </svg>
              </span>
              {brand}
            </div>
            {caption ? <p data-part="caption">{caption}</p> : null}
            {status ? (
              <a data-part="status" href={statusHref}>
                <i data-part="lamp" aria-hidden="true" />
                {status}
              </a>
            ) : null}
          </div>
          <nav data-part="cols" aria-label={navLabel}>
            {columns.map((column) => (
              <Footerlinks013 key={column.title} data-part="column" title={column.title} links={column.links} accent={accent} />
            ))}
          </nav>
          <div data-part="bottom">
            {build.length > 0 ? (
              <ul data-part="build" aria-label={buildLabel}>
                {build.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {legal.length > 0 ? (
              <ul data-part="legal">
                {legal.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            ) : null}
            <p data-part="copy">{copyright}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
