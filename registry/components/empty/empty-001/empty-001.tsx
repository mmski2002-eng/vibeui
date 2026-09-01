import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Empty001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "title" | "children"
> & {
  title?: string
  description?: string
  /** Подпись главного действия. Пустая строка убирает кнопку. */
  actionLabel?: string
  /** Второстепенная подсказка под кнопкой: горячая клавиша, ссылка на импорт. */
  hint?: ReactNode
  onAction?: () => void
  accent?: string
}

// Идея компонента: пустой экран объясняет, что делать, а не сообщает об
// отсутствии данных. Поэтому главное здесь — действие, а рисунок собран из
// трёх плиток на CSS: он намекает на будущий список, но не отвлекает.
const STYLES = `
:where([data-vibeui-block="empty-001"]){
--vibeui-empty-001-fg:oklch(0.24 0.016 265);
--vibeui-empty-001-muted:oklch(0.52 0.014 265);
--vibeui-empty-001-bg:oklch(0.985 0.002 265);
--vibeui-empty-001-border:oklch(0.9 0.006 265);
--vibeui-empty-001-accent:oklch(0.55 0.2 262);
--vibeui-empty-001-accent-fg:oklch(1 0 0);
--vibeui-empty-001-radius:1rem;
--vibeui-empty-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="empty-001"]{
display:flex;flex-direction:column;align-items:center;text-align:center;
gap:0.5rem;width:100%;box-sizing:border-box;
padding:2.5rem 1.5rem;
border:1px dashed var(--vibeui-empty-001-border);
border-radius:var(--vibeui-empty-001-radius);
background:var(--vibeui-empty-001-bg);color:var(--vibeui-empty-001-fg);
font-family:var(--vibeui-empty-001-font);
}
/* Рисунок: три плитки будущего списка, задняя приподнята и повёрнута. */
[data-vibeui-block="empty-001"] [data-part="art"]{
position:relative;width:4.5rem;height:3rem;margin-bottom:0.75rem;
}
[data-vibeui-block="empty-001"] [data-part="art"] span{
position:absolute;left:0;right:0;height:0.875rem;border-radius:0.3125rem;
border:1px solid var(--vibeui-empty-001-border);
background:oklch(1 0 0);
}
[data-vibeui-block="empty-001"] [data-part="art"] span:nth-child(1){top:0;transform:rotate(-4deg) scale(0.9);opacity:.65}
[data-vibeui-block="empty-001"] [data-part="art"] span:nth-child(2){top:1rem;transform:rotate(2deg) scale(0.96);opacity:.85}
[data-vibeui-block="empty-001"] [data-part="art"] span:nth-child(3){
top:2rem;border-color:color-mix(in oklab,var(--vibeui-empty-001-accent) 45%,var(--vibeui-empty-001-border));
}
[data-vibeui-block="empty-001"] [data-part="title"]{margin:0;font-size:1rem;font-weight:600;line-height:1.35}
[data-vibeui-block="empty-001"] [data-part="description"]{
margin:0;max-width:32ch;font-size:0.875rem;line-height:1.55;color:var(--vibeui-empty-001-muted);
}
[data-vibeui-block="empty-001"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;margin-top:0.75rem;
display:inline-flex;align-items:center;height:2.25rem;padding:0 1rem;
border-radius:0.5rem;font:inherit;font-size:0.875rem;font-weight:500;
background:var(--vibeui-empty-001-accent);color:var(--vibeui-empty-001-accent-fg);
transition:background-color .16s ease;
}
[data-vibeui-block="empty-001"] [data-part="action"]:hover{background:color-mix(in oklab,var(--vibeui-empty-001-accent) 88%,black)}
[data-vibeui-block="empty-001"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-empty-001-accent);outline-offset:2px}
[data-vibeui-block="empty-001"] [data-part="hint"]{margin-top:0.5rem;font-size:0.75rem;color:var(--vibeui-empty-001-muted)}
/* Отступы корня заданы один раз: контейнерный запрос применяется к потомкам
   контейнера, но не к нему самому, поэтому здесь адаптируется типографика. */
@container (min-width: 30rem){
[data-vibeui-block="empty-001"] [data-part="title"]{font-size:1.125rem}
[data-vibeui-block="empty-001"] [data-part="description"]{font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Пустое состояние, объясняющее следующий шаг.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Empty001({
  title = "Здесь пока пусто",
  description = "Создайте первый проект — он появится в этом списке вместе с адресом и историей публикаций.",
  actionLabel = "Создать проект",
  hint = "Или перетащите сюда папку с готовым сайтом",
  onAction,
  accent,
  className,
  style,
  ...props
}: Empty001Props) {
  const palette = {
    ...(accent ? { "--vibeui-empty-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-empty-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="empty-001"
        className={className}
        style={palette}
      >
        <span data-part="art" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <p data-part="title">{title}</p>
        {description ? <p data-part="description">{description}</p> : null}
        {actionLabel ? (
          <button data-part="action" type="button" onClick={onAction}>
            {actionLabel}
          </button>
        ) : null}
        {hint ? <span data-part="hint">{hint}</span> : null}
      </div>
    </>
  )
}
