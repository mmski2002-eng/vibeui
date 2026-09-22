import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"
import { Card025 } from "@/registry/components/card/card-025/card-025"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Cta005Props = {
  eyebrow?: string
  title?: string
  description?: string
  bullets?: string[]
  actionLabel?: string
  actionHref?: string
  noteLabel?: string
  imageSrc?: string
  imageAlt?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Призыв с картинкой сбоку. Место под картинку держит соотношение сторон,
// поэтому раскладка не прыгает, пока изображение грузится. Если imageSrc не
// передан, в том же месте рисуется нарисованная CSS-заглушка: блок обязан
// выглядеть законченным без единого внешнего файла.
//
// Тема приходит из color-scheme окружения через light-dark(): подложки у
// секции по умолчанию нет, заглушка и рамки темнеют вместе со страницей.
const STYLES = `

:where([data-vibeui-block="cta-005"]){
--vibeui-cta-005-bg:transparent;
--vibeui-cta-005-ink:light-dark(oklch(0.2 0.015 210),oklch(0.95 0.005 210));
--vibeui-cta-005-muted:light-dark(oklch(0.5 0.015 210),oklch(0.72 0.012 210));
--vibeui-cta-005-border:light-dark(oklch(0.9 0.008 210),oklch(0.35 0.012 210));
--vibeui-cta-005-mock-card:light-dark(oklch(1 0 0 / 78%),oklch(0.98 0.004 210 / 22%));
--vibeui-cta-005-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-cta-005-accent-fg:oklch(from var(--vibeui-cta-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-cta-005-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-005"]{color-scheme:dark}
[data-vibeui-block="cta-005"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-cta-005-bg);color:var(--vibeui-cta-005-ink);
font-family:var(--vibeui-cta-005-font);
}
/* Кадр — card-025, ширину задаёт колонка сетки. */
[data-vibeui-block="cta-005"] [data-part="media"]{width:100%}
[data-vibeui-block="cta-005"] [data-part="shell"]{
display:grid;gap:1.75rem;align-items:center;
max-width:74rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="cta-005"] [data-part="bullets"]{
margin:1.25rem 0 0;padding:0;list-style:none;display:grid;gap:0.5rem;
font-size:0.9375rem;
}
[data-vibeui-block="cta-005"] [data-part="bullets"] li{display:flex;align-items:flex-start;gap:0.5rem;line-height:1.45}
[data-vibeui-block="cta-005"] [data-part="bullets"] li::before{
content:"";flex:none;width:1rem;height:1rem;margin-top:0.1875rem;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-cta-005-accent) 22%,transparent);
box-shadow:inset 0 0 0 1.5px var(--vibeui-cta-005-accent);
}
[data-vibeui-block="cta-005"] [data-part="actions"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.875rem;margin-top:1.75rem}
[data-vibeui-block="cta-005"] [data-part="note"]{margin:0;color:var(--vibeui-cta-005-muted);font-size:0.8125rem}
@container (min-width: 46rem){
[data-vibeui-block="cta-005"] [data-part="shell"]{grid-template-columns:1fr 1fr;gap:3.5rem;padding:5rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_BULLETS = [
  "Замер и смета в день обращения",
  "Материалы со склада, без ожидания поставки",
  "Гарантия на монтаж три года",
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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

/** Призыв с картинкой сбоку: место под изображение держит соотношение сторон. */
export function Cta005({
  eyebrow = "Ремонт кухни",
  title = "Приезжаем на замер завтра, начинаем в понедельник",
  description = "Показываем смету до начала работ и не меняем её по ходу. Если сроки уезжают по нашей вине, платим неустойку за каждый день.",
  bullets = DEFAULT_BULLETS,
  actionLabel = "Вызвать замерщика",
  actionHref = "#measure",
  noteLabel = "Работаем по Москве и области",
  imageSrc,
  imageAlt = "Собранная кухня после ремонта",
  background = "",
  accent,
  className,
  style,
}: Cta005Props) {
  const palette = {
    ...(accent ? { "--vibeui-cta-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cta-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cta-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="cta-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="main">
            <Heading001
              data-part="heading"
              eyebrow={eyebrow}
              title={title}
              lede={description}
              size="lg"
              ledeWidth={50}
              accent={accent}
            />
            <ul data-part="bullets">
              {bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <div data-part="actions">
              <Button016
                data-part="action"
                label={actionLabel}
                href={actionHref}
                external={false}
                size="lg"
                tone="accent"
                accent={accent}
              />
              <p data-part="note">{noteLabel}</p>
            </div>
          </div>
          {/* Кадр — card-025; без картинки показывает свою подложку. */}
          <Card025 data-part="media" src={imageSrc} alt={imageAlt} ratio="5/4" accent={accent} />
        </div>
      </section>
    </>
  )
}
