import type { CSSProperties } from "react"
import { Footerlinks002 } from "@/registry/components/navigation/footerlinks-002/footerlinks-002"

export type Footer021Link = {
  label: string
  href: string
}

export type Footer021Props = {
  brand?: string
  caption?: string
  /** Автор и контакт. */
  author?: string
  email?: string
  /** Колонки ссылок: разделы курса, документы. */
  columns?: readonly { title: string; links: readonly Footer021Link[] }[]
  socials?: readonly Footer021Link[]
  socialsLabel?: string
  /** Реквизиты: ИП, ИНН, лицензия. */
  legal?: string
  /** Гигантское слово контуром внизу: true — имя бренда, строка — своё, false — без него. */
  giant?: boolean | string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал лендинга курса: словомарка с подписью, автор и почта, две колонки
// ссылок (разделы и документы), соцсети капсулами, реквизиты ИП и лицензия.
// В самом низу имя бренда гигантским контуром на всю ширину: выезжает
// снизу при скролле (scroll-driven), заливается акцентом по наведению.
// Серверный, без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-021"]){
--vibeui-footer-021-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-footer-021-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-021-muted:light-dark(#6b7280,#a3a3a3);
--vibeui-footer-021-line:light-dark(#e5e7eb,#2e2e2e);
--vibeui-footer-021-chip:light-dark(#ffffff,#242424);
--vibeui-footer-021-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-021-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-021-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-021"]{color-scheme:dark}
:where([data-vibeui-block="footer-021"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-021"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-021"]{box-sizing:border-box;display:block;overflow:hidden;background:var(--vibeui-footer-021-bg);color:var(--vibeui-footer-021-fg);font-family:var(--vibeui-footer-021-font);font-size:.9375rem;line-height:1.5;border-top:1px solid var(--vibeui-footer-021-line)}
[data-vibeui-block="footer-021"] *{box-sizing:border-box}
[data-vibeui-block="footer-021"] a{color:inherit;text-decoration:none}
[data-vibeui-block="footer-021"] a:focus-visible{outline:2px solid var(--vibeui-footer-021-accent);outline-offset:3px;border-radius:.25rem}
[data-vibeui-block="footer-021"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:3rem 1.25rem 1.75rem}
[data-vibeui-block="footer-021"] [data-part="top"]{display:grid;gap:2rem;padding-bottom:2rem;border-bottom:1px solid var(--vibeui-footer-021-line)}
[data-vibeui-block="footer-021"] [data-part="brand"]{margin:0;font-family:var(--vibeui-footer-021-display);font-size:1.25rem;font-weight:700;letter-spacing:-.01em}
[data-vibeui-block="footer-021"] [data-part="brand"]::before{content:"";display:inline-block;width:.6rem;height:.6rem;margin-right:.45rem;border-radius:.15rem;background:var(--vibeui-footer-021-accent);transform:rotate(45deg) translateY(-.05rem)}
[data-vibeui-block="footer-021"] [data-part="caption"]{margin:.35rem 0 0;font-size:.85rem;color:var(--vibeui-footer-021-muted)}
[data-vibeui-block="footer-021"] [data-part="author"]{margin:1.25rem 0 0;font-size:.9rem}
[data-vibeui-block="footer-021"] [data-part="email"]{display:inline-block;margin-top:.25rem;font-weight:600;border-bottom:1px solid var(--vibeui-footer-021-accent);padding-bottom:.05rem}
[data-vibeui-block="footer-021"] [data-part="column-col-title"]{margin:0 0 .75rem;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-footer-021-muted);font-weight:700}
[data-vibeui-block="footer-021"] [data-part="socials"]{display:flex;flex-wrap:wrap;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-021"] [data-part="social"]{display:inline-flex;align-items:center;height:2.4rem;padding:0 .9rem;border-radius:999px;background:var(--vibeui-footer-021-chip);border:1px solid var(--vibeui-footer-021-line);font-size:.82rem;font-weight:600;transition:border-color .2s,transform .2s}
[data-vibeui-block="footer-021"] [data-part="social"]:hover{border-color:var(--vibeui-footer-021-accent);transform:translateY(-1px)}
[data-vibeui-block="footer-021"] [data-part="bottom"]{padding-top:1.25rem;font-size:.75rem;color:var(--vibeui-footer-021-muted)}
[data-vibeui-block="footer-021"] [data-part="giant"]{display:block;margin:2rem 0 -.18em;font-family:var(--vibeui-footer-021-display);font-weight:700;font-size:clamp(3rem,13.5cqi,13rem);line-height:.9;letter-spacing:-.04em;white-space:nowrap;text-align:center;color:transparent;-webkit-text-stroke:1px color-mix(in oklab,var(--vibeui-footer-021-fg) 35%,transparent);user-select:none;pointer-events:none;transition:color .6s,-webkit-text-stroke-color .6s}
[data-vibeui-block="footer-021"]:hover [data-part="giant"]{color:color-mix(in oklab,var(--vibeui-footer-021-accent) 10%,transparent);-webkit-text-stroke-color:var(--vibeui-footer-021-accent)}
@supports (animation-timeline: view()){[data-vibeui-block="footer-021"] [data-part="giant"]{animation:vibeui-footer-021-rise linear both;animation-timeline:view();animation-range:entry 0% entry 100%}}
@keyframes vibeui-footer-021-rise{from{transform:translateY(40%);opacity:0}to{transform:none;opacity:1}}
[data-vibeui-block="footer-021"] [data-part="bottom"] p{margin:0;max-width:60rem}
@container (min-width: 56rem){
[data-vibeui-block="footer-021"] [data-part="shell"]{padding:4rem 2rem 1.75rem}
[data-vibeui-block="footer-021"] [data-part="top"]{grid-template-columns:1.6fr 1fr 1fr 1.2fr;gap:3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-021"] *{transition:none!important}}`

/** Подвал лендинга курса: словомарка, автор, ссылки, соцсети и реквизиты. */
export function Footer021({
  brand = "Figma Pro",
  caption = "Онлайн-курс для продуктовых дизайнеров",
  author = "Автор и ведущая — Ксения Мороз",
  email = "hello@example.com",
  columns = [
    { title: "Курс", links: [{ label: "Программа", href: "#program" }, { label: "Результаты", href: "#results" }, { label: "Стоимость", href: "#pricing" }, { label: "Вопросы", href: "#faq" }] },
    { title: "Документы", links: [{ label: "Договор оферты", href: "#" }, { label: "Политика конфиденциальности", href: "#" }, { label: "Условия возврата", href: "#" }] },
  ],
  socials = [
    { label: "Telegram", href: "https://t.me/" },
    { label: "YouTube", href: "https://youtube.com/" },
    { label: "Behance", href: "https://behance.net/" },
  ],
  socialsLabel = "Мы в сети",
  giant = true,
  legal = "ИП Мороз Ксения Андреевна, ИНН 780000000000, ОГРНИП 320000000000000. Лицензия на образовательную деятельность № Л035-00000-78/00000000. © 2021–2026.",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer021Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-021-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-021-fg": ink } : null),
    ...(background ? { "--vibeui-footer-021-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-021" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-021" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="top">
            <div>
              <p data-part="brand">{brand}</p>
              {caption ? <p data-part="caption">{caption}</p> : null}
              {author ? <p data-part="author">{author}</p> : null}
              {email ? (
                <a data-part="email" href={`mailto:${email}`}>
                  {email}
                </a>
              ) : null}
            </div>
            {columns.map((column) => (
              <Footerlinks002 key={column.title} data-part="column" title={column.title} links={column.links} accent={accent} />
            ))}
            <div>
              {socialsLabel ? <p data-part="column-col-title">{socialsLabel}</p> : null}
              <ul data-part="socials">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a data-part="social" href={social.href} target="_blank" rel="noreferrer noopener">
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div data-part="bottom">{legal ? <p>{legal}</p> : null}</div>
        </div>
        {giant ? (
          <span data-part="giant" aria-hidden="true">
            {giant === true ? brand : giant}
          </span>
        ) : null}
      </footer>
    </>
  )
}
