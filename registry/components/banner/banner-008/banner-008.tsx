import type { ComponentProps, CSSProperties } from "react"

export type Banner008Props = Omit<ComponentProps<"div">, "children"> & {
  message?: string
  /** Промокод: копировать его глазами проще, чем искать в письме. */
  code?: string
  actionLabel?: string
  actionHref?: string
  /** Подпись чекбокса закрытия для скринридера. */
  dismissLabel?: string
  /** Уникальный идентификатор чекбокса закрытия: нужен при двух полосах на странице. */
  id?: string
  /** Начальный цвет градиента; он же красит подпись кнопки. */
  accent?: string
  /** Подложка полосы целиком. Пусто — остаётся собственный градиент. */
  background?: string
}

// Идея компонента: закрываемая полоса акции без единой строки JS. Крестик —
// это <label> к спрятанному чекбоксу, а :has(:checked) убирает полосу целиком.
// Состояние живёт в DOM, поэтому компонент остаётся серверным.
//
// Градиент — это дизайн, а не тема, поэтому текст на нём светлый в обеих
// ветках. Но на тёмной странице тёмные концы градиента сливаются с фоном,
// и в тёмной ветке light-dark() они светлее.
const STYLES = `
:where([data-vibeui-block="banner-008"]){
--vibeui-banner-008-from:light-dark(oklch(0.42 0.15 315),oklch(0.5 0.16 315));
--vibeui-banner-008-to:light-dark(oklch(0.46 0.16 265),oklch(0.55 0.16 265));
--vibeui-banner-008-bg:linear-gradient(100deg,var(--vibeui-banner-008-from),var(--vibeui-banner-008-to));
--vibeui-banner-008-fg:oklch(0.98 0.01 315);
--vibeui-banner-008-muted:color-mix(in oklab,var(--vibeui-banner-008-fg) 68%,transparent);
--vibeui-banner-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-banner-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="banner-008"]{color-scheme:dark}
[data-vibeui-block="banner-008"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-banner-008-font);color:var(--vibeui-banner-008-fg);
}
/* Закрытие без JS: чекбокс спрятан, :has(:checked) убирает всю полосу. */
[data-vibeui-block="banner-008"] [data-part="switch"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="banner-008"]:has([data-part="switch"]:checked){display:none}
[data-vibeui-block="banner-008"] [data-part="shell"]{
display:flex;align-items:center;gap:0.875rem;flex-wrap:wrap;
box-sizing:border-box;padding:0.9375rem 0.875rem 0.9375rem 1.125rem;
border-radius:0.875rem;
background:var(--vibeui-banner-008-bg);
}
[data-vibeui-block="banner-008"] [data-part="message"]{
margin:0;flex:1 1 13rem;min-width:0;font-size:0.9375rem;line-height:1.45;
}
[data-vibeui-block="banner-008"] [data-part="code"]{
flex:none;padding:0.1875rem 0.5rem;border-radius:0.4375rem;
border:1px dashed oklch(1 0 0 / 45%);background:oklch(1 0 0 / 14%);
font-family:var(--vibeui-banner-008-mono);font-size:0.75rem;font-weight:700;letter-spacing:0.06em;
}
[data-vibeui-block="banner-008"] [data-part="action"]{
flex:none;display:inline-flex;align-items:center;height:1.9375rem;padding:0 0.8125rem;
border-radius:0.5rem;background:oklch(1 0 0);color:var(--vibeui-banner-008-from);
font-size:0.875rem;font-weight:700;text-decoration:none;
transition:transform .16s ease;
}
[data-vibeui-block="banner-008"] [data-part="action"]:hover{transform:translateY(-1px)}
[data-vibeui-block="banner-008"] [data-part="close"]{
flex:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;border-radius:0.5rem;
color:var(--vibeui-banner-008-muted);font-size:1rem;line-height:1;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="banner-008"] [data-part="close"]:hover{background:oklch(1 0 0 / 16%);color:var(--vibeui-banner-008-fg)}
[data-vibeui-block="banner-008"] [data-part="switch"]:focus-visible + [data-part="shell"] [data-part="close"]{outline:2px solid oklch(1 0 0);outline-offset:2px}
[data-vibeui-block="banner-008"] [data-part="action"]:focus-visible{outline:2px solid oklch(1 0 0);outline-offset:2px}
@container (max-width: 26rem){
[data-vibeui-block="banner-008"] [data-part="action"]{flex:1 1 100%;justify-content:center}
}
@container (min-width: 32rem){
[data-vibeui-block="banner-008"] [data-part="shell"]{padding:1.0625rem 0.875rem 1.0625rem 1.125rem}
[data-vibeui-block="banner-008"] [data-part="message"]{font-size:1rem}
[data-vibeui-block="banner-008"] [data-part="action"]{font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-008"] *{animation:none!important;transition:none!important}}
`

/**
 * Закрываемая полоса акции: крестик работает без JS, через чекбокс и :has().
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner008({
  message = "Годовая подписка на 30% дешевле до конца недели.",
  code = "AUTUMN30",
  actionLabel = "Забрать скидку",
  actionHref = "#pricing",
  dismissLabel = "Скрыть полосу акции",
  id = "vibeui-banner-008",
  accent,
  background = "",
  className,
  style,
  ...props
}: Banner008Props) {
  const palette = {
    ...(accent ? { "--vibeui-banner-008-from": accent } : null),
    ...(background ? { "--vibeui-banner-008-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-banner-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="banner"
        data-vibeui-block="banner-008"
        role="region"
        aria-label={message}
        className={className}
        style={palette}
      >
        <input
          data-part="switch"
          id={id}
          type="checkbox"
          aria-label={dismissLabel}
        />
        <div data-part="shell">
          <p data-part="message">{message}</p>
          {code ? <span data-part="code">{code}</span> : null}
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
          <label data-part="close" htmlFor={id} aria-hidden="true">
            ×
          </label>
        </div>
      </div>
    </>
  )
}
