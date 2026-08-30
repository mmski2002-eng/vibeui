import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alert012Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "title" | "children"
> & {
  version?: string
  title?: string
  /** Две-три строки списка изменений. Полный список — по ссылке. */
  changes?: string[]
  notesLabel?: string
  notesHref?: string
  updateLabel?: string
  laterLabel?: string
  onUpdate?: () => void
  onLater?: () => void
  accent?: string
}

// Идея компонента: сообщение о доступном обновлении. Номер версии — моно и
// в плашке: его сверяют, а не читают. Две-три строки изменений прямо в
// алерте отвечают на вопрос «зачем обновляться», иначе кнопку жмут вслепую
// или не жмут вовсе; полный список уходит по ссылке.
const STYLES = `
:where([data-vibeui-block="alert-012"]){
--vibeui-alert-012-fg:oklch(0.22 0.014 265);
--vibeui-alert-012-muted:oklch(0.5 0.014 265);
--vibeui-alert-012-bg:oklch(1 0 0);
--vibeui-alert-012-border:oklch(0.9 0.006 265);
--vibeui-alert-012-accent:oklch(0.55 0.2 262);
--vibeui-alert-012-radius:0.875rem;
--vibeui-alert-012-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-alert-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="alert-012"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;box-sizing:border-box;
padding:1rem 1.0625rem;
border:1px solid var(--vibeui-alert-012-border);
border-radius:var(--vibeui-alert-012-radius);
background:var(--vibeui-alert-012-bg);color:var(--vibeui-alert-012-fg);
font-family:var(--vibeui-alert-012-font);
}
[data-vibeui-block="alert-012"] [data-part="head"]{display:flex;align-items:center;gap:0.625rem}
/* Версия моноширинными в плашке: её сверяют символ за символом. */
[data-vibeui-block="alert-012"] [data-part="version"]{
flex:none;padding:0.1875rem 0.4375rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-alert-012-accent) 12%,transparent);
color:var(--vibeui-alert-012-accent);
font-family:var(--vibeui-alert-012-mono);font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="alert-012"] [data-part="title"]{font-size:0.9375rem;font-weight:600;line-height:1.35}
[data-vibeui-block="alert-012"] ul{
margin:0;padding:0 0 0 1rem;list-style:none;
display:flex;flex-direction:column;gap:0.1875rem;
}
[data-vibeui-block="alert-012"] li{
position:relative;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-alert-012-muted);
}
[data-vibeui-block="alert-012"] li::before{
content:"";position:absolute;left:-0.75rem;top:0.5rem;
width:0.25rem;height:0.25rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-alert-012-accent) 60%,transparent);
}
[data-vibeui-block="alert-012"] [data-part="actions"]{display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap}
[data-vibeui-block="alert-012"] [data-part="update"]{
appearance:none;cursor:pointer;border:0;font:inherit;
display:inline-flex;align-items:center;height:2rem;padding:0 0.9375rem;
border-radius:0.5rem;
background:var(--vibeui-alert-012-accent);color:oklch(1 0 0);
font-size:0.8125rem;font-weight:600;
transition:filter .16s ease;
}
[data-vibeui-block="alert-012"] [data-part="update"]:hover{filter:brightness(0.94)}
[data-vibeui-block="alert-012"] [data-part="later"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0;
color:var(--vibeui-alert-012-muted);font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="alert-012"] [data-part="later"]:hover{color:var(--vibeui-alert-012-fg)}
[data-vibeui-block="alert-012"] [data-part="notes"]{
margin-left:auto;color:var(--vibeui-alert-012-accent);
font-size:0.8125rem;font-weight:500;text-decoration:none;
}
[data-vibeui-block="alert-012"] [data-part="notes"]:hover{text-decoration:underline}
[data-vibeui-block="alert-012"] a:focus-visible,
[data-vibeui-block="alert-012"] button:focus-visible{outline:2px solid var(--vibeui-alert-012-accent);outline-offset:2px;border-radius:0.25rem}
@container (max-width: 24rem){
[data-vibeui-block="alert-012"] [data-part="notes"]{margin-left:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CHANGES = [
  "Панель кода открывается прямо в каталоге",
  "Блоки считают раскладку от своей ширины",
  "Исправлена установка на Windows",
]

/**
 * Алерт доступного обновления: версия, три строки изменений, действие.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert012({
  version = "2.4.0",
  title = "Доступно обновление",
  changes = DEFAULT_CHANGES,
  notesLabel = "Все изменения",
  notesHref = "#",
  updateLabel = "Обновить",
  laterLabel = "Позже",
  onUpdate,
  onLater,
  accent,
  className,
  style,
  ...props
}: Alert012Props) {
  const palette = {
    ...(accent ? { "--vibeui-alert-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alert-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alert-012"
        role="status"
        className={className}
        style={palette}
      >
        <div data-part="head">
          {version ? <span data-part="version">{version}</span> : null}
          <span data-part="title">{title}</span>
        </div>
        {changes.length ? (
          <ul>
            {changes.map((change) => (
              <li key={change}>{change}</li>
            ))}
          </ul>
        ) : null}
        <div data-part="actions">
          <button data-part="update" type="button" onClick={onUpdate}>
            {updateLabel}
          </button>
          {laterLabel ? (
            <button data-part="later" type="button" onClick={onLater}>
              {laterLabel}
            </button>
          ) : null}
          {notesLabel ? (
            <a data-part="notes" href={notesHref}>
              {notesLabel}
            </a>
          ) : null}
        </div>
      </div>
    </>
  )
}
