import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar026Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  name?: string
  role?: string
  ready?: boolean
}

// Идея компонента: заглушка и готовая строка живут в одной коробке. Обычная
// «скелетон-версия» рисуется отдельным компонентом, её размеры расходятся с
// настоящими, и при загрузке содержимое прыгает. Здесь круг и обе полосы
// повторяют геометрию имени и роли до пикселя: меняется только заливка.
// Пока данных нет, коробка объявлена role="status" с aria-busy, поэтому
// загрузка существует и для скринридера, а не только для глаз.
const STYLES = `
:where([data-vibeui-block="avatar-026"]){
--vibeui-avatar-026-size:2.75rem;
--vibeui-avatar-026-bg:oklch(1 0 0);
--vibeui-avatar-026-fg:oklch(0.24 0.014 265);
--vibeui-avatar-026-muted:oklch(0.55 0.014 265);
--vibeui-avatar-026-border:oklch(0.91 0.006 265);
--vibeui-avatar-026-bone:oklch(0.93 0.006 265);
--vibeui-avatar-026-shine:oklch(0.97 0.004 265);
--vibeui-avatar-026-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: тёмный текст обязан читаться на любом фоне. */
[data-vibeui-block="avatar-026"]{
display:flex;align-items:center;gap:0.75rem;
box-sizing:border-box;width:100%;max-width:18rem;padding:0.625rem 0.75rem;
background:var(--vibeui-avatar-026-bg);
border:1px solid var(--vibeui-avatar-026-border);border-radius:0.75rem;
font-family:var(--vibeui-avatar-026-font);color:var(--vibeui-avatar-026-fg);
}
[data-vibeui-block="avatar-026"] *{box-sizing:border-box}
[data-vibeui-block="avatar-026"] [data-part="face"]{
display:grid;place-items:center;flex:none;
width:var(--vibeui-avatar-026-size);height:var(--vibeui-avatar-026-size);
border-radius:9999px;
background:oklch(0.9 0.06 var(--vibeui-avatar-026-hue,265));
color:oklch(0.36 0.12 var(--vibeui-avatar-026-hue,265));
font-size:calc(var(--vibeui-avatar-026-size) * 0.34);font-weight:700;line-height:1;
}
[data-vibeui-block="avatar-026"] [data-part="text"]{display:flex;flex-direction:column;gap:0.25rem;min-width:0;flex:1 1 auto}
/* Высоты строк заданы жёстко: заглушка и текст обязаны совпадать. */
[data-vibeui-block="avatar-026"] [data-part="name"]{
height:1.0625rem;font-size:0.875rem;line-height:1.0625rem;font-weight:650;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="avatar-026"] [data-part="role"]{
height:0.9375rem;font-size:0.75rem;line-height:0.9375rem;color:var(--vibeui-avatar-026-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="avatar-026"] [data-part="bone"]{
border-radius:0.3125rem;
background:linear-gradient(90deg,var(--vibeui-avatar-026-bone) 0 40%,var(--vibeui-avatar-026-shine) 50%,var(--vibeui-avatar-026-bone) 60% 100%);
background-size:200% 100%;
animation:vibeui-avatar-026-shine 1.4s infinite linear;
}
[data-vibeui-block="avatar-026"] [data-bone="face"]{
flex:none;width:var(--vibeui-avatar-026-size);height:var(--vibeui-avatar-026-size);border-radius:9999px;
}
[data-vibeui-block="avatar-026"] [data-bone="name"]{height:1.0625rem;width:62%}
[data-vibeui-block="avatar-026"] [data-bone="role"]{height:0.9375rem;width:38%}
@keyframes vibeui-avatar-026-shine{
from{background-position:150% 0}
to{background-position:-50% 0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="avatar-026"] *{animation:none!important;transition:none!important}
[data-vibeui-block="avatar-026"] [data-part="bone"]{background:var(--vibeui-avatar-026-bone)}
}
`

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
 * Аватар в двух состояниях: заглушка и готовая строка в одной коробке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar026({
  name = "Ким Сон",
  role = "Аналитик",
  ready = false,
  className,
  style,
  ...props
}: Avatar026Props) {
  const palette = {
    "--vibeui-avatar-026-hue": hue(name),
    ...style,
  } as CSSProperties

  if (!ready) {
    return (
      <>
        <style href="vibeui-avatar-026" precedence="medium">
          {STYLES}
        </style>
        {/* Загрузка существует и для скринридера, а не только для глаз. */}
        <div
          {...props}
          data-vibeui-block="avatar-026"
          className={className}
          style={palette}
          role="status"
          aria-busy="true"
          aria-label="Загружается участник"
        >
          <span data-part="bone" data-bone="face" />
          <span data-part="text">
            <span data-part="bone" data-bone="name" />
            <span data-part="bone" data-bone="role" />
          </span>
        </div>
      </>
    )
  }

  return (
    <>
      <style href="vibeui-avatar-026" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="avatar-026"
        className={className}
        style={palette}
      >
        <span data-part="face" aria-hidden="true">
          {initials(name)}
        </span>
        <span data-part="text">
          <span data-part="name">{name}</span>
          <span data-part="role">{role}</span>
        </span>
      </div>
    </>
  )
}
