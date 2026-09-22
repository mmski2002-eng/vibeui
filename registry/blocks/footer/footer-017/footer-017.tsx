import type { CSSProperties } from "react"
import { Card147 } from "@/registry/components/card/card-147/card-147"

export type Footer017Props = {
  /** Подпись перехода. */
  kicker?: string
  /** Название следующего проекта. */
  title?: string
  note?: string
  href?: string
  /** Тон кадра-превью. */
  look?: "warm" | "paper" | "dark"
  /** Путь к превью следующего проекта; без него — тональная заглушка. */
  src?: string
  /** Контакты студии под карточкой. */
  studioName?: string
  contactLabel?: string
  contactHref?: string
  legal?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Футер «следующий проект»: крупное превью следующей работы одной
// однозначной ссылкой, короткий призыв продолжить просмотр и контакты
// студии ниже. Вся карточка — одна ссылка без вложенных кнопок;
// автоматического открытия следующего кейса при достижении низа нет
// и не будет. Кадр — CSS-заглушка, реальное превью передаёт проект.
const STYLES = `
:where([data-vibeui-block="footer-017"]){
--vibeui-footer-017-bg:#ffffff;
--vibeui-footer-017-ink:#000000;
--vibeui-footer-017-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-footer-017-line:color-mix(in oklab,#000000 11%,transparent);
--vibeui-footer-017-accent:#1a1a1a;
--vibeui-footer-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-footer-017-dur-2:180ms;
container-type:inline-size;
}
[data-vibeui-block="footer-017"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-footer-017-bg);color:var(--vibeui-footer-017-ink);
font-family:var(--vibeui-footer-017-font);
}
[data-vibeui-block="footer-017"] *{box-sizing:border-box}
[data-vibeui-block="footer-017"] [data-part="shell"]{
max-width:80rem;margin:0 auto;padding:3rem 1rem 1.5rem;
display:flex;flex-direction:column;gap:1.5rem;
}
[data-vibeui-block="footer-017"] [data-part="studio"]{
display:flex;align-items:center;gap:1rem;flex-wrap:wrap;
padding-top:1.25rem;border-top:1px solid var(--vibeui-footer-017-line);
font-size:0.9375rem;
}
[data-vibeui-block="footer-017"] [data-part="studio"] strong{font-weight:640}
[data-vibeui-block="footer-017"] [data-part="contact"]{
color:var(--vibeui-footer-017-ink);text-decoration:none;
border-bottom:2px solid var(--vibeui-footer-017-accent);padding-bottom:0.0625rem;
font-weight:580;
transition:color var(--vibeui-footer-017-dur-2) ease;
}
[data-vibeui-block="footer-017"] [data-part="contact"]:hover{color:var(--vibeui-footer-017-accent)}
[data-vibeui-block="footer-017"] [data-part="legal"]{
margin-left:auto;font-size:0.8125rem;color:var(--vibeui-footer-017-muted);
}
[data-vibeui-block="footer-017"] a:focus-visible{
outline:2px solid var(--vibeui-footer-017-accent);outline-offset:3px;
}
@container (min-width: 52rem){
[data-vibeui-block="footer-017"] [data-part="shell"]{padding:4rem 2rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-017"] *{animation:none!important;transition:none!important}}
`

/** Футер «следующий проект»: крупное превью одной ссылкой и контакты студии. */
export function Footer017({
  kicker = "Следующий проект",
  title = "Дом на склоне",
  note = "Архитектура · 2026",
  href = "#next-case",
  look = "warm",
  src,
  studioName = "Студия «Русло»",
  contactLabel = "hello@ruslo.studio",
  contactHref = "mailto:hello@ruslo.studio",
  legal = "© 2026",
  accent,
  className,
  style,
}: Footer017Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-017-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-017" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-017" className={className} style={palette}>
        <div data-part="shell">
          <Card147 data-part="next" href={href} kicker={kicker} look={look} src={src} title={title} note={note} accent={accent} />
          <div data-part="studio">
            <strong>{studioName}</strong>
            <a data-part="contact" href={contactHref}>
              {contactLabel}
            </a>
            <span data-part="legal">{legal}</span>
          </div>
        </div>
      </footer>
    </>
  )
}
