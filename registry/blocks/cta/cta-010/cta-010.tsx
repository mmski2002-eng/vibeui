import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Cta010Props = {
  eyebrow?: string
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  note?: string
  items?: string[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Призыв с чек-листом: слева обещание и кнопка, справа четыре галочки
// выгод. Галочка нарисована CSS-уголком, а не иконкой из библиотеки —
// блок обязан оставаться одним файлом без зависимостей и переживать смену
// акцента вместе с остальной палитрой.
const STYLES = `[data-vibeui-block="cta-010"] [data-part="heading"]{margin-bottom:1.75rem}

:where([data-vibeui-block="cta-010"]){
--vibeui-cta-010-bg:transparent;
--vibeui-cta-010-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-cta-010-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-cta-010-border:light-dark(oklch(0.88 0 0),oklch(0.34 0 0));
--vibeui-cta-010-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-cta-010-button:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-cta-010-button-ink:oklch(from var(--vibeui-cta-010-button) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-010-tint:color-mix(in oklab,var(--vibeui-cta-010-accent) 12%,transparent);
--vibeui-cta-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-cta-010-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-010"]{color-scheme:dark}
[data-vibeui-block="cta-010"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-cta-010-bg);color:var(--vibeui-cta-010-ink);
font-family:var(--vibeui-cta-010-font);
}
[data-vibeui-block="cta-010"] [data-part="shell"]{
max-width:70rem;margin:0 auto;padding:3rem 1.25rem;
display:grid;gap:2.25rem;align-items:center;
}
[data-vibeui-block="cta-010"] [data-part="note"]{
margin:0.875rem 0 0;color:var(--vibeui-cta-010-muted);font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="cta-010"] [data-part="list"]{
list-style:none;margin:0;padding:0;display:grid;gap:0.875rem;
}
[data-vibeui-block="cta-010"] [data-part="item"]{
display:flex;align-items:flex-start;gap:0.75rem;
font-size:0.9375rem;line-height:1.5;
}
[data-vibeui-block="cta-010"] [data-part="check"]{
flex:none;width:1.5rem;height:1.5rem;margin-top:0.0625rem;border-radius:999px;
background:var(--vibeui-cta-010-tint);position:relative;
}
[data-vibeui-block="cta-010"] [data-part="check"]::before{
content:"";position:absolute;left:0.4375rem;top:0.3125rem;
width:0.5rem;height:0.6875rem;
border-right:2px solid var(--vibeui-cta-010-accent);
border-bottom:2px solid var(--vibeui-cta-010-accent);
transform:rotate(42deg);
}
@container (min-width: 46rem){
[data-vibeui-block="cta-010"] [data-part="shell"]{
grid-template-columns:1.2fr 1fr;padding:4.5rem 2rem;gap:3.5rem;
}
[data-vibeui-block="cta-010"] [data-part="list"]{gap:1.125rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-010"] *{animation:none!important;transition:none!important}}
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

const DEFAULT_ITEMS = [
  "Готовые секции вместо вёрстки с нуля",
  "Один файл на блок — без цепочки зависимостей",
  "Инструкция для AI-агента у каждого компонента",
  "Светлая и тёмная тема из коробки",
]

/** Призыв в две колонки: обещание с кнопкой слева, чек-лист выгод справа. */
export function Cta010({
  eyebrow = "Что внутри",
  title = "Всё, что нужно для первой страницы",
  description = "Не набор кнопок, а готовые секции: герой, цены, отзывы, призыв. Скопируйте команду установки — остальное сделает ваш AI-агент.",
  actionLabel = "Начать бесплатно",
  actionHref = "#start",
  note = "Без карты и без звонка с менеджером.",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Cta010Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-cta-010-accent": accent,
          "--vibeui-cta-010-button": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-cta-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cta-010" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="cta-010"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="copy">
            <Heading001
              data-part="heading"
              eyebrow={eyebrow}
              title={title}
              lede={description}
              ledeWidth={48}
              accent={accent}
            />
            <Button016
              data-part="action"
              label={actionLabel}
              href={actionHref}
              external={false}
              size="lg"
              tone="accent"
              accent={accent}
            />
            <p data-part="note">{note}</p>
          </div>
          <ul data-part="list">
            {items.map((item) => (
              <li key={item} data-part="item">
                <span data-part="check" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
