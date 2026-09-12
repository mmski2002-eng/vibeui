import type { ComponentProps, CSSProperties } from "react"

export type Field003Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  placeholder?: string
  /** Расшифровка звёздочки в title у abbr. */
  requiredTitle?: string
  /** То же слово для screen reader: звёздочку он не читает. */
  requiredNote?: string
  optionalLabel?: string
  optionalTitle?: string
  optionalPlaceholder?: string
  legend?: string
  name?: string
  /** Пусто — подложки нет, форма лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: звёздочка, которая объясняет себя. Символ «*» ничего не
// значит для того, кто видит форму впервые, и совсем ничего — для screen
// reader. Здесь он обёрнут в <abbr> с расшифровкой, продублирован скрытым
// словом «обязательно» и объяснён сноской под парой полей. Рядом стоит
// необязательное поле с явной меткой: пара показывает разницу, а не намекает.
const STYLES = `
:where([data-vibeui-block="field-003"]){
--vibeui-field-003-bg:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-field-003-surface:transparent;
--vibeui-field-003-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-field-003-muted:color-mix(in oklab,var(--vibeui-field-003-fg) 68%,transparent);
--vibeui-field-003-border:light-dark(oklch(0.88 0 265),oklch(0.4 0 265));
--vibeui-field-003-shell:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-field-003-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-field-003-danger:light-dark(oklch(0.55 0.19 25),oklch(0.73 0.16 25));
--vibeui-field-003-edge:light-dark(oklch(0.348 0 0),oklch(0.863 0 0));
--vibeui-field-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="field-003"]{color-scheme:dark}
/* Подложки по умолчанию нет: форма ложится на фон страницы. */
[data-vibeui-block="field-003"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-field-003-surface);
border:1px solid var(--vibeui-field-003-shell);border-radius:0.875rem;
font-family:var(--vibeui-field-003-font);color:var(--vibeui-field-003-fg);
}
[data-vibeui-block="field-003"] *{box-sizing:border-box}
[data-vibeui-block="field-003"] [data-part="row"]{display:flex;flex-direction:column;gap:0.3125rem}
[data-vibeui-block="field-003"] label{
display:flex;align-items:baseline;gap:0.25rem;
font-size:0.8125rem;font-weight:600;
}
/* Звёздочка с расшифровкой: <abbr> объясняет символ и наведением, и вслух. */
[data-vibeui-block="field-003"] abbr{
color:var(--vibeui-field-003-danger);text-decoration:none;
font-weight:700;cursor:help;
}
[data-vibeui-block="field-003"] [data-part="optional"]{
font-size:0.75rem;font-weight:500;color:var(--vibeui-field-003-muted);
}
[data-vibeui-block="field-003"] input{
width:100%;height:2.375rem;padding:0 0.75rem;
background:var(--vibeui-field-003-bg);color:inherit;
border:1px solid var(--vibeui-field-003-border);border-radius:0.625rem;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="field-003"] input::placeholder{color:var(--vibeui-field-003-muted)}
[data-vibeui-block="field-003"] input:focus-visible{
outline:2px solid var(--vibeui-field-003-accent);outline-offset:1px;
border-color:var(--vibeui-field-003-accent);
}
[data-vibeui-block="field-003"] input[required]{
border-inline-start:3px solid var(--vibeui-field-003-edge);
}
/* Сноска рядом с полями, а не в конце длинной формы: там её не читают. */
[data-vibeui-block="field-003"] [data-part="legend"]{
display:flex;align-items:flex-start;gap:0.375rem;margin:0;
padding-top:0.5rem;border-top:1px dashed var(--vibeui-field-003-border);
font-size:0.75rem;line-height:1.4;color:var(--vibeui-field-003-muted);
}
[data-vibeui-block="field-003"] [data-part="legend"] span{color:var(--vibeui-field-003-danger);font-weight:700}
[data-vibeui-block="field-003"] [data-part="sr"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="field-003"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Обязательное поле со звёздочкой, у которой есть расшифровка и сноска.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Field003({
  label = "Юридическое название",
  placeholder = "ООО «Ромашка»",
  requiredTitle = "обязательное поле",
  requiredNote = ", обязательное поле",
  optionalLabel = "необязательно",
  optionalTitle = "Комментарий",
  optionalPlaceholder = "Что важно знать заранее",
  legend = "Звёздочкой отмечены поля, без которых заявку не примут.",
  name = "company",
  background = "",
  accent,
  className,
  style,
  ...props
}: Field003Props) {
  const palette = {
    ...(accent ? { "--vibeui-field-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-field-003-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-field-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="field"
        data-vibeui-block="field-003"
        className={className}
        style={palette}
      >
        <div data-part="row">
          <label htmlFor={`${name}-required`}>
            {label}
            <abbr title={requiredTitle} aria-hidden="true">
              *
            </abbr>
            <span data-part="sr">{requiredNote}</span>
          </label>
          <input
            id={`${name}-required`}
            name={name}
            type="text"
            required
            aria-required="true"
            placeholder={placeholder}
          />
        </div>

        <div data-part="row">
          <label htmlFor={`${name}-optional`}>
            {optionalTitle}
            <span data-part="optional">· {optionalLabel}</span>
          </label>
          <input
            id={`${name}-optional`}
            name={`${name}-comment`}
            type="text"
            placeholder={optionalPlaceholder}
          />
        </div>

        <p data-part="legend">
          <span aria-hidden="true">*</span>
          {legend}
        </p>
      </div>
    </>
  )
}
