import type { ComponentProps, CSSProperties } from "react"

export type Security003Props = Omit<ComponentProps<"section">, "children"> & {
  /** Текст для aria-label: секция декоративна, содержимого для чтения нет. */
  label?: string
  accent?: string
  /** Пульсирующее кольцо-свечение вокруг щита: защита активна. */
  glow?: boolean
  /** Появление щита и прорисовка галочки повторяются бесконечно. false — один проход и пауза. */
  repeat?: boolean
}

// Идея: щит выпрыгивает на сцену с лёгким пружинным перелётом масштаба,
// следом за ним обводкой прорисовывается галочка внутри — а вокруг щита
// мягко дышит пульсирующее кольцо, сигнал того, что защита активна и
// держится постоянно. Это и есть анимация категории.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="security-003"]){
--vibeui-security-003-bg-top:light-dark(oklch(0.95 0 250),oklch(0.2 0 250));
--vibeui-security-003-bg-bottom:light-dark(oklch(0.89 0 250),oklch(0.1 0 250));
--vibeui-security-003-fg:light-dark(oklch(0.28 0 255),oklch(0.92 0 255));
--vibeui-security-003-border:light-dark(oklch(0.86 0 255),oklch(0.32 0 255));
--vibeui-security-003-accent:light-dark(oklch(0.56 0.17 255),oklch(0.75 0.14 255));
--vibeui-security-003-icon-fg:oklch(0.98 0 0);
--vibeui-security-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="security-003"]{color-scheme:dark}
[data-vibeui-block="security-003"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-security-003-fg);font-family:var(--vibeui-security-003-font);
}
[data-vibeui-block="security-003"] *{box-sizing:border-box}
[data-vibeui-block="security-003"] [data-part="stage"]{
position:relative;isolation:isolate;overflow:hidden;min-height:13rem;
display:flex;align-items:center;justify-content:center;
border-radius:1.5rem;border:1px solid var(--vibeui-security-003-border);
background:linear-gradient(to bottom,var(--vibeui-security-003-bg-top),var(--vibeui-security-003-bg-bottom));
}
/* Кольцо-свечение: дышит по масштабу и прозрачности независимо от входа щита. */
[data-vibeui-block="security-003"] [data-part="ring"]{
position:absolute;width:7.5rem;height:7.5rem;z-index:0;border-radius:9999px;
border:1.5px solid color-mix(in oklab,var(--vibeui-security-003-accent) 55%,transparent);
animation:vibeui-security-003-pulse 3.2s ease-out infinite;
}
[data-vibeui-block="security-003"] [data-part="ring"][data-ring="2"]{animation-delay:-1.6s}
[data-vibeui-block="security-003"][data-glow="false"] [data-part="ring"]{display:none}
[data-vibeui-block="security-003"] [data-part="glow"]{
position:absolute;width:8.5rem;height:8.5rem;z-index:0;border-radius:9999px;
background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-security-003-accent) 45%,transparent),transparent 72%);
filter:blur(14px);opacity:0.6;
}
[data-vibeui-block="security-003"][data-glow="false"] [data-part="glow"]{display:none}
[data-vibeui-block="security-003"] [data-part="shield"]{
position:relative;z-index:1;display:block;width:6rem;height:6rem;
transform-box:fill-box;transform-origin:center;opacity:0;
animation:vibeui-security-003-shield 3.2s cubic-bezier(0.22,1,0.36,1) infinite;
}
[data-vibeui-block="security-003"] [data-part="outline"]{
fill:var(--vibeui-security-003-accent);
stroke:color-mix(in oklab,var(--vibeui-security-003-accent) 100%,black 18%);stroke-width:0.75;
stroke-linejoin:round;
filter:drop-shadow(0 0.5rem 0.75rem color-mix(in oklab,var(--vibeui-security-003-accent) 45%,transparent));
}
[data-vibeui-block="security-003"] [data-part="check"]{
fill:none;stroke:var(--vibeui-security-003-icon-fg);
stroke-width:2;stroke-linecap:round;stroke-linejoin:round;
stroke-dasharray:12;stroke-dashoffset:12;
animation:vibeui-security-003-check 3.2s cubic-bezier(0.22,1,0.36,1) infinite;
}
[data-vibeui-block="security-003"][data-repeat="false"] [data-part="shield"],
[data-vibeui-block="security-003"][data-repeat="false"] [data-part="check"]{
animation-iteration-count:1;animation-fill-mode:forwards;
}
@keyframes vibeui-security-003-pulse{
0%{transform:scale(0.78);opacity:0.55}
100%{transform:scale(1.28);opacity:0}
}
@keyframes vibeui-security-003-shield{
0%{opacity:0;transform:scale(0.55)}
16%{opacity:1}
34%{transform:scale(1.1)}
46%{transform:scale(0.96)}
58%,100%{opacity:1;transform:scale(1)}
}
@keyframes vibeui-security-003-check{
0%,42%{stroke-dashoffset:12;opacity:0}
50%{opacity:1}
70%,100%{stroke-dashoffset:0;opacity:1}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="security-003"] [data-part="ring"]{animation:none;opacity:0}
[data-vibeui-block="security-003"] [data-part="shield"]{animation:none;opacity:1;transform:scale(1)}
[data-vibeui-block="security-003"] [data-part="check"]{animation:none;stroke-dashoffset:0;opacity:1}
}
`

/**
 * Щит с галочкой: щит выпрыгивает пружинным масштабом, галочка
 * прорисовывается обводкой следом, вокруг дышит кольцо защиты.
 * Один файл, ноль зависимостей, собственная палитра, анимации на чистом CSS.
 */
export function Security003({
  label = "Защита активна",
  accent,
  glow = true,
  repeat = true,
  className,
  style,
  ...props
}: Security003Props) {
  const palette = {
    ...(accent ? { "--vibeui-security-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-security-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="security-003"
        data-slot="shield-check"
        data-glow={glow ? undefined : "false"}
        data-repeat={repeat ? undefined : "false"}
        className={className}
        style={palette}
        role="img"
        aria-label={label}
      >
        <div data-part="stage">
          <div data-part="glow" aria-hidden="true" />
          <div data-part="ring" data-ring="1" aria-hidden="true" />
          <div data-part="ring" data-ring="2" aria-hidden="true" />
          <svg data-part="shield" viewBox="0 0 24 24" aria-hidden="true">
            <path
              data-part="outline"
              d="M12 2.5 4.5 5.4v6.1c0 5.4 3.4 9.7 7.5 11 4.1-1.3 7.5-5.6 7.5-11V5.4Z"
            />
            <path data-part="check" d="M8.3 12.3 11 15l4.7-5.2" />
          </svg>
        </div>
      </section>
    </>
  )
}
