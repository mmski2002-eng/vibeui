import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Spinner005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  busy?: boolean
  label?: string
  children?: ReactNode
}

// Идея компонента: наложение поверх блока, которое действительно блокирует.
// Полупрозрачная плёнка сама по себе ничего не запрещает: под ней остаются
// кликабельные кнопки и достижимые табом поля. Здесь содержимое помечено
// inert — оно уходит и из фокуса, и из дерева доступности, — а на область
// поставлен aria-busy, чтобы скринридер сообщил о работе, а не молчал.
const STYLES = `
:where([data-vibeui-block="spinner-005"]){
--vibeui-spinner-005-surface:oklch(1 0 0);
--vibeui-spinner-005-border:oklch(0.9 0.006 265);
--vibeui-spinner-005-fg:oklch(0.24 0.014 265);
--vibeui-spinner-005-muted:oklch(0.55 0.014 265);
--vibeui-spinner-005-soft:oklch(0.96 0.004 265);
--vibeui-spinner-005-track:oklch(0.9 0.006 265);
--vibeui-spinner-005-accent:oklch(0.55 0.17 262);
--vibeui-spinner-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: и содержимое, и подпись наложения тёмные. */
[data-vibeui-block="spinner-005"]{
position:relative;overflow:hidden;
display:block;width:100%;max-width:22rem;box-sizing:border-box;
background:var(--vibeui-spinner-005-surface);
border:1px solid var(--vibeui-spinner-005-border);border-radius:1rem;
font-family:var(--vibeui-spinner-005-font);color:var(--vibeui-spinner-005-fg);
}
[data-vibeui-block="spinner-005"] [data-part="content"]{
display:flex;flex-direction:column;gap:0.625rem;padding:1rem;
}
[data-vibeui-block="spinner-005"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="spinner-005"] [data-part="field"]{
display:flex;flex-direction:column;gap:0.3125rem;
font-size:0.75rem;color:var(--vibeui-spinner-005-muted);
}
[data-vibeui-block="spinner-005"] [data-part="box"]{
height:2.25rem;border-radius:0.5rem;
border:1px solid var(--vibeui-spinner-005-border);
background:var(--vibeui-spinner-005-soft);
}
/* Плёнка не блокирует сама по себе: работу делает inert на содержимом. */
[data-vibeui-block="spinner-005"] [data-part="veil"]{
position:absolute;inset:0;
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;
background:color-mix(in oklab,var(--vibeui-spinner-005-surface) 78%,transparent);
backdrop-filter:blur(2px);
}
[data-vibeui-block="spinner-005"] [data-part="ring"]{
width:1.5rem;height:1.5rem;box-sizing:border-box;
border:2px solid var(--vibeui-spinner-005-track);
border-top-color:var(--vibeui-spinner-005-accent);
border-radius:9999px;
animation:vibeui-spinner-005-spin .7s linear infinite;
}
@keyframes vibeui-spinner-005-spin{to{transform:rotate(360deg)}}
@keyframes vibeui-spinner-005-pulse{0%,100%{opacity:.35}50%{opacity:1}}
[data-vibeui-block="spinner-005"] [data-part="veil-label"]{
font-size:0.8125rem;font-weight:650;
}
/* Без движения кольцо не крутится, а дышит: состояние сохраняется. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="spinner-005"] [data-part="ring"]{
animation:vibeui-spinner-005-pulse 1.6s ease-in-out infinite;
border-color:var(--vibeui-spinner-005-accent);
}
}
`

/**
 * Наложение поверх блока с настоящей блокировкой содержимого через inert.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner005({
  busy = true,
  label = "Сохраняем изменения",
  children,
  className,
  style,
  ...props
}: Spinner005Props) {
  return (
    <>
      <style href="vibeui-spinner-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="spinner-005"
        aria-busy={busy}
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="content" inert={busy}>
          {children ?? (
            <>
              <p data-part="title">Профиль команды</p>
              <span data-part="field">
                Название
                <span data-part="box" />
              </span>
              <span data-part="field">
                Домен
                <span data-part="box" />
              </span>
            </>
          )}
        </div>
        {busy ? (
          <div data-part="veil">
            <span data-part="ring" aria-hidden="true" />
            <span data-part="veil-label" role="status">
              {label}
            </span>
          </div>
        ) : null}
      </div>
    </>
  )
}
