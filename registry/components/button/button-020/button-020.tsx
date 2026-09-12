import type { ComponentProps, CSSProperties } from "react"

export type Button020Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  price?: string
  hint?: string
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: кнопка нижней панели телефона. Она во всю ширину, высотой
// 3rem и с отступом на домашнюю полоску через safe-area — иначе на iPhone
// нижний край кнопки уходит под системную черту. Цена стоит в самой кнопке:
// на этом шаге решение принимают по сумме, а не по слову «оплатить».
const STYLES = `
:where([data-vibeui-block="button-020"]){
--vibeui-button-020-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-020-hover-filter:light-dark(brightness(1.45),brightness(0.9));
/* fg — подпись на самой кнопке, она всегда светлая. Пояснение под кнопкой
   лежит на странице, поэтому берёт цвет страницы: на светлой подложке
   белая подсказка была невидима. */
--vibeui-button-020-fg:light-dark(oklch(0.99 0 265),oklch(0.17 0.01 265));
--vibeui-button-020-ink:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-button-020-muted:color-mix(in oklab,var(--vibeui-button-020-ink) 66%,transparent);
--vibeui-button-020-bg:transparent;
--vibeui-button-020-border:light-dark(oklch(0.92 0 265),oklch(0.34 0 265));
--vibeui-button-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-020"]{color-scheme:dark}
[data-vibeui-block="button-020"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;
padding:0.75rem 0.875rem calc(0.75rem + env(safe-area-inset-bottom,0px));
border-top:1px solid var(--vibeui-button-020-border);
background:var(--vibeui-button-020-bg);
font-family:var(--vibeui-button-020-font);
}
[data-vibeui-block="button-020"] button{
appearance:none;border:0;cursor:pointer;
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
width:100%;height:3rem;padding:0 1rem;box-sizing:border-box;
border-radius:0.75rem;
background:var(--vibeui-button-020-accent);color:oklch(from var(--vibeui-button-020-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font:inherit;font-size:0.9375rem;font-weight:650;line-height:1;
}
[data-vibeui-block="button-020"] button:hover{filter:var(--vibeui-button-020-hover-filter)}
[data-vibeui-block="button-020"] button:focus-visible{outline:2px solid var(--vibeui-button-020-accent);outline-offset:2px}
/* Цена в самой кнопке: решение принимают по сумме, а не по глаголу. */
[data-vibeui-block="button-020"] [data-part="price"]{font-variant-numeric:tabular-nums}
[data-vibeui-block="button-020"] [data-part="hint"]{
text-align:center;font-size:0.75rem;line-height:1.35;color:var(--vibeui-button-020-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-020"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Кнопка нижней панели телефона: во всю ширину, с ценой и safe-area.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button020({
  label = "Оформить заказ",
  price = "4 900 ₽",
  hint = "Доставка завтра, оплата при получении",
  background = "",
  accent,
  className,
  style,
  ...props
}: Button020Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-020-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-020-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-020" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button"
        data-vibeui-block="button-020"
        className={className}
        style={palette}
      >
        <button type="button">
          {label}
          {price ? <span data-part="price">{price}</span> : null}
        </button>
        {hint ? <p data-part="hint">{hint}</p> : null}
      </div>
    </>
  )
}
