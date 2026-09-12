import type { CSSProperties } from "react"

type CtaAnim001Action = {
  label: string
  href: string
}

export type CtaAnim001Props = {
  eyebrow?: string
  title?: string
  description?: string
  primaryAction?: CtaAnim001Action
  secondaryAction?: CtaAnim001Action
  accent?: string
  /** Дышащее свечение в фоне. false — плоский фон без анимации. */
  glow?: boolean
  className?: string
  style?: CSSProperties
}

// Полноценная секция-призыв. Фон — мягкое радиальное свечение, которое
// дышит по яркости и масштабу независимо от остального контента, поэтому
// пятно не читается как статичная подложка. Заголовок, подтекст и кнопки
// въезжают друг за другом при появлении секции — тем же приёмом, что и
// у hero-001 (fade+rise, stagger через animation-delay).
//
// container-type делает секцию собственным query-контейнером: кегль
// заголовка и паддинги считаются от ширины блока, а не от окна, поэтому
// миниатюра каталога и живая страница выглядят одинаково.
const STYLES = `
:where([data-vibeui-block="cta-anim-001"]){
--vibeui-cta-anim-001-bg:light-dark(oklch(0.99 0 265),oklch(0.16 0 265));
--vibeui-cta-anim-001-ink:light-dark(oklch(0.18 0 265),oklch(0.97 0 265));
--vibeui-cta-anim-001-muted:light-dark(oklch(0.48 0 265),oklch(0.72 0 265));
--vibeui-cta-anim-001-accent:light-dark(oklch(0.58 0.18 285),oklch(0.75 0.16 285));
--vibeui-cta-anim-001-accent-fg:light-dark(oklch(0.99 0 285),oklch(0.14 0 285));
--vibeui-cta-anim-001-border:light-dark(oklch(0.16 0 265 / 12%),oklch(1 0 0 / 16%));
--vibeui-cta-anim-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-anim-001"]{color-scheme:dark}
[data-vibeui-block="cta-anim-001"]{
min-width:min(100%,18rem);position:relative;overflow:hidden;isolation:isolate;
background:var(--vibeui-cta-anim-001-bg);color:var(--vibeui-cta-anim-001-ink);
font-family:var(--vibeui-cta-anim-001-sans);
}
/* Радиальное свечение дышит по opacity и scale, центр смещён к верху. */
[data-vibeui-block="cta-anim-001"] [data-part="glow"]{
position:absolute;left:50%;top:-10%;width:min(60rem,140%);height:32rem;
transform:translateX(-50%);pointer-events:none;z-index:0;
background:radial-gradient(50% 55% at 50% 40%,color-mix(in oklab,var(--vibeui-cta-anim-001-accent) 34%,transparent),transparent 72%);
animation:vibeui-cta-anim-001-breathe 6s ease-in-out infinite;
}
[data-vibeui-block="cta-anim-001"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="cta-anim-001"] [data-part="frame"]{
position:relative;z-index:1;max-width:56rem;margin:0 auto;
padding:clamp(3.5rem,14cqi,7rem) clamp(1.25rem,5cqi,2.5rem);
display:flex;flex-direction:column;align-items:center;gap:1rem;text-align:center;
}
[data-vibeui-block="cta-anim-001"] [data-part="eyebrow"]{
display:inline-flex;align-items:center;gap:0.4375rem;
padding:0.3125rem 0.75rem;border-radius:9999px;
border:1px solid var(--vibeui-cta-anim-001-border);
font-size:0.75rem;font-weight:600;letter-spacing:0.04em;
color:var(--vibeui-cta-anim-001-accent);
animation:vibeui-cta-anim-001-rise .6s cubic-bezier(.16,1,.3,1) both;
}
[data-vibeui-block="cta-anim-001"] [data-part="title"]{
margin:0;max-width:22ch;
font-size:clamp(1.875rem,5.4cqi,3.25rem);line-height:1.08;letter-spacing:-0.025em;font-weight:680;
animation:vibeui-cta-anim-001-rise .6s cubic-bezier(.16,1,.3,1) both;animation-delay:80ms;
}
[data-vibeui-block="cta-anim-001"] [data-part="description"]{
margin:0;max-width:48ch;
font-size:clamp(0.9375rem,1.6cqi,1.0625rem);line-height:1.6;color:var(--vibeui-cta-anim-001-muted);
animation:vibeui-cta-anim-001-rise .6s cubic-bezier(.16,1,.3,1) both;animation-delay:160ms;
}
[data-vibeui-block="cta-anim-001"] [data-part="actions"]{
display:flex;flex-wrap:wrap;align-items:center;justify-content:center;
gap:0.75rem;margin-top:0.625rem;
animation:vibeui-cta-anim-001-rise .6s cubic-bezier(.16,1,.3,1) both;animation-delay:240ms;
}
[data-vibeui-block="cta-anim-001"] [data-part="primary"]{
display:inline-flex;align-items:center;justify-content:center;
min-height:2.75rem;padding:0.25rem 1.5rem;border-radius:0.625rem;
background:var(--vibeui-cta-anim-001-accent);color:oklch(from var(--vibeui-cta-anim-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
text-decoration:none;font-size:0.9375rem;font-weight:650;
box-shadow:0 12px 32px -14px color-mix(in oklab,var(--vibeui-cta-anim-001-accent) 65%,transparent);
transition:transform .16s ease,filter .16s ease;
}
[data-vibeui-block="cta-anim-001"] [data-part="primary"]:hover{transform:translateY(-1px);filter:brightness(1.08)}
[data-vibeui-block="cta-anim-001"] [data-part="secondary"]{
display:inline-flex;align-items:center;justify-content:center;
min-height:2.75rem;padding:0.25rem 1.5rem;border-radius:0.625rem;
border:1px solid var(--vibeui-cta-anim-001-border);color:var(--vibeui-cta-anim-001-ink);
text-decoration:none;font-size:0.9375rem;font-weight:600;
transition:background-color .16s ease;
}
[data-vibeui-block="cta-anim-001"] [data-part="secondary"]:hover{background:color-mix(in oklab,var(--vibeui-cta-anim-001-ink) 6%,transparent)}
[data-vibeui-block="cta-anim-001"] a:focus-visible{outline:2px solid var(--vibeui-cta-anim-001-accent);outline-offset:3px}
@keyframes vibeui-cta-anim-001-breathe{0%,100%{opacity:.55;transform:translateX(-50%) scale(0.94)}50%{opacity:.9;transform:translateX(-50%) scale(1.04)}}
@keyframes vibeui-cta-anim-001-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="cta-anim-001"] *{animation:none!important;transition:none!important}
[data-vibeui-block="cta-anim-001"] [data-part="glow"]{opacity:.7;transform:translateX(-50%) scale(1)}
}
`

