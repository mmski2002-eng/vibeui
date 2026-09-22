import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"
import { Button077 } from "@/registry/components/button/button-077/button-077"

export type Cta004Props = {
  kicker?: string
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  linkLabel?: string
  linkHref?: string
  stat?: string
  statCaption?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Призыв на сплошной цветной подложке. Плита такого размера обязана нести
// узор, иначе она читается как ошибка заливки: сетка нарисована двумя
// повторяющимися градиентами и погашена к краям через mask-image, поэтому
// текст остаётся на спокойном месте, а края плиты не выглядят обрезанными.
//
// Плита остаётся цветной в любой теме — в этом её смысл. Но на тёмной
// странице заливка уходит глубже, а кнопка перестаёт быть чисто белой,
// иначе блок бьёт по глазам ярче всего остального на экране.
const STYLES = `

:where([data-vibeui-block="cta-004"]){
--vibeui-cta-004-accent:light-dark(oklch(0.28 0 0),oklch(0.45 0 0));
--vibeui-cta-004-ink:light-dark(oklch(0.99 0 268),oklch(0.96 0 268));
--vibeui-cta-004-muted:light-dark(oklch(0.9 0 0),oklch(0.85 0 0));
--vibeui-cta-004-button:light-dark(oklch(1 0 0),oklch(0.93 0 268));
--vibeui-cta-004-button-fg:light-dark(oklch(0.22 0 0),oklch(0.24 0 0));
--vibeui-cta-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-cta-004-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-004"]{color-scheme:dark}
[data-vibeui-block="cta-004"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;position:relative;isolation:isolate;overflow:hidden;
background:linear-gradient(135deg,var(--vibeui-cta-004-accent),color-mix(in oklab,var(--vibeui-cta-004-accent) 62%,oklch(0.42 0 0)));
color:var(--vibeui-cta-004-ink);font-family:var(--vibeui-cta-004-font);
}
[data-vibeui-block="cta-004"] [data-part="grid"]{
position:absolute;inset:0;z-index:0;pointer-events:none;
background-image:repeating-linear-gradient(90deg,oklch(1 0 0 / 14%) 0 1px,transparent 1px 4rem),repeating-linear-gradient(0deg,oklch(1 0 0 / 14%) 0 1px,transparent 1px 4rem);
mask-image:radial-gradient(120% 100% at 100% 0,black,transparent 72%);
}
[data-vibeui-block="cta-004"] [data-part="shell"]{
position:relative;z-index:1;
display:grid;gap:2rem;
max-width:74rem;margin:0 auto;padding:3.25rem 1.25rem;
}
[data-vibeui-block="cta-004"] [data-part="kicker"]{
margin:0 0 0.75rem;color:var(--vibeui-cta-004-muted);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="cta-004"] [data-part="side"]{
display:flex;flex-direction:column;gap:1.25rem;align-items:flex-start;
}
[data-vibeui-block="cta-004"] [data-part="stat"]{
margin:0;padding:1rem 1.25rem;border-radius:1rem;
background:oklch(1 0 0 / 12%);border:1px solid oklch(1 0 0 / 22%);
backdrop-filter:blur(6px);
}
[data-vibeui-block="cta-004"] [data-part="stat"] strong{
display:block;font-size:2rem;line-height:1;letter-spacing:-0.03em;font-weight:750;
}
[data-vibeui-block="cta-004"] [data-part="stat"] span{
display:block;margin-top:0.375rem;color:var(--vibeui-cta-004-muted);font-size:0.8125rem;line-height:1.4;max-width:22ch;
}
[data-vibeui-block="cta-004"] [data-part="actions"]{display:flex;flex-wrap:wrap;align-items:center;gap:1rem}
@container (min-width: 46rem){
[data-vibeui-block="cta-004"] [data-part="shell"]{grid-template-columns:1.35fr 1fr;align-items:center;gap:3.5rem;padding:5rem 2.5rem}
[data-vibeui-block="cta-004"] [data-part="side"]{align-items:flex-end;text-align:right}
[data-vibeui-block="cta-004"] [data-part="stat"] span{margin-left:auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-004"] *{animation:none!important;transition:none!important}}
`

/** Призыв на цветной плите: узор из градиентов, крупная цифра и одна кнопка. */
export function Cta004({
  kicker = "Переезд за один спринт",
  title = "Перенесите сайт на новый движок без остановки продаж",
  description = "Мы забираем вёрстку, контент и редиректы, а вы продолжаете работать. Переключение происходит ночью, откат готов на каждом шаге.",
  actionLabel = "Обсудить переезд",
  actionHref = "#call",
  linkLabel = "Как это устроено",
  linkHref = "#process",
  stat = "11 дней",
  statCaption = "средний срок переезда магазина на 3 000 товаров",
  accent,
  className,
  style,
}: Cta004Props) {
  const palette = {
    ...(accent ? { "--vibeui-cta-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cta-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="cta-004"
        className={className}
        style={palette}
      >
        <div data-part="grid" aria-hidden="true" />
        <div data-part="shell">
          <div data-part="main">
            <p data-part="kicker">{kicker}</p>
            <Heading001
              data-part="heading"
              title={title}
              lede={description}
              size="lg"
              ledeWidth={48}
              accent={accent}
            />
          </div>
          <div data-part="side">
            <p data-part="stat">
              <strong>{stat}</strong>
              <span>{statCaption}</span>
            </p>
            <div data-part="actions">
              <Button016
                data-part="action"
                label={actionLabel}
                href={actionHref}
                external={false}
                size="lg"
                tone="accent"
                accent={accent}
              />
              <Button077
                data-part="link"
                label={linkLabel}
                href={linkHref}
                accent={accent}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
