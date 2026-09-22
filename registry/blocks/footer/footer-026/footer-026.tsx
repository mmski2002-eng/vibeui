import type { CSSProperties, ComponentProps } from "react"

export type Footer026Link = { label: string; href: string }

export type Footer026Props = {
  /** Монограмма: две буквы, между ними снежинка. */
  initials?: readonly [string, string]
  names?: string
  dateLabel?: string
  place?: string
  /** Рукописная строка: «до встречи в снегу». */
  script?: string
  hashtag?: string
  links?: readonly Footer026Link[]
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

// Подвал зимней свадьбы: ветки хвои по углам (SVG-линии), по центру
// монограмма со снежинкой, имена антиквой и рукописное «до встречи в
// снегу», дата и место; ниже ряд якорей, хэштег и «ответьте до…».
// Невысокий, фон — синяя ночь. Серверный.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Marck+Script&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="footer-026"]){
--vibeui-footer-026-bg:light-dark(#1a1a1a,#0f0f0f);
--vibeui-footer-026-fg:#f2f2f2;
--vibeui-footer-026-muted:color-mix(in oklab,var(--vibeui-footer-026-fg) 60%,transparent);
--vibeui-footer-026-line:color-mix(in oklab,var(--vibeui-footer-026-fg) 20%,transparent);
--vibeui-footer-026-accent:#f2f2f2;
--vibeui-footer-026-silver:#9fb0c8;
--vibeui-footer-026-pine:#2f5d50;
--vibeui-footer-026-display:"Cormorant Garamond",Georgia,serif;
--vibeui-footer-026-script:"Marck Script","Segoe Script",cursive;
--vibeui-footer-026-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-026"]{color-scheme:dark}
:where([data-vibeui-block="footer-026"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="footer-026"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="footer-026"]{box-sizing:border-box;position:relative;display:block;overflow:hidden;background:var(--vibeui-footer-026-bg);color:var(--vibeui-footer-026-fg);font-family:var(--vibeui-footer-026-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="footer-026"] *{box-sizing:border-box}
[data-vibeui-block="footer-026"] [data-part="links"]{margin:0}
[data-vibeui-block="footer-026"] a{color:inherit;text-decoration:none}
[data-vibeui-block="footer-026"] a:focus-visible{outline:2px solid var(--vibeui-footer-026-accent);outline-offset:3px;border-radius:.3rem}
[data-vibeui-block="footer-026"] [data-part="pine"]{position:absolute;top:-1rem;width:14rem;height:14rem;fill:none;stroke:var(--vibeui-footer-026-pine);stroke-width:1.2;stroke-linecap:round;opacity:.7;pointer-events:none}
[data-vibeui-block="footer-026"] [data-part="pine"]:first-child{left:-2rem}
[data-vibeui-block="footer-026"] [data-part="pine"]:nth-child(2){right:-2rem;transform:scaleX(-1)}
[data-vibeui-block="footer-026"] [data-part="shell"]{position:relative;display:grid;gap:1.5rem;max-width:80rem;margin:0 auto;padding:3rem 1.25rem 1.5rem;text-align:center}
[data-vibeui-block="footer-026"] [data-part="mono"]{display:inline-flex;align-items:center;justify-content:center;gap:.4rem;font-family:var(--vibeui-footer-026-display);font-size:1.6rem;font-weight:500;letter-spacing:.1em;color:var(--vibeui-footer-026-silver)}
[data-vibeui-block="footer-026"] [data-part="mono"] svg{width:1rem;height:1rem;fill:none;stroke:var(--vibeui-footer-026-accent);stroke-width:1.4;stroke-linecap:round;filter:drop-shadow(0 0 6px var(--vibeui-footer-026-accent))}
[data-vibeui-block="footer-026"] [data-part="names"]{margin:.2rem 0 0;font-family:var(--vibeui-footer-026-display);font-size:clamp(1.8rem,4cqi,2.6rem);font-weight:500;line-height:1.05}
[data-vibeui-block="footer-026"] [data-part="script"]{display:block;margin-top:.3rem;font-family:var(--vibeui-footer-026-script);font-size:1.5rem;color:var(--vibeui-footer-026-accent)}
[data-vibeui-block="footer-026"] [data-part="date"]{margin:0;font-family:var(--vibeui-footer-026-display);font-size:1rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-footer-026-muted);font-variant-numeric:lining-nums}
[data-vibeui-block="footer-026"] [data-part="date"] i{display:inline-block;width:.35rem;height:.35rem;margin:0 .6rem .15rem;border-radius:50%;background:var(--vibeui-footer-026-accent);box-shadow:0 0 6px var(--vibeui-footer-026-accent)}
[data-vibeui-block="footer-026"] [data-part="bottom"]{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.7rem 1.4rem;padding-top:1.2rem;border-top:1px solid var(--vibeui-footer-026-line)}
[data-vibeui-block="footer-026"] [data-part="tag"]{display:inline-flex;align-items:center;height:1.9rem;padding:0 .8rem;border:1px solid var(--vibeui-footer-026-line);border-radius:999px;font-size:.76rem;font-weight:600;color:var(--vibeui-footer-026-silver);transition:border-color .25s,color .25s}
[data-vibeui-block="footer-026"] [data-part="tag"]:hover{border-color:var(--vibeui-footer-026-accent);color:var(--vibeui-footer-026-accent)}
[data-vibeui-block="footer-026"] [data-part="rsvp"]{margin:0;font-size:.84rem;color:var(--vibeui-footer-026-muted);white-space:nowrap}
[data-vibeui-block="footer-026"] [data-part="rsvp"] a{font-weight:600;color:var(--vibeui-footer-026-fg);border-bottom:1px solid var(--vibeui-footer-026-accent)}
@container (min-width:56rem){
[data-vibeui-block="footer-026"] [data-part="shell"]{padding:3.5rem 2.5rem 1.5rem}
[data-vibeui-block="footer-026"] [data-part="bottom"]{justify-content:space-between}
[data-vibeui-block="footer-026"] [data-part="pine"]{width:20rem;height:20rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-026"] *{animation:none!important;transition:none!important}}
[data-vibeui-block="footer-026"] [data-part="links"]{display:flex;flex-wrap:wrap;justify-content:center;gap:.25rem 1.2rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="footer-026"] [data-part="links"] a{font-family:var(--vibeui-footer-026-display);font-size:.98rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;opacity:.8;transition:opacity .25s,color .25s}
[data-vibeui-block="footer-026"] [data-part="links"] a:hover{opacity:1;color:var(--vibeui-footer-026-accent)}
`

const PINE = "M10 130c30-30 60-60 100-90M40 100c-4-12-2-24 2-34M40 100c10-8 22-12 34-12M62 78c-3-11-1-22 3-30M62 78c10-6 22-9 33-8M84 58c-2-10 0-20 4-28M84 58c9-5 20-7 30-6M30 110c-6-10-6-22-3-32M30 110c8-2 18-1 27 2"

export type LinksLink = { label: string; href: string }

type LinksProps = Omit<ComponentProps<"ul">, "title" | "children"> & {
  links?: readonly LinksLink[]
  accent?: string
  className?: string
  style?: CSSProperties
}

function Links({
  links = [ { label: "История", href: "#story" }, { label: "Вечер", href: "#evening" }, { label: "Дорога", href: "#place" }, { label: "Ответить", href: "#rsvp" }, { label: "Вопросы", href: "#faq" }, ],
  accent,
  className,
  style,
  ...props
}: LinksProps) {
  const palette = {
    ...(accent ? { "--vibeui-footer-026-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <ul
        {...props}
        className={className}
        style={palette}
      >
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
  )
}

/** Подвал зимней свадьбы: ветки хвои по углам, монограмма со снежинкой, имена и «до встречи в снегу», якоря, хэштег, «ответьте до». */
export function Footer026({
  initials = ["В", "Д"],
  names = "Валерия и Дмитрий",
  dateLabel = "18 декабря 2027",
  place = "Лесная усадьба",
  script = "до встречи в снегу",
  hashtag = "#лераидимавснегу",
  links = [
    { label: "История", href: "#story" },
    { label: "Вечер", href: "#evening" },
    { label: "Дорога", href: "#place" },
    { label: "Ответить", href: "#rsvp" },
    { label: "Вопросы", href: "#faq" },
  ],
  rsvpText = "Ответьте, пожалуйста,",
  rsvpLabel = "до 1 ноября",
  rsvpHref = "#rsvp",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Footer026Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-026-accent": accent } : null),
    ...(ink ? { "--vibeui-footer-026-fg": ink } : null),
    ...(background ? { "--vibeui-footer-026-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-footer-026" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-026" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <svg data-part="pine" viewBox="0 0 140 140" aria-hidden="true">
          <path d={PINE} />
        </svg>
        <svg data-part="pine" viewBox="0 0 140 140" aria-hidden="true">
          <path d={PINE} />
        </svg>
        <div data-part="shell">
          <div>
            <span data-part="mono">
              {initials[0]}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
              </svg>
              {initials[1]}
            </span>
            <p data-part="names">
              {names}
              {script ? <span data-part="script">{script}</span> : null}
            </p>
            <p data-part="date">
              {dateLabel}
              <i aria-hidden="true" />
              {place}
            </p>
          </div>
          <div data-part="bottom">
            {links.length > 0 ? (
              <Links data-part="links" links={links} accent={accent} />
            ) : null}
            {hashtag ? (
              <a data-part="tag" href={`https://www.instagram.com/explore/tags/${hashtag.replace(/^#/, "")}/`} target="_blank" rel="noopener noreferrer">
                {hashtag}
              </a>
            ) : null}
            {rsvpLabel ? (
              <p data-part="rsvp">
                {rsvpText} <a href={rsvpHref}>{rsvpLabel}</a>
              </p>
            ) : null}
          </div>
        </div>
      </footer>
    </>
  )
}
