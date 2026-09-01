import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Collapsible005Step = {
  label: string
  text: string
  open?: boolean
}

export type Collapsible005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  steps?: Collapsible005Step[]
  groupName?: string
  accent?: string
}

// Идея компонента: группа свёрток, где открыт ровно один шаг. Взаимное
// исключение держит атрибут name у details — общее имя делает их радиогруппой,
// поэтому состояние не дублируется в React и работает до гидратации. Слева
// пронумерованная колонка: у мастера настройки важен порядок, а не только
// сам факт раскрытия.
const STYLES = `
:where([data-vibeui-block="collapsible-005"]){
--vibeui-collapsible-005-bg:oklch(1 0 0);
--vibeui-collapsible-005-fg:oklch(0.24 0.014 265);
--vibeui-collapsible-005-muted:oklch(0.56 0.014 265);
--vibeui-collapsible-005-border:oklch(0.9 0.006 265);
--vibeui-collapsible-005-accent:oklch(0.54 0.19 285);
--vibeui-collapsible-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="collapsible-005"]{
display:flex;flex-direction:column;
box-sizing:border-box;width:100%;max-width:25rem;padding:0.375rem;
background:var(--vibeui-collapsible-005-bg);color:var(--vibeui-collapsible-005-fg);
border:1px solid var(--vibeui-collapsible-005-border);border-radius:1rem;
font-family:var(--vibeui-collapsible-005-font);
counter-reset:vibeui-step;
}
[data-vibeui-block="collapsible-005"] details+details{border-top:1px solid var(--vibeui-collapsible-005-border)}
[data-vibeui-block="collapsible-005"] summary{
display:flex;align-items:center;gap:0.75rem;
padding:0.6875rem 0.75rem;cursor:pointer;list-style:none;border-radius:0.75rem;
font-size:0.875rem;font-weight:640;
}
[data-vibeui-block="collapsible-005"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="collapsible-005"] summary:focus-visible{outline:2px solid var(--vibeui-collapsible-005-accent);outline-offset:-2px}
/* Номер шага рисует счётчик: переставили массив — нумерация поехала следом. */
[data-vibeui-block="collapsible-005"] summary::before{
counter-increment:vibeui-step;content:counter(vibeui-step);
flex:none;display:grid;place-items:center;
width:1.5rem;height:1.5rem;border-radius:9999px;
border:1px solid var(--vibeui-collapsible-005-border);
font-size:0.6875rem;font-weight:700;color:var(--vibeui-collapsible-005-muted);
transition:background-color .18s ease,color .18s ease,border-color .18s ease;
}
[data-vibeui-block="collapsible-005"] details[open] summary::before{
background:var(--vibeui-collapsible-005-accent);border-color:transparent;color:oklch(1 0 0);
}
[data-vibeui-block="collapsible-005"] [data-part="mark"]{
flex:none;margin-left:auto;width:0.4375rem;height:0.4375rem;
border-right:2px solid var(--vibeui-collapsible-005-muted);
border-bottom:2px solid var(--vibeui-collapsible-005-muted);
transform:rotate(-45deg);transform-origin:60% 60%;transition:transform .18s ease;
}
[data-vibeui-block="collapsible-005"] details[open] [data-part="mark"]{transform:rotate(45deg)}
[data-vibeui-block="collapsible-005"] [data-part="body"]{
margin:0;padding:0 0.75rem 0.875rem 3rem;
font-size:0.8125rem;line-height:1.55;color:var(--vibeui-collapsible-005-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="collapsible-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Collapsible005Step[] = [
  {
    label: "Подключить реестр",
    text: "Добавьте адрес реестра в components.json — после этого CLI видит компоненты по короткому имени.",
    open: true,
  },
  {
    label: "Установить компонент",
    text: "Команда кладёт один файл в components/vibeui и ничего больше не трогает: зависимостей у него нет.",
  },
  {
    label: "Подставить свои данные",
    text: "Пропсы описаны в metadata: подмените тексты и массивы, разметку и палитру оставьте как есть.",
  },
]

/**
 * Группа свёрток с одной открытой за раз: взаимное исключение держит атрибут
 * name у details. Один файл, ноль зависимостей, клиентского кода нет.
 */
export function Collapsible005({
  steps = DEFAULT_STEPS,
  groupName = "vibeui-collapsible-005",
  accent,
  className,
  style,
  ...props
}: Collapsible005Props) {
  const palette = {
    ...(accent ? { "--vibeui-collapsible-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-collapsible-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="collapsible-005"
        className={className}
        style={palette}
      >
        {steps.map((step) => (
          <details key={step.label} name={groupName} open={step.open}>
            <summary>
              {step.label}
              <span data-part="mark" aria-hidden="true" />
            </summary>
            <p data-part="body">{step.text}</p>
          </details>
        ))}
      </div>
    </>
  )
}
