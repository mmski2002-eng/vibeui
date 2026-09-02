import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge021Env = "prod" | "stage" | "dev"

export type Badge021Props = ComponentPropsWithoutRef<"span"> & {
  env?: Badge021Env
  label?: string
}

// Идея компонента: метка окружения, где смысл несёт форма. Боевое — плотный
// скошенный ярлык, предпродакшен — обычная пилюля, разработка — пунктирный
// прямоугольник. На скриншоте в баг-репорте цвет теряется первым, а силуэт
// остаётся: перепутанное окружение стоит дороже любой другой ошибки метки.
const STYLES = `
:where([data-vibeui-block="badge-021"]){
--vibeui-badge-021-bg:light-dark(oklch(0.97 0.004 265),oklch(0.26 0.009 265));
--vibeui-badge-021-fg:light-dark(oklch(0.36 0.014 265),oklch(0.9 0.007 265));
--vibeui-badge-021-border:light-dark(oklch(0.86 0.008 265),oklch(0.42 0.012 265));
--vibeui-badge-021-font:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="badge-021"]{
display:inline-flex;align-items:center;box-sizing:border-box;
height:1.5rem;padding:0 0.625rem;
border:1px solid var(--vibeui-badge-021-border);border-radius:0.25rem;
background:var(--vibeui-badge-021-bg);color:var(--vibeui-badge-021-fg);
font-family:var(--vibeui-badge-021-font);font-size:0.6875rem;font-weight:700;line-height:1;
letter-spacing:0.09em;text-transform:uppercase;vertical-align:middle;
}
/* Боевое: скошенный ярлык. Рамки нет — clip-path срезал бы её вместе с углом.
   Красная заливка одинакова в обеих темах намеренно: сигнал «это боевое»
   не имеет права слабеть от того, что страница потемнела. */
[data-vibeui-block="badge-021"][data-env="prod"]{
--vibeui-badge-021-bg:oklch(0.5 0.18 25);
--vibeui-badge-021-fg:oklch(0.99 0.01 25);
border-color:transparent;border-radius:0;padding:0 0.875rem;
clip-path:polygon(0.4rem 0,100% 0,calc(100% - 0.4rem) 100%,0 100%);
}
/* Предпродакшен: обычная пилюля — промежуточная форма между двумя крайними. */
[data-vibeui-block="badge-021"][data-env="stage"]{
--vibeui-badge-021-bg:light-dark(oklch(0.96 0.05 80),oklch(0.32 0.06 78));
--vibeui-badge-021-fg:light-dark(oklch(0.42 0.09 70),oklch(0.9 0.08 82));
--vibeui-badge-021-border:light-dark(oklch(0.85 0.09 80),oklch(0.5 0.09 80));
border-radius:9999px;
}
/* Разработка: пунктир, «ещё не настоящее». */
[data-vibeui-block="badge-021"][data-env="dev"]{
--vibeui-badge-021-bg:light-dark(oklch(0.98 0.003 265),oklch(0.23 0.008 265));
--vibeui-badge-021-fg:light-dark(oklch(0.48 0.014 265),oklch(0.78 0.01 265));
border-style:dashed;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-021"] *{animation:none!important;transition:none!important}}
`

/**
 * Метка окружения: prod, stage и dev отличаются силуэтом, а не только цветом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge021({
  env = "prod",
  label = "prod",
  className,
  style,
  ...props
}: Badge021Props) {
  return (
    <>
      <style href="vibeui-badge-021" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-021"
        data-env={env}
        className={className}
        style={style as CSSProperties}
      >
        {label}
      </span>
    </>
  )
}
