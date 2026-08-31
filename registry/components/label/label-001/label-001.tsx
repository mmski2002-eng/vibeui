import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Label001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  hint?: string
  placeholder?: string
  accent?: string
}

// Идея компонента: звёздочка сама по себе ничего не объясняет — половина
// людей читает её как «важное», а не «без этого форму не отправить».
// Поэтому здесь звёздочка нарисована, продублирована текстом для
// скринридера и подкреплена одной строкой, которая говорит зачем поле.
const STYLES = `
:where([data-vibeui-block="label-001"]){
--vibeui-label-001-surface:oklch(1 0 0);
--vibeui-label-001-surface-border:oklch(0.91 0.006 265);
--vibeui-label-001-fg:oklch(0.24 0.016 265);
--vibeui-label-001-muted:oklch(0.54 0.014 265);
--vibeui-label-001-field-border:oklch(0.85 0.01 265);
--vibeui-label-001-accent:oklch(0.55 0.2 262);
--vibeui-label-001-required:oklch(0.58 0.19 25);
--vibeui-label-001-radius:0.625rem;
--vibeui-label-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная светлая подложка: подпись — это тёмный текст, и на тёмной
   карточке каталога он обязан читаться без правки палитры проекта. */
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
 * Подпись обязательного поля: звёздочка, скрытая расшифровка для
 * скринридера и строка-объяснение под подписью. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Label001({
  label = "Рабочая почта",
  hint = "Пришлём на неё счёт и доступ в кабинет.",
  placeholder = "name@company.com",
  accent,
  className,
  style,
  ...props
}: Label001Props) {
  const id = useId()
  const hintId = `${id}-hint`
  const palette = {
    ...(accent ? { "--vibeui-label-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-label-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="label-001"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>
          {label}
          <span data-part="star" aria-hidden="true">
            *
          </span>
          <span data-part="sr">, обязательное поле</span>
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
