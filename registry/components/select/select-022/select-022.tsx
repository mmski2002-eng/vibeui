import type { ComponentProps, CSSProperties } from "react"

export type Select022Option = {
  value: string
  label: string
}

export type Select022Props = Omit<ComponentProps<"p">, "children"> & {
  before?: string
  after?: string
  label?: string
  name?: string
  options?: Select022Option[]
  defaultValue?: string
  accent?: string
}

// Идея компонента: select — часть предложения, а не отдельное поле формы.
// Ширина берётся из текста текущего варианта через field-sizing:content,
// в браузерах без поддержки остаётся разумная минимальная ширина —
// компонент не ломается, просто теряет точную подгонку.
const STYLES = `
:where([data-vibeui-block="select-022"]){
--vibeui-select-022-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-select-022-muted:color-mix(in oklab,var(--vibeui-select-022-fg) 68%,transparent);
--vibeui-select-022-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-select-022-tint:light-dark(oklch(0.287 0 0 / 10%),oklch(0.905 0 0 / 18%));
--vibeui-select-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-022"]{color-scheme:dark}
[data-vibeui-block="select-022"]{
/* width вместе с max-width: container-type отвязывает ширину от содержимого,
   и без явной ширины строка схлопывается в кадре, который центрирует
   содержимое флексом. */
margin:0;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:26rem;
font-family:var(--vibeui-select-022-font);font-size:0.9375rem;line-height:1.6;
color:var(--vibeui-select-022-fg);
container-type:inline-size;
}
[data-vibeui-block="select-022"] select{
appearance:none;-webkit-appearance:none;
display:inline-flex;align-items:center;vertical-align:baseline;
min-width:3.5rem;max-width:100%;field-sizing:content;
margin:0 0.125rem;padding:0.0625rem 1.25rem 0.0625rem 0.375rem;
border:none;border-bottom:1.5px dashed var(--vibeui-select-022-accent);
border-radius:0.25rem;
background:var(--vibeui-select-022-tint)
  linear-gradient(var(--vibeui-select-022-tint),var(--vibeui-select-022-tint)),
  linear-gradient(45deg,transparent 50%,var(--vibeui-select-022-muted) 50%),
  linear-gradient(135deg,var(--vibeui-select-022-muted) 50%,transparent 50%);
background-position:0 0,right 0.7rem center,right 0.45rem center;
background-size:100% 100%,0.3rem 0.3rem,0.3rem 0.3rem;
background-repeat:no-repeat;
color:var(--vibeui-select-022-accent);font:inherit;font-weight:600;cursor:pointer;
transition:background-color .16s ease;
}
[data-vibeui-block="select-022"] select:hover{
background-color:color-mix(in oklab,var(--vibeui-select-022-accent) 16%,transparent);
}
[data-vibeui-block="select-022"] select:focus-visible{
outline:2px solid var(--vibeui-select-022-accent);outline-offset:2px;
}
@container (max-width: 12rem){
[data-vibeui-block="select-022"] select{font-size:0.875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-022"] select{transition:none!important}}
`

const DEFAULT_OPTIONS: Select022Option[] = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
]

/**
 * Компактный select, вживлённый в строку текста: подпись, стрелка и рамка
 * поля не нужны — вариант читается как часть предложения. Один файл,
 * ноль зависимостей, серверный компонент.
 */
export function Select022({
  before = "Показывать по",
  after = "карточек на странице.",
  label = "Число карточек на странице",
  name,
  options = DEFAULT_OPTIONS,
  defaultValue = options[0]?.value,
  accent,
  id,
  className,
  style,
  ...props
}: Select022Props) {
  const palette = {
    ...(accent ? { "--vibeui-select-022-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-022" precedence="medium">
        {STYLES}
      </style>
      <p
        {...props}
        data-slot="select"
        data-vibeui-block="select-022"
        className={className}
        style={palette}
      >
        {before}{" "}
        <select
          id={id}
          name={name}
          defaultValue={defaultValue}
          aria-label={label}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>{" "}
        {after}
      </p>
    </>
  )
}
