import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar012Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  names?: string[]
  action?: string
  target?: string
}

// Идея компонента: стопка аватаров с подписью словами. Одни кружки не
// отвечают на вопрос «кто именно»: имена читаются, счётчик — нет. Подпись
// строится по правилу «двое и ещё N», а не перечислением всех: в списке из
// сорока участников строка иначе занимает три экрана.
const STYLES = `
:where([data-vibeui-block="avatar-012"]){
--vibeui-avatar-012-size:1.75rem;
--vibeui-avatar-012-overlap:0.5rem;
--vibeui-avatar-012-bg:oklch(1 0 0);
--vibeui-avatar-012-fg:oklch(0.22 0.014 265);
--vibeui-avatar-012-muted:oklch(0.52 0.014 265);
--vibeui-avatar-012-border:oklch(0.9 0.006 265);
--vibeui-avatar-012-ring:oklch(1 0 0);
--vibeui-avatar-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-012"]{
display:flex;align-items:center;gap:0.625rem;
box-sizing:border-box;width:100%;max-width:24rem;padding:0.625rem 0.75rem;
background:var(--vibeui-avatar-012-bg);
border:1px solid var(--vibeui-avatar-012-border);border-radius:9999px;
color:var(--vibeui-avatar-012-fg);font-family:var(--vibeui-avatar-012-font);
}
[data-vibeui-block="avatar-012"] [data-part="stack"]{display:flex;align-items:center;flex:none}
[data-vibeui-block="avatar-012"] [data-part="item"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:var(--vibeui-avatar-012-size);height:var(--vibeui-avatar-012-size);
border-radius:9999px;box-shadow:0 0 0 2px var(--vibeui-avatar-012-ring);
background:oklch(0.92 0.05 var(--vibeui-avatar-012-hue,250));
color:oklch(0.38 0.09 var(--vibeui-avatar-012-hue,250));
font-size:calc(var(--vibeui-avatar-012-size) * 0.36);font-weight:650;line-height:1;
user-select:none;
}
[data-vibeui-block="avatar-012"] [data-part="item"] + [data-part="item"]{margin-left:calc(var(--vibeui-avatar-012-overlap) * -1)}
[data-vibeui-block="avatar-012"] [data-part="item"]:nth-child(1){z-index:3}
[data-vibeui-block="avatar-012"] [data-part="item"]:nth-child(2){z-index:2}
[data-vibeui-block="avatar-012"] [data-part="item"]:nth-child(3){z-index:1}
/* Подпись режется многоточием: строка обязана остаться однострочной. */
[data-vibeui-block="avatar-012"] [data-part="caption"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.8125rem;line-height:1.3;color:var(--vibeui-avatar-012-muted);
}
[data-vibeui-block="avatar-012"] [data-part="caption"] b{color:var(--vibeui-avatar-012-fg);font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_NAMES = [
  "Анна Петрова",
  "Марк Ильин",
  "Мария Гурова",
  "Олег Дроздов",
  "Ирина Ким",
]

// Оттенок из имени: FNV-1a, разложенный по двенадцати ступеням круга.
// Сумма кодов символов не годится — кириллические имена ложатся в один
// розовый сектор; ступени в 30° дают заведомо различимые цвета.
function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function first(name: string) {
  return name.split(" ")[0]
}

/**
 * Стопка аватаров с подписью словами: «Анна, Марк и ещё трое».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar012({
  names = DEFAULT_NAMES,
  action = "отметили",
  target = "макет каталога",
  className,
  style,
  ...props
}: Avatar012Props) {
  const shown = names.slice(0, 3)
  const rest = names.length - 2

  return (
    <>
      <style href="vibeui-avatar-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="avatar-012"
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="stack" aria-hidden="true">
          {shown.map((name) => (
            <span
              key={name}
              data-part="item"
              style={{ "--vibeui-avatar-012-hue": hue(name) } as CSSProperties}
            >
              {initials(name)}
            </span>
          ))}
        </span>
        <span data-part="caption">
          <b>{first(names[0])}</b>
          {names.length > 1 ? (
            <>
              , <b>{first(names[1])}</b>
            </>
          ) : null}
          {rest > 0 ? ` и ещё ${rest}` : ""} {action} {target}
        </span>
      </div>
    </>
  )
}
