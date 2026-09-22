import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Cta009Props = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  /** Пусто — фирменная оранжевая плита. Передайте цвет, чтобы перекрасить. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Оранжевая полоса во всю ширину: чёрная типографика на фирменном light-dark(#1a1a1a,#f2f2f2)
// и одна белая кнопка. Собственный фон — осознанное исключение из правила
// «прозрачной подложки»: контраст полосы с остальной страницей и есть
// дизайн блока. Текст фиксированно тёмный в обеих темах: полоса не темнеет
// вместе со страницей, иначе она перестаёт быть полосой.
const STYLES = `[data-vibeui-block="cta-009"] [data-part="action"]{justify-self:start}

:where([data-vibeui-block="cta-009"]){
--vibeui-cta-009-bg:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-cta-009-ink:oklch(0.15 0 0);
--vibeui-cta-009-muted:oklch(0.15 0 0 / 78%);
--vibeui-cta-009-button:oklch(1 0 0);
--vibeui-cta-009-button-ink:oklch(from var(--vibeui-cta-009-button) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-cta-009-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-009"]{color-scheme:dark}
[data-vibeui-block="cta-009"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-cta-009-bg);color:var(--vibeui-cta-009-ink);
font-family:var(--vibeui-cta-009-font);
}
/* Поверхность тёмная в обеих темах: части внутри переключаются в тёмную схему. */
[data-vibeui-block="cta-009"] [data-part="shell"]{color-scheme:dark}
[data-vibeui-block="cta-009"] [data-part="shell"]{
max-width:76rem;margin:0 auto;padding:2.5rem 1.25rem;
display:grid;gap:1.5rem;align-items:center;
}
[data-vibeui-block="cta-009"] [data-part="copy"]{display:grid;gap:0.5rem}
@container (min-width: 44rem){
[data-vibeui-block="cta-009"] [data-part="action"]{justify-self:end}
[data-vibeui-block="cta-009"] [data-part="shell"]{
grid-template-columns:1fr auto;padding:3rem 2rem;
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-009"] *{animation:none!important;transition:none!important}}
`

/** Оранжевая полоса во всю ширину: чёрный текст и одна белая кнопка. */
export function Cta009({
  title = "Хватит листать — соберите свою страницу",
  description = "Выберите секции в каталоге, отдайте ссылку AI-агенту и получите сайт, который выглядит ровно как превью.",
  actionLabel = "Открыть каталог",
  actionHref = "#catalog",
  background = "",
  accent,
  className,
  style,
}: Cta009Props) {
  const palette = {
    ...(accent ? { "--vibeui-cta-009-bg": accent } : null),
    ...(background ? { "--vibeui-cta-009-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cta-009" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="cta-009"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="copy">
            <Heading001
              data-part="heading"
              title={title}
              lede={description}
              ledeWidth={56}
              accent={accent}
            />
          </div>
          <Button016
            data-part="action"
            label={actionLabel}
            href={actionHref}
            external={false}
            size="lg"
            tone="accent"
            accent={accent}
          />
        </div>
      </section>
    </>
  )
}
