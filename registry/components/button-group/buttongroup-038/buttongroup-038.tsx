import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup038Props = Omit<ComponentProps<"div">, "children"> & {
  saveLabel?: string
  closeLabel?: string
  intentName?: string
  note?: string
  label?: string
  accent?: string
}

// Идея компонента: два исхода одной отправки формы. Обе кнопки — настоящие
// submit с одинаковым name и разными value: браузер отправит пару только той
// кнопки, которую нажали, и серверу не нужен ни скрытый input, ни JS, чтобы
// понять намерение. Это единственная встроенная в HTML возможность различить
// «сохранить» и «сохранить и закрыть», и её стоит предпочесть обработчику.
// Главная кнопка первая по порядку DOM: при Enter в поле формы отправляется
// именно первая submit-кнопка, и это должно быть безопасное действие.
const STYLES = `
:where([data-vibeui-block="buttongroup-038"]){
--vibeui-buttongroup-038-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-038-muted:color-mix(in oklab,var(--vibeui-buttongroup-038-fg) 68%,transparent);
--vibeui-buttongroup-038-border:light-dark(oklch(0.88 0 265),oklch(0.41 0 265));
--vibeui-buttongroup-038-kbd:light-dark(oklch(0.98 0 265),oklch(0.31 0 265));
--vibeui-buttongroup-038-accent:light-dark(oklch(0.48 0.15 265),oklch(0.62 0.16 265));
--vibeui-buttongroup-038-on-accent:light-dark(oklch(0.99 0 265),oklch(0.98 0 265));
--vibeui-buttongroup-038-shadow:light-dark(oklch(0.2 0 265 / 14%),oklch(0 0 0 / 34%));
--vibeui-buttongroup-038-radius:0.625rem;
--vibeui-buttongroup-038-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-038"]{color-scheme:dark}
[data-vibeui-block="buttongroup-038"]{
box-sizing:border-box;display:inline-flex;flex-direction:column;gap:0.5rem;
font-family:var(--vibeui-buttongroup-038-font);
}
[data-vibeui-block="buttongroup-038"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-038"] [data-part="track"]{
display:flex;isolation:isolate;
border-radius:var(--vibeui-buttongroup-038-radius);
box-shadow:0 1px 2px var(--vibeui-buttongroup-038-shadow);
}
[data-vibeui-block="buttongroup-038"] button{
appearance:none;cursor:pointer;font:inherit;
position:relative;z-index:0;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-buttongroup-038-accent);
background:var(--vibeui-buttongroup-038-accent);
color:var(--vibeui-buttongroup-038-on-accent);
font-size:0.8125rem;font-weight:650;line-height:1;white-space:nowrap;
transition:background-color .16s ease;
}
[data-vibeui-block="buttongroup-038"] button:first-child{
border-start-start-radius:var(--vibeui-buttongroup-038-radius);
border-end-start-radius:var(--vibeui-buttongroup-038-radius);
}
[data-vibeui-block="buttongroup-038"] button:last-child{
border-start-end-radius:var(--vibeui-buttongroup-038-radius);
border-end-end-radius:var(--vibeui-buttongroup-038-radius);
}
/* Шов между двумя заливками одного цвета: рамка дала бы тёмную линию. */
[data-vibeui-block="buttongroup-038"] button + button{
margin-inline-start:-1px;
box-shadow:inset 1px 0 0 oklch(1 0 0 / 34%);
background:color-mix(in oklab,var(--vibeui-buttongroup-038-accent) 88%,black);
}
[data-vibeui-block="buttongroup-038"] button:hover{
background:color-mix(in oklab,var(--vibeui-buttongroup-038-accent) 80%,black);
}
[data-vibeui-block="buttongroup-038"] button:focus-visible{
z-index:1;outline:2px solid var(--vibeui-buttongroup-038-fg);outline-offset:2px;
}
[data-vibeui-block="buttongroup-038"] svg{
width:0.9375rem;height:0.9375rem;
stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;
}
[data-vibeui-block="buttongroup-038"] [data-part="note"]{
margin:0;color:var(--vibeui-buttongroup-038-muted);
font-size:0.75rem;line-height:1.4;
}
[data-vibeui-block="buttongroup-038"] kbd{
padding:0.0625rem 0.3125rem;border-radius:0.25rem;
border:1px solid var(--vibeui-buttongroup-038-border);
background:var(--vibeui-buttongroup-038-kbd);
color:var(--vibeui-buttongroup-038-fg);
font:inherit;font-size:0.6875rem;font-weight:650;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-038"] *{animation:none!important;transition:none!important}}
`

/**
 * Пара submit-кнопок с общим name и разными value: намерение различает браузер.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup038({
  saveLabel = "Сохранить",
  closeLabel = "Сохранить и закрыть",
  intentName = "intent",
  note = "в поле формы отправит «Сохранить»",
  label = "Завершение правки",
  accent,
  className,
  style,
  ...props
}: Buttongroup038Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-038-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-038" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-038"
        className={className}
        style={palette}
      >
        <div data-part="track" role="group" aria-label={label}>
          <button type="submit" name={intentName} value="save">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 4h11l3 3v13H5zM8 4v5h7M8 20v-6h8v6" />
            </svg>
            {saveLabel}
          </button>
          <button type="submit" name={intentName} value="save-and-close">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m5 13 4.5 4.5L19 7" />
            </svg>
            {closeLabel}
          </button>
        </div>
        <p data-part="note">
          <kbd>Enter</kbd> {note}
        </p>
      </div>
    </>
  )
}
