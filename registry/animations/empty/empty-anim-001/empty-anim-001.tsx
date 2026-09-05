import type { ComponentProps, CSSProperties } from "react"

export type EmptyAnim001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  /** Пилюля справа от заголовка: счётчик или статус. */
  badge?: string
  /** Подпись под новым элементом, который заполняет слот. */
  itemLabel?: string
  accent?: string
  paused?: boolean
}

// Идея: сетка пунктирных пустых слотов, в центре — кнопка добавления со
// своим дышащим кольцом. Раз за цикл один слот демонстрирует добавление:
// сперва по нему проходит рябь (расширяющийся и гаснущий круг), затем
// поверх пунктирной рамки проявляется карточка нового элемента и держится,
// прежде чем снова раствориться. Всё на @keyframes с паузами между фазами
// (0%→52%→64%→94%→100%), JS не участвует.
const STYLES = `
:where([data-vibeui-block="empty-anim-001"]){
--vibeui-empty-anim-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-empty-anim-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-empty-anim-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-empty-anim-001-muted:color-mix(in oklab,var(--vibeui-empty-anim-001-fg) 58%,transparent);
--vibeui-empty-anim-001-border:light-dark(oklch(0.88 0 0),oklch(0.33 0 0));
--vibeui-empty-anim-001-accent:light-dark(oklch(0.6 0.14 155),oklch(0.75 0.14 155));
--vibeui-empty-anim-001-accent-fg:oklch(from var(--vibeui-empty-anim-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-empty-anim-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="empty-anim-001"]{color-scheme:dark}
[data-vibeui-block="empty-anim-001"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-empty-anim-001-fg);font-family:var(--vibeui-empty-anim-001-font);
}
[data-vibeui-block="empty-anim-001"] *{box-sizing:border-box}
[data-vibeui-block="empty-anim-001"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-empty-anim-001-border);
background:var(--vibeui-empty-anim-001-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="empty-anim-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-empty-anim-001-border);
}
[data-vibeui-block="empty-anim-001"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="empty-anim-001"] [data-part="badge"]{
display:inline-flex;align-items:center;height:1.125rem;padding:0 0.5rem;border-radius:9999px;
font-size:0.625rem;font-weight:650;color:var(--vibeui-empty-anim-001-muted);
background:color-mix(in oklab,var(--vibeui-empty-anim-001-fg) 6%,transparent);
}
[data-vibeui-block="empty-anim-001"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;padding:0.875rem;
}
[data-vibeui-block="empty-anim-001"] [data-part="slot"]{
position:relative;aspect-ratio:1;border-radius:0.625rem;
border:1.5px dashed var(--vibeui-empty-anim-001-border);
display:flex;align-items:center;justify-content:center;overflow:hidden;
}
[data-vibeui-block="empty-anim-001"] [data-part="slot"][data-role="add"]{
border-style:solid;border-color:transparent;color:var(--vibeui-empty-anim-001-accent-fg);
background:var(--vibeui-empty-anim-001-accent);
}
[data-vibeui-block="empty-anim-001"] [data-part="slot"][data-role="add"] svg{
position:relative;z-index:1;width:1rem;height:1rem;
}
[data-vibeui-block="empty-anim-001"] [data-part="addring"]{
position:absolute;inset:0;border-radius:inherit;
border:2px solid var(--vibeui-empty-anim-001-accent);
animation:vibeui-empty-anim-001-addring 2.4s ease-out infinite;
}
[data-vibeui-block="empty-anim-001"] [data-part="ripple"]{
position:absolute;top:50%;left:50%;width:1.75rem;height:1.75rem;margin:-0.875rem 0 0 -0.875rem;
border-radius:9999px;background:var(--vibeui-empty-anim-001-accent);
animation:vibeui-empty-anim-001-ripple 4.8s ease-out infinite;
}
[data-vibeui-block="empty-anim-001"] [data-part="fill"]{
position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.25rem;
border-radius:inherit;background:var(--vibeui-empty-anim-001-card);
box-shadow:inset 0 0 0 1px var(--vibeui-empty-anim-001-border);
animation:vibeui-empty-anim-001-fill 4.8s ease-out infinite;
}
[data-vibeui-block="empty-anim-001"] [data-part="fill"] svg{width:1rem;height:1rem;color:var(--vibeui-empty-anim-001-accent)}
[data-vibeui-block="empty-anim-001"] [data-part="filllabel"]{
font-size:0.5rem;font-weight:650;color:var(--vibeui-empty-anim-001-muted);
}
[data-vibeui-block="empty-anim-001"][data-paused="true"] *{animation-play-state:paused!important}
@keyframes vibeui-empty-anim-001-addring{
0%{transform:scale(1);opacity:.6}
80%,100%{transform:scale(1.35);opacity:0}
}
@keyframes vibeui-empty-anim-001-ripple{
0%,54%{opacity:0;transform:scale(0.4)}
58%{opacity:.55;transform:scale(0.6)}
74%,100%{opacity:0;transform:scale(1.9)}
}
@keyframes vibeui-empty-anim-001-fill{
0%,52%{opacity:0;transform:scale(0.85)}
64%{opacity:1;transform:scale(1.04)}
72%,94%{opacity:1;transform:scale(1)}
100%{opacity:0;transform:scale(0.85)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="empty-anim-001"] [data-part="addring"]{animation:none;opacity:0}
[data-vibeui-block="empty-anim-001"] [data-part="ripple"]{animation:none;opacity:0}
[data-vibeui-block="empty-anim-001"] [data-part="fill"]{animation:none;opacity:1;transform:none}
}
`

const PLUS = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
)

const ITEM_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-5-5L5 21" />
  </svg>
)

const SLOT_COUNT = 9
const ADD_INDEX = 4
const TARGET_INDEX = 3

/**
 * Пустое состояние: сетка пунктирных слотов с кнопкой добавления в центре.
 * Один слот раз за цикл демонстрирует добавление элемента — рябь и
 * проявление карточки. Один файл, ноль зависимостей, собственная палитра.
 */
export function EmptyAnim001({
  title = "Ваша галерея",
  badge = "Пусто",
  itemLabel = "Новое",
  accent,
  paused = false,
  className,
  style,
  ...props
}: EmptyAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-empty-anim-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-empty-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="empty-anim-001"
        data-slot="empty-grid"
        data-paused={paused ? "true" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="title">{title}</p>
            {badge ? <span data-part="badge">{badge}</span> : null}
          </div>
          <div data-part="grid" role="img" aria-label={title}>
            {Array.from({ length: SLOT_COUNT }).map((_, index) => {
              if (index === ADD_INDEX) {
                return (
                  <div
                    data-part="slot"
                    data-role="add"
                    aria-hidden="true"
                    key={index}
                  >
                    <span data-part="addring" />
                    {PLUS}
                  </div>
                )
              }

              if (index === TARGET_INDEX) {
                return (
                  <div
                    data-part="slot"
                    data-role="target"
                    aria-hidden="true"
                    key={index}
                  >
                    <span data-part="ripple" />
                    <div data-part="fill">
                      {ITEM_ICON}
                      <span data-part="filllabel">{itemLabel}</span>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  data-part="slot"
                  data-role="empty"
                  aria-hidden="true"
                  key={index}
                />
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
