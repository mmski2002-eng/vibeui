import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Item012Props = Omit<
  ComponentPropsWithoutRef<"li">,
  "children" | "title"
> & {
  title?: string
  meta?: string
  time?: string
  unread?: boolean
}

// Идея компонента: строка уведомления, где непрочитанное состояние держится
// на трёх независимых сигналах — точка слева, полужирное название и лёгкая
// заливка строки, — а не на одном цвете. Точка помечена aria-hidden, потому
// что дублирует смысл: настоящий сигнал для скринридера — скрытый текст
// «Непрочитано» перед названием, который существует только в непрочитанном
// состоянии, а не превращается в пустой узел в прочитанном.
const STYLES = `
:where([data-vibeui-block="item-012"]){
--vibeui-item-012-bg:oklch(1 0 0);
--vibeui-item-012-fg:oklch(0.23 0.014 265);
--vibeui-item-012-muted:oklch(0.56 0.014 265);
--vibeui-item-012-border:oklch(0.9 0.006 265);
--vibeui-item-012-accent:oklch(0.58 0.18 258);
--vibeui-item-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="item-012"]{
display:flex;align-items:flex-start;gap:0.625rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.625rem 0.75rem;
list-style:none;
background:var(--vibeui-item-012-bg);
border:1px solid var(--vibeui-item-012-border);border-radius:0.75rem;
font-family:var(--vibeui-item-012-font);color:var(--vibeui-item-012-fg);
}
[data-vibeui-block="item-012"] *{box-sizing:border-box}
[data-vibeui-block="item-012"][data-unread]{
background:color-mix(in oklab,var(--vibeui-item-012-accent) 5%,var(--vibeui-item-012-bg));
}
[data-vibeui-block="item-012"] [data-part="dot"]{
flex:none;width:0.5rem;height:0.5rem;margin-top:0.375rem;border-radius:9999px;
background:var(--vibeui-item-012-accent);visibility:hidden;
}
[data-vibeui-block="item-012"][data-unread] [data-part="dot"]{visibility:visible}
[data-vibeui-block="item-012"] [data-part="text"]{flex:1 1 auto;min-width:0;display:grid;gap:0.1875rem}
[data-vibeui-block="item-012"] [data-part="title"]{
font-size:0.875rem;font-weight:500;line-height:1.35;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="item-012"][data-unread] [data-part="title"]{font-weight:700}
[data-vibeui-block="item-012"] [data-part="meta"]{
font-size:0.75rem;line-height:1.4;color:var(--vibeui-item-012-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="item-012"] [data-part="time"]{
flex:none;font-size:0.6875rem;color:var(--vibeui-item-012-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="item-012"] [data-part="sr"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
clip:rect(0,0,0,0);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="item-012"] *{animation:none!important;transition:none!important}}
`

/**
 * Строка уведомления с непрочитанной меткой и временем: точка, вес шрифта
 * и заливка строки — три сигнала, а не один. Один файл, ноль зависимостей.
 */
export function Item012({
  title = "Игорь оставил комментарий к смете",
  meta = "«Проверьте цифры по разделу три»",
  time = "14:32",
  unread = true,
  className,
  style,
  ...props
}: Item012Props) {
  return (
    <>
      <style href="vibeui-item-012" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-vibeui-block="item-012"
        data-unread={unread || undefined}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="dot" aria-hidden="true" />
        <span data-part="text">
          {unread ? <span data-part="sr">Непрочитано. </span> : null}
          <span data-part="title">{title}</span>
          <span data-part="meta">{meta}</span>
        </span>
        <span data-part="time">{time}</span>
      </li>
    </>
  )
}
