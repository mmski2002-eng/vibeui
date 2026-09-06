import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup003Option = {
  label: string
  hint?: string
}

export type Buttongroup003Props = Omit<ComponentProps<"div">, "children"> & {
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  action?: string
  options?: Buttongroup003Option[]
  menuLabel?: string
  menuId?: string
  accent?: string
}

// Идея компонента: split-кнопка — частое действие нажимается одним движением,
// а редкие прячутся за стрелкой. Меню открывает нативный popover: верхний
// слой, Esc и клик мимо достаются от браузера, клиентского JS нет вовсе.
// Позицию берёт CSS anchor positioning там, где он поддержан; где нет —
// popover остаётся карточкой по центру экрана, и это рабочий вид.
const STYLES = `
:where([data-vibeui-block="buttongroup-003"]){
--vibeui-buttongroup-003-surface:light-dark(oklch(1 0 0),oklch(0.23 0 265));
--vibeui-buttongroup-003-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-buttongroup-003-muted:color-mix(in oklab,var(--vibeui-buttongroup-003-fg) 68%,transparent);
--vibeui-buttongroup-003-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-buttongroup-003-hover:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
/* Подпись на заливке почти белая, поэтому в тёмной ветке акцент не светлее
   светлой: выше L≈0.57 контраст текста падает ниже 4.5:1. */
--vibeui-buttongroup-003-accent:light-dark(oklch(0.52 0.17 39.8),oklch(0.56 0.17 39.8));
--vibeui-buttongroup-003-accent-dark:light-dark(oklch(0.45 0.16 39.8),oklch(0.5 0.17 39.8));
--vibeui-buttongroup-003-on-accent:oklch(0.99 0 265);
--vibeui-buttongroup-003-radius:0.625rem;
--vibeui-buttongroup-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-003"]{color-scheme:dark}
[data-vibeui-block="buttongroup-003"]{
box-sizing:border-box;display:inline-flex;isolation:isolate;
border-radius:var(--vibeui-buttongroup-003-radius);
font-family:var(--vibeui-buttongroup-003-font);
}
[data-vibeui-block="buttongroup-003"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-003"] [data-part="main"],
[data-vibeui-block="buttongroup-003"] [data-part="more"]{
appearance:none;cursor:pointer;font:inherit;position:relative;z-index:0;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
height:2.25rem;border:0;
background:var(--vibeui-buttongroup-003-accent);
color:var(--vibeui-buttongroup-003-on-accent);
font-size:0.8125rem;font-weight:650;line-height:1;
transition:background-color .16s ease;
}
[data-vibeui-block="buttongroup-003"] [data-part="main"]{
padding:0 1rem;
border-start-start-radius:var(--vibeui-buttongroup-003-radius);
border-end-start-radius:var(--vibeui-buttongroup-003-radius);
}
/* Тонкая светлая полоса вместо рамки: у двух заливок одного цвета
   граница между ними иначе не читается. */
[data-vibeui-block="buttongroup-003"] [data-part="more"]{
width:2.125rem;
box-shadow:inset 1px 0 0 var(--vibeui-buttongroup-003-on-accent);
border-start-end-radius:var(--vibeui-buttongroup-003-radius);
border-end-end-radius:var(--vibeui-buttongroup-003-radius);
}
[data-vibeui-block="buttongroup-003"] [data-part="main"]:hover,
[data-vibeui-block="buttongroup-003"] [data-part="more"]:hover{background:var(--vibeui-buttongroup-003-accent-dark)}
[data-vibeui-block="buttongroup-003"] [data-part="main"]:focus-visible,
[data-vibeui-block="buttongroup-003"] [data-part="more"]:focus-visible{
z-index:1;
outline:2px solid var(--vibeui-buttongroup-003-accent-dark);outline-offset:2px;
}
[data-vibeui-block="buttongroup-003"] [data-part="caret"]{
width:0.4375rem;height:0.4375rem;margin-top:-0.25rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg);
}
[data-vibeui-block="buttongroup-003"] [data-part="menu"]{
box-sizing:border-box;width:min(15rem,calc(100vw - 2rem));
padding:0.3125rem;margin:0;
border:1px solid var(--vibeui-buttongroup-003-border);
border-radius:var(--vibeui-buttongroup-003-radius);
background:var(--vibeui-buttongroup-003-surface);
font-family:var(--vibeui-buttongroup-003-font);
box-shadow:0 18px 40px -22px oklch(0.2 0 265 / 60%);
}
[data-vibeui-block="buttongroup-003"] [data-part="menu"]:not(:popover-open){display:none}
[data-vibeui-block="buttongroup-003"] [data-part="menu"] button{
appearance:none;cursor:pointer;font:inherit;
display:block;width:100%;text-align:start;
padding:0.4375rem 0.5rem;border:0;border-radius:0.4375rem;background:transparent;
color:var(--vibeui-buttongroup-003-fg);font-size:0.8125rem;font-weight:500;
}
[data-vibeui-block="buttongroup-003"] [data-part="menu"] button:hover{background:var(--vibeui-buttongroup-003-hover)}
[data-vibeui-block="buttongroup-003"] [data-part="menu"] button:focus-visible{
outline:2px solid var(--vibeui-buttongroup-003-accent);outline-offset:-2px;
}
[data-vibeui-block="buttongroup-003"] [data-part="hint"]{
display:block;margin-top:0.0625rem;
font-size:0.75rem;font-weight:400;color:var(--vibeui-buttongroup-003-muted);
}
@supports (anchor-name:--vibeui-buttongroup-003-a){
[data-vibeui-block="buttongroup-003"] [data-part="more"]{anchor-name:--vibeui-buttongroup-003-a}
[data-vibeui-block="buttongroup-003"] [data-part="menu"]{
position:fixed;position-anchor:--vibeui-buttongroup-003-a;
position-area:bottom span-left;margin-top:0.375rem;
position-try-fallbacks:flip-block;
}
}
/* Развёрнутый режим: меню стоит в потоке под кнопками, а не в верхнем слое. */
[data-vibeui-block="buttongroup-003"]:has([data-open="true"]){flex-wrap:wrap}
[data-vibeui-block="buttongroup-003"] [data-part="menu"][data-open="true"]{
display:block;position:static;margin-top:0.375rem;width:100%;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Buttongroup003Option[] = [
  { label: "Сохранить и закрыть", hint: "Вернуться к списку" },
  { label: "Сохранить как черновик", hint: "Не показывать читателям" },
  { label: "Сохранить копию", hint: "Оригинал останется без изменений" },
]

/**
 * Split-кнопка: основное действие слева, остальные — в popover-меню.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup003({
  open = false,
  action = "Сохранить",
  options = DEFAULT_OPTIONS,
  menuLabel = "Другие способы сохранить",
  menuId = "vibeui-buttongroup-003-menu",
  accent,
  className,
  style,
  ...props
}: Buttongroup003Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-003"
        role="group"
        aria-label={action}
        className={className}
        style={palette}
      >
        <button type="button" data-part="main">
          {action}
        </button>
        <button
          type="button"
          data-part="more"
          popoverTarget={menuId}
          aria-label={menuLabel}
        >
          <span data-part="caret" aria-hidden="true" />
        </button>
        <div
          id={menuId}
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          data-part="menu"
          aria-label={menuLabel}
        >
          {options.map((option) => (
            <button key={option.label} type="button">
              {option.label}
              {option.hint ? <span data-part="hint">{option.hint}</span> : null}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
