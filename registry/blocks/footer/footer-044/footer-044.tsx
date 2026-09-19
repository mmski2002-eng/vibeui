"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Footer044Link = {
  label: string
  href: string
}

export type Footer044Props = {
  brand?: string
  tagline?: string
  links?: readonly Footer044Link[]
  socials?: readonly Footer044Link[]
  /** Колофон: чем набрано, кто сделал. */
  colophon?: string
  copyright?: string
  topLabel?: string
  topHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Подвал-колофон, как последняя страница книги: виньетка по центру, имя
// антиквой, курсивная строка о том, чем набран сайт, разделы и соцсети
// тонкими курсивными ссылками с подчёркиванием, которое дорисовывается.
// Ссылка «наверх» со стрелкой, которая приподнимается при наведении.
// Слушает `vibeui-writer:theme` и переходит в бумагу вместе с сайтом.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-044"]){
--vibeui-footer-044-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-footer-044-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-044-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-footer-044-muted:color-mix(in oklab,var(--vibeui-footer-044-fg) 60%,var(--vibeui-footer-044-bg));
--vibeui-footer-044-line:color-mix(in oklab,var(--vibeui-footer-044-fg) 14%,transparent);
--vibeui-footer-044-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-footer-044-font:"PT Serif",Georgia,"Times New Roman",serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-044"]{color-scheme:dark}
:where([data-vibeui-block="footer-044"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-044"][data-tone="dark"]){color-scheme:dark}
:where([data-vibeui-block="footer-044"][data-mode="day"]){color-scheme:light}
:where([data-vibeui-block="footer-044"][data-mode="night"]){color-scheme:dark}
[data-vibeui-block="footer-044"]{box-sizing:border-box;padding:4rem 0 2.5rem;background:var(--vibeui-footer-044-bg);color:var(--vibeui-footer-044-fg);font-family:var(--vibeui-footer-044-font);font-size:.95rem;line-height:1.6;transition:background-color .6s,color .6s}
[data-vibeui-block="footer-044"] *{box-sizing:border-box}
[data-vibeui-block="footer-044"] [data-part="shell"]{max-width:74rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;text-align:center;border-top:1px solid var(--vibeui-footer-044-line);padding-top:3rem}
[data-vibeui-block="footer-044"] [data-part="ornament"]{font-family:var(--vibeui-footer-044-display);font-size:1.6rem;color:var(--vibeui-footer-044-accent);line-height:1}
[data-vibeui-block="footer-044"] [data-part="brand"]{margin:.6rem 0 0;font-family:var(--vibeui-footer-044-display);font-weight:400;font-size:clamp(2rem,4.5cqi,3rem);line-height:1;letter-spacing:-.01em}
[data-vibeui-block="footer-044"] [data-part="tagline"]{margin:.5rem 0 0;font-style:italic;color:var(--vibeui-footer-044-muted)}
[data-vibeui-block="footer-044"] [data-part="nav"],[data-vibeui-block="footer-044"] [data-part="socials"]{display:flex;flex-wrap:wrap;justify-content:center;gap:.4rem 1.8rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-044"] a{position:relative;color:var(--vibeui-footer-044-fg);text-decoration:none;font-style:italic;padding:.2rem 0;transition:color .25s}
[data-vibeui-block="footer-044"] a::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--vibeui-footer-044-accent);transform:scaleX(0);transform-origin:left;transition:transform .35s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="footer-044"] a:hover::after{transform:scaleX(1)}
[data-vibeui-block="footer-044"] a:focus-visible{outline:2px solid var(--vibeui-footer-044-accent);outline-offset:3px}
[data-vibeui-block="footer-044"] [data-part="socials"] a{color:var(--vibeui-footer-044-muted);font-size:.88rem}
[data-vibeui-block="footer-044"] [data-part="socials"] a:hover{color:var(--vibeui-footer-044-fg)}
[data-vibeui-block="footer-044"] [data-part="bottom"]{display:grid;gap:.6rem;padding-top:1.6rem;border-top:1px solid var(--vibeui-footer-044-line);font-size:.8rem;font-style:italic;color:var(--vibeui-footer-044-muted)}
[data-vibeui-block="footer-044"] [data-part="bottom"] p{margin:0}
[data-vibeui-block="footer-044"] [data-part="top"]{display:inline-flex;align-items:center;gap:.4rem;justify-self:center;font-size:.85rem}
[data-vibeui-block="footer-044"] [data-part="top"] svg{width:.9rem;height:.9rem;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="footer-044"] [data-part="top"]:hover svg{transform:translateY(-3px)}
@container (min-width: 56rem){[data-vibeui-block="footer-044"] [data-part="bottom"]{grid-template-columns:1fr auto 1fr;align-items:center;text-align:left}[data-vibeui-block="footer-044"] [data-part="bottom"] p:last-of-type{text-align:right}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-044"] *{animation:none!important;transition:none!important}}`

/** Подвал-колофон писателя с виньеткой и «наверх». */
export function Footer044({
  brand = "Вера Холодова",
  tagline = "Тексты, книга и письма читателям",
  links = [
    { label: "Тексты", href: "#texts" },
    { label: "Книга", href: "#book" },
    { label: "Встречи", href: "#events" },
    { label: "Письма", href: "#letters" },
    { label: "Издателям", href: "#publishers" },
  ],
  socials = [
    { label: "Телеграм", href: "#" },
    { label: "Подкаст", href: "#" },
    { label: "Литрес", href: "#" },
    { label: "Почта", href: "mailto:vera@kholodova.ru" },
  ],
  colophon = "Набрано Cormorant Garamond и PT Serif. Никакой аналитики, только счётчик страниц.",
  copyright = "© 2026 Вера Холодова. Тексты можно цитировать со ссылкой.",
  topLabel = "Наверх",
  topHref = "#top",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer044Props) {
  const [mode, setMode] = useState<"day" | "night" | null>(null)

  useEffect(() => {
    const onTheme = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: string }>).detail
      if (detail?.mode === "day" || detail?.mode === "night") setMode(detail.mode)
    }
    window.addEventListener("vibeui-writer:theme", onTheme)
    return () => window.removeEventListener("vibeui-writer:theme", onTheme)
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-footer-044-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-044-fg": ink } : null),
    ...(background ? { "--vibeui-footer-044-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-044" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-044" data-tone={tone === "auto" ? undefined : tone} data-mode={mode ?? undefined} className={className} style={palette}>
        <div data-part="shell">
          <div>
            <div data-part="ornament" aria-hidden="true">
              ❦
            </div>
            <p data-part="brand">{brand}</p>
            {tagline ? <p data-part="tagline">{tagline}</p> : null}
          </div>
          {links.length > 0 ? (
            <nav aria-label="Разделы">
              <ul data-part="nav">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          {socials.length > 0 ? (
            <ul data-part="socials" aria-label="Соцсети">
              {socials.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          ) : null}
          <div data-part="bottom">
            <p>{copyright}</p>
            {topLabel ? (
              <a data-part="top" href={topHref}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                {topLabel}
              </a>
            ) : null}
            <p>{colophon}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