/**
 * Финальная секция призыва: дышащее свечение в фоне, заголовок и кнопки
 * въезжают снизу с лёгким стаггером при появлении. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function CtaAnim001({
  eyebrow = "Уже 400+ команд на борту",
  title = "Соберите первую страницу сегодня",
  description = "Выберите блоки, отдайте ссылку своему ИИ-агенту и получите страницу, которая выглядит ровно так, как в превью.",
  primaryAction = { label: "Начать бесплатно", href: "#start" },
  secondaryAction = { label: "Посмотреть примеры", href: "#cases" },
  accent,
  glow = true,
  className,
  style,
}: CtaAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-cta-anim-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cta-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="cta-anim-001"
        data-flat={glow ? undefined : "true"}
        className={className}
        style={palette}
      >
        <span data-part="glow" aria-hidden="true" />
        <div data-part="frame">
          {eyebrow ? <span data-part="eyebrow">{eyebrow}</span> : null}
          <h2 data-part="title">{title}</h2>
          {description ? <p data-part="description">{description}</p> : null}
          <div data-part="actions">
            {primaryAction ? (
              <a data-part="primary" href={primaryAction.href}>
                {primaryAction.label}
              </a>
            ) : null}
            {secondaryAction ? (
              <a data-part="secondary" href={secondaryAction.href}>
                {secondaryAction.label}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
