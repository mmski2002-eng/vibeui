import type { ComponentProps, CSSProperties } from "react"

export type Branding001Props = Omit<ComponentProps<"section">, "children"> & {
  /** Текст для aria-label: секция декоративна, содержимого для чтения нет. */
  label?: string
  accent?: string
  /** Конус света и ореол вокруг значка. false — значок без подсветки. */
  spotlight?: boolean
  /** Лёгкое парение значка вверх-вниз. */
  float?: boolean
  /** Яркость иконок дока гаснет к краям ряда. */
  dockFade?: boolean
}

// Идея: крупный значок приложения парит над размытым рядом плейсхолдеров
// дока, сверху его заливает мягкий конус света — сам конус и ореол под
// значком дышат по яркости и масштабу, это и есть анимация категории.
// Иконки дока — цветные плашки без подписей, их яркость гаснет к краям ряда,
// центр (под значком) остаётся самым ярким. Значок дополнительно чуть
// покачивается вверх-вниз, независимо от дыхания света.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="branding-001"]){
--vibeui-branding-001-bg-top:light-dark(oklch(0.94 0.006 260),oklch(0.19 0.012 260));
--vibeui-branding-001-bg-bottom:light-dark(oklch(0.88 0.01 260),oklch(0.09 0.01 260));
--vibeui-branding-001-fg:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-branding-001-border:light-dark(oklch(0.86 0.01 260),oklch(0.3 0.01 260));
--vibeui-branding-001-accent:light-dark(oklch(0.66 0.19 275),oklch(0.75 0.17 275));
--vibeui-branding-001-icon-fg:oklch(0.98 0 0);
--vibeui-branding-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="branding-001"]{color-scheme:dark}
[data-vibeui-block="branding-001"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-branding-001-fg);font-family:var(--vibeui-branding-001-font);
}
[data-vibeui-block="branding-001"] *{box-sizing:border-box}
[data-vibeui-block="branding-001"] [data-part="stage"]{
position:relative;isolation:isolate;overflow:hidden;min-height:14.5rem;
display:flex;flex-direction:column;align-items:center;justify-content:space-between;
padding:2.75rem 1.25rem 1.375rem;border-radius:1.5rem;
border:1px solid var(--vibeui-branding-001-border);
background:linear-gradient(to bottom,var(--vibeui-branding-001-bg-top),var(--vibeui-branding-001-bg-bottom));
}
/* Конус света: треугольник clip-path'ом, залитый градиентом акцента, размытый. */
[data-vibeui-block="branding-001"] [data-part="cone"]{
position:absolute;top:-3rem;left:50%;width:15rem;height:13rem;z-index:0;
clip-path:polygon(50% 0%,20% 100%,80% 100%);
background:linear-gradient(to bottom,color-mix(in oklab,var(--vibeui-branding-001-accent) 55%,transparent),transparent 74%);
filter:blur(9px);transform:translateX(-50%) scale(0.98);opacity:0.5;
animation:vibeui-branding-001-cone 4.4s ease-in-out infinite;
}
/* Ореол вокруг значка: размытый круг, дышит независимо от конуса. */
[data-vibeui-block="branding-001"] [data-part="glow"]{
position:absolute;top:3.5rem;left:50%;width:9rem;height:9rem;z-index:0;
border-radius:9999px;
background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-branding-001-accent) 62%,transparent),transparent 70%);
filter:blur(16px);transform:translate(-50%,-50%) scale(0.95);opacity:0.55;
animation:vibeui-branding-001-glow 4.4s ease-in-out infinite;
}
[data-vibeui-block="branding-001"][data-spotlight="false"] [data-part="cone"],
[data-vibeui-block="branding-001"][data-spotlight="false"] [data-part="glow"]{display:none}
[data-vibeui-block="branding-001"] [data-part="icon"]{
position:relative;z-index:1;display:flex;align-items:center;justify-content:center;
width:4.5rem;height:4.5rem;flex:none;border-radius:1.25rem;
background:linear-gradient(155deg,color-mix(in oklab,var(--vibeui-branding-001-accent) 100%,white 12%),color-mix(in oklab,var(--vibeui-branding-001-accent) 100%,black 22%));
box-shadow:0 0.75rem 1.5rem -0.5rem color-mix(in oklab,var(--vibeui-branding-001-accent) 65%,transparent),inset 0 1px 0 color-mix(in oklab,white 35%,transparent);
color:var(--vibeui-branding-001-icon-fg);
animation:vibeui-branding-001-float 3.4s ease-in-out infinite;
}
[data-vibeui-block="branding-001"][data-float="false"] [data-part="icon"]{animation:none}
[data-vibeui-block="branding-001"] [data-part="icon"] svg{width:1.875rem;height:1.875rem}
[data-vibeui-block="branding-001"] [data-part="dock"]{
position:relative;z-index:1;display:flex;align-items:flex-end;gap:0.5rem;
padding:0.625rem 0.75rem;border-radius:1.25rem;
background:color-mix(in oklab,var(--vibeui-branding-001-fg) 8%,transparent);
box-shadow:inset 0 1px 0 color-mix(in oklab,white 12%,transparent);
}
[data-vibeui-block="branding-001"] [data-part="dock-item"]{
width:1.5rem;height:1.5rem;flex:none;border-radius:0.5rem;
box-shadow:inset 0 1px 0 color-mix(in oklab,white 25%,transparent);
}
[data-vibeui-block="branding-001"] [data-part="dock-item"]:nth-child(1){background:oklch(0.62 0.19 25)}
[data-vibeui-block="branding-001"] [data-part="dock-item"]:nth-child(2){background:oklch(0.64 0.16 250)}
[data-vibeui-block="branding-001"] [data-part="dock-item"]:nth-child(3){background:oklch(0.7 0.15 150)}
[data-vibeui-block="branding-001"] [data-part="dock-item"]:nth-child(4){background:oklch(0.66 0.2 300)}
[data-vibeui-block="branding-001"] [data-part="dock-item"]:nth-child(5){background:oklch(0.72 0.14 190)}
[data-vibeui-block="branding-001"] [data-part="dock-item"]:nth-child(6){background:oklch(0.68 0.18 340)}
[data-vibeui-block="branding-001"] [data-part="dock-item"]:nth-child(7){background:oklch(0.78 0.15 90)}
/* Яркость дока гаснет к краям ряда, центр под значком остаётся ярче всего. */
[data-vibeui-block="branding-001"][data-dock-fade="true"] [data-part="dock-item"]:nth-child(1),
[data-vibeui-block="branding-001"][data-dock-fade="true"] [data-part="dock-item"]:nth-child(7){opacity:0.22}
[data-vibeui-block="branding-001"][data-dock-fade="true"] [data-part="dock-item"]:nth-child(2),
[data-vibeui-block="branding-001"][data-dock-fade="true"] [data-part="dock-item"]:nth-child(6){opacity:0.42}
[data-vibeui-block="branding-001"][data-dock-fade="true"] [data-part="dock-item"]:nth-child(3),
[data-vibeui-block="branding-001"][data-dock-fade="true"] [data-part="dock-item"]:nth-child(5){opacity:0.68}
@keyframes vibeui-branding-001-cone{0%,100%{opacity:0.42;transform:translateX(-50%) scale(0.96)}50%{opacity:0.68;transform:translateX(-50%) scale(1.04)}}
@keyframes vibeui-branding-001-glow{0%,100%{opacity:0.5;transform:translate(-50%,-50%) scale(0.92)}50%{opacity:0.78;transform:translate(-50%,-50%) scale(1.1)}}
@keyframes vibeui-branding-001-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-0.45rem)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="branding-001"] [data-part="cone"]{animation:none;opacity:0.55;transform:translateX(-50%) scale(1)}
[data-vibeui-block="branding-001"] [data-part="glow"]{animation:none;opacity:0.62;transform:translate(-50%,-50%) scale(1)}
[data-vibeui-block="branding-001"] [data-part="icon"]{animation:none}
}
`

const SPARK = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2c.7 3.6 2.1 5.9 4.9 6.8-2.8.9-4.2 3.2-4.9 6.8-.7-3.6-2.1-5.9-4.9-6.8 2.8-.9 4.2-3.2 4.9-6.8Z" />
    <path d="M19 14c.35 1.8 1.05 2.95 2.45 3.4-1.4.45-2.1 1.6-2.45 3.4-.35-1.8-1.05-2.95-2.45-3.4 1.4-.45 2.1-1.6 2.45-3.4Z" />
  </svg>
)

/**
 * Значок приложения под софитом с рядом плейсхолдеров дока. Один файл, ноль
 * зависимостей, собственная палитра. Свечение задаётся пропами, анимации на
 * чистом CSS.
 */
export function Branding001({
  label = "Значок приложения в свете софита",
  accent,
  spotlight = true,
  float = true,
  dockFade = true,
  className,
  style,
  ...props
}: Branding001Props) {
  const palette = {
    ...(accent ? { "--vibeui-branding-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-branding-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="branding-001"
        data-slot="app-spotlight"
        data-spotlight={spotlight ? undefined : "false"}
        data-float={float ? undefined : "false"}
        data-dock-fade={dockFade ? "true" : undefined}
        className={className}
        style={palette}
        role="img"
        aria-label={label}
      >
        <div data-part="stage">
          <div data-part="cone" aria-hidden="true" />
          <div data-part="glow" aria-hidden="true" />
          <div data-part="icon" aria-hidden="true">
            {SPARK}
          </div>
          <div data-part="dock" aria-hidden="true">
            <span data-part="dock-item" />
            <span data-part="dock-item" />
            <span data-part="dock-item" />
            <span data-part="dock-item" />
            <span data-part="dock-item" />
            <span data-part="dock-item" />
            <span data-part="dock-item" />
          </div>
        </div>
      </section>
    </>
  )
}
