import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Radio004Option = {
  value: string
  label: string
  description: string
  meta?: string
}

export type Radio004Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  options?: Radio004Option[]
  name?: string
  defaultValue?: string
  accent?: string
}

// Идея компонента: варианты с последствиями. Когда выбор меняет поведение
// системы, одной подписи мало — под каждым пунктом стоит объяснение, а
// справа короткая метка вроде «по умолчанию». Карточек нет: список разделён
// линиями, выбранная строка помечена цветной полосой слева.
const STYLES = `
:where([data-vibeui-block="radio-004"]){
--vibeui-radio-004-bg:oklch(1 0 0);
--vibeui-radio-004-fg:oklch(0.22 0.014 265);
--vibeui-radio-004-muted:oklch(0.55 0.014 265);
--vibeui-radio-004-border:oklch(0.91 0.006 265);
--vibeui-radio-004-ring:oklch(0.74 0.012 265);
--vibeui-radio-004-accent:oklch(0.55 0.16 155);
--vibeui-radio-004-tint:oklch(0.55 0.16 155 / 6%);
--vibeui-radio-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="radio-004"]{
display:flex;flex-direction:column;
width:100%;max-width:23rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.5rem;
background:var(--vibeui-radio-004-bg);
border:1px solid var(--vibeui-radio-004-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-004-font);color:var(--vibeui-radio-004-fg);
}
[data-vibeui-block="radio-004"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.25rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-radio-004-muted);
}
[data-vibeui-block="radio-004"] [data-part="list"]{clear:both;display:flex;flex-direction:column}
[data-vibeui-block="radio-004"] [data-part="option"]{
position:relative;display:flex;align-items:flex-start;gap:0.75rem;
padding:0.75rem 0.5rem 0.75rem 0.75rem;margin:0 -0.5rem 0 -0.375rem;
border-radius:0.5rem;cursor:pointer;
transition:background-color .16s ease;
}
[data-vibeui-block="radio-004"] [data-part="option"] + [data-part="option"]{
box-shadow:inset 0 1px 0 var(--vibeui-radio-004-border);
}
/* Полоса слева вместо рамки вокруг: список остаётся сплошным, а выбранный
   пункт всё равно виден периферийным зрением. */
[data-vibeui-block="radio-004"] [data-part="option"]::before{
content:"";position:absolute;left:0;top:0.625rem;bottom:0.625rem;
width:0.1875rem;border-radius:9999px;background:transparent;
}
[data-vibeui-block="radio-004"] [data-part="option"]:has(input:checked){background:var(--vibeui-radio-004-tint)}
[data-vibeui-block="radio-004"] [data-part="option"]:has(input:checked)::before{background:var(--vibeui-radio-004-accent)}
[data-vibeui-block="radio-004"] input{
appearance:none;-webkit-appearance:none;flex:none;margin:0.125rem 0 0;cursor:pointer;
width:1.0625rem;height:1.0625rem;border-radius:9999px;
border:1.5px solid var(--vibeui-radio-004-ring);
background:var(--vibeui-radio-004-bg);
}
[data-vibeui-block="radio-004"] input:checked{
border-color:var(--vibeui-radio-004-accent);
box-shadow:inset 0 0 0 0.1875rem var(--vibeui-radio-004-bg),inset 0 0 0 1rem var(--vibeui-radio-004-accent);
}
[data-vibeui-block="radio-004"] input:focus-visible{outline:2px solid var(--vibeui-radio-004-accent);outline-offset:2px}
[data-vibeui-block="radio-004"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="radio-004"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="radio-004"] [data-part="meta"]{
flex:none;font-size:0.625rem;font-weight:600;letter-spacing:0.03em;
text-transform:uppercase;color:var(--vibeui-radio-004-muted);
}
[data-vibeui-block="radio-004"] [data-part="description"]{
font-size:0.75rem;line-height:1.45;color:var(--vibeui-radio-004-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Radio004Option[] = [
  {
    value: "private",
    label: "Только я",
    description:
      "Проект не виден никому, ссылка не работает даже по прямому адресу.",
    meta: "по умолчанию",
  },
  {
    value: "link",
    label: "По ссылке",
    description:
      "Открывается у всех, кто получил ссылку, но не индексируется поиском.",
  },
  {
    value: "public",
    label: "Публичный",
    description: "Попадает в общую галерею и может быть найден поисковиками.",
  },
]

/**
 * Радиогруппа с объяснением под каждым вариантом и полосой у выбранного.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio004({
  legend = "Доступ к проекту",
  options = DEFAULT_OPTIONS,
  name = "vibeui-radio-004",
  defaultValue = "link",
  accent,
  className,
  style,
  ...props
}: Radio004Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-004" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="radio-004"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="list">
          {options.map((option) => (
            <label key={option.value} data-part="option">
              <input
                type="radio"
                name={name}
                value={option.value}
                defaultChecked={option.value === defaultValue}
              />
              <span data-part="text">
                <span data-part="head">
                  {option.label}
                  {option.meta ? (
                    <span data-part="meta">{option.meta}</span>
                  ) : null}
                </span>
                <span data-part="description">{option.description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}
