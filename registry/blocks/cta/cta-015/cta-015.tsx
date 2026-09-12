import type { CSSProperties, ReactNode } from "react"

type Cta015Badge = {
  caption: string
  store: string
  href: string
}

export type Cta015Props = {
  eyebrow?: string
  title?: string
  description?: string
  qrCaption?: string
  badges?: Cta015Badge[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Приложение и QR: слева текст с плашками сторов, справа QR-заглушка.
// QR нарисован CSS-паттерном — шахматная сетка и три угловых маркера —
// и помечен aria-hidden: это макет места под настоящий код, а не код.
// Плашка под QR всегда белая, а узор тёмный: сканеру нужен контраст
// тёмного на светлом, и темнить её вместе с темой нельзя.
const STYLES = `
:where([data-vibeui-block="cta-015"]){
--vibeui-cta-015-bg:transparent;
--vibeui-cta-015-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-cta-015-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-cta-015-border:light-dark(oklch(0.88 0 0),oklch(0.34 0 0));
--vibeui-cta-015-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-cta-015-badge-bg:oklch(0.2 0 0);
--vibeui-cta-015-badge-ink:oklch(0.97 0 0);
--vibeui-cta-015-qr-plate:oklch(1 0 0);
--vibeui-cta-015-qr-ink:oklch(0.2 0 0);
--vibeui-cta-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-015"]{color-scheme:dark}
[data-vibeui-block="cta-015"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-cta-015-bg);color:var(--vibeui-cta-015-ink);
font-family:var(--vibeui-cta-015-font);
}
[data-vibeui-block="cta-015"] [data-part="shell"]{
max-width:70rem;margin:0 auto;padding:3rem 1.25rem;
display:grid;gap:2.5rem;align-items:center;justify-items:center;
}
[data-vibeui-block="cta-015"] [data-part="copy"]{text-align:center}
[data-vibeui-block="cta-015"] [data-part="eyebrow"]{
margin:0 0 0.75rem;color:var(--vibeui-cta-015-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="cta-015"] [data-part="title"]{
margin:0 0 0.875rem;max-width:20ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="cta-015"] [data-part="description"]{
margin:0 0 1.75rem;max-width:46ch;
color:var(--vibeui-cta-015-muted);font-size:1rem;line-height:1.6;
}
[data-vibeui-block="cta-015"] [data-part="badges"]{
display:flex;flex-wrap:wrap;justify-content:center;gap:0.75rem;
}
[data-vibeui-block="cta-015"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.625rem;
padding:0.5625rem 1.125rem 0.5625rem 0.875rem;border-radius:0.75rem;
background:var(--vibeui-cta-015-badge-bg);color:var(--vibeui-cta-015-badge-ink);
text-decoration:none;
transition:transform .15s ease;
}
[data-vibeui-block="cta-015"] [data-part="badge"]:hover{transform:translateY(-1px)}
[data-vibeui-block="cta-015"] [data-part="badge"]:focus-visible{
outline:2px solid var(--vibeui-cta-015-accent);outline-offset:2px;
}
[data-vibeui-block="cta-015"] [data-part="badge"] svg{width:1.5rem;height:1.5rem;flex:none}
[data-vibeui-block="cta-015"] [data-part="badge-text"]{display:grid;gap:0.0625rem;justify-items:start}
[data-vibeui-block="cta-015"] [data-part="badge-caption"]{
font-size:0.625rem;letter-spacing:0.06em;text-transform:uppercase;opacity:0.75;
}
[data-vibeui-block="cta-015"] [data-part="badge-store"]{
font-size:1.0625rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="cta-015"] [data-part="qr-card"]{
display:grid;gap:0.75rem;justify-items:center;
padding:1.25rem;border:1px solid var(--vibeui-cta-015-border);border-radius:1.125rem;
background:var(--vibeui-cta-015-qr-plate);
}
[data-vibeui-block="cta-015"] [data-part="qr"]{
position:relative;width:min(10.5rem,56cqi);aspect-ratio:1;
background-image:repeating-conic-gradient(var(--vibeui-cta-015-qr-ink) 0 25%,transparent 0 50%);
background-size:11.5% 11.5%;
}
[data-vibeui-block="cta-015"] [data-part="finder"]{
position:absolute;width:26%;aspect-ratio:1;
border:0.3125rem solid var(--vibeui-cta-015-qr-ink);
background:var(--vibeui-cta-015-qr-plate);
display:grid;place-items:center;
}
[data-vibeui-block="cta-015"] [data-part="finder"]::before{
content:"";width:48%;aspect-ratio:1;background:var(--vibeui-cta-015-qr-ink);
}
[data-vibeui-block="cta-015"] [data-part="finder"]:nth-of-type(1){top:0;left:0}
[data-vibeui-block="cta-015"] [data-part="finder"]:nth-of-type(2){top:0;right:0}
[data-vibeui-block="cta-015"] [data-part="finder"]:nth-of-type(3){bottom:0;left:0}
[data-vibeui-block="cta-015"] [data-part="qr-caption"]{
margin:0;color:var(--vibeui-cta-015-qr-ink);font-size:0.75rem;font-weight:600;
}
@container (min-width: 46rem){
[data-vibeui-block="cta-015"] [data-part="shell"]{
grid-template-columns:1.4fr auto;padding:4.5rem 2rem;
}
[data-vibeui-block="cta-015"] [data-part="copy"]{text-align:left}
[data-vibeui-block="cta-015"] [data-part="badges"]{justify-content:flex-start}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-015"] *{animation:none!important;transition:none!important}}
`

// Значок платформы подбирается по названию магазина в бейдже; для
// неизвестной платформы бейдж остаётся текстовым.
const PLATFORM_ICONS: Record<string, ReactNode> = {
  ios: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.37 12.77c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.03 2.28-1.27 3.14-2.52.99-1.45 1.4-2.85 1.42-2.92-.03-.01-2.72-1.04-2.74-4.14zM13.8 5.13c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.29.69-3.03 1.56-.67.77-1.25 2-1.09 3.18 1.15.09 2.33-.59 3.05-1.45z"
      />
    </svg>
  ),
  android: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="m17.6 9.48 1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.43 11.43 0 0 0-8.94 0L5.65 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.4 9.48A10.81 10.81 0 0 0 1 18h22a10.81 10.81 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"
      />
    </svg>
  ),
}

