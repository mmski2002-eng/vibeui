import type { CSSProperties } from "react"

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
const STYLES = `
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
[data-vibeui-block="cta-009"] [data-part="shell"]{
max-width:76rem;margin:0 auto;padding:2.5rem 1.25rem;
display:grid;gap:1.5rem;align-items:center;
}
[data-vibeui-block="cta-009"] [data-part="copy"]{display:grid;gap:0.5rem}
[data-vibeui-block="cta-009"] [data-part="title"]{
margin:0;max-width:26ch;
font-size:clamp(1.5rem,4.5cqi,2.25rem);line-height:1.1;letter-spacing:-0.025em;font-weight:750;
}
[data-vibeui-block="cta-009"] [data-part="description"]{
margin:0;max-width:56ch;
color:var(--vibeui-cta-009-muted);font-size:1rem;line-height:1.55;
}
[data-vibeui-block="cta-009"] [data-part="action"]{
justify-self:start;display:inline-block;
padding:0.875rem 1.75rem;border-radius:999px;
background:var(--vibeui-cta-009-button);color:var(--vibeui-cta-009-button-ink);
font-size:0.9375rem;font-weight:650;text-decoration:none;white-space:nowrap;
transition:transform var(--vibeui-cta-009-dur-2) ease,box-shadow var(--vibeui-cta-009-dur-2) ease;
}
[data-vibeui-block="cta-009"] [data-part="action"]:hover{
transform:translateY(-1px);
box-shadow:0 10px 24px -14px oklch(0.15 0 0 / 60%);
}
[data-vibeui-block="cta-009"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-cta-009-ink);outline-offset:3px;
}
@container (min-width: 44rem){
[data-vibeui-block="cta-009"] [data-part="shell"]{
grid-template-columns:1fr auto;padding:3rem 2rem;
}
[data-vibeui-block="cta-009"] [data-part="action"]{justify-self:end}
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
            <h2 data-part="title">{title}</h2>
            <p data-part="description">{description}</p>
          </div>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
      </section>
    </>
  )
}
