import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Hero004Props = {
  eyebrow?: string
  title?: string
  lede?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  note?: string
  accent?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  className?: string
  style?: CSSProperties
}

// Идея блока: самый спокойный вариант hero — только слова. Ни мокапа, ни
// картинки, ни свечения: воздух, волосяные линии сверху и снизу и одна пара
// кнопок по центру. Раскладка считается от собственной ширины блока, поэтому
// в узкой карточке каталога кнопки встают столбиком, а не расползаются.
const STYLES = `
:where([data-vibeui-block="hero-004"]){
--vibeui-hero-004-bg:transparent;
--vibeui-hero-004-fg:light-dark(oklch(0.21 0.012 95),oklch(0.95 0.006 95));
--vibeui-hero-004-muted:light-dark(oklch(0.52 0.012 95),oklch(0.73 0.01 95));
--vibeui-hero-004-line:light-dark(oklch(0.89 0.008 95),oklch(0.37 0.01 95));
--vibeui-hero-004-accent:light-dark(oklch(0.2 0 0),oklch(0.92 0 0));
--vibeui-hero-004-accent-fg:oklch(from var(--vibeui-hero-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-004-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-hero-004-dur-2:180ms;
--vibeui-hero-004-dur-3:240ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-004"]{color-scheme:dark}
:where([data-vibeui-block="hero-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-004"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-004"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-hero-004-bg);color:var(--vibeui-hero-004-fg);
font-family:var(--vibeui-hero-004-sans);
}
[data-vibeui-block="hero-004"] *{box-sizing:border-box}
[data-vibeui-block="hero-004"] [data-part="shell"]{
max-width:56rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem;text-align:center;
}
[data-vibeui-block="hero-004"] [data-part="rule"]{height:1px;background:var(--vibeui-hero-004-line);margin:0 auto 2.25rem;width:100%;max-width:4rem}
[data-vibeui-block="hero-004"] [data-part="actions"]{
display:flex;flex-direction:column;align-items:stretch;gap:0.625rem;margin:2rem auto 0;max-width:22rem;
}
[data-vibeui-block="hero-004"] [data-part="note"]{
margin:1.25rem 0 0;font-size:0.8125rem;color:var(--vibeui-hero-004-muted);
}
[data-vibeui-block="hero-004"] [data-part="foot"]{height:1px;background:var(--vibeui-hero-004-line);margin:2.5rem auto 0;width:100%;max-width:4rem}
@container (min-width: 34rem){
[data-vibeui-block="hero-004"] [data-part="actions"]{flex-direction:row;justify-content:center;max-width:none}
[data-vibeui-block="hero-004"] [data-part="shell"]{padding:5rem 2rem}
}
@container (min-width: 56rem){
[data-vibeui-block="hero-004"] [data-part="shell"]{padding:7rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-004"] *{animation:none!important;transition:none!important}}
`

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

/** Спокойный текстовый hero: заголовок, подзаголовок и пара кнопок по центру. */
export function Hero004({
  eyebrow = "Запуск открыт",
  title = "Соберите лендинг за вечер, а не за спринт",
  lede = "Готовые секции, которые понимает ваш ИИ-агент. Выбираете дизайн, отдаёте инструкцию — получаете страницу, а не заготовку.",
  primary = { label: "Начать бесплатно", href: "#" },
  secondary = { label: "Смотреть каталог", href: "#" },
  note = "Без карты. Первые десять секций — навсегда бесплатно.",
  accent,
  background = "",
  tone = "auto",
  className,
  style,
}: Hero004Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hero-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-004"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="rule" aria-hidden="true" />
          <Heading001
            data-part="heading"
            eyebrow={eyebrow}
            title={title}
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
          {note ? <p data-part="note">{note}</p> : null}
          <div data-part="foot" aria-hidden="true" />
        </div>
      </section>
    </>
  )
}
