import type { ComponentProps, CSSProperties } from "react"

export type Error001Action = {
  label: string
  href: string
}

export type Error001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  code?: string
  title?: string
  description?: string
  primaryAction?: Error001Action
  secondaryAction?: Error001Action
  accent?: string
  /** Дышащее свечение в фоне. false — плоский фон без анимации. */
  glow?: boolean
  /** Периодический глитч кода ошибки. false — код статичен. */
  glitch?: boolean
}

// Идея: полноценная секция ошибки. Крупный код ошибки коротко дёргается и
// расходится RGB-каналами в начале каждого цикла (glitch на transform и
// text-shadow), затем заголовок, описание и кнопки въезжают снизу с
// нарастающей задержкой — тем же приёмом fade+rise, что и у cta-anim-001.
// Глитч повторяется бесконечно как редкий «сбой связи», текст после первого
// появления остаётся на месте.
//
// container-type делает секцию собственным query-контейнером: кегль кода и
// заголовка считается от ширины блока, а не от окна.
const STYLES = `
:where([data-vibeui-block="error-001"]){
--vibeui-error-001-bg:light-dark(oklch(0.99 0.002 25),oklch(0.16 0.014 25));
--vibeui-error-001-ink:light-dark(oklch(0.18 0.02 25),oklch(0.97 0.004 25));
--vibeui-error-001-muted:light-dark(oklch(0.48 0.02 25),oklch(0.72 0.014 25));
--vibeui-error-001-code:light-dark(oklch(0.22 0.02 25),oklch(0.95 0.006 25));
--vibeui-error-001-accent:light-dark(oklch(0.58 0.2 25),oklch(0.72 0.18 25));
--vibeui-error-001-accent-fg:light-dark(oklch(0.99 0.004 25),oklch(0.14 0.02 25));
--vibeui-error-001-border:light-dark(oklch(0.16 0.02 25 / 12%),oklch(1 0 0 / 16%));
--vibeui-error-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-error-001-mono:ui-monospace,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-001"]{color-scheme:dark}
[data-vibeui-block="error-001"]{
min-width:min(100%,18rem);position:relative;overflow:hidden;isolation:isolate;
background:var(--vibeui-error-001-bg);color:var(--vibeui-error-001-ink);
font-family:var(--vibeui-error-001-font);
}
[data-vibeui-block="error-001"] *{box-sizing:border-box}
/* Фоновое свечение дышит независимо от контента, чтобы пятно не читалось
   как статичная подложка. */
[data-vibeui-block="error-001"] [data-part="glow"]{
position:absolute;left:50%;top:-14%;width:min(56rem,150%);height:28rem;
transform:translateX(-50%);pointer-events:none;z-index:0;
background:radial-gradient(50% 55% at 50% 40%,color-mix(in oklab,var(--vibeui-error-001-accent) 30%,transparent),transparent 72%);
animation:vibeui-error-001-breathe 5s ease-in-out infinite;
}
[data-vibeui-block="error-001"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="error-001"] [data-part="frame"]{
position:relative;z-index:1;max-width:34rem;margin:0 auto;
padding:clamp(3rem,14cqi,6rem) clamp(1.25rem,5cqi,2.5rem);
display:flex;flex-direction:column;align-items:center;gap:0.75rem;text-align:center;
}
[data-vibeui-block="error-001"] [data-part="code"]{
margin:0;font-family:var(--vibeui-error-001-mono);
font-size:clamp(3.5rem,16cqi,6rem);line-height:1;font-weight:800;letter-spacing:-0.03em;
color:var(--vibeui-error-001-code);
animation:vibeui-error-001-glitch 5s steps(1) infinite;
}
[data-vibeui-block="error-001"][data-glitch="false"] [data-part="code"]{animation:none}
[data-vibeui-block="error-001"] [data-part="title"]{
margin:0;max-width:24ch;
font-size:clamp(1.25rem,3.6cqi,1.75rem);line-height:1.25;letter-spacing:-0.015em;font-weight:650;
animation:vibeui-error-001-rise .6s cubic-bezier(.16,1,.3,1) both;animation-delay:620ms;
}
[data-vibeui-block="error-001"] [data-part="description"]{
margin:0;max-width:42ch;
font-size:clamp(0.875rem,1.6cqi,0.9375rem);line-height:1.6;color:var(--vibeui-error-001-muted);
animation:vibeui-error-001-rise .6s cubic-bezier(.16,1,.3,1) both;animation-delay:700ms;
}
[data-vibeui-block="error-001"] [data-part="actions"]{
display:flex;flex-wrap:wrap;align-items:center;justify-content:center;
gap:0.625rem;margin-top:0.375rem;
animation:vibeui-error-001-rise .6s cubic-bezier(.16,1,.3,1) both;animation-delay:780ms;
}
[data-vibeui-block="error-001"] [data-part="primary"]{
display:inline-flex;align-items:center;justify-content:center;
min-height:2.625rem;padding:0.25rem 1.375rem;border-radius:0.625rem;
background:var(--vibeui-error-001-accent);color:var(--vibeui-error-001-accent-fg);
text-decoration:none;font-size:0.875rem;font-weight:650;
box-shadow:0 12px 28px -14px color-mix(in oklab,var(--vibeui-error-001-accent) 65%,transparent);
transition:transform .16s ease,filter .16s ease;
}
[data-vibeui-block="error-001"] [data-part="primary"]:hover{transform:translateY(-1px);filter:brightness(1.08)}
[data-vibeui-block="error-001"] [data-part="secondary"]{
display:inline-flex;align-items:center;justify-content:center;
min-height:2.625rem;padding:0.25rem 1.375rem;border-radius:0.625rem;
border:1px solid var(--vibeui-error-001-border);color:var(--vibeui-error-001-ink);
text-decoration:none;font-size:0.875rem;font-weight:600;
transition:background-color .16s ease;
}
[data-vibeui-block="error-001"] [data-part="secondary"]:hover{background:color-mix(in oklab,var(--vibeui-error-001-ink) 6%,transparent)}
[data-vibeui-block="error-001"] a:focus-visible{outline:2px solid var(--vibeui-error-001-accent);outline-offset:3px}
@keyframes vibeui-error-001-breathe{0%,100%{opacity:.5;transform:translateX(-50%) scale(0.94)}50%{opacity:.85;transform:translateX(-50%) scale(1.04)}}
@keyframes vibeui-error-001-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
/* Глитч живёт в первых 12% цикла — короткая вспышка расхождения каналов и
   дрожания, остальное время код неподвижен. */
@keyframes vibeui-error-001-glitch{
0%{transform:translate(0,0);text-shadow:none}
3%{transform:translate(-3px,1px);text-shadow:3px 0 rgba(255,40,90,.8),-3px 0 rgba(50,220,255,.65)}
6%{transform:translate(3px,-1px);text-shadow:-3px 0 rgba(255,40,90,.75),3px 0 rgba(50,220,255,.6)}
9%{transform:translate(-1px,0);text-shadow:1px 0 rgba(255,40,90,.5),-1px 0 rgba(50,220,255,.4)}
12%,100%{transform:translate(0,0);text-shadow:none}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="error-001"] *{animation:none!important;transition:none!important}
[data-vibeui-block="error-001"] [data-part="glow"]{opacity:.65;transform:translateX(-50%) scale(1)}
[data-vibeui-block="error-001"] [data-part="title"],
[data-vibeui-block="error-001"] [data-part="description"],
[data-vibeui-block="error-001"] [data-part="actions"]{opacity:1;transform:none}
}
`

/**
 * Полноценная секция ошибки: крупный код дёргается коротким глитчем в
 * начале каждого цикла, следом заголовок, описание и кнопки въезжают
 * снизу со стаггером. Один файл, ноль зависимостей, собственная палитра.
 */
export function Error001({
  code = "500",
  title = "Что-то пошло не так",
  description = "Сервер столкнулся с внутренней ошибкой и не смог обработать запрос. Мы уже получили уведомление и разбираемся.",
  primaryAction = { label: "На главную", href: "#home" },
  secondaryAction = { label: "Повторить", href: "#retry" },
  accent,
  glow = true,
  glitch = true,
  className,
  style,
  ...props
}: Error001Props) {
  const palette = {
    ...(accent ? { "--vibeui-error-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-001"
        data-slot="error-section"
        data-flat={glow ? undefined : "true"}
        data-glitch={glitch ? undefined : "false"}
        className={className}
        style={palette}
      >
        <span data-part="glow" aria-hidden="true" />
        <div data-part="frame">
          <p data-part="code">{code}</p>
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
