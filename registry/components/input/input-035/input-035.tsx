import { useId, type ComponentProps, type CSSProperties } from "react"

export type Input035Props = Omit<
  ComponentProps<"input">,
  "placeholder" | "size"
> & {
  label?: string
  accent?: string
  /** Цвет поверхности: вдавленное поле лепит тени из того же цвета, что и фон. */
  background?: string
}

// Идея: поле, вдавленное в поверхность двумя внутренними тенями — светлой и
// тёмной. В фокусе подпись не исчезает, а поднимается на верхнюю кромку
// плашкой цвета поверхности и окрашивается в акцент, а поле получает мягкое
// свечение акцента вместо рамки. Поле, подпись и плашка одного цвета с
// подложкой — поэтому у компонента своя поверхность, а не прозрачный фон.
const STYLES = `
:where([data-vibeui-block="input-035"]){
--vibeui-input-035-surface:light-dark(oklch(0.94 0.003 60),oklch(0.2 0.006 250));
--vibeui-input-035-fg:light-dark(oklch(0.24 0.01 60),oklch(0.97 0 0));
--vibeui-input-035-muted:light-dark(oklch(0.55 0.01 60),oklch(0.62 0.006 250));
--vibeui-input-035-light:light-dark(oklch(1 0 0 / 0.9),oklch(0.32 0.01 250 / 0.7));
--vibeui-input-035-dark:light-dark(oklch(0.62 0.015 60 / 0.4),oklch(0.09 0.01 250 / 0.9));
--vibeui-input-035-accent:oklch(0.6803 0.2144 39.8);
--vibeui-input-035-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-035"]{color-scheme:dark}
[data-vibeui-block="input-035"]{
position:relative;display:block;width:100%;max-width:22rem;box-sizing:border-box;
padding:1rem;border-radius:1rem;
background:var(--vibeui-input-035-surface);color:var(--vibeui-input-035-fg);
font-family:var(--vibeui-input-035-font);
}
[data-vibeui-block="input-035"] *{box-sizing:border-box}
[data-vibeui-block="input-035"] [data-part="wrap"]{position:relative;display:block}
[data-vibeui-block="input-035"] input{
display:block;width:100%;padding:.95rem 1rem;border:0;outline:0;border-radius:.65rem;
background:var(--vibeui-input-035-surface);color:inherit;font:inherit;font-size:1rem;
box-shadow:inset 5px 5px 10px var(--vibeui-input-035-dark),inset -5px -5px 10px var(--vibeui-input-035-light);
transition:box-shadow .4s ease;
}
[data-vibeui-block="input-035"] input:focus{
box-shadow:inset 5px 5px 10px var(--vibeui-input-035-dark),inset -5px -5px 10px var(--vibeui-input-035-light),
0 0 0 1px oklch(from var(--vibeui-input-035-accent) l c h / 0.55),0 0 18px oklch(from var(--vibeui-input-035-accent) l c h / 0.35);
}
[data-vibeui-block="input-035"] input:autofill{
-webkit-text-fill-color:var(--vibeui-input-035-fg);
box-shadow:inset 5px 5px 10px var(--vibeui-input-035-dark),inset -5px -5px 10px var(--vibeui-input-035-light),inset 0 0 0 100px var(--vibeui-input-035-surface);
}
[data-vibeui-block="input-035"] label{
position:absolute;left:1rem;top:50%;translate:0 -50%;pointer-events:none;
color:var(--vibeui-input-035-muted);font-size:1rem;transition:all .3s ease;
}
[data-vibeui-block="input-035"] input:is(:focus,:not(:placeholder-shown),:autofill) + label{
top:0;left:.75rem;padding:0 .45rem;border-radius:.35rem;font-size:.75rem;
background:var(--vibeui-input-035-surface);color:var(--vibeui-input-035-accent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-035"] *{transition:none!important}}
`

/**
 * Вдавленное неоморфное поле: подпись в фокусе поднимается на кромку и
 * окрашивается в акцент, поле мягко светится. Один файл, ноль зависимостей.
 */
export function Input035({
  label = "Почта",
  accent,
  background,
  className,
  style,
  id,
  type = "text",
  ...props
}: Input035Props) {
  const fallbackId = useId()
  const inputId = id ?? fallbackId

  const palette = {
    ...(accent ? { "--vibeui-input-035-accent": accent } : null),
    ...(background ? { "--vibeui-input-035-surface": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-input-035" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="input-035"
        data-slot="input"
        className={className}
        style={palette}
      >
        <span data-part="wrap">
          {/* placeholder из пробела нужен для :placeholder-shown — по нему подпись всплывает. */}
          <input {...props} id={inputId} type={type} placeholder=" " />
          <label htmlFor={inputId}>{label}</label>
        </span>
      </div>
    </>
  )
}
