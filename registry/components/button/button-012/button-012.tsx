import type { ComponentProps, CSSProperties } from "react"

export type Button012Shape = "circle" | "square"

export type Button012Props = Omit<ComponentProps<"button">, "children"> & {
  /** Что делает кнопка. Обязателен: у иконки нет текста. */
  label?: string
  icon?: "plus" | "close" | "more" | "search"
  shape?: Button012Shape
  size?: "sm" | "md" | "lg"
  tone?: "neutral" | "accent"
  /** Акцент: заливка тона accent и обводка фокуса. */
  accent?: string
}

// Идея компонента: кнопка без подписи, у которой имя всё равно есть. Оно
// уходит в aria-label и в title: иконка без имени — тупик и для скринридера,
// и для человека, который видит её впервые. Значки нарисованы бордюрами и
// псевдоэлементами, поэтому иконочный пакет не нужен.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте пятно кнопки светлее фона, граница светлее пятна, а подпись
// на акцентном тоне становится тёмной — светлая на светлом акценте слепнет.
const STYLES = `
:where([data-vibeui-block="button-012"]){
--vibeui-button-012-size:2.25rem;
--vibeui-button-012-fg:light-dark(oklch(0.3 0 265),oklch(0.93 0 265));
--vibeui-button-012-bg:light-dark(oklch(1 0 0),oklch(0.28 0 265));
--vibeui-button-012-border:light-dark(oklch(0.9 0 265),oklch(0.45 0 265));
--vibeui-button-012-hover:light-dark(oklch(0.96 0 265),oklch(0.35 0 265));
--vibeui-button-012-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-012-hover-filter:light-dark(brightness(1.45),brightness(0.9));
--vibeui-button-012-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.2 0 0));
--vibeui-button-012-radius:0.625rem;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-012"]{color-scheme:dark}
[data-vibeui-block="button-012"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:var(--vibeui-button-012-size);height:var(--vibeui-button-012-size);
padding:0;box-sizing:border-box;
border:1px solid var(--vibeui-button-012-border);
border-radius:var(--vibeui-button-012-radius);
background:var(--vibeui-button-012-bg);color:var(--vibeui-button-012-fg);
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="button-012"][data-shape="circle"]{border-radius:9999px}
[data-vibeui-block="button-012"][data-size="sm"]{--vibeui-button-012-size:1.875rem;--vibeui-button-012-radius:0.5rem}
[data-vibeui-block="button-012"][data-size="lg"]{--vibeui-button-012-size:2.75rem;--vibeui-button-012-radius:0.75rem}
[data-vibeui-block="button-012"][data-tone="accent"]{
border-color:transparent;background:var(--vibeui-button-012-accent);color:oklch(from var(--vibeui-button-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="button-012"]:hover{background:var(--vibeui-button-012-hover)}
[data-vibeui-block="button-012"][data-tone="accent"]:hover{filter:var(--vibeui-button-012-hover-filter);background:var(--vibeui-button-012-accent);color:oklch(from var(--vibeui-button-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="button-012"]:focus-visible{outline:2px solid var(--vibeui-button-012-accent);outline-offset:2px}
[data-vibeui-block="button-012"]:disabled{cursor:not-allowed;opacity:.5}
/* Значки на бордюрах: ради четырёх фигур пакет иконок не подключают. */
[data-vibeui-block="button-012"] [data-part="glyph"]{position:relative;width:0.875rem;height:0.875rem}
[data-vibeui-block="button-012"] [data-icon="plus"]::before,
[data-vibeui-block="button-012"] [data-icon="plus"]::after,
[data-vibeui-block="button-012"] [data-icon="close"]::before,
[data-vibeui-block="button-012"] [data-icon="close"]::after{
content:"";position:absolute;left:50%;top:50%;background:currentColor;border-radius:9999px;
}
[data-vibeui-block="button-012"] [data-icon="plus"]::before{width:0.75rem;height:1.5px;margin:-0.75px 0 0 -0.375rem}
[data-vibeui-block="button-012"] [data-icon="plus"]::after{width:1.5px;height:0.75rem;margin:-0.375rem 0 0 -0.75px}
[data-vibeui-block="button-012"] [data-icon="close"]::before,
[data-vibeui-block="button-012"] [data-icon="close"]::after{width:0.75rem;height:1.5px;margin:-0.75px 0 0 -0.375rem}
[data-vibeui-block="button-012"] [data-icon="close"]::before{transform:rotate(45deg)}
[data-vibeui-block="button-012"] [data-icon="close"]::after{transform:rotate(-45deg)}
[data-vibeui-block="button-012"] [data-icon="more"]{
display:flex;align-items:center;justify-content:center;gap:0.1875rem;
}
[data-vibeui-block="button-012"] [data-icon="more"] i{width:0.1875rem;height:0.1875rem;border-radius:9999px;background:currentColor}
[data-vibeui-block="button-012"] [data-icon="search"]::before{
content:"";position:absolute;left:0;top:0;width:0.625rem;height:0.625rem;
border:1.5px solid currentColor;border-radius:9999px;
}
[data-vibeui-block="button-012"] [data-icon="search"]::after{
content:"";position:absolute;right:0.0625rem;bottom:0.0625rem;
width:0.375rem;height:1.5px;background:currentColor;transform:rotate(45deg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-012"] *{animation:none!important;transition:none!important}}
`

/**
 * Кнопка-иконка, у которой имя всё равно есть: aria-label и title.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button012({
  label = "Добавить",
  icon = "plus",
  shape = "square",
  size = "md",
  tone = "neutral",
  accent,
  type = "button",
  className,
  style,
  ...props
}: Button012Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-012" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-012"
        data-shape={shape}
        data-size={size}
        data-tone={tone}
        className={className}
        style={palette}
        aria-label={label}
        title={label}
      >
        <span data-part="glyph" data-icon={icon} aria-hidden="true">
          {icon === "more" ? (
            <>
              <i />
              <i />
              <i />
            </>
          ) : null}
        </span>
      </button>
    </>
  )
}