function platformIcon(store: string): ReactNode {
  const key = store.toLowerCase()
  const known = Object.keys(PLATFORM_ICONS).find((name) => key.includes(name))
  return known ? PLATFORM_ICONS[known] : null
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

const DEFAULT_BADGES: Cta015Badge[] = [
  { caption: "Скачать для", store: "iOS", href: "#ios" },
  { caption: "Скачать для", store: "Android", href: "#android" },
]

/** Призыв поставить приложение: плашки сторов и QR-заглушка на белой плате. */
export function Cta015({
  eyebrow = "Каталог в кармане",
  title = "Смотрите секции с телефона",
  description = "Отмечайте понравившиеся блоки по дороге, а за рабочим столом отдавайте подборку AI-агенту. Наведите камеру — установка займёт минуту.",
  qrCaption = "Наведите камеру",
  badges = DEFAULT_BADGES,
  background = "",
  accent,
  className,
  style,
}: Cta015Props) {
  const palette = {
    ...(accent ? { "--vibeui-cta-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cta-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cta-015" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="cta-015"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="copy">
            <p data-part="eyebrow">{eyebrow}</p>
            <h2 data-part="title">{title}</h2>
            <p data-part="description">{description}</p>
            <div data-part="badges">
              {badges.map((badge) => (
                <a key={badge.store} data-part="badge" href={badge.href}>
                  {platformIcon(badge.store)}
                  <span data-part="badge-text">
                    <span data-part="badge-caption">{badge.caption}</span>
                    <span data-part="badge-store">{badge.store}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
          <div data-part="qr-card">
            <div data-part="qr" aria-hidden="true">
              <span data-part="finder" />
              <span data-part="finder" />
              <span data-part="finder" />
            </div>
            <p data-part="qr-caption">{qrCaption}</p>
          </div>
        </div>
      </section>
    </>
  )
}
