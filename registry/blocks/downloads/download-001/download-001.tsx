import type { CSSProperties } from "react"

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
--vibeui-download-001-badge:light-dark(oklch(0.18 0 0),oklch(0.24 0 0));
--vibeui-download-001-badge-ink:oklch(0.98 0 0);
--vibeui-download-001-border:light-dark(oklch(0.88 0 0),oklch(0.34 0 0));
--vibeui-download-001-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-download-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
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
display:inline-flex;flex-direction:column;align-items:flex-start;gap:0.0625rem;
padding:0.625rem 1.25rem;border-radius:0.875rem;text-decoration:none;
background:var(--vibeui-download-001-badge);color:var(--vibeui-download-001-badge-ink);
transition:transform .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="download-001"] [data-part="badge"]:hover{transform:translateY(-2px);box-shadow:0 12px 28px -18px oklch(0 0 0 / 55%)}
[data-vibeui-block="download-001"] [data-part="badge"]:focus-visible{outline:2px solid var(--vibeui-download-001-accent);outline-offset:3px}
[data-vibeui-block="download-001"] [data-part="kicker"]{font-size:0.6875rem;opacity:.8;letter-spacing:0.02em}
[data-vibeui-block="download-001"] [data-part="store"]{font-size:1.0625rem;font-weight:700;line-height:1.2}
@container (min-width: 36rem){[data-vibeui-block="download-001"] [data-part="shell"]{padding:4.5rem 2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="download-001"] *{animation:none!important;transition:none!important}}
`

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
                <span data-part="kicker">{store.kicker}</span>
                <span data-part="store">{store.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
