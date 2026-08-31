import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Banner006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  message?: string
  /** Что происходит с несохранённым: без этой строки полоса бесполезна. */
  detail?: string
  retryLabel?: string
  onRetry?: () => void
}

// Идея компонента: полоса «нет сети», которая объясняет последствия. Не просто
// «офлайн», а что будет с набранным текстом. Индикатор слева — три затухающие
// чёрточки, они читаются как оборванный сигнал даже без цвета.
const STYLES = `
:where([data-vibeui-block="banner-006"]){
--vibeui-banner-006-bg:oklch(0.25 0.012 265);
--vibeui-banner-006-fg:oklch(0.96 0.002 265);
--vibeui-banner-006-muted:oklch(0.75 0.008 265);
--vibeui-banner-006-tone:oklch(0.78 0.13 75);
--vibeui-banner-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="banner-006"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-banner-006-font);color:var(--vibeui-banner-006-fg);
}
[data-vibeui-block="banner-006"] [data-part="shell"]{
display:flex;align-items:center;gap:0.875rem;flex-wrap:wrap;
box-sizing:border-box;padding:0.75rem 1rem;
border-radius:0.875rem;background:var(--vibeui-banner-006-bg);
}
/* Три чёрточки гаснут по очереди: оборванный сигнал читается без цвета. */
[data-vibeui-block="banner-006"] [data-part="signal"]{
display:flex;align-items:flex-end;gap:0.125rem;flex:none;height:0.875rem;
}
[data-vibeui-block="banner-006"] [data-part="signal"] i{
display:block;width:0.1875rem;border-radius:0.0625rem;
background:var(--vibeui-banner-006-tone);
animation:vibeui-banner-006-fade 1.8s ease-in-out infinite;
}
[data-vibeui-block="banner-006"] [data-part="signal"] i:nth-child(1){height:0.375rem}
[data-vibeui-block="banner-006"] [data-part="signal"] i:nth-child(2){height:0.625rem;animation-delay:.2s}
[data-vibeui-block="banner-006"] [data-part="signal"] i:nth-child(3){height:0.875rem;animation-delay:.4s;opacity:.35}
@keyframes vibeui-banner-006-fade{0%,100%{opacity:1}50%{opacity:.25}}
[data-vibeui-block="banner-006"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;flex:1 1 14rem;min-width:0}
[data-vibeui-block="banner-006"] [data-part="message"]{font-size:0.875rem;font-weight:640;line-height:1.35}
[data-vibeui-block="banner-006"] [data-part="detail"]{font-size:0.8125rem;line-height:1.45;color:var(--vibeui-banner-006-muted)}
[data-vibeui-block="banner-006"] [data-part="retry"]{
appearance:none;cursor:pointer;flex:none;
height:2rem;padding:0 0.875rem;border-radius:0.5rem;
border:1px solid oklch(1 0 0 / 26%);background:transparent;
color:var(--vibeui-banner-006-fg);
font:inherit;font-size:0.8125rem;font-weight:640;
transition:background-color .16s ease;
}
[data-vibeui-block="banner-006"] [data-part="retry"]:hover{background:oklch(1 0 0 / 12%)}
[data-vibeui-block="banner-006"] [data-part="retry"]:focus-visible{outline:2px solid var(--vibeui-banner-006-tone);outline-offset:2px}
@container (max-width: 24rem){
[data-vibeui-block="banner-006"] [data-part="retry"]{width:100%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-006"] *{animation:none!important;transition:none!important}}
`

/**
 * Полоса офлайн-состояния: индикатор сигнала, последствия и повтор.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner006({
  message = "Нет соединения с сервером",
  detail = "Изменения сохраняются в браузере и уйдут сами, как только сеть вернётся.",
  retryLabel = "Проверить сеть",
  onRetry,
  className,
  style,
  ...props
}: Banner006Props) {
  return (
    <>
      <style href="vibeui-banner-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="banner-006"
        role="status"
        aria-live="polite"
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="shell">
          <span data-part="signal" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span data-part="text">
            <span data-part="message">{message}</span>
            {detail ? <span data-part="detail">{detail}</span> : null}
          </span>
          {retryLabel ? (
            <button data-part="retry" type="button" onClick={onRetry}>
              {retryLabel}
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}
