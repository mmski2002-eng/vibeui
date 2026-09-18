import type { CSSProperties } from "react"

export type Footer029Link = {
  label: string
  href: string
}

export type Footer029Column = {
  title: string
  links: readonly Footer029Link[]
}

export type Footer029Props = {
  brand?: string
  tagline?: string
  version?: string
  license?: string
  columns?: readonly Footer029Column[]
  /** Строка статуса: «все системы работают». */
  status?: string
  copyright?: string
  madeBy?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Минимальный подвал open-source проекта: имя моноширинным с «~/», чипы
// версии и лицензии, три колонки ссылок, строка статуса с зелёной точкой,
// внизу — копирайт и «сделано контрибьюторами из N стран». Линии вместо
// теней, всё на одной сетке.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-029"]){
--vibeui-footer-029-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-footer-029-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-029-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-029-muted:color-mix(in oklab,var(--vibeui-footer-029-fg) 60%,var(--vibeui-footer-029-bg));
--vibeui-footer-029-line:color-mix(in oklab,var(--vibeui-footer-029-fg) 12%,transparent);
--vibeui-footer-029-ok:#3fa35b;
--vibeui-footer-029-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-029-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-029"]{color-scheme:dark}
:where([data-vibeui-block="footer-029"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-029"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-029"]{box-sizing:border-box;padding:3.5rem 0 2rem;background:var(--vibeui-footer-029-bg);color:var(--vibeui-footer-029-fg);font-family:var(--vibeui-footer-029-font);font-size:.92rem;line-height:1.5;border-top:1px solid var(--vibeui-footer-029-line)}
[data-vibeui-block="footer-029"] *{box-sizing:border-box}
[data-vibeui-block="footer-029"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="footer-029"] [data-part="top"]{display:grid;gap:2rem}
[data-vibeui-block="footer-029"] [data-part="brand"]{font-family:var(--vibeui-footer-029-mono);font-weight:600;font-size:1.1rem}
[data-vibeui-block="footer-029"] [data-part="brand"] i{color:var(--vibeui-footer-029-accent);font-style:normal}
[data-vibeui-block="footer-029"] [data-part="tag"]{margin:.5rem 0 0;color:var(--vibeui-footer-029-muted);max-width:22rem}
[data-vibeui-block="footer-029"] [data-part="chips"]{display:flex;gap:.4rem;margin-top:.9rem}
[data-vibeui-block="footer-029"] [data-part="chips"] span{font-family:var(--vibeui-footer-029-mono);font-size:.68rem;padding:.2rem .45rem;border-radius:4px;border:1px solid var(--vibeui-footer-029-line);color:var(--vibeui-footer-029-muted)}
[data-vibeui-block="footer-029"] [data-part="cols"]{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem}
[data-vibeui-block="footer-029"] [data-part="cols"] h4{margin:0 0 .6rem;font-family:var(--vibeui-footer-029-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-footer-029-muted)}
[data-vibeui-block="footer-029"] [data-part="cols"] a{display:block;color:inherit;text-decoration:none;padding:.15rem 0;opacity:.85;transition:color .2s,opacity .2s}
[data-vibeui-block="footer-029"] [data-part="cols"] a:hover{opacity:1;color:var(--vibeui-footer-029-accent)}
[data-vibeui-block="footer-029"] [data-part="bottom"]{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-top:2.5rem;padding-top:1.2rem;border-top:1px solid var(--vibeui-footer-029-line);font-family:var(--vibeui-footer-029-mono);font-size:.72rem;color:var(--vibeui-footer-029-muted)}
[data-vibeui-block="footer-029"] [data-part="status"]{display:inline-flex;align-items:center;gap:.4rem}
[data-vibeui-block="footer-029"] [data-part="status"] i{width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-footer-029-ok);box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-footer-029-ok) 25%,transparent)}
[data-vibeui-block="footer-029"] a:focus-visible{outline:2px solid var(--vibeui-footer-029-accent);outline-offset:2px}
@container (min-width: 56rem){[data-vibeui-block="footer-029"] [data-part="top"]{grid-template-columns:minmax(0,1fr) minmax(0,1.5fr)}[data-vibeui-block="footer-029"] [data-part="cols"]{grid-template-columns:repeat(3,1fr)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-029"] *{transition:none!important}}`

/** Минимальный подвал open-source проекта. */
export function Footer029({
  brand = "tabl",
  tagline = "Headless-таблица для React. Данные и поведение — от нас, разметка — от вас.",
  version = "v2.4.1",
  license = "MIT",
  columns = [
    { title: "Проект", links: [{ label: "Документация", href: "#docs" }, { label: "Песочница", href: "#playground" }, { label: "История версий", href: "#changelog" }, { label: "Roadmap", href: "#" }] },
    { title: "Сообщество", links: [{ label: "GitHub", href: "#" }, { label: "Discussions", href: "#" }, { label: "Telegram", href: "#" }, { label: "Good first issue", href: "#" }] },
    { title: "Ещё", links: [{ label: "npm", href: "#" }, { label: "Спонсоры", href: "#star" }, { label: "Кодекс поведения", href: "#" }, { label: "Безопасность", href: "#" }] },
  ],
  status = "все системы работают · CI зелёный",
  copyright = "© tabl contributors",
  madeBy = "сделано контрибьюторами из 31 страны",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer029Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-029-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-029-fg": ink } : null),
    ...(background ? { "--vibeui-footer-029-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-029" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-029" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="top">
            <div>
              <div data-part="brand">
                <i>~/</i>
                {brand}
              </div>
              {tagline ? <p data-part="tag">{tagline}</p> : null}
              <div data-part="chips">
                {version ? <span>{version}</span> : null}
                {license ? <span>{license}</span> : null}
              </div>
            </div>
            <div data-part="cols">
              {columns.map((column) => (
                <div key={column.title}>
                  <h4>{column.title}</h4>
                  {column.links.map((link) => (
                    <a key={link.label} href={link.href}>
                      {link.label}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div data-part="bottom">
            {status ? (
              <span data-part="status">
                <i aria-hidden="true" />
                {status}
              </span>
            ) : null}
            <span>
              {copyright}
              {madeBy ? ` · ${madeBy}` : ""}
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
