import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Item004Props = Omit<
  ComponentPropsWithoutRef<"a">,
  "children" | "title"
> & {
  title?: string
  meta?: string
  hint?: string
  accent?: string
}

// Идея компонента: строка, которая сама является ссылкой. В item-001 ссылка
// растянута псевдоэлементом внутри строки — здесь корень блока и есть тег a,
// поэтому цель не нужно эмулировать: её знает браузер, и она попадает в список
// ссылок страницы с полным текстом. Стрелка сдвигается на наведении и фокусе
// одинаково — состояние клавиатуры не должно выглядеть беднее мышиного.
const STYLES = `
:where([data-vibeui-block="item-004"]){
--vibeui-item-004-bg:oklch(1 0 0);
--vibeui-item-004-fg:oklch(0.23 0.014 265);
--vibeui-item-004-muted:oklch(0.56 0.014 265);
--vibeui-item-004-border:oklch(0.9 0.006 265);
--vibeui-item-004-hover:oklch(0.975 0.003 265);
--vibeui-item-004-accent:oklch(0.55 0.19 262);
--vibeui-item-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="item-004"]{
display:flex;align-items:center;gap:0.75rem;text-decoration:none;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.6875rem 0.875rem;
background:var(--vibeui-item-004-bg);
border:1px solid var(--vibeui-item-004-border);border-radius:0.75rem;
font-family:var(--vibeui-item-004-font);color:var(--vibeui-item-004-fg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="item-004"] *{box-sizing:border-box}
[data-vibeui-block="item-004"]:hover,
[data-vibeui-block="item-004"]:focus-visible{
background:var(--vibeui-item-004-hover);
border-color:color-mix(in oklab,var(--vibeui-item-004-accent) 35%,var(--vibeui-item-004-border));
}
[data-vibeui-block="item-004"]:focus-visible{outline:2px solid var(--vibeui-item-004-accent);outline-offset:2px}
[data-vibeui-block="item-004"] [data-part="text"]{flex:1 1 auto;min-width:0;display:grid;gap:0.125rem}
[data-vibeui-block="item-004"] [data-part="title"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="item-004"] [data-part="meta"]{font-size:0.75rem;line-height:1.35;color:var(--vibeui-item-004-muted)}
[data-vibeui-block="item-004"] [data-part="hint"]{
flex:none;font-size:0.6875rem;color:var(--vibeui-item-004-muted);font-variant-numeric:tabular-nums;
}
/* Стрелка едет одинаково на наведении и на фокусе: клавиатура не второй сорт. */
[data-vibeui-block="item-004"] [data-part="chevron"]{
flex:none;color:var(--vibeui-item-004-accent);font-size:0.875rem;line-height:1;
transition:transform .15s ease;
}
[data-vibeui-block="item-004"]:hover [data-part="chevron"],
[data-vibeui-block="item-004"]:focus-visible [data-part="chevron"]{transform:translateX(2px)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="item-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Строка-ссылка: корень блока сам является тегом a.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Item004({
  title = "Настройки уведомлений",
  meta = "Почта, телеграм и еженедельная сводка",
  hint = "12",
  href = "#",
  accent,
  className,
  style,
  ...props
}: Item004Props) {
  const palette = {
    ...(accent ? { "--vibeui-item-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-item-004" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        href={href}
        data-vibeui-block="item-004"
        className={className}
        style={palette}
      >
        <span data-part="text">
          <span data-part="title">{title}</span>
          {meta ? <span data-part="meta">{meta}</span> : null}
        </span>
        {hint ? <span data-part="hint">{hint}</span> : null}
        <span data-part="chevron" aria-hidden="true">
          →
        </span>
      </a>
    </>
  )
}
