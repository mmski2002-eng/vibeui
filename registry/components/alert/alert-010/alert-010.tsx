import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alert010Issue = {
  /** Подпись поля, к которому относится ошибка. */
  field: string
  message: string
  /** Якорь поля: строка становится ссылкой и уводит к нему. */
  href?: string
}

export type Alert010Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "title" | "children"
> & {
  title?: string
  issues?: Alert010Issue[]
}

// Идея компонента: сводка ошибок формы над кнопкой отправки. Каждая строка —
// ссылка на поле: в длинной форме искать глазами то самое поле дороже, чем
// щёлкнуть. Заголовок называет число, потому что «исправьте ошибки» без
// количества не говорит, сколько работы впереди.
const STYLES = `
:where([data-vibeui-block="alert-010"]){
--vibeui-alert-010-fg:oklch(0.24 0.016 265);
--vibeui-alert-010-muted:oklch(0.5 0.014 265);
--vibeui-alert-010-bg:oklch(1 0 0);
--vibeui-alert-010-danger:oklch(0.56 0.19 25);
--vibeui-alert-010-radius:0.75rem;
--vibeui-alert-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="alert-010"]{
display:flex;align-items:flex-start;gap:0.75rem;
width:100%;box-sizing:border-box;
padding:0.9375rem 1.0625rem;
border:1px solid color-mix(in oklab,var(--vibeui-alert-010-danger) 35%,transparent);
border-radius:var(--vibeui-alert-010-radius);
background:color-mix(in oklab,var(--vibeui-alert-010-danger) 5%,var(--vibeui-alert-010-bg));
color:var(--vibeui-alert-010-fg);font-family:var(--vibeui-alert-010-font);
}
[data-vibeui-block="alert-010"] [data-part="icon"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.375rem;height:1.375rem;margin-top:0.0625rem;border-radius:9999px;
background:var(--vibeui-alert-010-danger);color:oklch(0.99 0.01 25);
font-size:0.75rem;font-weight:800;line-height:1;
}
[data-vibeui-block="alert-010"] [data-part="text"]{display:flex;flex-direction:column;gap:0.4375rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="alert-010"] [data-part="title"]{font-size:0.875rem;font-weight:650;line-height:1.4}
[data-vibeui-block="alert-010"] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-block="alert-010"] li{
display:flex;gap:0.375rem;
font-size:0.8125rem;line-height:1.5;color:var(--vibeui-alert-010-muted);
}
/* Подпись поля жирнее текста ошибки: сначала «где», потом «что». */
[data-vibeui-block="alert-010"] [data-part="field"]{
flex:none;color:var(--vibeui-alert-010-fg);font-weight:600;
}
[data-vibeui-block="alert-010"] a{color:inherit;text-decoration:none}
[data-vibeui-block="alert-010"] a:hover [data-part="field"]{text-decoration:underline}
[data-vibeui-block="alert-010"] a:focus-visible{outline:2px solid var(--vibeui-alert-010-danger);outline-offset:2px;border-radius:0.25rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ISSUES: Alert010Issue[] = [
  {
    field: "Адрес проекта",
    message: "уже занят — попробуйте другой",
    href: "#slug",
  },
  {
    field: "Почта администратора",
    message: "не похожа на адрес: пропущен домен",
    href: "#email",
  },
  {
    field: "Тариф",
    message: "не выбран",
    href: "#plan",
  },
]

/**
 * Сводка ошибок формы: число в заголовке, строки-ссылки на поля.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert010({
  title,
  issues = DEFAULT_ISSUES,
  className,
  style,
  ...props
}: Alert010Props) {
  const heading = title ?? `Не удалось сохранить: ошибок — ${issues.length}`

  return (
    <>
      <style href="vibeui-alert-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alert-010"
        role="alert"
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="icon" aria-hidden="true">
          !
        </span>
        <div data-part="text">
          <span data-part="title">{heading}</span>
          <ul>
            {issues.map((issue) => (
              <li key={issue.field}>
                {issue.href ? (
                  <a href={issue.href}>
                    <span data-part="field">{issue.field}</span> {issue.message}
                  </a>
                ) : (
                  <>
                    <span data-part="field">{issue.field}</span>
                    {issue.message}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
