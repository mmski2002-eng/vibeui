import type { CSSProperties } from "react"

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
const STYLES = `
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
[data-vibeui-block="testimonials-010"] [data-part="figure"]{
margin:0;display:grid;gap:2rem;
}
[data-vibeui-block="testimonials-010"] [data-part="quote"]{
position:relative;margin:0;padding-top:2.5rem;
font-family:var(--vibeui-testimonials-010-serif);
font-size:clamp(1.75rem,6.5cqi,4.25rem);line-height:1.12;letter-spacing:-0.02em;font-weight:500;
text-wrap:balance;
}
[data-vibeui-block="testimonials-010"] [data-part="quote"]::before{
content:"\\201C";position:absolute;top:-0.05em;left:-0.04em;
color:var(--vibeui-testimonials-010-accent);
font-size:1.9em;line-height:1;pointer-events:none;
}
[data-vibeui-block="testimonials-010"] [data-part="quote"]::after{
content:"\\201D";margin-left:0.08em;
color:var(--vibeui-testimonials-010-accent);
}
[data-vibeui-block="testimonials-010"] [data-part="author"]{
display:flex;align-items:baseline;gap:0.625rem;flex-wrap:wrap;
}
[data-vibeui-block="testimonials-010"] [data-part="author"]::before{
content:"";align-self:center;
width:2.5rem;height:2px;border-radius:2px;
background:var(--vibeui-testimonials-010-accent);color:oklch(from var(--vibeui-testimonials-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="testimonials-010"] [data-part="name"]{font-size:1rem;font-weight:660}
[data-vibeui-block="testimonials-010"] [data-part="role"]{color:var(--vibeui-testimonials-010-muted);font-size:0.9375rem}
@container (min-width: 48rem){
[data-vibeui-block="testimonials-010"] [data-part="shell"]{padding:6.5rem 3rem}
[data-vibeui-block="testimonials-010"] [data-part="quote"]{padding-top:0;padding-left:1.1em}
[data-vibeui-block="testimonials-010"] [data-part="quote"]::before{left:-0.08em}
[data-vibeui-block="testimonials-010"] [data-part="author"]{padding-left:2.35em}
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
          <figure data-part="figure">
            <blockquote data-part="quote">{quote}</blockquote>
            <figcaption data-part="author">
              <span data-part="name">{name}</span>
              <span data-part="role">{role}</span>
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  )
}
