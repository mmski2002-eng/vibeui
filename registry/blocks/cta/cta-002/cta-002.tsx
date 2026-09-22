import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Cta002Props = {
  eyebrow?: string
  title?: string
  description?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  proof?: string[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Центрированный призыв на две равные кнопки. Так делают, когда у продукта
// два честных входа: «купить» и «сначала посмотреть». Чтобы пара не выглядела
// нерешительностью, вторая кнопка — контурная, а под ними идёт строка коротких
// подтверждений вместо ещё одного абзаца.
//
// Тема приходит из color-scheme окружения через light-dark(): подложки у
// секции по умолчанию нет, карточка темнеет вместе со страницей.
const STYLES = `

:where([data-vibeui-block="cta-002"]){
--vibeui-cta-002-bg:transparent;
--vibeui-cta-002-card:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-cta-002-ink:light-dark(oklch(0.21 0 250),oklch(0.95 0 250));
--vibeui-cta-002-muted:light-dark(oklch(0.5 0 250),oklch(0.72 0 250));
--vibeui-cta-002-border:light-dark(oklch(0.9 0 250),oklch(0.35 0 250));
--vibeui-cta-002-accent:light-dark(oklch(0.28 0 0),oklch(0.899 0 0));
--vibeui-cta-002-accent-fg:oklch(from var(--vibeui-cta-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-cta-002-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-002"]{color-scheme:dark}
[data-vibeui-block="cta-002"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-cta-002-bg);color:var(--vibeui-cta-002-ink);
font-family:var(--vibeui-cta-002-font);
}
[data-vibeui-block="cta-002"] [data-part="shell"]{
max-width:64rem;margin:0 auto;padding:3rem 1.25rem;text-align:center;
}
[data-vibeui-block="cta-002"] [data-part="card"]{
padding:2.25rem 1.5rem;border:1px solid var(--vibeui-cta-002-border);border-radius:1.5rem;
background:var(--vibeui-cta-002-card);
background-image:radial-gradient(60% 90% at 50% -10%,color-mix(in oklab,var(--vibeui-cta-002-accent) 12%,transparent),transparent 70%);
}
[data-vibeui-block="cta-002"] [data-part="actions"]{
display:flex;flex-direction:column;gap:0.625rem;margin-top:1.75rem;
}
[data-vibeui-block="cta-002"] [data-part="proof"]{
display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem 1.25rem;
margin:1.5rem 0 0;padding:0;list-style:none;
color:var(--vibeui-cta-002-muted);font-size:0.8125rem;
}
[data-vibeui-block="cta-002"] [data-part="proof"] li{display:inline-flex;align-items:center;gap:0.4375rem}
[data-vibeui-block="cta-002"] [data-part="proof"] li::before{
content:"";width:0.375rem;height:0.375rem;border-radius:999px;flex:none;
background:var(--vibeui-cta-002-accent);color:oklch(from var(--vibeui-cta-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
@container (min-width: 40rem){
[data-vibeui-block="cta-002"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="cta-002"] [data-part="card"]{padding:3.5rem 3rem}
[data-vibeui-block="cta-002"] [data-part="actions"]{flex-direction:row;justify-content:center;gap:0.875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PROOF = [
  "Первый макет за вечер",
  "Отмена в один клик",
  "Поддержка отвечает за час",
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

/** Центрированный призыв с двумя равными кнопками и строкой подтверждений. */
export function Cta002({
  eyebrow = "Готовы начать",
  title = "Соберите первую страницу до конца недели",
  description = "Возьмите готовые секции, соберите из них страницу и отдайте её команде — без брифов на три недели и без вёрстки с нуля.",
  primaryLabel = "Начать бесплатно",
  primaryHref = "#start",
  secondaryLabel = "Посмотреть примеры",
  secondaryHref = "#examples",
  proof = DEFAULT_PROOF,
  background = "",
  accent,
  className,
  style,
}: Cta002Props) {
  const palette = {
    ...(accent ? { "--vibeui-cta-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cta-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cta-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="cta-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="card">
            <Heading001
              data-part="heading"
              eyebrow={eyebrow}
              title={title}
              lede={description}
              size="lg"
              align="center"
              ledeWidth={52}
              accent={accent}
            />
            <div data-part="actions">
              <Button016
                data-part="primary"
                label={primaryLabel}
                href={primaryHref}
                external={false}
                size="lg"
                tone="accent"
                accent={accent}
              />
              <Button016
                data-part="secondary"
                label={secondaryLabel}
                href={secondaryHref}
                external={false}
                size="lg"
                tone="neutral"
                accent={accent}
              />
            </div>
            <ul data-part="proof">
              {proof.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
