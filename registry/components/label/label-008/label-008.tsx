import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Label008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  reason?: string
  actionText?: string
  actionHref?: string
  accent?: string
}

// Идея компонента: выключенное поле без объяснения читается как поломка.
// Поле здесь не disabled, а readonly с aria-disabled: так оно остаётся в
// порядке обхода, и скринридер успевает прочитать причину, привязанную
// через aria-describedby. Рядом стоит ссылка, снимающая запрет, — иначе
// тупик.
const STYLES = `
:where([data-vibeui-block="label-008"]){
--vibeui-label-008-surface:oklch(1 0 0);
--vibeui-label-008-surface-border:oklch(0.91 0.006 265);
--vibeui-label-008-fg:oklch(0.24 0.016 265);
--vibeui-label-008-muted:oklch(0.54 0.014 265);
--vibeui-label-008-locked-bg:oklch(0.97 0.003 265);
--vibeui-label-008-locked-border:oklch(0.89 0.008 265);
--vibeui-label-008-accent:oklch(0.55 0.2 262);
--vibeui-label-008-radius:0.625rem;
--vibeui-label-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="label-008"]{
box-sizing:border-box;width:100%;max-width:24rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-label-008-surface);
border:1px solid var(--vibeui-label-008-surface-border);
font-family:var(--vibeui-label-008-font);color:var(--vibeui-label-008-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="label-008"] [data-part="row"]{
display:flex;align-items:center;gap:0.375rem;
}
[data-vibeui-block="label-008"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;
color:var(--vibeui-label-008-muted);
}
/* Замок нарисован двумя прямоугольниками: корпус — фон элемента, дужка —
   рамка псевдоэлемента. Иконочный пакет ради одного значка не нужен. */
[data-vibeui-block="label-008"] [data-part="lock"]{
position:relative;flex:none;
width:0.625rem;height:0.5rem;margin-top:0.1875rem;border-radius:0.125rem;
background:var(--vibeui-label-008-muted);
}
[data-vibeui-block="label-008"] [data-part="lock"]::before{
content:"";position:absolute;left:50%;top:-0.3125rem;translate:-50% 0;
width:0.375rem;height:0.3125rem;
border:1.5px solid var(--vibeui-label-008-muted);border-bottom:0;
border-radius:0.25rem 0.25rem 0 0;
}
[data-vibeui-block="label-008"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
font:inherit;font-size:0.9375rem;
color:var(--vibeui-label-008-muted);
background:var(--vibeui-label-008-locked-bg);
border:1px solid var(--vibeui-label-008-locked-border);
border-radius:var(--vibeui-label-008-radius);
cursor:not-allowed;
}
[data-vibeui-block="label-008"] input:focus-visible{
outline:2px solid var(--vibeui-label-008-accent);outline-offset:2px;
}
[data-vibeui-block="label-008"] [data-part="reason"]{
margin:0;font-size:0.8125rem;line-height:1.45;
color:var(--vibeui-label-008-muted);
}
[data-vibeui-block="label-008"] a{
color:var(--vibeui-label-008-accent);font-weight:500;
text-underline-offset:0.15em;
}
[data-vibeui-block="label-008"] a:focus-visible{
outline:2px solid var(--vibeui-label-008-accent);outline-offset:2px;
border-radius:0.25rem;
}
`

/**
 * Подпись выключенного поля с причиной и выходом: поле readonly, а не
 * disabled, поэтому остаётся доступным с клавиатуры. Один файл, ноль
 * зависимостей.
 */
export function Label008({
  label = "Тариф",
  reason = "Тариф меняется только после оплаты текущего периода — он закрывается 30 сентября.",
  actionText = "Оплатить сейчас",
  actionHref = "#",
  accent,
  className,
  style,
  ...props
}: Label008Props) {
  const id = useId()
  const reasonId = `${id}-reason`
  const palette = {
    ...(accent ? { "--vibeui-label-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-label-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="label-008"
        className={className}
        style={palette}
      >
        <div data-part="row">
          <span data-part="lock" aria-hidden="true" />
          <label htmlFor={id}>{label}</label>
        </div>
        <input
          id={id}
          type="text"
          name="plan"
          defaultValue="Команда, 12 мест"
          readOnly
          aria-disabled="true"
          aria-describedby={reasonId}
        />
        <p data-part="reason" id={reasonId}>
          {reason} <a href={actionHref}>{actionText}</a>
        </p>
      </div>
    </>
  )
}
