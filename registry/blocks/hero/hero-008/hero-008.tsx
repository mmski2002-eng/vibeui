import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Hero008Props = {
  title?: string
  lede?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  logosTitle?: string
  logos?: string[]
  accent?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  className?: string
  style?: CSSProperties
}

// Идея блока: доказательство внизу. Текст занимает верх, а нижнюю треть держит
// полоса клиентов, отбитая линией. Логотипы — текстовые начертания, а не
// картинки: чужие файлы в блок не входят, а wordmark из системного шрифта
// читается на любом фоне и не мылится на ретине. Полоса не бесконечная лента,
// а сетка: в узком блоке она честно переносится, а не уезжает за край.
const STYLES = `
:where([data-vibeui-block="hero-008"]){
--vibeui-hero-008-bg:transparent;
--vibeui-hero-008-fg:light-dark(oklch(0.19 0 250),oklch(0.96 0 250));
--vibeui-hero-008-muted:light-dark(oklch(0.52 0 250),oklch(0.72 0 250));
--vibeui-hero-008-line:light-dark(oklch(0.9 0 250),oklch(0.36 0 250));
--vibeui-hero-008-soft:light-dark(oklch(0.97 0 250),oklch(0.24 0 250));
--vibeui-hero-008-accent:light-dark(oklch(0.2 0 0),oklch(0.92 0 0));
--vibeui-hero-008-accent-fg:oklch(from var(--vibeui-hero-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-008-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-hero-008-dur-2:180ms;
--vibeui-hero-008-dur-3:240ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-008"]{color-scheme:dark}
:where([data-vibeui-block="hero-008"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-008"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-008"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-hero-008-bg);color:var(--vibeui-hero-008-fg);
font-family:var(--vibeui-hero-008-sans);
}
[data-vibeui-block="hero-008"] *{box-sizing:border-box}
[data-vibeui-block="hero-008"] [data-part="shell"]{max-width:64rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem 0;text-align:center}
[data-vibeui-block="hero-008"] [data-part="actions"]{display:flex;flex-direction:column;gap:0.625rem;margin:1.875rem auto 0;max-width:20rem}
[data-vibeui-block="hero-008"] [data-part="proof"]{margin-top:3rem;border-top:1px solid var(--vibeui-hero-008-line);background:var(--vibeui-hero-008-soft)}
[data-vibeui-block="hero-008"] [data-part="proofinner"]{max-width:64rem;width:100%;margin:0 auto;padding:1.75rem 1.25rem}
[data-vibeui-block="hero-008"] [data-part="prooftitle"]{
margin:0 0 1.125rem;text-align:center;font-size:0.6875rem;font-weight:650;letter-spacing:0.16em;text-transform:uppercase;
color:var(--vibeui-hero-008-muted);
}
[data-vibeui-block="hero-008"] [data-part="logos"]{
list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem 1.5rem;
}
[data-vibeui-block="hero-008"] [data-part="logos"] li{
display:flex;align-items:center;justify-content:center;gap:0.4375rem;
font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;color:var(--vibeui-hero-008-fg);opacity:.62;
transition:opacity var(--vibeui-hero-008-dur-2) ease;
}
[data-vibeui-block="hero-008"] [data-part="logos"] li:hover{opacity:1}
[data-vibeui-block="hero-008"] [data-part="mark"]{
width:1.125rem;height:1.125rem;border-radius:0.3125rem;background:currentColor;
-webkit-mask-image:conic-gradient(from 45deg,black 0 25%,transparent 0 50%,black 0 75%,transparent 0);
mask-image:conic-gradient(from 45deg,black 0 25%,transparent 0 50%,black 0 75%,transparent 0);
}
@container (min-width: 34rem){
[data-vibeui-block="hero-008"] [data-part="actions"]{flex-direction:row;justify-content:center;max-width:none}
[data-vibeui-block="hero-008"] [data-part="shell"]{padding:5.5rem 2rem 0}
[data-vibeui-block="hero-008"] [data-part="logos"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@container (min-width: 56rem){
[data-vibeui-block="hero-008"] [data-part="logos"]{grid-template-columns:repeat(6,minmax(0,1fr))}
[data-vibeui-block="hero-008"] [data-part="proofinner"]{padding:2.25rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LOGOS = ["Контур", "Литера", "Оптика", "Тандем", "Ясно", "Верста"]

/**
 * Ветка темы для заданной подложки. Без неё светлый фон достался бы тексту
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

/** Hero с полосой логотипов клиентов внизу: текст сверху, доказательство под линией. */
export function Hero008({
  title = "Страницы, которым доверяют отделы маркетинга",
  lede = "Секции переживают редизайн бренда: тексты, цвета и типографика вынесены в пропсы, вёрстка остаётся на месте.",
  primary = { label: "Собрать страницу", href: "#" },
  secondary = { label: "Поговорить с нами", href: "#" },
  logosTitle = "С нами работают",
  logos = DEFAULT_LOGOS,
  accent,
  background = "",
  tone = "auto",
  className,
  style,
}: Hero008Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hero-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-008" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-008"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            title={title}
            lede={lede}
            level="h1"
            size="lg"
            align="center"
            accent={accent}
          />
          <div data-part="actions">
            <Button016
              data-part="primary"
              size="lg"
              label={primary.label}
              href={primary.href}
              external={false}
              tone="accent"
              accent={accent}
            />
            <Button016
              data-part="secondary"
              size="lg"
              label={secondary.label}
              href={secondary.href}
              external={false}
              tone="neutral"
              accent={accent}
            />
          </div>
        </div>

        <div data-part="proof">
          <div data-part="proofinner">
            <h2 data-part="prooftitle">{logosTitle}</h2>
            <ul data-part="logos">
              {logos.slice(0, 6).map((logo) => (
                <li key={logo}>
                  <span data-part="mark" aria-hidden="true" />
                  {logo}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
