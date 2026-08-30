import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button016Props = Omit<ComponentPropsWithoutRef<"a">, "children"> & {
  label?: string
  href?: string
  /** Открывать в новой вкладке: тогда об этом говорится вслух и значком. */
  external?: boolean
  tone?: "neutral" | "accent"
}

// Идея компонента: ссылка, которая выглядит кнопкой, но остаётся ссылкой.
// Её можно открыть в новой вкладке, скопировать адрес и увидеть в статусной
// строке — с <button onClick={router.push}> всё это теряется. У внешней
// ссылки есть значок и сказано словами, что она уходит на другой сайт.
const STYLES = `
:where([data-vibeui-block="button-016"]){
--vibeui-button-016-fg:oklch(0.3 0.014 265);
--vibeui-button-016-bg:oklch(1 0 0);
--vibeui-button-016-border:oklch(0.9 0.006 265);
--vibeui-button-016-hover:oklch(0.96 0.004 265);
--vibeui-button-016-accent:oklch(0.55 0.17 265);
--vibeui-button-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-016"]{
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.25rem;padding:0 0.875rem;box-sizing:border-box;
border:1px solid var(--vibeui-button-016-border);border-radius:0.625rem;
background:var(--vibeui-button-016-bg);color:var(--vibeui-button-016-fg);
font-family:var(--vibeui-button-016-font);font-size:0.8125rem;font-weight:600;line-height:1;
text-decoration:none;
transition:background-color .16s ease;
}
[data-vibeui-block="button-016"][data-tone="accent"]{
border-color:transparent;background:var(--vibeui-button-016-accent);color:oklch(0.99 0.01 265);
}
[data-vibeui-block="button-016"]:hover{background:var(--vibeui-button-016-hover)}
[data-vibeui-block="button-016"][data-tone="accent"]:hover{background:var(--vibeui-button-016-accent);filter:brightness(0.95)}
[data-vibeui-block="button-016"]:focus-visible{outline:2px solid var(--vibeui-button-016-accent);outline-offset:2px}
/* Значок внешней ссылки: рамка и стрелка из бордюров. */
[data-vibeui-block="button-016"] [data-part="out"]{position:relative;flex:none;width:0.75rem;height:0.75rem;opacity:.75}
[data-vibeui-block="button-016"] [data-part="out"]::before{
content:"";position:absolute;left:0;bottom:0;width:0.5625rem;height:0.5625rem;
border:1.5px solid currentColor;border-top-color:transparent;border-right-color:transparent;
border-radius:0.125rem;
}
[data-vibeui-block="button-016"] [data-part="out"]::after{
content:"";position:absolute;right:0;top:0;width:0.4375rem;height:0.4375rem;
border-top:1.5px solid currentColor;border-right:1.5px solid currentColor;
}
/* Пояснение про новую вкладку — только для скринридера: значок его не
   заменяет, а текст рядом с кнопкой был бы шумом. */
[data-vibeui-block="button-016"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-016"] *{animation:none!important;transition:none!important}}
`

/**
 * Ссылка в виде кнопки: адрес копируется, вкладка открывается.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button016({
  label = "Открыть документацию",
  href = "#",
  external = true,
  tone = "neutral",
  className,
  style,
  ...props
}: Button016Props) {
  return (
    <>
      <style href="vibeui-button-016" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-vibeui-block="button-016"
        data-tone={tone}
        href={href}
        className={className}
        style={style as CSSProperties}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : null)}
      >
        {label}
        {external ? (
          <>
            <span data-part="out" aria-hidden="true" />
            <span data-part="sr">(откроется в новой вкладке)</span>
          </>
        ) : null}
      </a>
    </>
  )
}
