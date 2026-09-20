import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Label002Props = Omit<ComponentProps<"div">, "children"> & {
  /**
   * Показать подсказку развёрнутой в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  label?: string
  question?: string
  answer?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: длинное объяснение рядом с подписью загромождает форму,
// а всплывающая подсказка обычно требует JS и мыши. Здесь кнопка-вопрос
// открывает нативный popover через popovertarget: работает без единой
// строчки скрипта, закрывается по Esc и по клику мимо, а с клавиатуры
// это обычная кнопка в порядке обхода.
const STYLES = `
:where([data-vibeui-block="label-002"]){
--vibeui-label-002-surface:transparent;
--vibeui-label-002-surface-border:light-dark(oklch(0.91 0 265),oklch(0.33 0 265));
--vibeui-label-002-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-label-002-muted:color-mix(in oklab,var(--vibeui-label-002-fg) 68%,transparent);
--vibeui-label-002-field-border:light-dark(oklch(0.85 0 265),oklch(0.4 0 265));
--vibeui-label-002-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-label-002-tip-bg:light-dark(oklch(0.22 0 265),oklch(0.34 0 265));
--vibeui-label-002-tip-fg:light-dark(oklch(0.97 0 265),oklch(0.96 0 265));
--vibeui-label-002-radius:0.625rem;
--vibeui-label-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="label-002"]{color-scheme:dark}
[data-vibeui-block="label-002"]{
box-sizing:border-box;width:100%;max-width:24rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-label-002-surface);
border:1px solid var(--vibeui-label-002-surface-border);
font-family:var(--vibeui-label-002-font);color:var(--vibeui-label-002-fg);
display:flex;flex-direction:column;gap:0.4375rem;
}
[data-vibeui-block="label-002"] [data-part="row"]{
display:flex;align-items:center;gap:0.375rem;
}
[data-vibeui-block="label-002"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="label-002"] [data-part="ask"]{
appearance:none;flex:none;cursor:pointer;
width:1.125rem;height:1.125rem;padding:0;
display:inline-flex;align-items:center;justify-content:center;
font:inherit;font-size:0.75rem;font-weight:700;line-height:1;
color:var(--vibeui-label-002-muted);background:transparent;
border:1px solid var(--vibeui-label-002-field-border);border-radius:50%;
anchor-name:--vibeui-label-002-ask;
transition:color .16s ease,border-color .16s ease;
}
[data-vibeui-block="label-002"] [data-part="ask"]:hover{
color:var(--vibeui-label-002-accent);border-color:var(--vibeui-label-002-accent);
}
[data-vibeui-block="label-002"] [data-part="ask"]:focus-visible{
outline:2px solid var(--vibeui-label-002-accent);outline-offset:2px;
}
/* Без поддержки anchor-position браузер сам ставит popover по центру
   экрана — это некрасиво, но подсказка всё равно читается. */
[data-vibeui-block="label-002"] [data-part="tip"]{
box-sizing:border-box;margin:auto;padding:0.625rem 0.75rem;
max-width:17rem;border:0;border-radius:0.625rem;
font-family:var(--vibeui-label-002-font);font-size:0.8125rem;line-height:1.45;
color:var(--vibeui-label-002-tip-fg);background:var(--vibeui-label-002-tip-bg);
box-shadow:0 12px 28px oklch(0.2 0 265 / 28%);
}
@supports (anchor-name: --a){
[data-vibeui-block="label-002"] [data-part="tip"]{
position-anchor:--vibeui-label-002-ask;
margin:0.375rem 0 0;
position-area:bottom span-right;
position-try-fallbacks:flip-block,flip-inline;
}
}
[data-vibeui-block="label-002"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
font:inherit;font-size:0.9375rem;
color:var(--vibeui-label-002-fg);background:var(--vibeui-label-002-surface);
border:1px solid var(--vibeui-label-002-field-border);
border-radius:var(--vibeui-label-002-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="label-002"] input::placeholder{color:var(--vibeui-label-002-muted)}
[data-vibeui-block="label-002"] input:focus-visible{
outline:none;border-color:var(--vibeui-label-002-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-label-002-accent) 22%,transparent);
}
/* Развёрнутый режим: подсказка стоит в потоке под подписью, а не в верхнем слое. */
[data-vibeui-block="label-002"] [data-part="tip"][data-open="true"]{
position:static;margin:0.375rem 0 0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="label-002"] *{animation:none!important;transition:none!important}}
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
 * Подпись с кнопкой-вопросом: объяснение живёт в нативном popover и
 * открывается без JS. Один файл, ноль зависимостей, собственная палитра.
 */
export function Label002({
  open = false,
  label = "Код подразделения",
  question = "Где взять код подразделения",
  answer = "Четыре цифры из шапки договора, строка «Подразделение». Если договора под рукой нет, код подскажет ваш менеджер.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Label002Props) {
  const id = useId()
  const tipId = `${id}-tip`
  const palette = {
    ...(accent ? { "--vibeui-label-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-label-002-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-label-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="label"
        data-vibeui-block="label-002"
        className={className}
        style={palette}
      >
        <div data-part="row">
          <label htmlFor={id}>{label}</label>
          <button
            data-part="ask"
            type="button"
            popoverTarget={tipId}
            aria-label={question}
          >
            <span aria-hidden="true">?</span>
          </button>
        </div>
        <div
          data-part="tip"
          id={tipId}
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
        >
          {answer}
        </div>
        <input id={id} type="text" name="unit" inputMode="numeric" />
      </div>
    </>
  )
}
