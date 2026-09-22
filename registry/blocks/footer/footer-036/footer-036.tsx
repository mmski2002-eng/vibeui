import type { CSSProperties } from "react"
import { Footerlinks025 } from "@/registry/components/navigation/footerlinks-025/footerlinks-025"

export type Footer036Link = {
  label: string
  href: string
}

export type Footer036Cell = {
  label: string
  value: string
  href?: string
}

export type Footer036Props = {
  brand?: string
  caption?: string
  /** Ячейки штампа: подпись сверху, значение снизу. 4–8 штук. */
  cells?: readonly Footer036Cell[]
  nav?: readonly Footer036Link[]
  legal?: readonly Footer036Link[]
  /** Реквизиты моно-строкой. */
  requisites?: string
  copyright?: string
  /** Заголовки колонок навигации и документов. */
  navTitle?: string
  legalTitle?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал как штамп чертежа (основная надпись по ГОСТ): сетка ячеек с
// подписями «Разраб.», «Пров.», «Лист», «Листов» и значениями —
// телефон, адрес, часы, гарантия. Слева крупный бренд с подписью, справа
// разделы и правовые ссылки, внизу реквизиты моно и копирайт. Рамка
// двойная, как на листе. Без JS.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-036"]){
--vibeui-footer-036-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-footer-036-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-036-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-036-muted:color-mix(in oklab,var(--vibeui-footer-036-fg) 62%,var(--vibeui-footer-036-bg));
--vibeui-footer-036-line:color-mix(in oklab,var(--vibeui-footer-036-fg) 22%,transparent);
--vibeui-footer-036-grid:color-mix(in oklab,var(--vibeui-footer-036-fg) 8%,transparent);
--vibeui-footer-036-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-036-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-036-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-036"]{color-scheme:dark}
:where([data-vibeui-block="footer-036"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-036"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-036"]{box-sizing:border-box;padding:3rem 0 1.5rem;background-color:var(--vibeui-footer-036-bg);background-image:linear-gradient(var(--vibeui-footer-036-grid) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-footer-036-grid) 1px,transparent 1px);background-size:1rem 1rem;color:var(--vibeui-footer-036-fg);font-family:var(--vibeui-footer-036-font);font-size:.9rem;line-height:1.5}
[data-vibeui-block="footer-036"] *{box-sizing:border-box}
[data-vibeui-block="footer-036"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="footer-036"] [data-part="sheet"]{position:relative;border:2px solid var(--vibeui-footer-036-fg);padding:.4rem;background:var(--vibeui-footer-036-bg)}
[data-vibeui-block="footer-036"] [data-part="frame"]{display:grid;border:1px solid var(--vibeui-footer-036-fg)}
[data-vibeui-block="footer-036"] [data-part="brand"]{display:grid;align-content:center;gap:.3rem;padding:1.4rem 1.2rem;border-bottom:1px solid var(--vibeui-footer-036-fg)}
[data-vibeui-block="footer-036"] [data-part="brand"] b{font-family:var(--vibeui-footer-036-display);font-weight:800;font-size:clamp(2rem,6cqi,3.2rem);line-height:.95;letter-spacing:-.04em;text-transform:uppercase}
[data-vibeui-block="footer-036"] [data-part="brand"] b::after{content:"";display:block;width:2.4rem;height:.35rem;margin-top:.6rem;background:var(--vibeui-footer-036-accent)}
[data-vibeui-block="footer-036"] [data-part="brand"] span{font-family:var(--vibeui-footer-036-mono);font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-footer-036-muted)}
[data-vibeui-block="footer-036"] [data-part="cells"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));margin:0}
[data-vibeui-block="footer-036"] [data-part="cell"]{display:grid;gap:.15rem;padding:.7rem .9rem;border-right:1px solid var(--vibeui-footer-036-fg);border-bottom:1px solid var(--vibeui-footer-036-fg);min-width:0}
[data-vibeui-block="footer-036"] [data-part="cell"]:nth-child(2n){border-right:0}
[data-vibeui-block="footer-036"] [data-part="cell"] dt{font-family:var(--vibeui-footer-036-mono);font-size:.58rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-footer-036-muted)}
[data-vibeui-block="footer-036"] [data-part="cell"] dd{margin:0;font-family:var(--vibeui-footer-036-mono);font-size:.82rem;font-weight:500;overflow-wrap:anywhere}
[data-vibeui-block="footer-036"] [data-part="cell"] a{color:inherit;text-decoration:none;border-bottom:1px solid var(--vibeui-footer-036-line);transition:border-color .2s}
[data-vibeui-block="footer-036"] [data-part="cell"] a:hover{border-color:var(--vibeui-footer-036-accent)}
[data-vibeui-block="footer-036"] a:focus-visible{outline:2px solid var(--vibeui-footer-036-accent);outline-offset:2px}
[data-vibeui-block="footer-036"] [data-part="bottom"]{display:grid;gap:.5rem;padding:.7rem 1.2rem;font-family:var(--vibeui-footer-036-mono);font-size:.66rem;letter-spacing:.02em;color:var(--vibeui-footer-036-muted)}
[data-vibeui-block="footer-036"] [data-part="bottom"] p{margin:0}
@container (min-width: 44rem){[data-vibeui-block="footer-036"] [data-part="cells"]{grid-template-columns:repeat(4,minmax(0,1fr))}[data-vibeui-block="footer-036"] [data-part="cell"]:nth-child(2n){border-right:1px solid var(--vibeui-footer-036-fg)}[data-vibeui-block="footer-036"] [data-part="cell"]:nth-child(4n){border-right:0}[data-vibeui-block="footer-036"] [data-part="bottom"]{grid-template-columns:minmax(0,1fr) auto}}
@container (min-width: 64rem){
[data-vibeui-block="footer-036"] [data-part="links"]{grid-area:links}[data-vibeui-block="footer-036"] [data-part="frame"]{grid-template-columns:18rem minmax(0,1fr) 16rem;grid-template-areas:"brand cells links" "bottom bottom bottom"}[data-vibeui-block="footer-036"] [data-part="brand"]{grid-area:brand;border-bottom:0;border-right:1px solid var(--vibeui-footer-036-fg)}[data-vibeui-block="footer-036"] [data-part="cells"]{grid-area:cells;grid-template-columns:repeat(2,minmax(0,1fr));align-content:start;border-right:1px solid var(--vibeui-footer-036-fg)}[data-vibeui-block="footer-036"] [data-part="cell"]:nth-child(4n){border-right:1px solid var(--vibeui-footer-036-fg)}[data-vibeui-block="footer-036"] [data-part="cell"]:nth-child(2n){border-right:0}[data-vibeui-block="footer-036"] [data-part="bottom"]{grid-area:bottom;border-top:1px solid var(--vibeui-footer-036-fg)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-036"] *{animation:none!important;transition:none!important}}`

/** Подвал-штамп чертежа с ячейками реквизитов. */
export function Footer036({
  brand = "Ровно",
  caption = "ремонт квартир · Москва · с 2011",
  cells = [
    { label: "Телефон", value: "+7 495 120-40-40", href: "tel:+74951204040" },
    { label: "Почта", value: "smeta@rovno.ru", href: "mailto:smeta@rovno.ru" },
    { label: "Офис", value: "Москва, Большая Полянка, 28, стр. 2" },
    { label: "Часы", value: "пн–сб 9:00–21:00" },
    { label: "Гарантия", value: "5 лет по договору" },
    { label: "Штраф за просрочку", value: "0,5 % в день" },
    { label: "Лист", value: "1" },
    { label: "Листов", value: "1" },
  ],
  nav = [
    { label: "Смета", href: "#calc" },
    { label: "Этапы", href: "#stages" },
    { label: "Объекты", href: "#works" },
    { label: "Стройка онлайн", href: "#online" },
    { label: "Бригада", href: "#team" },
    { label: "Отзывы", href: "#reviews" },
  ],
  legal = [
    { label: "Договор (образец)", href: "#contract" },
    { label: "Политика данных", href: "#privacy" },
  ],
  requisites = "ООО «Ровно» · ИНН 7706412870 · ОГРН 1157746318204 · СРО НОСТРОЙ № С-0412",
  copyright = "© 2011–2026 Ровно",
  navTitle = "Разделы",
  legalTitle = "Документы",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer036Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-036-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-036-fg": ink } : null),
    ...(background ? { "--vibeui-footer-036-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-036" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-036" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="sheet">
            <div data-part="frame">
              <div data-part="brand">
                <b>{brand}</b>
                {caption ? <span>{caption}</span> : null}
              </div>
              <dl data-part="cells">
                {cells.map((cell) => (
                  <div key={cell.label} data-part="cell">
                    <dt>{cell.label}</dt>
                    <dd>{cell.href ? <a href={cell.href}>{cell.value}</a> : cell.value}</dd>
                  </div>
                ))}
              </dl>
              <Footerlinks025 data-part="links" nav={nav} navTitle={navTitle} legal={legal} legalTitle={legalTitle} accent={accent} />
              <div data-part="bottom">
                {requisites ? <p>{requisites}</p> : null}
                {copyright ? <p>{copyright}</p> : null}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
