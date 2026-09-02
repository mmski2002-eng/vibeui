import type { ComponentProps, CSSProperties } from "react"

export type Avatar039Props = Omit<ComponentProps<"header">, "children"> & {
  name?: string
  role?: string
  src?: string
  action?: string
  stats?: { value: string; label: string }[]
  accent?: string
  /** Цвет текста. Пусто — берётся из темы окружения, приглушённый выводится из него. */
  textColor?: string
}

// Идея компонента: шапка страницы профиля — обложка, крупный портрет внахлёст
// и строка действий. Портрет наезжает на обложку отрицательным margin, а не
// абсолютным позиционированием: высота шапки тогда считается сама, и текст под
// портретом не приходится отодвигать вручную на его половину. Раскладка
// считается от ширины самой шапки, а не от экрана: в узкой колонке она
// становится вертикальной, в широкой — строкой с кнопкой справа.
const STYLES = `
:where([data-vibeui-block="avatar-039"]){
--vibeui-avatar-039-size:5.5rem;
--vibeui-avatar-039-accent:light-dark(oklch(0.52 0.14 var(--vibeui-avatar-039-hue)),oklch(0.72 0.14 var(--vibeui-avatar-039-hue)));
--vibeui-avatar-039-surface:light-dark(oklch(1 0 0),oklch(0.21 0.012 265));
--vibeui-avatar-039-border:light-dark(oklch(0.9 0.008 265),oklch(0.31 0.012 265));
--vibeui-avatar-039-fg:light-dark(oklch(0.22 0.015 265),oklch(0.96 0.005 265));
--vibeui-avatar-039-muted:color-mix(in oklab,var(--vibeui-avatar-039-fg) 68%,transparent);
--vibeui-avatar-039-hue:250;
--vibeui-avatar-039-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-039"]{
container-type:inline-size;
display:block;width:100%;overflow:hidden;
border-radius:1rem;border:1px solid var(--vibeui-avatar-039-border);
background:var(--vibeui-avatar-039-surface);color:var(--vibeui-avatar-039-fg);
font-family:var(--vibeui-avatar-039-font);
}
/* Обложка нарисована градиентом: картинка обложки — забота проекта, а
   компонент обязан выглядеть готовым и без неё. */
[data-vibeui-block="avatar-039"] [data-part="cover"]{
height:6.5rem;
background:
 radial-gradient(80% 160% at 8% -20%,oklch(0.82 0.11 calc(var(--vibeui-avatar-039-hue) - 25) / 90%) 0%,transparent 70%),
 radial-gradient(70% 140% at 95% 120%,oklch(0.5 0.13 calc(var(--vibeui-avatar-039-hue) + 55) / 80%) 0%,transparent 70%),
 linear-gradient(135deg,oklch(0.7 0.12 var(--vibeui-avatar-039-hue)),oklch(0.56 0.12 calc(var(--vibeui-avatar-039-hue) + 30)));
}
[data-vibeui-block="avatar-039"] [data-part="body"]{
display:flex;flex-direction:column;gap:0.875rem;
padding:0 1.25rem 1.25rem;
}
[data-vibeui-block="avatar-039"] [data-part="head"]{
display:flex;flex-direction:column;gap:0.75rem;
}
[data-vibeui-block="avatar-039"] [data-part="face"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:var(--vibeui-avatar-039-size);height:var(--vibeui-avatar-039-size);
/* Портрет наезжает на обложку ровно на половину своей высоты. */
margin-top:calc(var(--vibeui-avatar-039-size) / -2);
border-radius:9999px;overflow:hidden;
box-shadow:0 0 0 4px var(--vibeui-avatar-039-surface);
background:light-dark(oklch(0.9 0.06 var(--vibeui-avatar-039-hue)),oklch(0.34 0.065 var(--vibeui-avatar-039-hue)));
color:light-dark(oklch(0.36 0.12 var(--vibeui-avatar-039-hue)),oklch(0.88 0.063 var(--vibeui-avatar-039-hue)));
font-size:calc(var(--vibeui-avatar-039-size) * 0.32);font-weight:650;line-height:1;
}
[data-vibeui-block="avatar-039"] [data-part="face"] img{
width:100%;height:100%;object-fit:cover;display:block;
}
[data-vibeui-block="avatar-039"] [data-part="name"]{
margin:0;font-size:1.125rem;font-weight:650;line-height:1.25;
}
[data-vibeui-block="avatar-039"] [data-part="role"]{
margin:0.125rem 0 0;color:var(--vibeui-avatar-039-muted);font-size:0.875rem;line-height:1.35;
}
[data-vibeui-block="avatar-039"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;align-self:flex-start;
display:inline-flex;align-items:center;justify-content:center;
height:2.25rem;padding:0 1rem;border-radius:0.625rem;
background:var(--vibeui-avatar-039-accent);color:oklch(0.99 0.003 265);
font-family:inherit;font-size:0.875rem;font-weight:600;line-height:1;
}
[data-vibeui-block="avatar-039"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-avatar-039-accent);outline-offset:2px;
}
[data-vibeui-block="avatar-039"] [data-part="stats"]{
list-style:none;margin:0;padding:0;
display:flex;flex-wrap:wrap;gap:1.5rem;
border-top:1px solid var(--vibeui-avatar-039-border);padding-top:0.875rem;
}
[data-vibeui-block="avatar-039"] [data-part="stats"] b{
display:block;font-size:1rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="avatar-039"] [data-part="stats"] span{
color:var(--vibeui-avatar-039-muted);font-size:0.75rem;
}
/* От ширины самой шапки: в широкой колонке имя и кнопка встают в строку. */
@container (min-width: 30rem){
[data-vibeui-block="avatar-039"] [data-part="head"]{
flex-direction:row;align-items:flex-end;gap:1rem;
}
[data-vibeui-block="avatar-039"] [data-part="titles"]{flex:1;min-width:0;padding-bottom:0.25rem}
[data-vibeui-block="avatar-039"] [data-part="action"]{align-self:flex-end;margin-bottom:0.25rem}
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-039"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-039"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STATS = [
  { value: "412", label: "Установок" },
  { value: "18", label: "Блоков" },
  { value: "4", label: "В команде" },
]

// Оттенок из имени: тот же FNV-1a, что и у остальных аватаров категории —
// обложка и портрет одного человека совпадают по цвету на всех страницах.
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
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/**
 * Шапка профиля: обложка, портрет внахлёст, имя, роль, действие и счётчики.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar039({
  name = "Мария Гурова",
  role = "Продуктовый дизайнер · Москва",
  src,
  action = "Написать сообщение",
  stats = DEFAULT_STATS,
  accent,
  textColor,
  className,
  style,
  ...props
}: Avatar039Props) {
  const palette = {
    "--vibeui-avatar-039-hue": hue(name),
    ...(accent ? { "--vibeui-avatar-039-accent": accent } : null),
    ...(textColor ? { "--vibeui-avatar-039-fg": textColor } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-039" precedence="medium">
        {STYLES}
      </style>
      <header
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-039"
        className={className}
        style={palette}
      >
        <div data-part="cover" aria-hidden="true" />
        <div data-part="body">
          <div data-part="head">
            <span data-part="face">
              {src ? (
                <img src={src} alt={name} />
              ) : (
                <span aria-hidden="true">{initials(name)}</span>
              )}
            </span>
            <div data-part="titles">
              <h2 data-part="name">{name}</h2>
              <p data-part="role">{role}</p>
            </div>
            {action ? (
              <button type="button" data-part="action">
                {action}
              </button>
            ) : null}
          </div>
          {stats.length > 0 ? (
            <ul data-part="stats">
              {stats.map((stat) => (
                <li key={stat.label}>
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </header>
    </>
  )
}
