import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Item007Props = Omit<
  ComponentPropsWithoutRef<"label">,
  "children" | "title"
> & {
  title?: string
  meta?: string
  name?: string
  defaultChecked?: boolean
  accent?: string
}

// Идея компонента: строка выбора, где состояние держит нативный чекбокс, а не
// React-состояние. Поэтому компонент серверный, работает в обычной форме и
// отдаёт значение при отправке. Галочка нарисована CSS через :has(:checked),
// сам input не спрятан display:none — он прозрачен и растянут на строку, иначе
// пропадёт из последовательности фокуса. Выбранная строка меняет не только
// цвет, но и заливку с рамкой: одного оттенка мало при дальтонизме.
const STYLES = `
:where([data-vibeui-block="item-007"]){
--vibeui-item-007-bg:oklch(1 0 0);
--vibeui-item-007-fg:oklch(0.23 0.014 265);
--vibeui-item-007-muted:oklch(0.56 0.014 265);
--vibeui-item-007-border:oklch(0.9 0.006 265);
--vibeui-item-007-accent:oklch(0.55 0.19 262);
--vibeui-item-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="item-007"]{
position:relative;display:flex;align-items:center;gap:0.6875rem;cursor:pointer;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.625rem 0.75rem;
background:var(--vibeui-item-007-bg);
border:1px solid var(--vibeui-item-007-border);border-radius:0.75rem;
font-family:var(--vibeui-item-007-font);color:var(--vibeui-item-007-fg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="item-007"] *{box-sizing:border-box}
/* Input прозрачен и растянут, но остаётся в потоке фокуса: display:none убил бы клавиатуру. */
[data-vibeui-block="item-007"] input{
position:absolute;inset:0;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="item-007"]:has(input:focus-visible){outline:2px solid var(--vibeui-item-007-accent);outline-offset:2px}
[data-vibeui-block="item-007"]:has(input:checked){
background:color-mix(in oklab,var(--vibeui-item-007-accent) 7%,var(--vibeui-item-007-bg));
border-color:color-mix(in oklab,var(--vibeui-item-007-accent) 45%,var(--vibeui-item-007-border));
}
[data-vibeui-block="item-007"] [data-part="box"]{
flex:none;display:grid;place-items:center;
width:1.125rem;height:1.125rem;border-radius:0.375rem;
border:1.5px solid var(--vibeui-item-007-border);
color:transparent;font-size:0.6875rem;font-weight:800;line-height:1;
transition:background-color .15s ease,border-color .15s ease,color .15s ease;
}
[data-vibeui-block="item-007"]:has(input:checked) [data-part="box"]{
background:var(--vibeui-item-007-accent);border-color:var(--vibeui-item-007-accent);
color:oklch(1 0 0);
}
[data-vibeui-block="item-007"] [data-part="text"]{display:grid;gap:0.125rem;min-width:0}
[data-vibeui-block="item-007"] [data-part="title"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="item-007"] [data-part="meta"]{font-size:0.75rem;line-height:1.35;color:var(--vibeui-item-007-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="item-007"] *{animation:none!important;transition:none!important}}
`

/**
 * Строка выбора с галочкой на нативном чекбоксе, без клиентского состояния.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Item007({
  title = "Отдельный домен",
  meta = "Подключается за пять минут · 490 ₽ в месяц",
  name = "option",
  defaultChecked = true,
  accent,
  className,
  style,
  ...props
}: Item007Props) {
  const palette = {
    ...(accent ? { "--vibeui-item-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-item-007" precedence="medium">
        {STYLES}
      </style>
      <label
        {...props}
        data-vibeui-block="item-007"
        className={className}
        style={palette}
      >
        <input type="checkbox" name={name} defaultChecked={defaultChecked} />
        <span data-part="box" aria-hidden="true">
          ✓
        </span>
        <span data-part="text">
          <span data-part="title">{title}</span>
          {meta ? <span data-part="meta">{meta}</span> : null}
        </span>
      </label>
    </>
  )
}
