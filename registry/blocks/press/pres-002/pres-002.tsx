import type { CSSProperties } from "react"

type Pres002Asset = {
  title: string
  note: string
  format: string
}

export type Pres002Props = {
  eyebrow?: string
  title?: string
  summary?: string
  assets?: Pres002Asset[]
  downloadLabel?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Медиа-кит: карточки ассетов бренда (логотип, палитра, шрифты) с превью-
// плиткой, описанием и кнопкой скачивания формата. Превью — тёплая плитка с
// монограммой или образцом цвета. Формат раздела «для прессы», где скачивают
// официальные ассеты бренда одним файлом.
const STYLES = `
:where([data-vibeui-block="pres-002"]){
--vibeui-pres-002-bg:transparent;
--vibeui-pres-002-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-pres-002-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-pres-002-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-pres-002-card:light-dark(oklch(0.99 0 0),oklch(0.2 0 0));
--vibeui-pres-002-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-pres-002-on-accent:oklch(0.15 0.02 39.8);
--vibeui-pres-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pres-002"]{color-scheme:dark}
[data-vibeui-block="pres-002"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-pres-002-bg);color:var(--vibeui-pres-002-ink);
font-family:var(--vibeui-pres-002-font);
}
[data-vibeui-block="pres-002"] [data-part="shell"]{max-width:64rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="pres-002"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-pres-002-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="pres-002"] [data-part="title"]{margin:0 0 0.625rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="pres-002"] [data-part="summary"]{margin:0 0 2rem;max-width:40rem;color:var(--vibeui-pres-002-muted);font-size:1.0625rem;line-height:1.6}
[data-vibeui-block="pres-002"] [data-part="grid"]{display:grid;gap:1rem;grid-template-columns:minmax(0,1fr)}
[data-vibeui-block="pres-002"] [data-part="asset"]{
min-inline-size:0;display:flex;flex-direction:column;gap:0.875rem;
padding:1.25rem;border:1px solid var(--vibeui-pres-002-border);border-radius:1.125rem;background:var(--vibeui-pres-002-card)}
[data-vibeui-block="pres-002"] [data-part="thumb"]{
aspect-ratio:16 / 9;border-radius:0.75rem;display:grid;place-items:center;
background:linear-gradient(140deg,oklch(0.6 0.18 39.8),oklch(0.38 0.13 28));
color:oklch(0.98 0 0);font-size:1.75rem;font-weight:800}
[data-vibeui-block="pres-002"] [data-part="asset"]:nth-child(3n+2) [data-part="thumb"]{background:linear-gradient(140deg,oklch(0.58 0.16 55),oklch(0.36 0.11 42))}
[data-vibeui-block="pres-002"] [data-part="asset"]:nth-child(3n+3) [data-part="thumb"]{background:linear-gradient(140deg,oklch(0.5 0.15 25),oklch(0.3 0.1 18))}
[data-vibeui-block="pres-002"] [data-part="asset-title"]{margin:0;font-size:1rem;font-weight:700}
[data-vibeui-block="pres-002"] [data-part="asset-note"]{margin:0.125rem 0 0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-pres-002-muted)}
[data-vibeui-block="pres-002"] [data-part="dl"]{
margin-top:auto;display:inline-flex;align-items:center;justify-content:center;gap:0.375rem;
height:2.5rem;border-radius:0.75rem;text-decoration:none;
border:1px solid var(--vibeui-pres-002-border);color:inherit;font-size:0.875rem;font-weight:640;
transition:border-color .16s ease,background-color .16s ease}
[data-vibeui-block="pres-002"] [data-part="dl"]:hover{border-color:var(--vibeui-pres-002-accent)}
[data-vibeui-block="pres-002"] [data-part="dl"]:focus-visible{outline:2px solid var(--vibeui-pres-002-accent);outline-offset:2px}
[data-vibeui-block="pres-002"] [data-part="fmt"]{color:var(--vibeui-pres-002-muted);font-weight:500}
@container (min-width: 44rem){
[data-vibeui-block="pres-002"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="pres-002"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pres-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ASSETS: Pres002Asset[] = [
  { title: "Логотип", note: "Основной и монохромный варианты, safe-зоны.", format: "SVG · PNG" },
  { title: "Палитра", note: "Фирменный оранжевый и нейтрали в HEX и OKLCH.", format: "PDF" },
  { title: "Шрифты", note: "Гарнитуры интерфейса и заголовков с лицензией.", format: "ZIP" },
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

/** Медиа-кит: карточки ассетов бренда с превью и кнопкой скачивания. */
export function Pres002({
  eyebrow = "Медиа-кит",
  title = "Ассеты бренда",
  summary = "Официальные логотипы, палитра и шрифты для публикаций о VibeUI. Используйте их без изменений пропорций и цвета.",
  assets = DEFAULT_ASSETS,
  downloadLabel = "Скачать",
  background = "",
  accent,
  className,
  style,
}: Pres002Props) {
  const palette = {
    ...(accent ? { "--vibeui-pres-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pres-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pres-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pres-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <p data-part="summary">{summary}</p>
          <div data-part="grid">
            {assets.map((asset) => (
              <div key={asset.title} data-part="asset">
                <div data-part="thumb" aria-hidden="true">
                  {asset.title.charAt(0)}
                </div>
                <div>
                  <p data-part="asset-title">{asset.title}</p>
                  <p data-part="asset-note">{asset.note}</p>
                </div>
                <a href="#" data-part="dl">
                  {downloadLabel} <span data-part="fmt">{asset.format}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
