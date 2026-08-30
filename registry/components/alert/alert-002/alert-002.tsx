import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Alert002Tone = "info" | "success" | "warning" | "danger"

export type Alert002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "title" | "children"
> & {
  tone?: Alert002Tone
  title?: string
  description?: string
  /** Ссылка справа: «Подробнее», «Открыть журнал». */
  action?: ReactNode
}

// Идея компонента: залитый алерт — самый тяжёлый вес в наборе. Он для того
// единственного случая, когда сообщение нельзя пропустить: сервис лежит,
// оплата не прошла, данные вот-вот удалятся. Заливка тоном по всей площади
// сознательно кричит, поэтому такой алерт на экране должен быть один.
const STYLES = `
:where([data-vibeui-block="alert-002"]){
--vibeui-alert-002-bg:oklch(0.55 0.19 25);
--vibeui-alert-002-fg:oklch(0.99 0.01 25);
--vibeui-alert-002-muted:oklch(0.93 0.03 25);
--vibeui-alert-002-radius:0.75rem;
--vibeui-alert-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="alert-002"]{
/* flex-wrap живёт здесь, а не в @container: контейнерный запрос применяется
   к потомкам контейнера, но не к нему самому. На широкой раскладке перенос
   ни на что не влияет — всё умещается в строку. */
display:flex;flex-wrap:wrap;align-items:flex-start;gap:0.75rem;
width:100%;box-sizing:border-box;
padding:0.875rem 1rem;border-radius:var(--vibeui-alert-002-radius);
background:var(--vibeui-alert-002-bg);color:var(--vibeui-alert-002-fg);
font-family:var(--vibeui-alert-002-font);
}
[data-vibeui-block="alert-002"][data-tone="info"]{--vibeui-alert-002-bg:oklch(0.5 0.18 262);--vibeui-alert-002-fg:oklch(0.99 0.01 262);--vibeui-alert-002-muted:oklch(0.9 0.04 262)}
[data-vibeui-block="alert-002"][data-tone="success"]{--vibeui-alert-002-bg:oklch(0.5 0.14 152);--vibeui-alert-002-fg:oklch(0.99 0.01 152);--vibeui-alert-002-muted:oklch(0.9 0.04 152)}
[data-vibeui-block="alert-002"][data-tone="warning"]{--vibeui-alert-002-bg:oklch(0.62 0.15 70);--vibeui-alert-002-fg:oklch(0.99 0.01 70);--vibeui-alert-002-muted:oklch(0.94 0.04 70)}
/* Значок на просвете заливки: обводка вместо второго цвета. */
[data-vibeui-block="alert-002"] [data-part="icon"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.375rem;height:1.375rem;margin-top:0.0625rem;
border:1.5px solid currentColor;border-radius:9999px;
font-size:0.75rem;font-weight:800;line-height:1;
}
[data-vibeui-block="alert-002"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="alert-002"] [data-part="title"]{font-size:0.875rem;font-weight:650;line-height:1.4}
[data-vibeui-block="alert-002"] [data-part="description"]{font-size:0.8125rem;line-height:1.5;color:var(--vibeui-alert-002-muted)}
[data-vibeui-block="alert-002"] [data-part="action"]{
flex:none;align-self:center;
color:inherit;font-size:0.8125rem;font-weight:650;text-decoration:none;
border-bottom:1px solid color-mix(in oklab,currentColor 45%,transparent);
transition:border-color .16s ease;
}
[data-vibeui-block="alert-002"] [data-part="action"]:hover{border-bottom-color:currentColor}
[data-vibeui-block="alert-002"] a:focus-visible,
[data-vibeui-block="alert-002"] button:focus-visible{outline:2px solid currentColor;outline-offset:2px}
@container (max-width: 26rem){
/* Текст занимает строку целиком, иначе действие сжимает его до нуля. */
[data-vibeui-block="alert-002"] [data-part="text"]{flex:1 1 100%}
[data-vibeui-block="alert-002"] [data-part="action"]{width:100%;align-self:flex-start;padding-left:2.125rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-002"] *{animation:none!important;transition:none!important}}
`

const GLYPHS: Record<Alert002Tone, string> = {
  info: "i",
  success: "✓",
  warning: "!",
  danger: "!",
}

/**
 * Залитый алерт для сообщений, которые нельзя пропустить.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert002({
  tone = "danger",
  title = "Оплата не прошла",
  description = "Банк отклонил списание. Проект останется опубликованным ещё 5 дней, потом перейдёт в режим только для чтения.",
  action = "Обновить карту",
  className,
  style,
  ...props
}: Alert002Props) {
  return (
    <>
      <style href="vibeui-alert-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alert-002"
        data-tone={tone}
        role={tone === "danger" ? "alert" : "status"}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="icon" aria-hidden="true">
          {GLYPHS[tone]}
        </span>
        <span data-part="text">
          {title ? <span data-part="title">{title}</span> : null}
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
        </span>
        {action ? <span data-part="action">{action}</span> : null}
      </div>
    </>
  )
}
