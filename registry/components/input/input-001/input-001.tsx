import type { ComponentProps, CSSProperties } from "react"

export type Input001Size = "md" | "lg"

export type Input001Props = Omit<
  ComponentProps<"input">,
  "size" | "placeholder"
> & {
  label?: string
  /** Подсказка под полем. В состоянии ошибки её место занимает текст ошибки. */
  hint?: string
  /** Текст ошибки. Непустая строка переводит поле в невалидное состояние. */
  error?: string
  size?: Input001Size
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: подпись живёт внутри рамки и уезжает в неё же при вводе.
// Поле не занимает вертикаль на отдельную подпись, но подпись никогда не
// исчезает — в отличие от placeholder, который пропадает вместе с контекстом.
// Всё держится на :placeholder-shown, поэтому JS не нужен.
const STYLES = `
:where([data-vibeui-block="input-001"]){
--vibeui-input-001-surface:transparent;
--vibeui-input-001-surface-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-input-001-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-input-001-muted:color-mix(in oklab,var(--vibeui-input-001-fg) 68%,transparent);
--vibeui-input-001-bg:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-input-001-border:light-dark(oklch(0.87 0 265),oklch(0.42 0 265));
--vibeui-input-001-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.74 0.16 39.8));
--vibeui-input-001-danger:light-dark(oklch(0.55 0.19 25),oklch(0.74 0.16 25));
--vibeui-input-001-radius:0.625rem;
--vibeui-input-001-height:3.5rem;
--vibeui-input-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-001"]{color-scheme:dark}
[data-vibeui-block="input-001"]{
box-sizing:border-box;
display:flex;flex-direction:column;gap:0.375rem;
font-family:var(--vibeui-input-001-font);color:var(--vibeui-input-001-fg);
}
/* Подложка появляется только вместе с пропом background: без него поле
   лежит прямо на фоне страницы и рамка вокруг пустоты ему не нужна. */
[data-vibeui-block="input-001"][data-surface="on"]{
padding:0.875rem;
background:var(--vibeui-input-001-surface);
border:1px solid var(--vibeui-input-001-surface-border);border-radius:0.875rem;
}
[data-vibeui-block="input-001"][data-size="lg"]{--vibeui-input-001-height:4rem}
[data-vibeui-block="input-001"] [data-part="field"]{
position:relative;display:block;
}
[data-vibeui-block="input-001"] input{
width:100%;box-sizing:border-box;margin:0;
height:var(--vibeui-input-001-height);
padding:1.375rem 0.875rem 0.5rem;
border:1px solid var(--vibeui-input-001-border);
border-radius:var(--vibeui-input-001-radius);
background:var(--vibeui-input-001-bg);color:inherit;
font:inherit;font-size:0.9375rem;line-height:1.2;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-001"][data-size="lg"] input{font-size:1rem;padding-top:1.625rem}
[data-vibeui-block="input-001"] input:hover:not(:disabled):not(:focus){border-color:var(--vibeui-input-001-muted)}
[data-vibeui-block="input-001"] input:focus{
outline:none;border-color:var(--vibeui-input-001-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-001-accent) 22%,transparent);
}
[data-vibeui-block="input-001"] input:disabled{
cursor:not-allowed;opacity:.55;
background:color-mix(in oklab,var(--vibeui-input-001-border) 25%,var(--vibeui-input-001-bg));
}
[data-vibeui-block="input-001"] [data-part="label"]{
position:absolute;left:0.9375rem;top:0.5rem;
font-size:0.6875rem;font-weight:500;letter-spacing:0.01em;
color:var(--vibeui-input-001-muted);
transform-origin:left top;pointer-events:none;
transition:transform .16s ease,color .16s ease;
}
/* Поле пустое и не в фокусе — подпись стоит на месте текста, ровно по
   центру поля. Сдвиг считается от высоты: у крупного размера он свой. */
[data-vibeui-block="input-001"] input:placeholder-shown:not(:focus) + [data-part="label"]{
transform:translateY(0.5625rem) scale(1.32);
}
[data-vibeui-block="input-001"][data-size="lg"] input:placeholder-shown:not(:focus) + [data-part="label"]{
transform:translateY(0.8125rem) scale(1.32);
}
[data-vibeui-block="input-001"] input:focus + [data-part="label"]{color:var(--vibeui-input-001-accent)}
[data-vibeui-block="input-001"] [data-part="note"]{
font-size:0.75rem;line-height:1.35;color:var(--vibeui-input-001-muted);
}
[data-vibeui-block="input-001"][data-invalid="true"] input{border-color:var(--vibeui-input-001-danger)}
[data-vibeui-block="input-001"][data-invalid="true"] input:focus{
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-001-danger) 22%,transparent);
}
[data-vibeui-block="input-001"][data-invalid="true"] [data-part="label"],
[data-vibeui-block="input-001"][data-invalid="true"] [data-part="note"]{color:var(--vibeui-input-001-danger)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-001"] *{animation:none!important;transition:none!important}}
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
 * Текстовое поле с подписью, которая уезжает внутрь рамки при вводе.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input001({
  label = "Рабочая почта",
  hint,
  error,
  size = "md",
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Input001Props) {
  const palette = {
    ...(accent ? { "--vibeui-input-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-001-surface": background,
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
      <style href="vibeui-input-001" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="input"
        data-vibeui-block="input-001"
        data-size={size}
        data-surface={background ? "on" : undefined}
        data-invalid={invalid || undefined}
        className={className}
        style={palette}
      >
        <label data-part="field">
          <input
            {...props}
            id={id}
            placeholder=" "
            aria-invalid={invalid || undefined}
            aria-describedby={noteId}
          />
          <span data-part="label">{label}</span>
        </label>
        {note ? (
          <span
            data-part="note"
            id={noteId}
            role={invalid ? "alert" : undefined}
          >
            {note}
          </span>
        ) : null}
      </div>
    </>
  )
}
