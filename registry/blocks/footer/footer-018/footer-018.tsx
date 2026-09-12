import type { CSSProperties, ReactNode } from "react"

type Footer018Link = {
  label: string
  href: string
}

export type Footer018Props = {
  /** Слот медиа-кадра (ReactNode): изображение или видеофон. Приоритетнее src. */
  media?: ReactNode
  /** Путь к кадру строкой — фолбэк, когда media не передан. */
  src?: string
  mediaLabel?: string
  /** Крупная контактная фраза. */
  title?: string
  actionLabel?: string
  actionHref?: string
  /** Компактная навигация. */
  links?: Footer018Link[]
  navLabel?: string
  /** Служебная строка с документами. */
  legalLinks?: Footer018Link[]
  copyright?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Кинематографический финальный экран: фотография или спокойная
// предметная сцена, чёрно-графитовая подложка под текстом, крупная
// контактная фраза и компактная навигация. Финальный кадр выразителен
// без движения — статика и есть основной режим. Необходимые документы
// не прячутся за декоративной сценой: служебная строка всегда видна.
const STYLES = `
:where([data-vibeui-block="footer-018"]){
--vibeui-footer-018-ink:#ffffff;
--vibeui-footer-018-muted:color-mix(in oklab,#ffffff 66%,#1a1a1a);
--vibeui-footer-018-accent:#f2f2f2;
--vibeui-footer-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="footer-018"]{
position:relative;display:block;min-width:min(100%,16rem);overflow:hidden;
background:#000000;color:var(--vibeui-footer-018-ink);
font-family:var(--vibeui-footer-018-font);
}
[data-vibeui-block="footer-018"] *{box-sizing:border-box}
[data-vibeui-block="footer-018"] [data-part="media"]{
position:absolute;inset:0;
}
[data-vibeui-block="footer-018"] [data-part="media"] img,
[data-vibeui-block="footer-018"] [data-part="media"] video{
width:100%;height:100%;object-fit:cover;display:block;
}
[data-vibeui-block="footer-018"] [data-part="scene"]{
position:absolute;inset:0;
background:linear-gradient(165deg,#232830 0%,#4a5058 38%,#6d6659 62%,#191512 100%);
}
[data-vibeui-block="footer-018"] [data-part="scene"]::after{
content:"";position:absolute;inset:0;
background:radial-gradient(28rem 15rem at 72% 24%,rgb(255 200 150 / 24%),transparent 62%);
}
[data-vibeui-block="footer-018"] [data-part="scrim"]{
position:absolute;inset:0;pointer-events:none;
background:linear-gradient(rgb(0 0 0 / 20%),transparent 30%,rgb(0 0 0 / 74%) 78%);
}
[data-vibeui-block="footer-018"] [data-part="shell"]{
position:relative;max-width:80rem;margin:0 auto;min-height:32rem;
padding:5rem 1rem 1.5rem;display:flex;flex-direction:column;justify-content:flex-end;gap:1.5rem;
}
[data-vibeui-block="footer-018"] [data-part="title"]{
margin:0;max-width:16ch;
font-size:clamp(2.25rem,7cqi,4.75rem);line-height:1;letter-spacing:-0.03em;font-weight:730;
text-shadow:0 1px 28px rgb(0 0 0 / 40%);
}
[data-vibeui-block="footer-018"] [data-part="row"]{
display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap;
}
[data-vibeui-block="footer-018"] [data-part="action"]{
display:inline-flex;align-items:center;min-height:2.875rem;padding:0.375rem 1.5rem;
background:var(--vibeui-footer-018-accent);color:oklch(from var(--vibeui-footer-018-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
text-decoration:none;font-size:1rem;font-weight:660;
transition:filter .16s ease;
}
[data-vibeui-block="footer-018"] [data-part="action"]:hover{filter:brightness(1.06)}
[data-vibeui-block="footer-018"] [data-part="nav"]{
display:flex;align-items:center;gap:0.25rem 1.25rem;flex-wrap:wrap;
}
[data-vibeui-block="footer-018"] [data-part="nav"] a{
color:var(--vibeui-footer-018-muted);text-decoration:none;
font-size:0.9375rem;font-weight:540;
transition:color .16s ease;
}
[data-vibeui-block="footer-018"] [data-part="nav"] a:hover{color:var(--vibeui-footer-018-ink)}
[data-vibeui-block="footer-018"] [data-part="legal"]{
display:flex;align-items:center;gap:0.5rem 1.25rem;flex-wrap:wrap;
padding-top:1rem;border-top:1px solid color-mix(in oklab,#ffffff 18%,transparent);
font-size:0.8125rem;color:var(--vibeui-footer-018-muted);
}
[data-vibeui-block="footer-018"] [data-part="legal"] a{
color:inherit;text-decoration:none;
transition:color .16s ease;
}
[data-vibeui-block="footer-018"] [data-part="legal"] a:hover{color:var(--vibeui-footer-018-ink)}
[data-vibeui-block="footer-018"] [data-part="legal"] span{margin-left:auto}
[data-vibeui-block="footer-018"] a:focus-visible{
outline:2px solid var(--vibeui-footer-018-accent);outline-offset:3px;
}
@container (min-width: 52rem){
[data-vibeui-block="footer-018"] [data-part="shell"]{padding:7rem 2rem 2rem;min-height:38rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-018"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Footer018Link[] = [
  { label: "Номера", href: "#rooms" },
  { label: "Ресторан", href: "#restaurant" },
  { label: "Спа", href: "#spa" },
  { label: "Контакты", href: "#contacts" },
]

const DEFAULT_LEGAL: Footer018Link[] = [
  { label: "Политика конфиденциальности", href: "#privacy" },
  { label: "Оферта", href: "#terms" },
]

/** Кинематографический финал: кадр, крупная контактная фраза и видимые документы. */
export function Footer018({
  media,
  src,
  mediaLabel = "Вечерний вид отеля в горах",
  title = "Приезжайте — горы подождут вас",
  actionLabel = "Забронировать",
  actionHref = "#book",
  links = DEFAULT_LINKS,
  navLabel = "Разделы сайта",
  legalLinks = DEFAULT_LEGAL,
  copyright = "© 2026 Отель «Перевал»",
  accent,
  className,
  style,
}: Footer018Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-018-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-018" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-018" className={className} style={palette}>
        {media ? (
          <div data-part="media">{media}</div>
        ) : src ? (
          <div data-part="media">
            <img src={src} alt={mediaLabel} />
          </div>
        ) : (
          <div data-part="scene" role="img" aria-label={mediaLabel} />
        )}
        <div data-part="scrim" aria-hidden="true" />
        <div data-part="shell">
          <h2 data-part="title">{title}</h2>
          <div data-part="row">
            <a data-part="action" href={actionHref}>
              {actionLabel}
            </a>
            <nav data-part="nav" aria-label={navLabel}>
              {links.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div data-part="legal">
            {legalLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <span>{copyright}</span>
          </div>
        </div>
      </footer>
    </>
  )
}
