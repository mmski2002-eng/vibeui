import type { CSSProperties, ReactNode } from "react"

type Download001Store = {
  kicker: string
  name: string
  href: string
}

export type Download001Props = {
  eyebrow?: string
  title?: string
  summary?: string
  stores?: Download001Store[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Секция загрузки приложения с бейджами магазинов. Бейджи нарисованы своей
// вёрсткой (мелкая приписка сверху, название магазина крупно), без логотипов
// Apple или Google — только нейтральные плашки-ссылки. Формат «скачайте
// приложение» для лендинга мобильного продукта.
const STYLES = `
:where([data-vibeui-block="download-001"]){
--vibeui-download-001-bg:transparent;
--vibeui-download-001-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-download-001-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-download-001-badge:oklch(0 0 0);
--vibeui-download-001-badge-line:oklch(0.72 0 0);
--vibeui-download-001-badge-ink:oklch(0.98 0 0);
--vibeui-download-001-border:light-dark(oklch(0.88 0 0),oklch(0.34 0 0));
--vibeui-download-001-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-download-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-download-001-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="download-001"]{color-scheme:dark}
[data-vibeui-block="download-001"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-download-001-bg);color:var(--vibeui-download-001-ink);
font-family:var(--vibeui-download-001-font);
}
[data-vibeui-block="download-001"] [data-part="shell"]{max-width:44rem;margin:0 auto;padding:3.5rem 1.25rem;text-align:center}
[data-vibeui-block="download-001"] [data-part="eyebrow"]{margin:0 0 0.625rem;color:var(--vibeui-download-001-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="download-001"] [data-part="title"]{margin:0 0 0.75rem;font-size:clamp(1.75rem,6cqi,2.75rem);line-height:1.08;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="download-001"] [data-part="summary"]{margin:0 auto 2rem;max-width:32rem;color:var(--vibeui-download-001-muted);font-size:1.0625rem;line-height:1.6}
[data-vibeui-block="download-001"] [data-part="badges"]{display:flex;flex-wrap:wrap;gap:0.75rem;justify-content:center}
[data-vibeui-block="download-001"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.5rem;box-sizing:border-box;
height:2.5rem;min-width:9.5rem;padding:0 0.75rem 0 0.625rem;
border:1px solid var(--vibeui-download-001-badge-line);border-radius:0.375rem;text-decoration:none;
background:var(--vibeui-download-001-badge);color:var(--vibeui-download-001-badge-ink);
transition:transform var(--vibeui-download-001-dur-2) ease;
}
[data-vibeui-block="download-001"] [data-part="badge"]:hover{transform:translateY(-2px);box-shadow:0 12px 28px -18px oklch(0 0 0 / 55%)}
[data-vibeui-block="download-001"] [data-part="badge"]:focus-visible{outline:2px solid var(--vibeui-download-001-accent);outline-offset:3px}
[data-vibeui-block="download-001"] [data-part="badge"] svg{width:1.5rem;height:1.5rem;flex:none}
[data-vibeui-block="download-001"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;line-height:1}
[data-vibeui-block="download-001"] [data-part="kicker"]{font-size:0.5625rem;line-height:1.1;letter-spacing:0.01em}
[data-vibeui-block="download-001"] [data-part="store"]{font-size:1.0625rem;font-weight:600;line-height:1.1;letter-spacing:-0.01em;white-space:nowrap}
@container (min-width: 36rem){[data-vibeui-block="download-001"] [data-part="shell"]{padding:4.5rem 2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="download-001"] *{animation:none!important;transition:none!important}}
`

// Значки магазинов подбираются по названию: список магазинов приходит
// строками, а бейдж без фирменного знака читается как обычная кнопка.
const STORE_ICONS: Record<string, ReactNode> = {
  "app store": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.37 12.77c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.03 2.28-1.27 3.14-2.52.99-1.45 1.4-2.85 1.42-2.92-.03-.01-2.72-1.04-2.74-4.14zM13.8 5.13c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.29.69-3.03 1.56-.67.77-1.25 2-1.09 3.18 1.15.09 2.33-.59 3.05-1.45z"
      />
    </svg>
  ),
  "google play": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M3.6 1.8 12.7 12l-9.1 10.2c-.4-.4-.6-1-.6-1.7V3.5c0-.7.2-1.3.6-1.7z"
      />
      <path fill="#34A853" d="M3.6 1.8c.5-.4 1.2-.5 1.9-.1l10.6 6.9L12.7 12z" />
      <path
        fill="#FBBC04"
        d="m16.1 8.6 3.9 2.3c1.1.6 1.1 1.6 0 2.3l-3.9 2.2L12.7 12z"
      />
      <path
        fill="#EA4335"
        d="M3.6 22.2 12.7 12l3.4 3.4-10.6 6.9c-.7.4-1.4.3-1.9-.1z"
      />
    </svg>
  ),
}

function storeIcon(name: string): ReactNode {
  const key = name.toLowerCase()
  const known = Object.keys(STORE_ICONS).find((store) => key.includes(store))
  return known ? STORE_ICONS[known] : null
}

const DEFAULT_STORES: Download001Store[] = [
  { kicker: "Загрузите в", name: "App Store", href: "#" },
  { kicker: "Доступно в", name: "Google Play", href: "#" },
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

/** Секция загрузки приложения с нейтральными бейджами магазинов. */
export function Download001({
  eyebrow = "Приложение",
  title = "Скачайте приложение",
  summary = "Каталог всегда под рукой: смотрите компоненты и копируйте команду установки прямо с телефона.",
  stores = DEFAULT_STORES,
  background = "",
  accent,
  className,
  style,
}: Download001Props) {
  const palette = {
    ...(accent ? { "--vibeui-download-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-download-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-download-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="download-001"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <p data-part="summary">{summary}</p>
          <div data-part="badges">
            {stores.map((store) => (
              <a key={store.name} href={store.href} data-part="badge">
                {storeIcon(store.name)}
                <span data-part="text">
                  <span data-part="kicker">{store.kicker}</span>
                  <span data-part="store">{store.name}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
