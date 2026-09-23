import type { ComponentProps, CSSProperties } from "react"

export type Input034Props = Omit<ComponentProps<"textarea">, "placeholder"> & {
  label?: string
  /** Подсказка под полем. В состоянии ошибки её место занимает текст ошибки. */
  hint?: string
  /** Текст ошибки. Непустая строка переводит поле в невалидное состояние. */
  error?: string
  /** Высота в строках; тянуть за угол можно только вниз. */
  rows?: number
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: многострочное поле с той же плавающей подписью, что у
// input-001, — форма из полей и сообщения выглядит одним набором. Подпись
// стоит в поле, пока оно пустое, и уезжает в верхний край при вводе; всё
// держится на :placeholder-shown, JS не нужен. Тянуть можно только по
// вертикали: горизонтальное растягивание ломает сетку формы.
const STYLES = `
:where([data-vibeui-block="input-034"]){
--vibeui-input-034-surface:transparent;
--vibeui-input-034-surface-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-input-034-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-input-034-muted:color-mix(in oklab,var(--vibeui-input-034-fg) 68%,transparent);
--vibeui-input-034-bg:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-input-034-border:light-dark(oklch(0.87 0 265),oklch(0.42 0 265));
--vibeui-input-034-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-input-034-danger:light-dark(oklch(0.55 0.19 25),oklch(0.74 0.16 25));
--vibeui-input-034-radius:0.625rem;
--vibeui-input-034-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-034"]{color-scheme:dark}
[data-vibeui-block="input-034"]{
box-sizing:border-box;
display:flex;flex-direction:column;gap:0.375rem;
font-family:var(--vibeui-input-034-font);color:var(--vibeui-input-034-fg);
}
[data-vibeui-block="input-034"][data-surface="on"]{
padding:0.875rem;
background:var(--vibeui-input-034-surface);
border:1px solid var(--vibeui-input-034-surface-border);border-radius:0.875rem;
}
[data-vibeui-block="input-034"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="input-034"] textarea{
display:block;width:100%;box-sizing:border-box;margin:0;
min-height:3.5rem;padding:1.5rem 0.875rem 0.625rem;
border:1px solid var(--vibeui-input-034-border);
border-radius:var(--vibeui-input-034-radius);
background:var(--vibeui-input-034-bg);color:inherit;
font:inherit;font-size:0.9375rem;line-height:1.5;
resize:vertical;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-034"] textarea:hover:not(:disabled):not(:focus){border-color:var(--vibeui-input-034-muted)}
[data-vibeui-block="input-034"] textarea:focus{
outline:none;border-color:var(--vibeui-input-034-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-034-accent) 22%,transparent);
}
[data-vibeui-block="input-034"] textarea:disabled{
cursor:not-allowed;opacity:.55;
background:color-mix(in oklab,var(--vibeui-input-034-border) 25%,var(--vibeui-input-034-bg));
}
[data-vibeui-block="input-034"] [data-part="label"]{
position:absolute;left:0.9375rem;top:0.5rem;
font-size:0.6875rem;font-weight:500;letter-spacing:0.01em;
color:var(--vibeui-input-034-muted);
transform-origin:left top;pointer-events:none;
transition:transform .16s ease,color .16s ease;
}
[data-vibeui-block="input-034"] textarea:placeholder-shown:not(:focus) + [data-part="label"]{
transform:translateY(0.625rem) scale(1.32);
}
[data-vibeui-block="input-034"] textarea:focus + [data-part="label"]{color:var(--vibeui-input-034-accent)}
[data-vibeui-block="input-034"] [data-part="note"]{
font-size:0.75rem;line-height:1.35;color:var(--vibeui-input-034-muted);
}
[data-vibeui-block="input-034"][data-invalid="true"] textarea{border-color:var(--vibeui-input-034-danger)}
[data-vibeui-block="input-034"][data-invalid="true"] textarea:focus{
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-034-danger) 22%,transparent);
}
[data-vibeui-block="input-034"][data-invalid="true"] [data-part="label"],
[data-vibeui-block="input-034"][data-invalid="true"] [data-part="note"]{color:var(--vibeui-input-034-danger)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-034"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Многострочное поле с плавающей подписью — пара к input-001.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input034({
  label = "Сообщение",
  hint = "",
  error = "",
  rows = 4,
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Input034Props) {
  const palette = {
    ...(accent ? { "--vibeui-input-034-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-034-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const invalid = Boolean(error)
  const note = error || hint
  const noteId = id && note ? `${id}-note` : undefined

  return (
    <>
      <style href="vibeui-input-034" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="input"
        data-vibeui-block="input-034"
        data-surface={background ? "on" : undefined}
        data-invalid={invalid || undefined}
        className={className}
        style={palette}
      >
        <label data-part="field">
          <textarea
            {...props}
            id={id}
            rows={rows}
            placeholder=" "
            aria-invalid={invalid || undefined}
            aria-describedby={noteId}
          />
          <span data-part="label">{label}</span>
        </label>
        {note ? (
          <span data-part="note" id={noteId} role={invalid ? "alert" : undefined}>
            {note}
          </span>
        ) : null}
      </div>
    </>
  )
}
