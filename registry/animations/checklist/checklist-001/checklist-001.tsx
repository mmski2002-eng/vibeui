import type { ComponentProps, CSSProperties } from "react"

function CheckIcon({ style }: { style?: CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export type Checklist001Item = {
  label: string
  /** Короткая пометка справа: длительность, тег и т. п. */
  meta?: string
}

export type Checklist001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  /** Пилюля справа от заголовка. */
  badge?: string
  items?: Checklist001Item[]
  accent?: string
  /** Секунд на полный круг: сколько занимает обход всего списка. */
  duration?: number
}

// Идея: чек-лист задач, которые сами отмечаются выполненными по очереди —
// галочка проявляется во флажке, подпись перечёркивается растущей линией,
// затем всё гаснет и цикл начинается заново со следующего пункта. Один
// @keyframes на все строки, у каждой свой отрицательный animation-delay,
// вычисленный от её позиции в списке (браузерный трюк без JS: та же
// техника, что у вкладок browser-003) — так каждая строка отмечается в
// свой черёд, а не все разом.
const STYLES = `
:where([data-vibeui-block="checklist-001"]){
--vibeui-checklist-001-duration:8s;
--vibeui-checklist-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-checklist-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-checklist-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-checklist-001-muted:color-mix(in oklab,var(--vibeui-checklist-001-fg) 58%,transparent);
--vibeui-checklist-001-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-checklist-001-accent:light-dark(oklch(0.6 0.16 155),oklch(0.75 0.15 155));
--vibeui-checklist-001-accent-fg:oklch(from var(--vibeui-checklist-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-checklist-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="checklist-001"]{color-scheme:dark}
[data-vibeui-block="checklist-001"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-checklist-001-fg);font-family:var(--vibeui-checklist-001-font);
}
[data-vibeui-block="checklist-001"] *{box-sizing:border-box}
[data-vibeui-block="checklist-001"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-checklist-001-border);
background:var(--vibeui-checklist-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="checklist-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.75rem;border-bottom:1px solid var(--vibeui-checklist-001-border);
background:var(--vibeui-checklist-001-frame);border-radius:1rem 1rem 0 0;
}
[data-vibeui-block="checklist-001"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="checklist-001"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
height:1rem;min-width:1rem;padding:0 0.3125rem;border-radius:9999px;
font-size:0.5625rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-checklist-001-accent);
background:color-mix(in oklab,var(--vibeui-checklist-001-accent) 16%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-checklist-001-accent) 24%,transparent);
}
[data-vibeui-block="checklist-001"] [data-part="list"]{
display:flex;flex-direction:column;margin:0;padding:0.5rem 0.75rem 0.75rem;list-style:none;
}
[data-vibeui-block="checklist-001"] [data-part="row"]{
display:flex;align-items:center;gap:0.625rem;padding:0.4375rem 0;
}
[data-vibeui-block="checklist-001"] [data-part="box"]{
position:relative;flex:none;display:flex;align-items:center;justify-content:center;
width:1.125rem;height:1.125rem;border-radius:0.375rem;
border:1.5px solid var(--vibeui-checklist-001-border);background:transparent;
animation:vibeui-checklist-001-box var(--vibeui-checklist-001-duration) ease-in-out infinite;
}
[data-vibeui-block="checklist-001"] [data-part="box"] svg{
width:0.6875rem;height:0.6875rem;color:var(--vibeui-checklist-001-accent-fg);
animation:vibeui-checklist-001-check var(--vibeui-checklist-001-duration) ease-in-out infinite;
}
[data-vibeui-block="checklist-001"] [data-part="text"]{
position:relative;min-width:0;flex:1 1 auto;
}
[data-vibeui-block="checklist-001"] [data-part="top"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="checklist-001"] [data-part="label"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;font-weight:550;line-height:1.4;
animation:vibeui-checklist-001-label var(--vibeui-checklist-001-duration) ease-in-out infinite;
}
[data-vibeui-block="checklist-001"] [data-part="meta"]{
flex:none;font-size:0.625rem;font-weight:550;font-variant-numeric:tabular-nums;
color:var(--vibeui-checklist-001-muted);white-space:nowrap;
}
[data-vibeui-block="checklist-001"] [data-part="strike"]{
position:absolute;left:0;right:0;top:50%;height:1px;
background:currentColor;transform:scaleX(0);transform-origin:left center;
animation:vibeui-checklist-001-strike var(--vibeui-checklist-001-duration) ease-in-out infinite;
}
@keyframes vibeui-checklist-001-box{
0%,4%{background:transparent;border-color:var(--vibeui-checklist-001-border);transform:scale(1)}
8%{background:var(--vibeui-checklist-001-accent);border-color:var(--vibeui-checklist-001-accent);transform:scale(1.12);color:oklch(from var(--vibeui-checklist-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
14%,88%{background:var(--vibeui-checklist-001-accent);border-color:var(--vibeui-checklist-001-accent);transform:scale(1);color:oklch(from var(--vibeui-checklist-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
94%,100%{background:transparent;border-color:var(--vibeui-checklist-001-border);transform:scale(1)}
}
@keyframes vibeui-checklist-001-check{
0%,6%{opacity:0;transform:scale(0.4)}
10%,88%{opacity:1;transform:scale(1)}
94%,100%{opacity:0;transform:scale(0.4)}
}
@keyframes vibeui-checklist-001-label{
0%,6%{color:var(--vibeui-checklist-001-fg)}
10%,88%{color:var(--vibeui-checklist-001-muted)}
94%,100%{color:var(--vibeui-checklist-001-fg)}
}
@keyframes vibeui-checklist-001-strike{
0%,6%{transform:scaleX(0)}
12%,88%{transform:scaleX(1)}
94%,100%{transform:scaleX(0)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="checklist-001"] [data-part="box"],
[data-vibeui-block="checklist-001"] [data-part="box"] svg,
[data-vibeui-block="checklist-001"] [data-part="label"],
[data-vibeui-block="checklist-001"] [data-part="strike"]{animation:none}
}
`

const DEFAULT_ITEMS: Checklist001Item[] = [
  { label: "Собрать макет", meta: "10 мин" },
  { label: "Настроить палитру", meta: "5 мин" },
  { label: "Собрать компоненты", meta: "20 мин" },
  { label: "Прогнать тесты", meta: "8 мин" },
  { label: "Опубликовать релиз", meta: "3 мин" },
]

/**
 * Чек-лист с пунктами, которые сами отмечаются выполненными по очереди.
 * Один файл, ноль зависимостей, собственная палитра. Цикл держится на
 * @keyframes с отрицательным animation-delay по позиции строки.
 */
export function Checklist001({
  title = "Чек-лист запуска",
  badge,
  items = DEFAULT_ITEMS,
  accent,
  duration = 8,
  className,
  style,
  ...props
}: Checklist001Props) {
  const palette = {
    ...(accent ? { "--vibeui-checklist-001-accent": accent } : null),
    "--vibeui-checklist-001-duration": `${duration}s`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-checklist-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="checklist-001"
        data-slot="checklist"
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="gtitle">{title}</p>
            {badge ? <span data-part="badge">{badge}</span> : null}
          </div>
          <ol data-part="list">
            {items.map((item, index) => {
              const delay = `calc(var(--vibeui-checklist-001-duration) * ${(-(
                index / items.length
              )).toFixed(4)})`

              return (
                <li data-part="row" key={item.label}>
                  <span
                    data-part="box"
                    aria-hidden="true"
                    style={{ animationDelay: delay }}
                  >
                    <CheckIcon style={{ animationDelay: delay }} />
                  </span>
                  <span data-part="text">
                    <span data-part="top">
                      <span data-part="label" style={{ animationDelay: delay }}>
                        {item.label}
                      </span>
                      {item.meta ? (
                        <span data-part="meta">{item.meta}</span>
                      ) : null}
                    </span>
                    <span
                      data-part="strike"
                      aria-hidden="true"
                      style={{ animationDelay: delay }}
                    />
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </section>
    </>
  )
}
