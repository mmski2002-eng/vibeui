import { Fragment, type ComponentProps, type CSSProperties } from "react"

export type KbdAnim002Props = Omit<ComponentProps<"section">, "children"> & {
  /** Клавиши комбинации слева направо, например ["⌘", "K"]. */
  keys?: string[]
  /** Подпись под клавишами: что делает шорткат. */
  label?: string
  accent?: string
}

const DEFAULT_KEYS = ["⌘", "K"]

// Идея: комбинация клавиш как ряд объёмных keycap-кнопок с тенью снизу,
// разделённых знаком «+». Клавиши по очереди «нажимаются» — уходят вниз на
// толщину тени, сама тень схлопывается, — имитируя демонстрацию шортката по
// одной клавише за раз, затем цикл повторяется.
const STYLES = `
:where([data-vibeui-block="kbd-anim-002"]){
--vibeui-kbd-anim-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-kbd-anim-002-key:light-dark(oklch(1 0 0),oklch(0.28 0.006 265));
--vibeui-kbd-anim-002-fg:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-kbd-anim-002-muted:color-mix(in oklab,var(--vibeui-kbd-anim-002-fg) 55%,transparent);
--vibeui-kbd-anim-002-border:light-dark(oklch(0.9 0 0),oklch(0.36 0 0));
--vibeui-kbd-anim-002-edge:light-dark(oklch(0.8 0 0),oklch(0.16 0 0));
--vibeui-kbd-anim-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-kbd-anim-002-accent-fg:oklch(from var(--vibeui-kbd-anim-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-kbd-anim-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="kbd-anim-002"]{color-scheme:dark}
[data-vibeui-block="kbd-anim-002"]{
display:block;box-sizing:border-box;width:100%;max-width:18rem;margin:0;
color:var(--vibeui-kbd-anim-002-fg);font-family:var(--vibeui-kbd-anim-002-font);
}
[data-vibeui-block="kbd-anim-002"] *{box-sizing:border-box}
[data-vibeui-block="kbd-anim-002"] [data-part="frame"]{
display:flex;flex-direction:column;align-items:center;gap:0.75rem;
padding:1.5rem 1rem;border-radius:1.25rem;
border:1px solid var(--vibeui-kbd-anim-002-border);
background:var(--vibeui-kbd-anim-002-frame);
}
[data-vibeui-block="kbd-anim-002"] [data-part="combo"]{
display:flex;align-items:center;gap:0.5rem;
}
[data-vibeui-block="kbd-anim-002"] [data-part="key"]{
display:flex;align-items:center;justify-content:center;
min-width:2.5rem;height:2.5rem;padding:0 0.625rem;border-radius:0.75rem;
border:1px solid var(--vibeui-kbd-anim-002-border);
background:var(--vibeui-kbd-anim-002-key);color:var(--vibeui-kbd-anim-002-fg);
font-size:1rem;font-weight:650;user-select:none;
box-shadow:0 3px 0 var(--vibeui-kbd-anim-002-edge),0 6px 14px -8px oklch(0 0 0 / 0.4);
animation:vibeui-kbd-anim-002-press 2.6s ease-in-out infinite;
}
[data-vibeui-block="kbd-anim-002"] [data-part="plus"]{
font-size:0.875rem;font-weight:650;color:var(--vibeui-kbd-anim-002-muted);
}
[data-vibeui-block="kbd-anim-002"] [data-part="label"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-kbd-anim-002-muted);text-align:center;
}
@keyframes vibeui-kbd-anim-002-press{
0%,100%{transform:translateY(0);background:var(--vibeui-kbd-anim-002-key);color:var(--vibeui-kbd-anim-002-fg);box-shadow:0 3px 0 var(--vibeui-kbd-anim-002-edge),0 6px 14px -8px oklch(0 0 0 / 0.4)}
10%,26%{transform:translateY(3px);background:var(--vibeui-kbd-anim-002-accent);color:var(--vibeui-kbd-anim-002-accent-fg);box-shadow:0 0 0 var(--vibeui-kbd-anim-002-edge),0 1px 4px -2px oklch(0 0 0 / 0.3)}
36%{transform:translateY(0);background:var(--vibeui-kbd-anim-002-key);color:var(--vibeui-kbd-anim-002-fg);box-shadow:0 3px 0 var(--vibeui-kbd-anim-002-edge),0 6px 14px -8px oklch(0 0 0 / 0.4)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="kbd-anim-002"] [data-part="key"]{animation:none}
}
`

/**
 * Комбинация клавиш как ряд объёмных keycap-кнопок: по очереди нажимаются
 * в цикле, имитируя демонстрацию шортката. Один файл, ноль зависимостей,
 * собственная палитра.
 */
export function KbdAnim002({
  keys = DEFAULT_KEYS,
  label = "Быстрый поиск",
  accent,
  className,
  style,
  ...props
}: KbdAnim002Props) {
  const palette = {
    ...(accent ? { "--vibeui-kbd-anim-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-kbd-anim-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="kbd-anim-002"
        data-slot="keyboard-shortcut"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="combo" aria-hidden="true">
            {keys.map((key, index) => (
              <Fragment key={`${key}-${index}`}>
                {index > 0 ? <span data-part="plus">+</span> : null}
                <span
                  data-part="key"
                  style={{ animationDelay: `${index * 1.3}s` }}
                >
                  {key}
                </span>
              </Fragment>
            ))}
          </div>
          {label ? <p data-part="label">{label}</p> : null}
        </div>
      </section>
    </>
  )
}
