"use client"

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Hero011Props = {
  kicker?: string
  title?: string
  titleAccent?: string
  lede?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  meta?: string[]
  accent?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  className?: string
  style?: CSSProperties
}

// Идея блока: фон и есть дизайн. Сетка нарисована двумя repeating-linear-
// gradient и погашена radial-маской к краям — линии не упираются в границу
// секции, а растворяются. Поверх — два цветных пятна на разных углах.
// Всё это фон одного элемента: ни одного лишнего слоя в разметке, ничего
// не перехватывает клики, и картинка не участвует в потоке.
const STYLES = `
:where([data-vibeui-block="hero-011"]){
--vibeui-hero-011-bg:transparent;
--vibeui-hero-011-fg:light-dark(oklch(0.19 0 275),oklch(0.98 0 275));
--vibeui-hero-011-muted:light-dark(oklch(0.5 0 275),oklch(0.72 0 275));
--vibeui-hero-011-line:light-dark(oklch(0.19 0 275 / 9%),oklch(1 0 0 / 8%));
--vibeui-hero-011-edge:light-dark(oklch(0.19 0 275 / 18%),oklch(1 0 0 / 18%));
--vibeui-hero-011-veil:light-dark(oklch(0.19 0 275 / 4%),oklch(1 0 0 / 5%));
--vibeui-hero-011-accent:light-dark(oklch(0.2 0 0),oklch(0.92 0 0));
--vibeui-hero-011-accent-fg:oklch(from var(--vibeui-hero-011-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-011-cool:light-dark(oklch(0.287 0 0),oklch(0.885 0 0));
--vibeui-hero-011-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-hero-011-dur-2:180ms;
--vibeui-hero-011-dur-3:240ms;
--vibeui-hero-011-dur-5:460ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-011"]{color-scheme:dark}
:where([data-vibeui-block="hero-011"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-011"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-011"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;position:relative;isolation:isolate;overflow:hidden;
background:var(--vibeui-hero-011-bg);color:var(--vibeui-hero-011-fg);font-family:var(--vibeui-hero-011-sans);
}
[data-vibeui-block="hero-011"] *{box-sizing:border-box}
[data-vibeui-block="hero-011"]::before{
content:"";position:absolute;inset:0;z-index:-2;pointer-events:none;
background:
repeating-linear-gradient(to right,var(--vibeui-hero-011-line) 0 1px,transparent 1px 4rem),
repeating-linear-gradient(to bottom,var(--vibeui-hero-011-line) 0 1px,transparent 1px 4rem);
-webkit-mask-image:radial-gradient(120% 90% at 50% 0%,black,transparent 72%);
mask-image:radial-gradient(120% 90% at 50% 0%,black,transparent 72%);
}
[data-vibeui-block="hero-011"]::after{
content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;
background:
radial-gradient(45% 45% at 22% 8%,color-mix(in oklab,var(--vibeui-hero-011-accent) 34%,transparent),transparent 70%),
radial-gradient(50% 50% at 84% 26%,color-mix(in oklab,var(--vibeui-hero-011-cool) 40%,transparent),transparent 72%);
}
/* Третий слой света идёт за курсором: фон перестаёт быть картинкой и
   реагирует на присутствие. Без указателя слой просто не появляется. */
[data-vibeui-block="hero-011"] [data-part="spot"]{
position:absolute;inset:0;z-index:-1;pointer-events:none;opacity:0;
background:radial-gradient(28% 34% at var(--vibeui-hero-011-mx,50%) var(--vibeui-hero-011-my,30%),
color-mix(in oklab,var(--vibeui-hero-011-accent) 30%,transparent),transparent 70%);
transition:opacity var(--vibeui-hero-011-dur-5) ease;
}
[data-vibeui-block="hero-011"]:hover [data-part="spot"]{opacity:1}
[data-vibeui-block="hero-011"] [data-part="shell"]{
position:relative;max-width:54rem;width:100%;margin:0 auto;padding:4rem 1.25rem;text-align:center;
}
[data-vibeui-block="hero-011"] [data-part="kicker"]{
display:inline-block;margin:0 0 1.25rem;padding:0.3125rem 0.75rem;border-radius:9999px;
border:1px solid var(--vibeui-hero-011-edge);background:var(--vibeui-hero-011-veil);
font-size:0.75rem;font-weight:600;color:var(--vibeui-hero-011-muted);
}
[data-vibeui-block="hero-011"] [data-part="actions"]{display:flex;flex-direction:column;gap:0.625rem;margin:2rem auto 0;max-width:20rem}
[data-vibeui-block="hero-011"] [data-part="meta"]{
list-style:none;display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem 1.5rem;margin:2rem 0 0;padding:0;
font-size:0.75rem;color:var(--vibeui-hero-011-muted);
}
[data-vibeui-block="hero-011"] [data-part="meta"] li{display:flex;align-items:center;gap:0.4375rem}
[data-vibeui-block="hero-011"] [data-part="dot"]{width:0.3125rem;height:0.3125rem;border-radius:9999px;background:var(--vibeui-hero-011-accent);color:oklch(from var(--vibeui-hero-011-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
@container (min-width: 34rem){
[data-vibeui-block="hero-011"] [data-part="actions"]{flex-direction:row;justify-content:center;max-width:none}
[data-vibeui-block="hero-011"] [data-part="shell"]{padding:6.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="hero-011"] [data-part="spot"]{display:none}[data-vibeui-block="hero-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_META = [
  "Ноль зависимостей",
  "Своя палитра",
  "Container queries",
  "Reduced motion",
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

/** Hero на фоновом градиенте и сетке: линии гасятся маской, поверх — два цветных пятна. */
export function Hero011({
  kicker = "Версия 2.0 уже в каталоге",
  title = "Фон, который делает",
  titleAccent = "половину работы",
  lede = "Сетка и свечение нарисованы градиентами на самой секции — ни картинок, ни лишних слоёв в разметке.",
  primary = { label: "Забрать секцию", href: "#" },
  secondary = { label: "Читать документацию", href: "#" },
  meta = DEFAULT_META,
  accent,
  background = "",
  tone = "auto",
  className,
  style,
}: Hero011Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hero-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const trackPointer = (event: ReactPointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    event.currentTarget.style.setProperty("--vibeui-hero-011-mx", `${x}%`)
    event.currentTarget.style.setProperty("--vibeui-hero-011-my", `${y}%`)
  }

  return (
    <>
      <style href="vibeui-hero-011" precedence="medium">
        {STYLES}
      </style>
      <section
        onPointerMove={trackPointer}
        data-vibeui-block="hero-011"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="spot" aria-hidden="true" />
        <div data-part="shell">
          {kicker ? <p data-part="kicker">{kicker}</p> : null}
          <Heading001
            data-part="heading"
            title={title}
            titleAccent={titleAccent}
            lede={lede}
            level="h1"
            size="xl"
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
          {meta.length > 0 ? (
            <ul data-part="meta">
              {meta.slice(0, 4).map((item) => (
                <li key={item}>
                  <span data-part="dot" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </>
  )
}
