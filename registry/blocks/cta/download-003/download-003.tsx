import type { CSSProperties, ReactNode } from "react"

type Download003Platform = {
  name: string
  detail: string
  href: string
  primary?: boolean
}

export type Download003Props = {
  eyebrow?: string
  title?: string
  version?: string
  platforms?: Download003Platform[]
  otherNote?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Загрузка десктопного приложения по платформам: карточки Mac, Windows,
// Linux с типом файла и весом. Определённая под систему пользователя платформа
// выделена брендовой рамкой (задаётся флагом primary). Иконки платформ —
// простые CSS-глифы, без брендовых логотипов. Формат страницы загрузки
// десктоп-продукта.
const STYLES = `
:where([data-vibeui-block="download-003"]){
--vibeui-download-003-bg:transparent;
--vibeui-download-003-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-download-003-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-download-003-border:light-dark(oklch(0.88 0 0),oklch(0.32 0 0));
--vibeui-download-003-card:light-dark(oklch(0.98 0 0),oklch(0.2 0 0));
--vibeui-download-003-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-download-003-on-accent:oklch(from var(--vibeui-download-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-download-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-download-003-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="download-003"]{color-scheme:dark}
[data-vibeui-block="download-003"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-download-003-bg);color:var(--vibeui-download-003-ink);
font-family:var(--vibeui-download-003-font);
}
[data-vibeui-block="download-003"] [data-part="shell"]{max-width:60rem;margin:0 auto;padding:3.5rem 1.25rem;text-align:center}
[data-vibeui-block="download-003"] [data-part="eyebrow"]{margin:0 0 0.625rem;color:var(--vibeui-download-003-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="download-003"] [data-part="title"]{margin:0 0 0.5rem;font-size:clamp(1.75rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="download-003"] [data-part="version"]{margin:0 0 2rem;color:var(--vibeui-download-003-muted);font-size:0.9375rem}
[data-vibeui-block="download-003"] [data-part="grid"]{display:grid;gap:1rem;grid-template-columns:minmax(0,1fr);text-align:left}
[data-vibeui-block="download-003"] [data-part="card"]{
min-inline-size:0;display:flex;flex-direction:column;gap:0.75rem;
padding:1.25rem;border:1px solid var(--vibeui-download-003-border);border-radius:1rem;
background:var(--vibeui-download-003-card);
transition:border-color var(--vibeui-download-003-dur-2) ease,transform var(--vibeui-download-003-dur-2) ease;
}
[data-vibeui-block="download-003"] [data-part="card"]:hover{transform:translateY(-2px)}
[data-vibeui-block="download-003"] [data-part="card"][data-primary="true"]{border-color:var(--vibeui-download-003-accent);box-shadow:0 0 0 1px var(--vibeui-download-003-accent)}
[data-vibeui-block="download-003"] [data-part="glyph"] svg{width:1.25rem;height:1.25rem}
[data-vibeui-block="download-003"] [data-part="glyph"]{
width:2.75rem;height:2.75rem;border-radius:0.75rem;flex:none;
display:grid;place-items:center;font-size:1.25rem;font-weight:800;
background:color-mix(in oklab,var(--vibeui-download-003-accent) 12%,transparent);
color:var(--vibeui-download-003-accent);
}
[data-vibeui-block="download-003"] [data-part="name"]{margin:0;font-size:1.0625rem;font-weight:700}
[data-vibeui-block="download-003"] [data-part="detail"]{margin:0.1875rem 0 0;font-size:0.8125rem;color:var(--vibeui-download-003-muted)}
[data-vibeui-block="download-003"] [data-part="btn"]{
margin-top:auto;display:inline-flex;align-items:center;justify-content:center;
height:2.75rem;border-radius:0.75rem;text-decoration:none;
border:1px solid var(--vibeui-download-003-border);color:inherit;
font-size:0.9375rem;font-weight:650;transition:border-color var(--vibeui-download-003-dur-2) ease,background-color var(--vibeui-download-003-dur-2) ease;
}
[data-vibeui-block="download-003"] [data-part="btn"]:hover{border-color:var(--vibeui-download-003-accent)}
[data-vibeui-block="download-003"] [data-part="btn"]:focus-visible{outline:2px solid var(--vibeui-download-003-accent);outline-offset:2px}
[data-vibeui-block="download-003"] [data-part="card"][data-primary="true"] [data-part="btn"]{border-color:transparent;background:var(--vibeui-download-003-accent);color:oklch(from var(--vibeui-download-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="download-003"] [data-part="other"]{margin:1.75rem 0 0;font-size:0.875rem;color:var(--vibeui-download-003-muted)}
[data-vibeui-block="download-003"] [data-part="other"] a{color:var(--vibeui-download-003-accent);text-decoration:underline;text-underline-offset:2px}
@container (min-width: 44rem){
[data-vibeui-block="download-003"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="download-003"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="download-003"] *{animation:none!important;transition:none!important}}
`

// Значки платформ подбираются по названию; для неизвестной остаётся первая
// буква. Linux — терминал, а не Tux: пингвин в 20px нечитаем.
const PLATFORM_ICONS: Record<string, ReactNode> = {
  mac: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.37 12.77c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.03 2.28-1.27 3.14-2.52.99-1.45 1.4-2.85 1.42-2.92-.03-.01-2.72-1.04-2.74-4.14zM13.8 5.13c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.29.69-3.03 1.56-.67.77-1.25 2-1.09 3.18 1.15.09 2.33-.59 3.05-1.45z"
      />
    </svg>
  ),
  windows: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M0 3.45 9.75 2.1v9.45H0zm10.95-1.5L24 0v11.4H10.95zM0 12.6h9.75v9.45L0 20.7zm10.95 0H24V24l-13.05-1.8z"
      />
    </svg>
  ),
  linux: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 7 6 5-6 5M13 17h6" />
    </svg>
  ),
}

function platformIcon(name: string): ReactNode {
  const key = name.toLowerCase()
  const known = Object.keys(PLATFORM_ICONS).find((os) => key.includes(os))
  return known ? PLATFORM_ICONS[known] : null
}

const DEFAULT_PLATFORMS: Download003Platform[] = [
  {
    name: "macOS",
    detail: "Apple Silicon · .dmg · 48 МБ",
    href: "#",
    primary: true,
  },
  { name: "Windows", detail: "64-bit · .exe · 52 МБ", href: "#" },
  { name: "Linux", detail: "AppImage · 55 МБ", href: "#" },
]

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

/** Загрузка десктопного приложения по платформам; своя система выделена. */
export function Download003({
  eyebrow = "Десктоп",
  title = "Скачайте для своей системы",
  version = "Версия 2.4.0 · обновлено 6 сентября 2026",
  platforms = DEFAULT_PLATFORMS,
  otherNote = "Нужна другая сборка?",
  background = "",
  accent,
  className,
  style,
}: Download003Props) {
  const palette = {
    ...(accent ? { "--vibeui-download-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-download-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-download-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="download-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <p data-part="version">{version}</p>
          <div data-part="grid">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                data-part="card"
                data-primary={platform.primary ? "true" : undefined}
              >
                <span data-part="glyph" aria-hidden="true">
                  {platformIcon(platform.name) ?? platform.name.charAt(0)}
                </span>
                <div>
                  <p data-part="name">{platform.name}</p>
                  <p data-part="detail">{platform.detail}</p>
                </div>
                <a href={platform.href} data-part="btn">
                  Скачать
                </a>
              </div>
            ))}
          </div>
          <p data-part="other">
            {otherNote} <a href="#">Все сборки и архив версий</a>
          </p>
        </div>
      </section>
    </>
  )
}
