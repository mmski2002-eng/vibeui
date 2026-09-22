import type { CSSProperties } from "react"
import { Card041 } from "@/registry/components/card/card-041/card-041"

type Testimonials003Metric = {
  value: string
  caption: string
}

export type Testimonials003Props = {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  avatarImage?: string
  quote?: string
  name?: string
  role?: string
  company?: string
  /** Инициалы в кружке. По умолчанию считаются из name. */
  initials?: string
  metrics?: Testimonials003Metric[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Одна крупная цитата вместо стены карточек. Приём работает, когда есть
// действительно сильный отзыв: его набирают засечным шрифтом, дают ему всю
// ширину и подпирают проверяемыми цифрами. Кавычка нарисована фоновым
// знаком и намеренно обрезана сверху — она подложка, а не украшение.
const STYLES = `
:where([data-vibeui-block="testimonials-003"]){
--vibeui-testimonials-003-bg:transparent;
--vibeui-testimonials-003-ink:light-dark(oklch(0.2 0.02 70),oklch(0.95 0.008 80));
--vibeui-testimonials-003-muted:light-dark(oklch(0.47 0.02 70),oklch(0.73 0.014 80));
--vibeui-testimonials-003-border:light-dark(oklch(0.87 0.016 80),oklch(0.36 0.018 75));
--vibeui-testimonials-003-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-testimonials-003-on-accent:oklch(from var(--vibeui-testimonials-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-testimonials-003-serif:ui-serif,Georgia,"Times New Roman",serif;
--vibeui-testimonials-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-003"]{color-scheme:dark}
[data-vibeui-block="testimonials-003"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;position:relative;overflow:hidden;
background:var(--vibeui-testimonials-003-bg);color:var(--vibeui-testimonials-003-ink);
font-family:var(--vibeui-testimonials-003-font);
}
[data-vibeui-block="testimonials-003"] [data-part="shell"]{
position:relative;z-index:1;
max-width:60rem;margin:0 auto;padding:3.25rem 1.25rem;
}
[data-vibeui-block="testimonials-003"] [data-part="glyph"]{
position:absolute;left:0.5rem;top:-1.5rem;z-index:0;
color:color-mix(in oklab,var(--vibeui-testimonials-003-accent) 16%,transparent);
font-family:var(--vibeui-testimonials-003-serif);
font-size:16rem;line-height:1;pointer-events:none;user-select:none;
}
[data-vibeui-block="testimonials-003"] [data-part="figure"]{margin:0}
[data-vibeui-block="testimonials-003"] [data-part="quote"]{
margin:0;
font-family:var(--vibeui-testimonials-003-serif);
font-size:clamp(1.375rem,4.4cqi,2.25rem);line-height:1.28;letter-spacing:-0.015em;font-weight:500;
text-wrap:balance;
}
[data-vibeui-block="testimonials-003"] [data-part="author"]{
display:flex;align-items:center;gap:0.875rem;margin-top:2rem;
}
[data-vibeui-block="testimonials-003"] [data-part="avatar"]{
position:relative;width:3rem;height:3rem;flex:none;border-radius:999px;
display:grid;place-items:center;color:var(--vibeui-testimonials-003-on-accent);
font-size:0.9375rem;font-weight:700;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="testimonials-003"] [data-part="avatar"][data-empty="true"]{background:var(--vibeui-testimonials-003-accent);color:oklch(from var(--vibeui-testimonials-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="testimonials-003"] [data-part="avatar"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;
}
[data-vibeui-block="testimonials-003"] [data-part="name"]{display:block;font-size:1rem;font-weight:660}
[data-vibeui-block="testimonials-003"] [data-part="role"]{display:block;color:var(--vibeui-testimonials-003-muted);font-size:0.875rem;line-height:1.4}
[data-vibeui-block="testimonials-003"] [data-part="company"]{
margin-left:auto;padding-left:1rem;border-left:1px solid var(--vibeui-testimonials-003-border);
color:var(--vibeui-testimonials-003-muted);
font-size:0.8125rem;font-weight:640;letter-spacing:0.08em;text-transform:uppercase;
}
[data-vibeui-block="testimonials-003"] [data-part="metrics"]{
display:grid;gap:1.25rem;margin:2.25rem 0 0;padding:1.5rem 0 0;
border-top:1px solid var(--vibeui-testimonials-003-border);
}
@container (min-width: 40rem){
[data-vibeui-block="testimonials-003"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="testimonials-003"] [data-part="metrics"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_METRICS: Testimonials003Metric[] = [
  { value: "4 дня", caption: "вместо трёх недель на выпуск посадочной" },
  { value: "−62 %", caption: "времени дизайнера на типовые экраны" },
  { value: "17", caption: "страниц собрано за первый квартал" },
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

/** Инициалы: первые буквы двух первых слов имени. */
function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}

/** Одна крупная цитата: засечный набор, автор и три проверяемые цифры. */
export function Testimonials003({
  quote = "Мы перестали спорить о том, как должна выглядеть очередная страница. Спорим теперь о том, что на ней написано, — и это единственный спор, который приносит деньги.",
  avatarImage = "",
  name = "Елена Ремизова",
  role = "Директор по продукту",
  company = "Артель",
  initials = initialsOf(name),
  metrics = DEFAULT_METRICS,
  background = "",
  accent,
  className,
  style,
}: Testimonials003Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-testimonials-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-testimonials-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="testimonials-003"
        className={className}
        style={palette}
      >
        <span data-part="glyph" aria-hidden="true">
          “
        </span>
        <div data-part="shell">
          <figure data-part="figure">
            <blockquote data-part="quote">{quote}</blockquote>
            <figcaption data-part="author">
              <span
                data-part="avatar"
                data-empty={avatarImage ? undefined : "true"}
                aria-hidden="true"
              >
                {avatarImage ? (
                  <img
                    src={avatarImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                {initials}
              </span>
              <span>
                <span data-part="name">{name}</span>
                <span data-part="role">{role}</span>
              </span>
              <span data-part="company">{company}</span>
            </figcaption>
          </figure>
          <dl data-part="metrics">
            {metrics.map((metric) => (
              <Card041 key={metric.caption} data-part="metric" caption={metric.caption} value={metric.value} accent={accent} />
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
