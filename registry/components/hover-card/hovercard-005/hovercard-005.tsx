import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Hovercard005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Сокращение, набранное в тексте. */
  term?: string
  /** Полная расшифровка сокращения. */
  full?: string
  definition?: string
  category?: string
  /** Смежные термины: подсказка ведёт к соседним статьям словаря. */
  related?: string[]
  /** Текст строки до сокращения. */
  leadText?: string
  /** Текст строки после сокращения. */
  tailText?: string
  /** Подпись перед списком смежных терминов. */
  relatedLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: словарная статья у сокращения в тексте. От подсказки она
// отличается структурой: расшифровка, раздел, определение и смежные термины —
// это карточка справочника, а не короткая реплика.
//
// Тема берётся из color-scheme окружения через light-dark(): собственной
// тёмной темы у компонента нет, он следует за страницей.
const STYLES = `
:where([data-vibeui-block="hovercard-005"]){
--vibeui-hovercard-005-bg:transparent;
--vibeui-hovercard-005-card:light-dark(oklch(0.995 0.004 90),oklch(0.26 0.012 70));
--vibeui-hovercard-005-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 90));
--vibeui-hovercard-005-muted:light-dark(oklch(0.52 0.014 265),oklch(0.73 0.012 90));
--vibeui-hovercard-005-border:light-dark(oklch(0.89 0.01 90),oklch(0.37 0.014 70));
--vibeui-hovercard-005-accent:light-dark(oklch(0.48 0.13 45),oklch(0.79 0.13 55));
--vibeui-hovercard-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="hovercard-005"]{
width:100%;max-width:28rem;box-sizing:border-box;
padding:1rem 1.125rem;
border:1px solid var(--vibeui-hovercard-005-border);border-radius:0.875rem;
background:var(--vibeui-hovercard-005-bg);
font-family:var(--vibeui-hovercard-005-font);color:var(--vibeui-hovercard-005-fg);
}
[data-vibeui-block="hovercard-005"] [data-part="line"]{margin:0;font-size:0.875rem;line-height:1.7}
/* Статья цепляется к сокращению в строке, а не к абзацу целиком. */
[data-vibeui-block="hovercard-005"] [data-part="host"]{position:relative;display:inline-block}
/* Сокращение в тексте: пунктир снизу и курсор help, ссылки здесь нет. */
[data-vibeui-block="hovercard-005"] [data-part="term"]{
cursor:help;font-weight:650;color:var(--vibeui-hovercard-005-accent);
text-decoration:underline dotted currentColor;text-underline-offset:0.22em;
border-radius:0.1875rem;
}
[data-vibeui-block="hovercard-005"] [data-part="term"]:focus-visible{outline:2px solid var(--vibeui-hovercard-005-accent);outline-offset:2px}
[data-vibeui-block="hovercard-005"] [data-part="card"]{
position:absolute;left:0;top:calc(100% + 0.5rem);z-index:20;
display:flex;flex-direction:column;gap:0.375rem;
width:19rem;box-sizing:border-box;padding:0.875rem;
border:1px solid var(--vibeui-hovercard-005-border);
border-left:3px solid var(--vibeui-hovercard-005-accent);
border-radius:0.75rem;
background:var(--vibeui-hovercard-005-card);
box-shadow:0 22px 46px -28px oklch(0.25 0.03 60 / 55%);
opacity:0;visibility:hidden;translate:0 -0.25rem;
transition:opacity .15s ease,translate .15s ease,visibility .15s;
}
[data-vibeui-block="hovercard-005"] [data-part="host"]:hover [data-part="card"],
[data-vibeui-block="hovercard-005"] [data-part="host"]:focus-within [data-part="card"]{opacity:1;visibility:visible;translate:0 0}
[data-vibeui-block="hovercard-005"] [data-part="head"]{display:flex;align-items:baseline;gap:0.5rem;flex-wrap:wrap}
[data-vibeui-block="hovercard-005"] [data-part="full"]{font-size:0.875rem;font-weight:680;line-height:1.3}
[data-vibeui-block="hovercard-005"] [data-part="category"]{
flex:none;padding:0.0625rem 0.4375rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-hovercard-005-accent) 12%,transparent);
color:var(--vibeui-hovercard-005-accent);
font-size:0.625rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="hovercard-005"] [data-part="definition"]{display:block;margin:0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-hovercard-005-muted)}
[data-vibeui-block="hovercard-005"] [data-part="related"]{
display:flex;align-items:baseline;gap:0.375rem;flex-wrap:wrap;
padding-top:0.375rem;border-top:1px dashed var(--vibeui-hovercard-005-border);
font-size:0.75rem;color:var(--vibeui-hovercard-005-muted);
}
[data-vibeui-block="hovercard-005"] [data-part="related"] b{color:var(--vibeui-hovercard-005-fg);font-weight:640}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hovercard-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_RELATED = ["TTFB", "кеш на краю", "прогрев"]

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

/**
 * Карточка термина глоссария: расшифровка, раздел, определение и смежные слова.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Hovercard005({
  term = "CDN",
  full = "Content Delivery Network",
  definition = "Сеть серверов, раздающих статические файлы из точки, ближайшей к посетителю. Сокращает задержку и снимает нагрузку с основного сервера.",
  category = "инфраструктура",
  related = DEFAULT_RELATED,
  leadText = "Статику мы раздаём через ",
  tailText = ", поэтому первая загрузка идёт из ближайшего города.",
  relatedLabel = "см. также: ",
  accent,
  background = "",
  className,
  style,
  ...props
}: Hovercard005Props) {
  const palette = {
    ...(accent ? { "--vibeui-hovercard-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hovercard-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hovercard-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="hovercard-005"
        className={className}
        style={palette}
      >
        <p data-part="line">
          {leadText}
          <span data-part="host">
            <span
              data-part="term"
              tabIndex={0}
              aria-describedby="vibeui-hovercard-005-card"
            >
              {term}
            </span>
            <span
              data-part="card"
              id="vibeui-hovercard-005-card"
              role="tooltip"
            >
              <span data-part="head">
                <span data-part="full">{full}</span>
                {category ? <span data-part="category">{category}</span> : null}
              </span>
              <span data-part="definition">{definition}</span>
              {related.length > 0 ? (
                <span data-part="related">
                  {relatedLabel}
                  <b>{related.join(", ")}</b>
                </span>
              ) : null}
            </span>
          </span>
          {tailText}
        </p>
      </div>
    </>
  )
}
