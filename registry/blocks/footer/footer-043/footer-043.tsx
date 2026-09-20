import type { CSSProperties } from "react"

export type Footer043Link = {
  label: string
  href: string
}

export type Footer043Requisite = {
  label: string
  value: string
}

export type Footer043Props = {
  brand?: string
  /** Полное юридическое имя под брендом. */
  legalName?: string
  /** Рукописная фраза на полях. */
  thanks?: string
  requisites?: readonly Footer043Requisite[]
  documents?: readonly Footer043Link[]
  contacts?: readonly Footer043Link[]
  socials?: readonly Footer043Link[]
  legal?: readonly Footer043Link[]
  copyright?: string
  /** aria соцсетей и заголовки колонок. */
  socialsLabel?: string
  requisitesTitle?: string
  documentsTitle?: string
  contactsTitle?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал благотворительного фонда: сверху пунктирный «шов», бренд антиквой
// с полным юридическим именем и рукописным «спасибо, что дочитали»,
// колонка реквизитов моноширинной вёрсткой (ИНН, ОГРН, счёт — с «копировать
// глазами» разметкой), документы с иконкой pdf, контакты и соцсети. Внизу
// правовые ссылки и копирайт. Без хуков.
const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;700&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-043"]){
--vibeui-footer-043-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-footer-043-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-043-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-043-muted:color-mix(in oklab,var(--vibeui-footer-043-fg) 62%,var(--vibeui-footer-043-bg));
--vibeui-footer-043-line:color-mix(in oklab,var(--vibeui-footer-043-fg) 16%,transparent);
--vibeui-footer-043-soft:color-mix(in oklab,var(--vibeui-footer-043-fg) 5%,var(--vibeui-footer-043-bg));
--vibeui-footer-043-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-footer-043-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-043-hand:"Caveat","Segoe Script",cursive;
--vibeui-footer-043-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-043"]{color-scheme:dark}
:where([data-vibeui-block="footer-043"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-043"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-043"]{box-sizing:border-box;padding:3.5rem 0 2rem;background:var(--vibeui-footer-043-bg);color:var(--vibeui-footer-043-fg);font-family:var(--vibeui-footer-043-font);font-size:.95rem;line-height:1.5}
[data-vibeui-block="footer-043"] *{box-sizing:border-box}
[data-vibeui-block="footer-043"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="footer-043"] [data-part="seam"]{border:0;border-top:2px dashed var(--vibeui-footer-043-line);margin:0 0 3rem}
[data-vibeui-block="footer-043"] [data-part="grid"]{display:grid;gap:2.5rem}
[data-vibeui-block="footer-043"] [data-part="brand"]{display:inline-flex;align-items:center;gap:.5rem;font-family:var(--vibeui-footer-043-display);font-style:italic;font-weight:700;font-size:1.6rem;letter-spacing:-.01em}
[data-vibeui-block="footer-043"] [data-part="brand"] svg{width:1.6rem;height:1.6rem;color:var(--vibeui-footer-043-accent)}
[data-vibeui-block="footer-043"] [data-part="legal-name"]{margin:.6rem 0 0;max-width:22rem;font-size:.85rem;color:var(--vibeui-footer-043-muted)}
[data-vibeui-block="footer-043"] [data-part="thanks"]{margin:1.4rem 0 0;font-family:var(--vibeui-footer-043-hand);font-size:1.7rem;line-height:1.1;color:var(--vibeui-footer-043-accent);transform:rotate(-2deg);transform-origin:left}
[data-vibeui-block="footer-043"] [data-part="col"] h3{margin:0 0 .9rem;font-size:.78rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-footer-043-muted)}
[data-vibeui-block="footer-043"] [data-part="col"] ul{margin:0;padding:0;list-style:none;display:grid;gap:.5rem}
[data-vibeui-block="footer-043"] [data-part="col"] a{color:var(--vibeui-footer-043-fg);text-decoration:none;transition:color .2s}
[data-vibeui-block="footer-043"] [data-part="col"] a:hover{color:var(--vibeui-footer-043-accent)}
[data-vibeui-block="footer-043"] [data-part="req"]{display:grid;gap:.5rem;margin:0}
[data-vibeui-block="footer-043"] [data-part="req"] div{display:grid;gap:.1rem;padding:.5rem .7rem;border-radius:.5rem;background:var(--vibeui-footer-043-soft)}
[data-vibeui-block="footer-043"] [data-part="req"] dt{font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-footer-043-muted)}
[data-vibeui-block="footer-043"] [data-part="req"] dd{margin:0;font-family:var(--vibeui-footer-043-mono);font-size:.85rem;word-break:break-all;user-select:all}
[data-vibeui-block="footer-043"] [data-part="doc"]{display:inline-flex;align-items:center;gap:.5rem}
[data-vibeui-block="footer-043"] [data-part="doc"] svg{width:1rem;height:1rem;flex-shrink:0;color:var(--vibeui-footer-043-accent)}
[data-vibeui-block="footer-043"] [data-part="socials"]{display:flex;flex-wrap:wrap;gap:.5rem;margin:1.2rem 0 0;padding:0;list-style:none}
[data-vibeui-block="footer-043"] [data-part="socials"] a{display:inline-flex;align-items:center;padding:.4rem .8rem;border-radius:999px;border:1px solid var(--vibeui-footer-043-line);font-size:.85rem;font-weight:500;color:var(--vibeui-footer-043-fg);text-decoration:none;transition:border-color .2s,background .2s}
[data-vibeui-block="footer-043"] [data-part="socials"] a:hover{border-color:var(--vibeui-footer-043-accent);background:var(--vibeui-footer-043-soft)}
[data-vibeui-block="footer-043"] [data-part="bottom"]{display:flex;flex-wrap:wrap;justify-content:space-between;gap:.6rem 1.5rem;margin:3rem 0 0;padding-top:1.2rem;border-top:1px solid var(--vibeui-footer-043-line);font-size:.8rem;color:var(--vibeui-footer-043-muted)}
[data-vibeui-block="footer-043"] [data-part="bottom"] ul{display:flex;flex-wrap:wrap;gap:.4rem 1.2rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-043"] [data-part="bottom"] a{color:inherit;text-decoration:none}
[data-vibeui-block="footer-043"] [data-part="bottom"] a:hover{color:var(--vibeui-footer-043-fg)}
[data-vibeui-block="footer-043"] a:focus-visible{outline:2px solid var(--vibeui-footer-043-accent);outline-offset:2px}
@container (min-width: 44rem){[data-vibeui-block="footer-043"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 64rem){[data-vibeui-block="footer-043"] [data-part="grid"]{grid-template-columns:1.3fr 1fr 1fr 1fr;gap:3rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-043"] *{animation:none!important;transition:none!important}}`

/** Подвал фонда: реквизиты, документы, контакты, рукописное «спасибо». */
export function Footer043({
  brand = "Тёплый дом",
  legalName = "Благотворительный фонд помощи пожилым людям «Тёплый дом». Зарегистрирован Минюстом РФ 14.03.2018.",
  thanks = "спасибо, что дочитали до реквизитов",
  requisites = [
    { label: "ИНН / КПП", value: "6950214477 / 695001001" },
    { label: "ОГРН", value: "1186952004312" },
    { label: "Расчётный счёт", value: "40703810563000001842" },
    { label: "Банк", value: "Тверское отделение ПАО Сбербанк, БИК 042809679" },
  ],
  documents = [
    { label: "Устав фонда", href: "#documents" },
    { label: "Годовой отчёт 2025", href: "#documents" },
    { label: "Аудиторское заключение", href: "#documents" },
    { label: "Договор публичной оферты", href: "#documents" },
    { label: "Политика обработки данных", href: "#documents" },
  ],
  contacts = [
    { label: "+7 (4822) 41-08-17", href: "tel:+74822410817" },
    { label: "help@teplydom.org", href: "mailto:help@teplydom.org" },
    { label: "Тверь, ул. Коробкова, 12, склад 3", href: "#map" },
    { label: "Пн–Пт 10:00–19:00", href: "#contacts" },
  ],
  socials = [
    { label: "Telegram", href: "#" },
    { label: "ВКонтакте", href: "#" },
    { label: "Дзен", href: "#" },
  ],
  legal = [
    { label: "Отказаться от рассылки", href: "#" },
    { label: "Вернуть платёж", href: "#" },
  ],
  copyright = "© 2018–2026 БФ «Тёплый дом»",
  socialsLabel = "Соцсети",
  requisitesTitle = "Реквизиты",
  documentsTitle = "Документы",
  contactsTitle = "Контакты",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer043Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-043-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-043-fg": ink } : null),
    ...(background ? { "--vibeui-footer-043-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-043" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-043" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <hr data-part="seam" />
          <div data-part="grid">
            <div>
              <p data-part="brand">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 11.5 12 4l9 7.5" />
                  <path d="M5.5 10v10h13V10" />
                  <path d="M12 20v-5.5a2 2 0 0 1 4 0V20" />
                  <path d="M8.5 13.2c0-.9 1.4-1.2 1.75-.3.35-.9 1.75-.6 1.75.3 0 1-1.75 2.2-1.75 2.2S8.5 14.2 8.5 13.2Z" fill="currentColor" stroke="none" />
                </svg>
                {brand}
              </p>
              {legalName ? <p data-part="legal-name">{legalName}</p> : null}
              {thanks ? <p data-part="thanks">{thanks}</p> : null}
              {socials.length > 0 ? (
                <ul data-part="socials" aria-label={socialsLabel}>
                  {socials.map((item) => (
                    <li key={item.label}>
                      <a href={item.href}>{item.label}</a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div data-part="col">
              <h3>{requisitesTitle}</h3>
              <dl data-part="req">
                {requisites.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <nav data-part="col" aria-label={documentsTitle}>
              <h3>{documentsTitle}</h3>
              <ul>
                {documents.map((item) => (
                  <li key={item.label}>
                    <a data-part="doc" href={item.href}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                        <path d="M14 3v5h5M9 13h6M9 17h6" />
                      </svg>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div data-part="col">
              <h3>{contactsTitle}</h3>
              <ul>
                {contacts.map((item) => (
                  <li key={item.label}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div data-part="bottom">
            <span>{copyright}</span>
            {legal.length > 0 ? (
              <ul>
                {legal.map((item) => (
                  <li key={item.label}>
                    <a href={item.href}>{item.label}</a>
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
