import type { CSSProperties } from "react"

export type Footer038Link = {
  label: string
  href: string
}

export type Footer038Column = {
  title: string
  links: readonly Footer038Link[]
}

export type Footer038Props = {
  brand?: string
  /** Рукописная подпись под лого. */
  caption?: string
  /** Строка контактов: телефон, почта, Telegram. */
  contacts?: readonly Footer038Link[]
  columns?: readonly Footer038Column[]
  socials?: readonly Footer038Link[]
  legal?: readonly Footer038Link[]
  copyright?: string
  /** Огромное слово-контур по низу. Пусто — не показывать. */
  bigWord?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал языковой школы: сверху тетрадная линовка, лого с рукописной
// подписью и контакты, три колонки ссылок, внизу правовые ссылки, соцсети
// и копирайт. По самому низу — огромное слово-контур (text-stroke) во всю
// ширину, при наведении заливается чернилами. Без JS.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@500;600;700;800&family=Golos+Text:wght@400;500;600&family=Marck+Script&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-038"]){
--vibeui-footer-038-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-footer-038-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-038-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-038-muted:color-mix(in oklab,var(--vibeui-footer-038-fg) 62%,var(--vibeui-footer-038-bg));
--vibeui-footer-038-line:color-mix(in oklab,var(--vibeui-footer-038-fg) 12%,transparent);
--vibeui-footer-038-rule:color-mix(in oklab,var(--vibeui-footer-038-fg) 8%,transparent);
--vibeui-footer-038-display:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-038-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-footer-038-hand:"Marck Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-038"]{color-scheme:dark}
:where([data-vibeui-block="footer-038"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-038"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-038"]{box-sizing:border-box;position:relative;overflow:hidden;padding:0 0 1.5rem;background:var(--vibeui-footer-038-bg);color:var(--vibeui-footer-038-fg);font-family:var(--vibeui-footer-038-font);font-size:.92rem;line-height:1.5}
[data-vibeui-block="footer-038"]::before{content:"";display:block;height:1.2rem;background:repeating-linear-gradient(180deg,var(--vibeui-footer-038-rule) 0 1px,transparent 1px .4rem)}
[data-vibeui-block="footer-038"] *{box-sizing:border-box}
[data-vibeui-block="footer-038"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:3rem 1.25rem 0;display:grid;gap:2.5rem}
[data-vibeui-block="footer-038"] [data-part="brand"]{display:inline-grid;line-height:1;text-decoration:none;color:inherit}
[data-vibeui-block="footer-038"] [data-part="brand"] b{font-family:var(--vibeui-footer-038-display);font-weight:800;font-size:1.7rem;letter-spacing:-.03em}
[data-vibeui-block="footer-038"] [data-part="brand"] span{font-family:var(--vibeui-footer-038-hand);font-size:1.1rem;color:var(--vibeui-footer-038-accent);transform:rotate(-2deg);transform-origin:left;margin-top:.1rem}
[data-vibeui-block="footer-038"] [data-part="contacts"]{display:grid;gap:.4rem;margin:1.4rem 0 0;padding:0;list-style:none}
[data-vibeui-block="footer-038"] [data-part="contacts"] a{display:inline-flex;align-items:center;gap:.5rem;color:var(--vibeui-footer-038-fg);text-decoration:none;font-weight:500;transition:color .2s}
[data-vibeui-block="footer-038"] [data-part="contacts"] a::before{content:"";width:.4rem;height:.4rem;border-radius:50%;background:var(--vibeui-footer-038-accent)}
[data-vibeui-block="footer-038"] [data-part="contacts"] a:hover{color:var(--vibeui-footer-038-accent)}
[data-vibeui-block="footer-038"] [data-part="columns"]{display:grid;gap:2rem;grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="footer-038"] [data-part="columns"] h3{margin:0 0 .8rem;font-family:var(--vibeui-footer-038-hand);font-weight:400;font-size:1.25rem;color:var(--vibeui-footer-038-accent)}
[data-vibeui-block="footer-038"] [data-part="columns"] ul{margin:0;padding:0;list-style:none;display:grid;gap:.5rem}
[data-vibeui-block="footer-038"] [data-part="columns"] a{position:relative;color:var(--vibeui-footer-038-fg);text-decoration:none;transition:color .2s}
[data-vibeui-block="footer-038"] [data-part="columns"] a::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:1.5px;background:var(--vibeui-footer-038-accent);transform:scaleX(0);transform-origin:left;transition:transform .3s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="footer-038"] [data-part="columns"] a:hover::after{transform:scaleX(1)}
[data-vibeui-block="footer-038"] [data-part="bottom"]{display:flex;flex-wrap:wrap;align-items:center;gap:.8rem 1.5rem;padding-top:1.5rem;border-top:1px solid var(--vibeui-footer-038-line);font-size:.8rem;color:var(--vibeui-footer-038-muted)}
[data-vibeui-block="footer-038"] [data-part="legal"]{display:flex;flex-wrap:wrap;gap:1.2rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-038"] [data-part="legal"] a{color:inherit;text-decoration:none}
[data-vibeui-block="footer-038"] [data-part="legal"] a:hover{color:var(--vibeui-footer-038-fg)}
[data-vibeui-block="footer-038"] [data-part="socials"]{display:flex;flex-wrap:wrap;gap:.5rem;margin:0 0 0 auto;padding:0;list-style:none}
[data-vibeui-block="footer-038"] [data-part="socials"] a{display:inline-flex;align-items:center;height:2rem;padding:0 .75rem;border-radius:999px;border:1px solid var(--vibeui-footer-038-line);color:var(--vibeui-footer-038-fg);text-decoration:none;font-size:.78rem;font-weight:500;transition:border-color .2s,color .2s,transform .2s}
[data-vibeui-block="footer-038"] [data-part="socials"] a:hover{border-color:var(--vibeui-footer-038-accent);color:var(--vibeui-footer-038-accent);transform:translateY(-1px)}
[data-vibeui-block="footer-038"] a:focus-visible{outline:2px solid var(--vibeui-footer-038-accent);outline-offset:2px}
[data-vibeui-block="footer-038"] [data-part="big"]{display:block;margin:1.5rem auto -.35em;max-width:80rem;padding:0 1.25rem;font-family:var(--vibeui-footer-038-display);font-weight:800;font-size:clamp(4rem,19cqi,15rem);line-height:1;letter-spacing:-.05em;text-align:center;color:transparent;-webkit-text-stroke:1.5px color-mix(in oklab,var(--vibeui-footer-038-fg) 35%,transparent);user-select:none;transition:color .6s cubic-bezier(.2,.8,.2,1),-webkit-text-stroke-color .6s}
[data-vibeui-block="footer-038"] [data-part="big"]:hover{color:var(--vibeui-footer-038-accent);-webkit-text-stroke-color:var(--vibeui-footer-038-accent)}
@container (min-width: 44rem){[data-vibeui-block="footer-038"] [data-part="columns"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@container (min-width: 60rem){[data-vibeui-block="footer-038"] [data-part="shell"]{grid-template-columns:minmax(0,1.1fr) minmax(0,2fr);align-items:start}[data-vibeui-block="footer-038"] [data-part="bottom"]{grid-column:1/-1}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-038"] *{animation:none!important;transition:none!important}}`

/** Подвал языковой школы с огромным словом-контуром. */
export function Footer038({
  brand = "Слово",
  caption = "языковая онлайн-школа",
  contacts = [
    { label: "+7 812 407-21-90", href: "tel:+78124072190" },
    { label: "privet@slovo.school", href: "mailto:privet@slovo.school" },
    { label: "@slovo_school", href: "#telegram" },
  ],
  columns = [
    { title: "языки", links: [{ label: "Английский", href: "#schedule" }, { label: "Испанский", href: "#schedule" }, { label: "Итальянский", href: "#schedule" }, { label: "Тест уровня", href: "#test" }] },
    { title: "школа", links: [{ label: "Как учим", href: "#how" }, { label: "Преподаватели", href: "#teachers" }, { label: "Цены", href: "#pricing" }, { label: "Отзывы", href: "#reviews" }] },
    { title: "помощь", links: [{ label: "Вопросы", href: "#faq" }, { label: "Пробный урок", href: "#trial" }, { label: "Перенос занятия", href: "#faq" }, { label: "Возврат", href: "#legal" }] },
  ],
  socials = [
    { label: "Telegram", href: "#telegram" },
    { label: "VK", href: "#vk" },
    { label: "YouTube", href: "#youtube" },
  ],
  legal = [
    { label: "Оферта", href: "#offer" },
    { label: "Конфиденциальность", href: "#privacy" },
    { label: "Лицензия № Л035-01271-78", href: "#license" },
  ],
  copyright = "© 2026 Слово, Санкт-Петербург",
  bigWord = "Слово",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer038Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-038-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-038-fg": ink } : null),
    ...(background ? { "--vibeui-footer-038-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-038" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-038" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            <a data-part="brand" href="#top">
              <b>{brand}</b>
              {caption ? <span>{caption}</span> : null}
            </a>
            {contacts.length > 0 ? (
              <ul data-part="contacts">
                {contacts.map((contact) => (
                  <li key={contact.label}>
                    <a href={contact.href}>{contact.label}</a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {columns.length > 0 ? (
            <nav data-part="columns" aria-label="Разделы сайта">
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
          ) : null}
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
        {bigWord ? (
          <span data-part="big" aria-hidden="true">
            {bigWord}
          </span>
        ) : null}
      </footer>
    </>
  )
}
