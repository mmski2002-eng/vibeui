import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Accordion005Item = {
  title: string
  body: string
  /** Раздел недоступен: не раскрывается и объясняет причину. */
  disabled?: boolean
  /** Раздел требует внимания: подсвечен и отмечен слева. */
  highlighted?: boolean
  /** Короткая подпись состояния справа: «Готово», «Нужен ответ». */
  status?: string
}

export type Accordion005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  items?: Accordion005Item[]
  defaultOpen?: number
  accent?: string
}

// Идея компонента: у разделов есть состояния. Недоступный не раскрывается и
// сам объясняет причину — вместо того чтобы открыться в пустоту; требующий
// внимания отмечен полосой у края и подписью, а не только цветом текста.
// Недоступный раздел остаётся видимым: спрятать его — значит скрыть, что
// шаг вообще существует.
const STYLES = `
:where([data-vibeui-block="accordion-005"]){
--vibeui-accordion-005-fg:oklch(0.22 0.014 265);
--vibeui-accordion-005-muted:oklch(0.52 0.014 265);
--vibeui-accordion-005-bg:oklch(1 0 0);
--vibeui-accordion-005-border:oklch(0.91 0.006 265);
--vibeui-accordion-005-accent:oklch(0.55 0.2 262);
--vibeui-accordion-005-warn:oklch(0.68 0.15 70);
--vibeui-accordion-005-radius:0.75rem;
--vibeui-accordion-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-005"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:42rem;box-sizing:border-box;
color:var(--vibeui-accordion-005-fg);font-family:var(--vibeui-accordion-005-font);
}
[data-vibeui-block="accordion-005"] details,
[data-vibeui-block="accordion-005"] [data-part="locked"]{
position:relative;overflow:hidden;
border:1px solid var(--vibeui-accordion-005-border);
border-radius:var(--vibeui-accordion-005-radius);
background:var(--vibeui-accordion-005-bg);
}
[data-vibeui-block="accordion-005"] summary{
display:flex;align-items:center;gap:0.75rem;
padding:0.875rem 1.0625rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:550;line-height:1.4;
}
[data-vibeui-block="accordion-005"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-005"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-005-accent);outline-offset:-2px}
[data-vibeui-block="accordion-005"] [data-part="title"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="accordion-005"] [data-part="status"]{
flex:none;padding:0.1875rem 0.5rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-accordion-005-border) 55%,transparent);
color:var(--vibeui-accordion-005-muted);
font-size:0.6875rem;font-weight:600;white-space:nowrap;
}
[data-vibeui-block="accordion-005"] [data-part="chevron"]{
flex:none;width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-accordion-005-muted);
border-bottom:1.5px solid var(--vibeui-accordion-005-muted);
transform:rotate(45deg) translate(-0.0625rem,-0.0625rem);
transition:transform .18s ease;
}
[data-vibeui-block="accordion-005"] details[open] [data-part="chevron"]{transform:rotate(225deg) translate(-0.0625rem,-0.0625rem)}
[data-vibeui-block="accordion-005"] [data-part="body"]{
margin:0;padding:0 1.0625rem 1rem;
font-size:0.875rem;line-height:1.6;color:var(--vibeui-accordion-005-muted);max-width:62ch;
}
/* Требует внимания: полоса у края плюс тёплая подпись состояния. */
[data-vibeui-block="accordion-005"] details[data-highlighted="true"]{
border-color:color-mix(in oklab,var(--vibeui-accordion-005-warn) 45%,var(--vibeui-accordion-005-border));
background:color-mix(in oklab,var(--vibeui-accordion-005-warn) 6%,var(--vibeui-accordion-005-bg));
}
[data-vibeui-block="accordion-005"] details[data-highlighted="true"]::before{
content:"";position:absolute;left:0;top:0;bottom:0;width:3px;
background:var(--vibeui-accordion-005-warn);
}
[data-vibeui-block="accordion-005"] details[data-highlighted="true"] [data-part="status"]{
background:color-mix(in oklab,var(--vibeui-accordion-005-warn) 18%,transparent);
color:color-mix(in oklab,var(--vibeui-accordion-005-warn) 70%,black);
}
/* Недоступный раздел: не <details>, а статичный блок — раскрывать нечего. */
[data-vibeui-block="accordion-005"] [data-part="locked"]{
opacity:.65;background:color-mix(in oklab,var(--vibeui-accordion-005-border) 22%,var(--vibeui-accordion-005-bg));
}
[data-vibeui-block="accordion-005"] [data-part="locked"] [data-part="head"]{
display:flex;align-items:center;gap:0.75rem;
padding:0.875rem 1.0625rem;cursor:not-allowed;
font-size:0.9375rem;font-weight:550;line-height:1.4;
}
[data-vibeui-block="accordion-005"] [data-part="reason"]{
margin:0;padding:0 1.0625rem 0.875rem;
font-size:0.8125rem;line-height:1.5;color:var(--vibeui-accordion-005-muted);
}
@container (min-width: 32rem){
[data-vibeui-block="accordion-005"] summary,
[data-vibeui-block="accordion-005"] [data-part="locked"] [data-part="head"]{padding:1rem 1.25rem;font-size:1rem}
[data-vibeui-block="accordion-005"] [data-part="body"]{padding:0 1.25rem 1.125rem;font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion005Item[] = [
  {
    title: "Реквизиты компании",
    status: "Готово",
    body: "ИНН, юридический адрес и банковский счёт заполнены. Изменения вступают в силу со следующего расчётного периода.",
  },
  {
    title: "Подтверждение почты",
    status: "Нужен ответ",
    highlighted: true,
    body: "Письмо отправлено на адрес администратора. Пока адрес не подтверждён, счета уходят только внутрь личного кабинета.",
  },
  {
    title: "Договор с приложениями",
    status: "Готово",
    body: "Подписан электронной подписью 4 марта. Копия доступна в разделе документов.",
  },
  {
    title: "Экспорт бухгалтерии",
    status: "Недоступно",
    disabled: true,
    body: "Раздел откроется после подтверждения почты: выгрузка отправляется на подтверждённый адрес.",
  },
]

/**
 * Аккордеон с состояниями разделов: подсвеченный и недоступный.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion005({
  items = DEFAULT_ITEMS,
  defaultOpen = 1,
  accent,
  className,
  style,
  ...props
}: Accordion005Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="accordion-005"
        className={className}
        style={palette}
      >
        {items.map((item, index) =>
          item.disabled ? (
            <div key={item.title} data-part="locked" aria-disabled="true">
              <div data-part="head">
                <span data-part="title">{item.title}</span>
                {item.status ? (
                  <span data-part="status">{item.status}</span>
                ) : null}
              </div>
              <p data-part="reason">{item.body}</p>
            </div>
          ) : (
            <details
              key={item.title}
              open={index === defaultOpen}
              data-highlighted={item.highlighted || undefined}
            >
              <summary>
                <span data-part="title">{item.title}</span>
                {item.status ? (
                  <span data-part="status">{item.status}</span>
                ) : null}
                <span data-part="chevron" aria-hidden="true" />
              </summary>
              <p data-part="body">{item.body}</p>
            </details>
          ),
        )}
      </div>
    </>
  )
}
