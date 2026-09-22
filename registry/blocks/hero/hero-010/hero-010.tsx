import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Hero010Props = {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  eyebrow?: string
  title?: string
  lede?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  bullets?: string[]
  imageCaption?: string
  accent?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  className?: string
  style?: CSSProperties
}

// Идея блока: половина на половину, без полей. Правая часть — не карточка и не
// окно, а изображение во всю высоту секции, прижатое к её краю: композиция
// собрана градиентами и clip-path, поэтому картинки в поставке нет, но место
// под неё размечено — достаточно положить <img> в тот же слот. Текст слева
// прижат к внутреннему краю, а не отцентрован: взгляд идёт по вертикали.
const STYLES = `
:where([data-vibeui-block="hero-010"]){
--vibeui-hero-010-bg:transparent;
--vibeui-hero-010-fg:light-dark(oklch(0.2 0 240),oklch(0.95 0 240));
--vibeui-hero-010-muted:light-dark(oklch(0.5 0 240),oklch(0.73 0 240));
--vibeui-hero-010-line:light-dark(oklch(0.89 0 240),oklch(0.37 0 240));
--vibeui-hero-010-accent:light-dark(oklch(0.2 0 0),oklch(0.92 0 0));
--vibeui-hero-010-accent-fg:oklch(from var(--vibeui-hero-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-010-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-hero-010-dur-2:180ms;
--vibeui-hero-010-dur-3:240ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-010"]{color-scheme:dark}
:where([data-vibeui-block="hero-010"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-010"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-010"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;background:var(--vibeui-hero-010-bg);color:var(--vibeui-hero-010-fg);
font-family:var(--vibeui-hero-010-sans);
}
[data-vibeui-block="hero-010"] *{box-sizing:border-box}
[data-vibeui-block="hero-010"] [data-part="shell"]{display:grid;grid-template-columns:1fr;align-items:stretch}
[data-vibeui-block="hero-010"] [data-part="copy"]{padding:3rem 1.25rem;display:flex;flex-direction:column;justify-content:center}
[data-vibeui-block="hero-010"] [data-part="inner"]{max-width:34rem;width:100%}
[data-vibeui-block="hero-010"] ul{list-style:none;margin:1.5rem 0 0;padding:0;display:grid;gap:0.625rem}
[data-vibeui-block="hero-010"] li{display:flex;align-items:flex-start;gap:0.625rem;font-size:0.875rem;line-height:1.5}
[data-vibeui-block="hero-010"] [data-part="tick"]{
flex:0 0 auto;margin-top:0.125rem;width:1.125rem;height:1.125rem;border-radius:9999px;
display:flex;align-items:center;justify-content:center;
background:color-mix(in oklab,var(--vibeui-hero-010-accent) 18%,transparent);color:var(--vibeui-hero-010-accent);
}
[data-vibeui-block="hero-010"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.625rem;margin-top:1.875rem}
[data-vibeui-block="hero-010"] figure{
position:relative;margin:0;min-height:16rem;overflow:hidden;
background:
radial-gradient(70% 60% at 20% 20%,color-mix(in oklab,var(--vibeui-hero-010-accent) 70%,white),transparent 70%),
radial-gradient(80% 70% at 85% 90%,oklch(0.82 0.11 55),transparent 72%),
linear-gradient(160deg,light-dark(oklch(0.2 0 0),oklch(0.92 0 0)),light-dark(oklch(0.2 0 0),oklch(0.92 0 0)));
}
[data-vibeui-block="hero-010"] [data-part="cut"]{
position:absolute;inset:0;background:oklch(1 0 0 / 16%);
clip-path:polygon(0 62%,100% 30%,100% 100%,0 100%);
}
[data-vibeui-block="hero-010"] [data-part="ring"]{
position:absolute;left:50%;top:50%;width:min(60%,18rem);aspect-ratio:1;transform:translate(-50%,-50%);
border-radius:9999px;border:1px solid oklch(1 0 0 / 45%);overflow:hidden;
}
[data-vibeui-block="hero-010"] [data-part="ring"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
transition:transform .7s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="hero-010"] [data-part="ring"]:hover img{transform:scale(1.05)}
[data-vibeui-block="hero-010"] [data-part="ring"]::after{
content:"";position:absolute;inset:18%;border-radius:9999px;border:1px solid oklch(1 0 0 / 30%);
}
[data-vibeui-block="hero-010"] figcaption{
position:absolute;left:1rem;bottom:1rem;padding:0.375rem 0.625rem;border-radius:0.375rem;
background:oklch(0 0 0 / 40%);color:oklch(1 0 0);font-size:0.75rem;font-weight:600;
}
@container (min-width: 34rem){
[data-vibeui-block="hero-010"] [data-part="copy"]{padding:4rem 2rem}
[data-vibeui-block="hero-010"] figure{min-height:20rem}
}
@container (min-width: 56rem){
[data-vibeui-block="hero-010"] [data-part="shell"]{grid-template-columns:1fr 1fr;min-height:34rem}
[data-vibeui-block="hero-010"] [data-part="copy"]{padding:4.5rem clamp(2rem,5cqi,4.5rem);justify-self:end;max-width:44rem}
[data-vibeui-block="hero-010"] figure{min-height:100%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_BULLETS = [
  "Секция ставится одной командой агента",
  "Тексты и цвета — пропсы, вёрстка не трогается",
  "Работает без вашей темы и без Tailwind",
]

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

/** Hero пополам: текст в левой половине, изображение во всю высоту в правой. */
export function Hero010({
  eyebrow = "Дизайн-система без дизайнера",
  image = "",
  title = "Половина страницы — картинка, половина — суть",
  lede = "Классическая раскладка, в которой изображение прижато к краю экрана и работает на всю высоту секции.",
  primary = { label: "Взять секцию", href: "#" },
  secondary = { label: "Все раскладки", href: "#" },
  bullets = DEFAULT_BULLETS,
  imageCaption = "Место под ваш кадр",
  accent,
  background = "",
  tone = "auto",
  className,
  style,
}: Hero010Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hero-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-010" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-010"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="copy">
            <div data-part="inner">
              <Heading001
                data-part="heading"
                eyebrow={eyebrow}
                title={title}
                lede={lede}
                level="h1"
                size="lg"
                accent={accent}
              />
              {bullets.length > 0 ? (
                <ul>
                  {bullets.slice(0, 4).map((bullet) => (
                    <li key={bullet}>
                      <span data-part="tick" aria-hidden="true">
                        <svg viewBox="0 0 16 16" width="11" height="11">
                          <path
                            d="M3.5 8.5 6.5 11.5 12.5 4.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
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
          </div>

          <figure>
            <span data-part="cut" aria-hidden="true" />
            <span
              data-part="ring"
              data-empty={image ? undefined : "true"}
              aria-hidden="true"
            >
              {image ? (
                <img src={image} alt="" loading="lazy" decoding="async" />
              ) : null}
            </span>
            <figcaption>{imageCaption}</figcaption>
          </figure>
        </div>
      </section>
    </>
  )
}
