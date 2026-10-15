import type { CSSProperties } from "react"

export type Footer045Column = { title: string; links: readonly { label: string; href: string }[] }

export type Footer045Props = {
  brand?: string
  /** Фото внутри букв бренда; пусто — градиентная заливка. */
  wordImage?: string
  tagline?: string
  phone?: string
  email?: string
  address?: string
  hours?: string
  columns?: readonly Footer045Column[]
  legal?: string
  copyright?: string
  topLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Тёмный подвал: контакты крупно, колонки разделов, внизу огромное слово
// бренда — внутри букв фотография, которая растворяется книзу в фон, а при
// наведении медленно проплывает. Без фото буквы залиты градиентом. Над
// словом янтарная линия-горизонт. Реквизиты моно, кнопка «наверх» кругом.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const S = '[data-vibeui-block="footer-045"]'
const STYLES = `
:where(${S}){
--vibeui-footer-045-bg:light-dark(#e4dfd7,#0a0b0c);
--vibeui-footer-045-fg:light-dark(#16181a,#f2efe9);
--vibeui-footer-045-accent:#e8a35c;
--vibeui-footer-045-muted:color-mix(in oklab,var(--vibeui-footer-045-fg) 56%,transparent);
--vibeui-footer-045-line:color-mix(in oklab,var(--vibeui-footer-045-fg) 12%,transparent);
--vibeui-footer-045-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-045-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) ${S}{color-scheme:dark}
:where(${S}[data-tone="light"]){color-scheme:light}
:where(${S}[data-tone="dark"]){color-scheme:dark}
${S}{overflow:hidden;padding:clamp(3.5rem,7cqi,5.5rem) 0 1.5rem;background:var(--vibeui-footer-045-bg);color:var(--vibeui-footer-045-fg);font-family:var(--vibeui-footer-045-font);font-size:.9rem}
${S} *{box-sizing:border-box}
${S} [data-part="shell"]{max-width:90rem;margin:0 auto;padding:0 clamp(1rem,3cqi,2.5rem)}
${S} [data-part="top"]{display:grid;gap:2.5rem}
${S} [data-part="contacts"] p{margin:0 0 1.4rem;max-width:22rem;color:var(--vibeui-footer-045-muted)}
${S} [data-part="contacts"] a{display:block;width:fit-content;color:inherit;text-decoration:none;font-size:clamp(1.4rem,3cqi,2.2rem);font-weight:300;letter-spacing:-.03em;background:linear-gradient(var(--vibeui-footer-045-accent),var(--vibeui-footer-045-accent)) 0 100%/0 1px no-repeat;transition:background-size .5s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="contacts"] a:hover{background-size:100% 1px}
${S} [data-part="contacts"] dl{display:grid;grid-template-columns:auto 1fr;gap:.35rem 1rem;margin:1.6rem 0 0;font-size:.82rem}
${S} [data-part="contacts"] dt{font-family:var(--vibeui-footer-045-mono);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-footer-045-muted);padding-top:.15rem}
${S} [data-part="contacts"] dd{margin:0}
${S} [data-part="cols"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2rem}
${S} [data-part="cols"] h3{margin:0 0 1rem;font-family:var(--vibeui-footer-045-mono);font-size:.68rem;font-weight:400;letter-spacing:.12em;text-transform:uppercase;color:var(--vibeui-footer-045-muted)}
${S} [data-part="cols"] ul{display:grid;gap:.6rem;margin:0;padding:0;list-style:none}
${S} [data-part="cols"] a{color:inherit;text-decoration:none;transition:color .3s,padding-left .4s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="cols"] a:hover{color:var(--vibeui-footer-045-accent);padding-left:.35rem}
${S} [data-part="word"]{position:relative;display:block;margin:clamp(2.5rem,6cqi,4.5rem) 0 0;padding-top:clamp(1.5rem,3cqi,2.5rem);user-select:none}
${S} [data-part="word"]::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:linear-gradient(90deg,transparent,var(--vibeui-footer-045-accent) 50%,transparent);opacity:.7}
${S} [data-part="word"] span{display:block;font-size:clamp(4rem,20cqi,19rem);font-weight:600;line-height:.8;letter-spacing:-.045em;text-transform:uppercase;text-align:center;color:transparent;background:linear-gradient(180deg,var(--vibeui-footer-045-fg) 0%,color-mix(in oklab,var(--vibeui-footer-045-fg) 55%,var(--vibeui-footer-045-accent)) 45%,transparent 95%);-webkit-background-clip:text;background-clip:text}
${S} [data-part="word"][data-image] span{background:linear-gradient(180deg,transparent 30%,var(--vibeui-footer-045-bg) 98%),var(--vibeui-footer-045-word) 50% 55%/cover no-repeat;-webkit-background-clip:text;background-clip:text;filter:saturate(1.15) brightness(1.15);transition:background-position 6s cubic-bezier(.2,.6,.3,1)}
${S} [data-part="word"][data-image]:hover span{background-position:50% 55%,50% 30%}
${S} [data-part="bottom"]{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid var(--vibeui-footer-045-line);font-family:var(--vibeui-footer-045-mono);font-size:.68rem;color:var(--vibeui-footer-045-muted)}
${S} [data-part="up"]{display:grid;place-items:center;width:2.8rem;height:2.8rem;border:1px solid var(--vibeui-footer-045-line);border-radius:50%;color:inherit;text-decoration:none;transition:background-color .3s,color .3s,transform .5s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="up"]:hover{background:var(--vibeui-footer-045-accent);color:#111;transform:translateY(-3px)}
${S} [data-part="up"] svg{width:1rem;height:1rem}
${S} a:focus-visible{outline:2px solid var(--vibeui-footer-045-accent);outline-offset:2px}
@container (min-width: 56rem){${S} [data-part="top"]{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr)}${S} [data-part="cols"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){${S} *{transition:none!important}}
${S} [data-part="up"]{transition:background-color .35s,color .35s,border-color .35s,transform .3s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="up"] svg{transition:transform .45s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="up"]:active{transform:scale(.9);transition-duration:.12s}
${S} [data-part="up"]:hover svg[data-dir="next"]{transform:translateX(3px)}
${S} [data-part="up"]:hover svg[data-dir="prev"]{transform:translateX(-3px)}
${S} [data-part="up"]:hover svg[data-dir="up"]{transform:translateY(-3px)}
${S} [data-part="up"]:hover svg[data-dir="down"]{transform:translateY(3px)}
@keyframes vibeui-footer-045-fly{0%{transform:none}45%{transform:translate(140%,-140%)}46%{transform:translate(-140%,140%)}100%{transform:none}}
@keyframes vibeui-footer-045-pop{0%{transform:scale(.94)}60%{transform:scale(1.04)}100%{transform:none}}
@media (prefers-reduced-motion:reduce){${S} *,${S} *::before{animation:none!important;transition:none!important}}`

const DEFAULT_COLUMNS: Footer045Column[] = [
  { title: "Дома", links: [{ label: "Каталог проектов", href: "#projects" }, { label: "Банные дома", href: "#projects" }, { label: "Индивидуальный проект", href: "#contact" }] },
  { title: "Компания", links: [{ label: "Технология", href: "#tech" }, { label: "Этапы", href: "#stages" }, { label: "Построенные дома", href: "#built" }] },
  { title: "Клиентам", links: [{ label: "Стоимость", href: "#calc" }, { label: "Ипотека", href: "#faq" }, { label: "Гарантия", href: "#faq" }] },
]

/** Тёмный подвал с контактами и огромным словом бренда контуром. */
export function Footer045({
  brand = "Сосна",
  wordImage = "/demo/house/hero-02.webp",
  tagline = "Строим дома из клеёного бруса в Ленинградской области, Карелии и Подмосковье с 2015 года.",
  phone = "+7 (812) 407-18-42",
  email = "dom@sosna.build",
  address = "Шоурум: Приозерское ш., 12 км, посёлок Сосново",
  hours = "Ежедневно 9:00–21:00",
  columns = DEFAULT_COLUMNS,
  legal = "ООО «Сосна» · ИНН 4712034567 · ОГРН 1154712000321",
  copyright = "© 2026",
  topLabel = "Наверх",
  tone = "dark",
  accent,
  ink,
  background,
  className,
  style,
}: Footer045Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-045-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-045-fg": ink } : null),
    ...(background ? { "--vibeui-footer-045-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-045" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-045" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="top">
            <div data-part="contacts">
              {tagline ? <p>{tagline}</p> : null}
              {phone ? <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a> : null}
              {email ? <a href={`mailto:${email}`}>{email}</a> : null}
              <dl>
                {address ? (
                  <>
                    <dt>⌂</dt>
                    <dd>{address}</dd>
                  </>
                ) : null}
                {hours ? (
                  <>
                    <dt>◷</dt>
                    <dd>{hours}</dd>
                  </>
                ) : null}
              </dl>
            </div>
            <nav data-part="cols">
              {columns.map((column) => (
                <div key={column.title}>
                  <h3>{column.title}</h3>
                  <ul>
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <a href={link.href}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          <span data-part="word" aria-hidden="true" data-image={wordImage ? "" : undefined} style={wordImage ? ({ ["--vibeui-footer-045-word" as string]: `url("${wordImage}")` } as CSSProperties) : undefined}>
            <span>{brand}</span>
          </span>
          <div data-part="bottom">
            <span>
              {copyright} {legal}
            </span>
            <a data-part="up" href="#top" aria-label={topLabel}>
              <svg data-dir="up" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 13V3M4 7l4-4 4 4" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
