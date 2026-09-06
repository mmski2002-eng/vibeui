import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Label001Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  hint?: string
  placeholder?: string
  /** Расшифровка звёздочки для озвучки: читается вместо слова «звёздочка». */
  requiredText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: звёздочка сама по себе ничего не объясняет — половина
// людей читает её как «важное», а не «без этого форму не отправить».
// Поэтому здесь звёздочка нарисована, продублирована текстом для
// скринридера и подкреплена одной строкой, которая говорит зачем поле.
const STYLES = `
:where([data-vibeui-block="label-001"]){
--vibeui-label-001-surface:transparent;
--vibeui-label-001-surface-border:light-dark(oklch(0.91 0 265),oklch(0.33 0 265));
--vibeui-label-001-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-label-001-muted:color-mix(in oklab,var(--vibeui-label-001-fg) 68%,transparent);
--vibeui-label-001-field-border:light-dark(oklch(0.85 0 265),oklch(0.4 0 265));
--vibeui-label-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.16 262));
--vibeui-label-001-required:light-dark(oklch(0.58 0.19 25),oklch(0.74 0.16 25));
--vibeui-label-001-radius:0.625rem;
--vibeui-label-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="label-001"]{color-scheme:dark}
/* Подложки по умолчанию нет: палитра идёт от color-scheme окружения, и блок
   ложится на фон страницы. Плашка появляется только пропом background. */
[data-vibeui-block="label-001"]{
box-sizing:border-box;width:100%;max-width:24rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-label-001-surface);
border:1px solid var(--vibeui-label-001-surface-border);
font-family:var(--vibeui-label-001-font);color:var(--vibeui-label-001-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="label-001"] label{
display:inline-flex;align-items:baseline;gap:0.25rem;
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
/* Звёздочка декоративна: её значение уносит соседний текст для чтения
   вслух, иначе скринридер произносит «звёздочка» и оставляет гадать. */
[data-vibeui-block="label-001"] [data-part="star"]{
color:var(--vibeui-label-001-required);font-size:0.9375rem;line-height:1;
}
[data-vibeui-block="label-001"] [data-part="sr"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="label-001"] [data-part="hint"]{
margin:0;font-size:0.8125rem;line-height:1.45;
color:var(--vibeui-label-001-muted);
}
[data-vibeui-block="label-001"] input{
box-sizing:border-box;width:100%;margin-top:0.125rem;
height:2.5rem;padding:0 0.75rem;
font:inherit;font-size:0.9375rem;font-weight:400;
color:var(--vibeui-label-001-fg);background:var(--vibeui-label-001-surface);
border:1px solid var(--vibeui-label-001-field-border);
border-radius:var(--vibeui-label-001-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="label-001"] input::placeholder{color:var(--vibeui-label-001-muted)}
[data-vibeui-block="label-001"] input:focus-visible{
outline:none;border-color:var(--vibeui-label-001-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-label-001-accent) 22%,transparent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="label-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Подпись обязательного поля: звёздочка, скрытая расшифровка для
 * скринридера и строка-объяснение под подписью. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Label001({
  label = "Рабочая почта",
  hint = "Пришлём на неё счёт и доступ в кабинет.",
  placeholder = "name@company.com",
  requiredText = ", обязательное поле",
  background = "",
  accent,
  className,
  style,
  ...props
}: Label001Props) {
  const id = useId()
  const hintId = `${id}-hint`
  const palette = {
    ...(accent ? { "--vibeui-label-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-label-001-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-label-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="label"
        data-vibeui-block="label-001"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>
          {label}
          <span data-part="star" aria-hidden="true">
            *
          </span>
          <span data-part="sr">{requiredText}</span>
        </label>
        <p data-part="hint" id={hintId}>
          {hint}
        </p>
        <input
          id={id}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={placeholder}
          aria-describedby={hintId}
        />
      </div>
    </>
  )
}
