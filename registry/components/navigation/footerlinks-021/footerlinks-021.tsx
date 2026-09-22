import type { ComponentProps, CSSProperties } from "react"

export type Footerlinks021Link = { label: string; href: string }

export type Footerlinks021Props = {
  /** Монограмма: две буквы, между ними снежинка. */
  initials?: readonly [string, string]
  names?: string
  dateLabel?: string
  place?: string
  /** Рукописная строка: «до встречи в снегу». */
  script?: string
  hashtag?: string
  links?: readonly Footerlinks021Link[]
  rsvpText?: string
  rsvpLabel?: string
  rsvpHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

export type Footerlinks021Props = {
  /** Монограмма: две буквы, между ними снежинка. */
  initials?: readonly [string, string]
  names?: string
  dateLabel?: string
  place?: string
  /** Рукописная строка: «до встречи в снегу». */
  script?: string
  hashtag?: string
  links?: readonly Footerlinks021Link[]
  rsvpText?: string
  rsvpLabel?: string
  rsvpHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

export type Footerlinks021Props = Omit<ComponentProps<"ul">, "title" | "children"> & {
  links?: readonly Footerlinks021Link[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-026, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="footerlinks-021"]){
--vibeui-footerlinks-021-accent:#f2f2f2;
--vibeui-footerlinks-021-display:"Cormorant Garamond",Georgia,serif;
}
[data-vibeui-block="footerlinks-021"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="footerlinks-021"] *{box-sizing:border-box}
[data-vibeui-block="footerlinks-021"]{display:flex;flex-wrap:wrap;justify-content:center;gap:.25rem 1.2rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footerlinks-021"] a{font-family:var(--vibeui-footerlinks-021-display);font-size:.98rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;opacity:.8;transition:opacity .25s,color .25s}
[data-vibeui-block="footerlinks-021"] a:hover{opacity:1;color:var(--vibeui-footerlinks-021-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footerlinks-021"] *{animation:none!important;transition:none!important}}
`

/** Строка ссылок подвала приглашения: курсив, разделители. */
export function Footerlinks021({
  links = [ { label: "История", href: "#story" }, { label: "Вечер", href: "#evening" }, { label: "Дорога", href: "#place" }, { label: "Ответить", href: "#rsvp" }, { label: "Вопросы", href: "#faq" }, ],
  accent,
  className,
  style,
  ...props
}: Footerlinks021Props) {
  const palette = {
    ...(accent ? { "--vibeui-footerlinks-021-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footerlinks-021" precedence="medium">
        {STYLES}
      </style>
      <ul
        {...props}
        data-slot="navigation"
        data-vibeui-block="footerlinks-021"
        className={className}
        style={palette}
      >
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </>
  )
}
