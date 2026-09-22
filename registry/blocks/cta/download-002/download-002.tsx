import type { CSSProperties } from "react"
import { Button120 } from "@/registry/components/button/button-120/button-120"

type Download002Store = {
  kicker: string
  name: string
  href: string
}

export type Download002Props = {
  eyebrow?: string
  title?: string
  summary?: string
  qrCaption?: string
  stores?: Download002Store[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Секция загрузки с QR-заглушкой: слева текст и бейджи магазинов, справа
// «QR-код» — декоративный узор из клеток на CSS-градиенте, а не настоящий
// код. Формат «наведите камеру» для десктопного лендинга: настоящий QR
// подставит приложение вместо узора-заглушки.
const STYLES = `[data-vibeui-block="download-002"] [data-part="badge"]{min-width:9.5rem}

:where([data-vibeui-block="download-002"]){
--vibeui-download-002-bg:transparent;
--vibeui-download-002-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-download-002-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-download-002-badge:oklch(0 0 0);
--vibeui-download-002-badge-line:oklch(0.72 0 0);
--vibeui-download-002-badge-ink:oklch(0.98 0 0);
--vibeui-download-002-border:light-dark(oklch(0.88 0 0),oklch(0.34 0 0));
--vibeui-download-002-qr-bg:oklch(1 0 0);
--vibeui-download-002-qr-ink:oklch(0.15 0 0);
--vibeui-download-002-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-download-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-download-002-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="download-002"]{color-scheme:dark}
[data-vibeui-block="download-002"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-download-002-bg);color:var(--vibeui-download-002-ink);
font-family:var(--vibeui-download-002-font);
}
[data-vibeui-block="download-002"] [data-part="shell"]{max-width:60rem;margin:0 auto;padding:3.5rem 1.25rem;display:grid;gap:2rem;align-items:center}
[data-vibeui-block="download-002"] [data-part="eyebrow"]{margin:0 0 0.625rem;color:var(--vibeui-download-002-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="download-002"] [data-part="title"]{margin:0 0 0.75rem;font-size:clamp(1.75rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="download-002"] [data-part="summary"]{margin:0 0 1.75rem;color:var(--vibeui-download-002-muted);font-size:1.0625rem;line-height:1.6}
[data-vibeui-block="download-002"] [data-part="badges"]{display:flex;flex-wrap:wrap;gap:0.75rem}
[data-vibeui-block="download-002"] [data-part="qr-wrap"]{display:flex;flex-direction:column;align-items:center;gap:0.75rem}
/* QR-заглушка: клетчатый узор из двух повторяющихся градиентов на белом
   поле с рамкой-акцентом. Это декорация, а не считываемый код. */
[data-vibeui-block="download-002"] [data-part="qr"]{
width:11rem;height:11rem;border-radius:1rem;padding:0.75rem;box-sizing:border-box;
background:var(--vibeui-download-002-qr-bg);
border:2px solid color-mix(in oklab,var(--vibeui-download-002-accent) 40%,transparent);
box-shadow:0 12px 32px -20px oklch(0 0 0 / 40%);
}
[data-vibeui-block="download-002"] [data-part="qr-grid"]{
width:100%;height:100%;border-radius:0.375rem;
background-image:
repeating-linear-gradient(90deg,var(--vibeui-download-002-qr-ink) 0 8%,transparent 8% 16%),
repeating-linear-gradient(0deg,var(--vibeui-download-002-qr-ink) 0 8%,transparent 8% 16%);
background-blend-mode:multiply;
}
[data-vibeui-block="download-002"] [data-part="qr-caption"]{color:var(--vibeui-download-002-muted);font-size:0.8125rem;text-align:center}
@container (min-width: 44rem){
[data-vibeui-block="download-002"] [data-part="shell"]{padding:4.5rem 2rem;grid-template-columns:1fr auto;gap:3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="download-002"] *{animation:none!important;transition:none!important}}
`

// Значки магазинов подбираются по названию: список магазинов приходит
// строками, а бейдж без фирменного знака читается как обычная кнопка.


const DEFAULT_STORES: Download002Store[] = [
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

/** Секция загрузки с декоративной QR-заглушкой и бейджами магазинов. */
export function Download002({
  eyebrow = "Приложение",
  title = "Наведите камеру",
  summary = "Отсканируйте код — откроется страница приложения в вашем магазине. Или выберите магазин вручную.",
  qrCaption = "Наведите камеру телефона на код",
  stores = DEFAULT_STORES,
  background = "",
  accent,
  className,
  style,
}: Download002Props) {
  const palette = {
    ...(accent ? { "--vibeui-download-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-download-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-download-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="download-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div>
            <p data-part="eyebrow">{eyebrow}</p>
            <h2 data-part="title">{title}</h2>
            <p data-part="summary">{summary}</p>
            <div data-part="badges">
              {stores.map((store) => (
                <Button120 key={store.name} data-part="badge" name={store.name} href={store.href} kicker={store.kicker} accent={accent} />
              ))}
            </div>
          </div>
          <div data-part="qr-wrap">
            <div
              data-part="qr"
              role="img"
              aria-label="QR-код на страницу приложения"
            >
              <div data-part="qr-grid" aria-hidden="true" />
            </div>
            <p data-part="qr-caption">{qrCaption}</p>
          </div>
        </div>
      </section>
    </>
  )
}
