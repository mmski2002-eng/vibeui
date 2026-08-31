import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Item009State = "ok" | "wait" | "fail" | "off"

export type Item009Props = Omit<
  ComponentPropsWithoutRef<"li">,
  "children" | "title"
> & {
  title?: string
  meta?: string
  state?: Item009State
  label?: string
}

// Идея компонента: строка с меткой состояния, которую можно прочитать без
// цвета. Каждому состоянию отвечает своя форма маркера — круг, треугольник,
// квадрат и кольцо, — и своё слово. Цвет здесь третий по счёту признак, а не
// единственный: при дальтонизме и на чёрно-белой печати зелёное и красное
// сливаются. Само слово состояния лежит в разметке текстом, поэтому попадает
// и в скринридер, и в поиск по странице.
const STYLES = `
:where([data-vibeui-block="item-009"]){
--vibeui-item-009-bg:oklch(1 0 0);
--vibeui-item-009-fg:oklch(0.23 0.014 265);
--vibeui-item-009-muted:oklch(0.56 0.014 265);
--vibeui-item-009-border:oklch(0.9 0.006 265);
--vibeui-item-009-ok:oklch(0.58 0.15 152);
--vibeui-item-009-wait:oklch(0.68 0.14 78);
--vibeui-item-009-fail:oklch(0.58 0.19 27);
--vibeui-item-009-off:oklch(0.6 0.01 265);
--vibeui-item-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="item-009"]{
display:flex;align-items:center;gap:0.75rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.625rem 0.75rem;
list-style:none;
background:var(--vibeui-item-009-bg);
border:1px solid var(--vibeui-item-009-border);border-radius:0.75rem;
font-family:var(--vibeui-item-009-font);color:var(--vibeui-item-009-fg);
}
[data-vibeui-block="item-009"] *{box-sizing:border-box}
[data-vibeui-block="item-009"] [data-part="text"]{flex:1 1 auto;min-width:0;display:grid;gap:0.125rem}
[data-vibeui-block="item-009"] [data-part="title"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="item-009"] [data-part="meta"]{font-size:0.75rem;line-height:1.35;color:var(--vibeui-item-009-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="item-009"] [data-part="badge"]{
flex:none;display:inline-flex;align-items:center;gap:0.375rem;
padding:0.1875rem 0.5rem 0.1875rem 0.4375rem;border-radius:999px;
border:1px solid color-mix(in oklab,var(--vibeui-item-009-tone) 40%,transparent);
background:color-mix(in oklab,var(--vibeui-item-009-tone) 12%,transparent);
color:color-mix(in oklab,var(--vibeui-item-009-tone) 72%,black);
font-size:0.6875rem;font-weight:650;line-height:1.4;white-space:nowrap;
}
/* Форма маркера различает состояния там, где цвет уже не работает. */
[data-vibeui-block="item-009"] [data-part="mark"]{
width:0.5rem;height:0.5rem;background:var(--vibeui-item-009-tone);
}
[data-vibeui-block="item-009"][data-state="ok"]{--vibeui-item-009-tone:var(--vibeui-item-009-ok)}
[data-vibeui-block="item-009"][data-state="wait"]{--vibeui-item-009-tone:var(--vibeui-item-009-wait)}
[data-vibeui-block="item-009"][data-state="fail"]{--vibeui-item-009-tone:var(--vibeui-item-009-fail)}
[data-vibeui-block="item-009"][data-state="off"]{--vibeui-item-009-tone:var(--vibeui-item-009-off)}
[data-vibeui-block="item-009"][data-state="ok"] [data-part="mark"]{border-radius:999px}
[data-vibeui-block="item-009"][data-state="wait"] [data-part="mark"]{clip-path:polygon(50% 0,100% 100%,0 100%)}
[data-vibeui-block="item-009"][data-state="fail"] [data-part="mark"]{border-radius:1px;transform:rotate(45deg)}
[data-vibeui-block="item-009"][data-state="off"] [data-part="mark"]{
border-radius:999px;background:none;
box-shadow:inset 0 0 0 2px var(--vibeui-item-009-tone);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="item-009"] *{animation:none!important;transition:none!important}}
`

const LABELS: Record<Item009State, string> = {
  ok: "Работает",
  wait: "Разворачивается",
  fail: "Ошибка",
  off: "Отключено",
}

/**
 * Строка списка с меткой состояния: форма, слово и только затем цвет.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Item009({
  title = "api.vibeui.ru",
  meta = "Прод · последняя проверка 40 секунд назад",
  state = "ok",
  label,
  className,
  style,
  ...props
}: Item009Props) {
  const text = label ?? LABELS[state]

  return (
    <>
      <style href="vibeui-item-009" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-vibeui-block="item-009"
        data-state={state}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="text">
          <span data-part="title">{title}</span>
          {meta ? <span data-part="meta">{meta}</span> : null}
        </span>
        <span data-part="badge">
          <span data-part="mark" aria-hidden="true" />
          {text}
        </span>
      </li>
    </>
  )
}
