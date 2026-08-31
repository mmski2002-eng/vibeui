import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Hovercard007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  title?: string
  text?: string
  /** Задержка перед раскрытием в секундах: уход курсора отменяет её. */
  delay?: number
}

// Идея компонента: карточка с намерением. Пока курсор стоит на ссылке, снизу
// растёт тонкая полоска ожидания, и только потом раскрывается карточка. Уход
// курсора обнуляет и полоску, и задержку — пролёт мышью ничего не открывает.
const STYLES = `
:where([data-vibeui-block="hovercard-007"]){
--vibeui-hovercard-007-bg:oklch(1 0 0);
--vibeui-hovercard-007-fg:oklch(0.22 0.014 265);
--vibeui-hovercard-007-muted:oklch(0.54 0.014 265);
--vibeui-hovercard-007-border:oklch(0.9 0.006 265);
--vibeui-hovercard-007-accent:oklch(0.55 0.16 200);
--vibeui-hovercard-007-delay:0.45s;
--vibeui-hovercard-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="hovercard-007"]{
width:100%;max-width:28rem;box-sizing:border-box;
padding:1rem 1.125rem;
border:1px solid var(--vibeui-hovercard-007-border);border-radius:0.875rem;
background:var(--vibeui-hovercard-007-bg);
font-family:var(--vibeui-hovercard-007-font);color:var(--vibeui-hovercard-007-fg);
}
[data-vibeui-block="hovercard-007"] [data-part="line"]{margin:0;font-size:0.875rem;line-height:1.7}
/* Ожидание и карточка привязаны к ссылке в строке, а не ко всему абзацу. */
[data-vibeui-block="hovercard-007"] [data-part="host"]{position:relative;display:inline-block}
[data-vibeui-block="hovercard-007"] [data-part="link"]{
position:relative;display:inline-block;
color:var(--vibeui-hovercard-007-accent);font-weight:640;text-decoration:none;
border-bottom:1px solid color-mix(in oklab,var(--vibeui-hovercard-007-accent) 40%,transparent);
}
[data-vibeui-block="hovercard-007"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-hovercard-007-accent);outline-offset:2px;border-radius:0.25rem}
/* Полоска ожидания: растёт ровно столько, сколько длится задержка. */
[data-vibeui-block="hovercard-007"] [data-part="link"]::after{
content:"";position:absolute;left:0;bottom:-1px;height:2px;width:100%;
transform-origin:left center;transform:scaleX(0);
background:var(--vibeui-hovercard-007-accent);
transition:transform var(--vibeui-hovercard-007-delay) linear;
}
[data-vibeui-block="hovercard-007"] [data-part="host"]:hover [data-part="link"]::after,
[data-vibeui-block="hovercard-007"] [data-part="host"]:focus-within [data-part="link"]::after{transform:scaleX(1)}
[data-vibeui-block="hovercard-007"] [data-part="card"]{
position:absolute;left:0;top:calc(100% + 0.5rem);z-index:20;
display:flex;flex-direction:column;gap:0.375rem;
width:17rem;box-sizing:border-box;padding:0.8125rem 0.875rem;
border:1px solid var(--vibeui-hovercard-007-border);border-radius:0.875rem;
background:var(--vibeui-hovercard-007-bg);
box-shadow:0 22px 46px -28px oklch(0.2 0.02 265 / 55%);
opacity:0;visibility:hidden;translate:0 -0.25rem;
transition:opacity .14s ease 0s,translate .14s ease 0s,visibility .14s 0s;
}
/* Задержка стоит только в открытом состоянии: уход курсора отменяет её. */
[data-vibeui-block="hovercard-007"] [data-part="host"]:hover [data-part="card"],
[data-vibeui-block="hovercard-007"] [data-part="host"]:focus-within [data-part="card"]{
opacity:1;visibility:visible;translate:0 0;
transition-delay:var(--vibeui-hovercard-007-delay);
}
[data-vibeui-block="hovercard-007"] [data-part="title"]{font-size:0.875rem;font-weight:660;line-height:1.3}
[data-vibeui-block="hovercard-007"] [data-part="text"]{display:block;margin:0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-hovercard-007-muted)}
[data-vibeui-block="hovercard-007"] [data-part="hint"]{
padding-top:0.375rem;border-top:1px solid var(--vibeui-hovercard-007-border);
font-size:0.6875rem;color:var(--vibeui-hovercard-007-muted);
}
[data-vibeui-block="hovercard-007"] [data-part="hint"] b{color:var(--vibeui-hovercard-007-fg);font-weight:650;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hovercard-007"] *{animation:none!important;transition:none!important}}
`

/**
 * Карточка с задержкой раскрытия: полоска ожидания и отмена при уходе курсора.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Hovercard007({
  label = "тарифы на хранение",
  title = "Хранение файлов",
  text = "Первые 50 ГБ входят в любой тариф. Дальше считаем по 4 ₽ за гигабайт в месяц, округляя вниз до целого.",
  delay = 0.45,
  className,
  style,
  ...props
}: Hovercard007Props) {
  const palette = {
    "--vibeui-hovercard-007-delay": `${delay}s`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hovercard-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="hovercard-007"
        className={className}
        style={palette}
      >
        <p data-part="line">
          Подробности смотрите в разделе{" "}
          <span data-part="host">
            <a
              data-part="link"
              href="#pricing"
              aria-describedby="vibeui-hovercard-007-card"
            >
              {label}
            </a>
            <span
              data-part="card"
              id="vibeui-hovercard-007-card"
              role="tooltip"
            >
              <span data-part="title">{title}</span>
              <span data-part="text">{text}</span>
              <span data-part="hint">
                карточка раскроется через <b>{delay}&nbsp;с</b> наведения
              </span>
            </span>
          </span>{" "}
          — проведите курсором мимо, карточка не откроется.
        </p>
      </div>
    </>
  )
}
