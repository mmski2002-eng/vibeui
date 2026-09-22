import type { CSSProperties } from "react"
import { Card107 } from "@/registry/components/card/card-107/card-107"

export type Testimonials010Props = {
  quote?: string
  name?: string
  role?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Одна цитата на весь экран. Гигантская типографика — это заявление:
// у нас есть отзыв, который стоит целой секции. Оранжевая кавычка задаёт
// масштаб и маркирует жанр раньше, чем прочитано первое слово. Второй
// такой блок на странице отменяет эффект первого.
const STYLES = `[data-vibeui-block="testimonials-010"] [data-part="figure"]{margin:0}

:where([data-vibeui-block="testimonials-010"]){
--vibeui-testimonials-010-bg:transparent;
--vibeui-testimonials-010-ink:light-dark(oklch(0.17 0 0),oklch(0.96 0 0));
--vibeui-testimonials-010-muted:light-dark(oklch(0.48 0 0),oklch(0.71 0 0));
--vibeui-testimonials-010-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-testimonials-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-testimonials-010-serif:Georgia,"Times New Roman",Times,serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-010"]{color-scheme:dark}
[data-vibeui-block="testimonials-010"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-testimonials-010-bg);color:var(--vibeui-testimonials-010-ink);
font-family:var(--vibeui-testimonials-010-font);
}
[data-vibeui-block="testimonials-010"] [data-part="shell"]{
max-width:64rem;margin:0 auto;padding:4rem 1.25rem;
}
@container (min-width: 48rem){
[data-vibeui-block="testimonials-010"] [data-part="shell"]{padding:6.5rem 3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-010"] *{animation:none!important;transition:none!important}}
`

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

/** Одна гигантская цитата с оранжевыми кавычками и автором внизу. */
export function Testimonials010({
  quote = "Мы перестали спорить о вёрстке. Дизайнер выбирает блок, агент ставит ровно его — и на страницу попадает то, что было в превью.",
  name = "Анна Ковалёва",
  role = "Арт-директор, студия «Полёт»",
  background = "",
  accent,
  className,
  style,
}: Testimonials010Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-testimonials-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-testimonials-010" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="testimonials-010"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Card107 data-part="figure" quote={quote} name={name} role={role} accent={accent} />
        </div>
      </section>
    </>
  )
}
