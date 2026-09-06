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
--vibeui-avatar-039-size:5.75rem;
--vibeui-avatar-039-accent:light-dark(oklch(0.26 0.035 var(--vibeui-avatar-039-hue)),oklch(0.95 0.012 var(--vibeui-avatar-039-hue)));
--vibeui-avatar-039-on-accent:light-dark(oklch(0.99 0 265),oklch(0.18 0 265));
--vibeui-avatar-039-surface:light-dark(oklch(1 0 0),oklch(0.2 0 265));
--vibeui-avatar-039-border:light-dark(oklch(0.92 0 265),oklch(0.3 0 265));
--vibeui-avatar-039-fg:light-dark(oklch(0.22 0 265),oklch(0.96 0 265));
--vibeui-avatar-039-muted:color-mix(in oklab,var(--vibeui-avatar-039-fg) 60%,transparent);
--vibeui-avatar-039-shadow:light-dark(oklch(0.2 0 265 / 13%),oklch(0 0 0 / 50%));
--vibeui-avatar-039-hue:250;
--vibeui-avatar-039-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-039"]{
container-type:inline-size;
display:block;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);overflow:hidden;
border-radius:1.375rem;border:1px solid var(--vibeui-avatar-039-border);
background:var(--vibeui-avatar-039-surface);color:var(--vibeui-avatar-039-fg);
font-family:var(--vibeui-avatar-039-font);
box-shadow:0 1px 2px var(--vibeui-avatar-039-shadow),0 28px 56px -34px var(--vibeui-avatar-039-shadow);
}
[data-vibeui-block="avatar-039"] *{box-sizing:border-box}
/* Обложка нарисована градиентом: картинка обложки — забота проекта, а
   компонент обязан выглядеть готовым и без неё. Основа тёмная и почти
   нейтральная, оттенок имени приходит подсветками — иначе на некоторых
   именах карточка уезжала в салатовый. */
[data-vibeui-block="avatar-039"] [data-part="cover"]{
position:relative;height:7.5rem;
background:
 radial-gradient(90% 150% at 12% -30%,oklch(0.62 0.07 calc(var(--vibeui-avatar-039-hue) - 20) / 55%) 0%,transparent 60%),
 radial-gradient(80% 140% at 90% 130%,oklch(0.45 0.08 calc(var(--vibeui-avatar-039-hue) + 60) / 50%) 0%,transparent 62%),
 linear-gradient(125deg,oklch(0.23 0 258) 0%,oklch(0.29 0 265) 55%,oklch(0.2 0 272) 100%);
}
/* Стеклянный блик поверх обложки: тонкая верхняя подсветка и мягкий низ. */
[data-vibeui-block="avatar-039"] [data-part="cover"]::after{
content:"";position:absolute;inset:0;
background:
 linear-gradient(180deg,oklch(1 0 0 / 14%) 0%,transparent 42%),
 linear-gradient(180deg,transparent 55%,oklch(0.15 0 265 / 22%) 100%);
}
/* Позиционирование обязательно: обложка тоже позиционирована и иначе
   закрасила бы наехавший на неё портрет. */
[data-vibeui-block="avatar-039"] [data-part="body"]{
position:relative;
display:flex;flex-direction:column;gap:1.125rem;
padding:0 1.375rem 1.375rem;
}
[data-vibeui-block="avatar-039"] [data-part="head"]{
display:flex;flex-direction:column;gap:0.875rem;
}
[data-vibeui-block="avatar-039"] [data-part="face"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:var(--vibeui-avatar-039-size);height:var(--vibeui-avatar-039-size);
/* Портрет наезжает на обложку ровно на половину своей высоты. */
margin-top:calc(var(--vibeui-avatar-039-size) / -2);
border-radius:9999px;overflow:hidden;
box-shadow:
 0 0 0 4px var(--vibeui-avatar-039-surface),
 0 0 0 5px light-dark(oklch(0.2 0 265 / 8%),oklch(1 0 0 / 10%)),
 0 12px 26px -14px var(--vibeui-avatar-039-shadow);
background:light-dark(oklch(0.9 0.06 var(--vibeui-avatar-039-hue)),oklch(0.34 0.065 var(--vibeui-avatar-039-hue)));
color:light-dark(oklch(0.36 0.12 var(--vibeui-avatar-039-hue)),oklch(0.88 0.063 var(--vibeui-avatar-039-hue)));
font-size:calc(var(--vibeui-avatar-039-size) * 0.32);font-weight:650;line-height:1;
}
[data-vibeui-block="avatar-039"] [data-part="face"] img{
width:100%;height:100%;object-fit:cover;display:block;
}
[data-vibeui-block="avatar-039"] [data-part="name"]{
margin:0;font-size:1.25rem;font-weight:660;letter-spacing:-0.02em;line-height:1.2;
}
[data-vibeui-block="avatar-039"] [data-part="role"]{
margin:0.25rem 0 0;color:var(--vibeui-avatar-039-muted);font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="avatar-039"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;align-self:flex-start;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.375rem;padding:0.375rem 1.125rem;border-radius:9999px;
background:var(--vibeui-avatar-039-accent);color:var(--vibeui-avatar-039-on-accent);
font-family:inherit;font-size:0.8125rem;font-weight:600;letter-spacing:-0.01em;line-height:1;
box-shadow:0 1px 2px var(--vibeui-avatar-039-shadow),0 10px 20px -12px var(--vibeui-avatar-039-shadow);
transition:transform .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="avatar-039"] [data-part="action"]:hover{
transform:translateY(-1px);
box-shadow:0 2px 4px var(--vibeui-avatar-039-shadow),0 16px 26px -14px var(--vibeui-avatar-039-shadow);
}
[data-vibeui-block="avatar-039"] [data-part="action"]:active{transform:translateY(0)}
[data-vibeui-block="avatar-039"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-avatar-039-accent);outline-offset:2px;
}
/* Счётчики — сегментированная панель: волоски между ячейками рисует зазор
   в grid, залитый цветом границы. */
[data-vibeui-block="avatar-039"] [data-part="stats"]{
list-style:none;margin:0;padding:0;overflow:hidden;
display:grid;grid-template-columns:repeat(auto-fit,minmax(6rem,1fr));gap:1px;
border:1px solid var(--vibeui-avatar-039-border);border-radius:0.875rem;
background:var(--vibeui-avatar-039-border);
}
[data-vibeui-block="avatar-039"] [data-part="stats"] li{
padding:0.75rem 0.875rem;
background:light-dark(oklch(0.985 0 265),oklch(0.23 0 265));
}
[data-vibeui-block="avatar-039"] [data-part="stats"] b{
display:block;font-size:1.0625rem;font-weight:660;letter-spacing:-0.02em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="avatar-039"] [data-part="stats"] span{
display:block;margin-top:0.125rem;
color:var(--vibeui-avatar-039-muted);font-size:0.6875rem;text-transform:uppercase;letter-spacing:0.07em;
}
/* От ширины самой шапки: в широкой колонке имя и кнопка встают в строку. */
@container (min-width: 30rem){
[data-vibeui-block="avatar-039"] [data-part="head"]{
flex-direction:row;align-items:flex-end;gap:1.125rem;
}
[data-vibeui-block="avatar-039"] [data-part="titles"]{flex:1;min-width:0;padding-bottom:0.125rem}
[data-vibeui-block="avatar-039"] [data-part="action"]{align-self:flex-end;margin-bottom:0.125rem}
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
