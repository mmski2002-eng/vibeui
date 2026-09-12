import type { ComponentProps, CSSProperties } from "react"

export type Button007Props = ComponentProps<"button"> & {
  /** Инициалы для стопки аватаров. Картинок нет намеренно: ноль запросов. */
  people?: string[]
  hint?: string
  accent?: string
}

// Идея компонента: социальное доказательство внутри самой кнопки. Слева —
// стопка перекрывающихся аватаров из инициалов, справа от подписи — тихая
// строка с количеством. Аватары нарисованы CSS, поэтому нет ни картинок,
// ни сетевых запросов, ни зависимостей.
//
// Пятно кнопки тёмное по замыслу, но не одинаково тёмное: через light-dark()
// в тёмном контексте оно светлее фона страницы, иначе пилюля растворилась бы
// в ней. Подпись остаётся светлой в обеих ветках.
const STYLES = `
:where([data-vibeui-block="button-007"]){
--vibeui-button-007-bg:light-dark(oklch(0.22 0 265),oklch(0.33 0 265));
--vibeui-button-007-fg:oklch(0.98 0 265);
--vibeui-button-007-hint:light-dark(oklch(0.72 0 265),oklch(0.78 0 265));
--vibeui-button-007-avatar:light-dark(oklch(0.305 0 0),oklch(0.892 0 0));
--vibeui-button-007-avatar-fg:oklch(0.99 0 250);
--vibeui-button-007-ring:light-dark(oklch(0.72 0 265),oklch(0.84 0 265));
--vibeui-button-007-radius:9999px;
--vibeui-button-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-007"]{color-scheme:dark}
[data-vibeui-block="button-007"]{
appearance:none;cursor:pointer;border:0;
display:inline-flex;align-items:center;gap:0.625rem;
height:2.75rem;padding:0 1.125rem 0 0.5rem;border-radius:var(--vibeui-button-007-radius);
font-family:var(--vibeui-button-007-font);font-size:0.875rem;font-weight:500;line-height:1;
background:var(--vibeui-button-007-bg);color:var(--vibeui-button-007-fg);
transition:background-color .18s ease;
}
[data-vibeui-block="button-007"] [data-part="stack"]{display:inline-flex;flex:none}
[data-vibeui-block="button-007"] [data-part="avatar"]{
width:1.75rem;height:1.75rem;border-radius:9999px;flex:none;
display:inline-flex;align-items:center;justify-content:center;
font-size:0.625rem;font-weight:600;letter-spacing:0.02em;
background:var(--vibeui-button-007-avatar);color:var(--vibeui-button-007-avatar-fg);
box-shadow:0 0 0 2px var(--vibeui-button-007-bg);
transition:transform .22s cubic-bezier(0.16,1,0.3,1);
}
/* Нахлёст меньше половины буквы: при -0.5rem соседний кружок съедал
   вторую букву инициалов, и стопка читалась как каша. */
[data-vibeui-block="button-007"] [data-part="avatar"]+[data-part="avatar"]{margin-left:-0.3125rem}
[data-vibeui-block="button-007"] [data-part="avatar"]:nth-child(2){background:color-mix(in oklab, var(--vibeui-button-007-avatar) 70%, oklch(0.7 0.14 55))}
[data-vibeui-block="button-007"] [data-part="avatar"]:nth-child(3){background:color-mix(in oklab, var(--vibeui-button-007-avatar) 55%, oklch(0.55 0.19 25))}
[data-vibeui-block="button-007"]:hover:not(:disabled){background:color-mix(in oklab, var(--vibeui-button-007-bg) 82%, white)}
[data-vibeui-block="button-007"]:hover:not(:disabled) [data-part="avatar"]{margin-left:-0.25rem}
[data-vibeui-block="button-007"]:hover:not(:disabled) [data-part="avatar"]:first-child{margin-left:0}
[data-vibeui-block="button-007"] [data-part="hint"]{color:var(--vibeui-button-007-hint);font-size:0.8125rem;font-weight:400}
[data-vibeui-block="button-007"]:focus-visible{outline:2px solid var(--vibeui-button-007-ring);outline-offset:2px}
[data-vibeui-block="button-007"]:disabled{cursor:not-allowed;opacity:.55}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-007"] *{transition:none!important}}
`

/**
 * Кнопка с социальным доказательством: стопка аватаров и тихий счётчик.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button007({
  people = ["АК", "МД", "ЛП"],
  hint = "+2 400 команд",
  accent,
  type = "button",
  className,
  style,
  children = "Присоединиться",
  ...props
}: Button007Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-007-avatar": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-007" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-007"
        className={className}
        style={palette}
      >
        <span data-part="stack" aria-hidden="true">
          {people.map((initials) => (
            <span data-part="avatar" key={initials}>
              {initials}
            </span>
          ))}
        </span>
        {children}
        {hint ? <span data-part="hint">{hint}</span> : null}
      </button>
    </>
  )
}
