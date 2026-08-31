import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Collapsible009Release = {
  version: string
  date: string
  text: string
  open?: boolean
}

export type Collapsible009Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  title?: string
  releases?: Collapsible009Release[]
  accent?: string
}

// Идея компонента: список изменений, где стартовое состояние объявлено прямо
// в разметке атрибутом open. Это не «начальное значение стейта», а само
// состояние: сервер отдаёт нужный раздел уже раскрытым, до гидратации ничего
// не мигает, а печать и поиск по странице видят содержимое. Версия и дата
// стоят в одной строке заголовка слева, чтобы список читался колонкой.
const STYLES = `
:where([data-vibeui-block="collapsible-009"]){
--vibeui-collapsible-009-bg:oklch(1 0 0);
--vibeui-collapsible-009-fg:oklch(0.24 0.014 265);
--vibeui-collapsible-009-muted:oklch(0.56 0.014 265);
--vibeui-collapsible-009-border:oklch(0.9 0.006 265);
--vibeui-collapsible-009-accent:oklch(0.56 0.15 165);
--vibeui-collapsible-009-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-collapsible-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="collapsible-009"]{
display:block;box-sizing:border-box;width:100%;max-width:26rem;padding:0.875rem;
background:var(--vibeui-collapsible-009-bg);color:var(--vibeui-collapsible-009-fg);
border:1px solid var(--vibeui-collapsible-009-border);border-radius:1rem;
font-family:var(--vibeui-collapsible-009-font);
}
[data-vibeui-block="collapsible-009"] [data-part="title"]{
margin:0 0 0.625rem;font-size:0.75rem;font-weight:700;
letter-spacing:0.06em;text-transform:uppercase;color:var(--vibeui-collapsible-009-muted);
}
[data-vibeui-block="collapsible-009"] details{border-top:1px solid var(--vibeui-collapsible-009-border)}
[data-vibeui-block="collapsible-009"] summary{
display:flex;align-items:baseline;gap:0.625rem;
padding:0.625rem 0.125rem;cursor:pointer;list-style:none;
font-size:0.8125rem;
}
[data-vibeui-block="collapsible-009"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="collapsible-009"] summary:focus-visible{outline:2px solid var(--vibeui-collapsible-009-accent);outline-offset:2px;border-radius:0.375rem}
[data-vibeui-block="collapsible-009"] [data-part="version"]{
flex:none;padding:0.0625rem 0.4375rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-collapsible-009-accent) 15%,transparent);
color:var(--vibeui-collapsible-009-accent);
font-family:var(--vibeui-collapsible-009-mono);font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="collapsible-009"] [data-part="date"]{font-weight:640}
[data-vibeui-block="collapsible-009"] [data-part="state"]{
margin-left:auto;font-size:0.6875rem;color:var(--vibeui-collapsible-009-muted);
}
/* Подпись переключателя меняется на CSS: два узла вместо React-условия. */
[data-vibeui-block="collapsible-009"] [data-part="state"] [data-when="open"]{display:none}
[data-vibeui-block="collapsible-009"] details[open] [data-part="state"] [data-when="open"]{display:inline}
[data-vibeui-block="collapsible-009"] details[open] [data-part="state"] [data-when="closed"]{display:none}
[data-vibeui-block="collapsible-009"] [data-part="body"]{
margin:0;padding:0 0.125rem 0.75rem;
font-size:0.8125rem;line-height:1.55;color:var(--vibeui-collapsible-009-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="collapsible-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_RELEASES: Collapsible009Release[] = [
  {
    version: "0.6.0",
    date: "12 августа",
    text: "Реестр отдаёт исходник компонента по /f/<name>.tsx — теперь агент забирает файл байт в байт.",
    open: true,
  },
  {
    version: "0.5.2",
    date: "29 июля",
    text: "Каталог фильтруется по тегам, а карточки считают ширину от собственного контейнера.",
  },
  {
    version: "0.5.0",
    date: "14 июля",
    text: "Инструкция Copy for AI собирается из metadata, а не пишется руками под каждый компонент.",
  },
]

/**
 * Список изменений, где раскрытый раздел объявлен атрибутом open прямо в
 * разметке. Один файл, ноль зависимостей, клиентского кода нет.
 */
export function Collapsible009({
  title = "История версий",
  releases = DEFAULT_RELEASES,
  accent,
  className,
  style,
  ...props
}: Collapsible009Props) {
  const palette = {
    ...(accent ? { "--vibeui-collapsible-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-collapsible-009" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="collapsible-009"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{title}</h3>
        {releases.map((release) => (
          <details key={release.version} open={release.open}>
            <summary>
              <span data-part="version">{release.version}</span>
              <span data-part="date">{release.date}</span>
              <span data-part="state">
                <span data-when="closed">развернуть</span>
                <span data-when="open">свернуть</span>
              </span>
            </summary>
            <p data-part="body">{release.text}</p>
          </details>
        ))}
      </section>
    </>
  )
}
