import type { ComponentProps, CSSProperties } from "react"

export type Security002Props = Omit<ComponentProps<"section">, "children"> & {
  /** Текст для aria-label: секция декоративна, содержимого для чтения нет. */
  label?: string
  accent?: string
  /** Размытый ореол за замком. false — замок без подсветки. */
  glow?: boolean
  /** Защёлкивание повторяется бесконечно. false — один проход и пауза на закрытом замке. */
  repeat?: boolean
}

// Идея: дужка замка защёлкивается сверху вниз с лёгким пружинным перелётом
// и садится на корпус — в момент посадки от замка расходится кольцо-пинг.
// Это и есть анимация категории: наглядная блокировка доступа.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="security-002"]){
--vibeui-security-002-bg-top:light-dark(oklch(0.95 0 250),oklch(0.2 0 250));
--vibeui-security-002-bg-bottom:light-dark(oklch(0.89 0 250),oklch(0.1 0 250));
--vibeui-security-002-fg:light-dark(oklch(0.28 0 255),oklch(0.92 0 255));
--vibeui-security-002-border:light-dark(oklch(0.86 0 255),oklch(0.32 0 255));
--vibeui-security-002-accent:light-dark(oklch(0.56 0.17 255),oklch(0.75 0.14 255));
--vibeui-security-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="security-002"]{color-scheme:dark}
[data-vibeui-block="security-002"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-security-002-fg);font-family:var(--vibeui-security-002-font);
}
[data-vibeui-block="security-002"] *{box-sizing:border-box}
/* Сцена без рамки и подложки: раньше здесь были скруглённый контур и
   градиент, и знак читался как экран устройства, а не как самостоятельный
   значок. Осталось только центрирование и место под свечение. */
[data-vibeui-block="security-002"] [data-part="stage"]{
position:relative;isolation:isolate;min-height:13rem;
display:flex;align-items:center;justify-content:center;
}
/* Ореол за замком: размытый круг, дышит независимо от цикла защёлкивания. */
[data-vibeui-block="security-002"] [data-part="glow"]{
position:absolute;width:9.5rem;height:9.5rem;z-index:0;border-radius:9999px;
background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-security-002-accent) 55%,transparent),transparent 70%);
filter:blur(16px);opacity:0.5;transform:scale(0.95);
animation:vibeui-security-002-breathe 4.4s ease-in-out infinite;
}
[data-vibeui-block="security-002"][data-glow="false"] [data-part="glow"]{display:none}
[data-vibeui-block="security-002"] [data-part="wrap"]{
position:relative;z-index:1;width:6.5rem;height:6.5rem;
}
[data-vibeui-block="security-002"] [data-part="ping"]{
position:absolute;inset:0.5rem;z-index:0;border-radius:1.25rem;
background:color-mix(in oklab,var(--vibeui-security-002-accent) 45%,transparent);
opacity:0;animation:vibeui-security-002-ping 3.2s ease-out infinite;
}
[data-vibeui-block="security-002"] [data-part="lock"]{
position:relative;z-index:1;display:block;width:100%;height:100%;
stroke:var(--vibeui-security-002-fg);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;fill:none;
}
[data-vibeui-block="security-002"] [data-part="body"]{
fill:color-mix(in oklab,var(--vibeui-security-002-fg) 8%,transparent);
}
[data-vibeui-block="security-002"] [data-part="keyhole"]{
stroke:none;fill:var(--vibeui-security-002-accent);
}
[data-vibeui-block="security-002"] [data-part="shackle"]{
transform-box:fill-box;transform-origin:50% 100%;
animation:vibeui-security-002-shackle 3.2s cubic-bezier(0.32,0.1,0.2,1) infinite;
}
[data-vibeui-block="security-002"][data-repeat="false"] [data-part="shackle"],
[data-vibeui-block="security-002"][data-repeat="false"] [data-part="ping"]{
animation-iteration-count:1;animation-fill-mode:forwards;
}
@keyframes vibeui-security-002-breathe{0%,100%{opacity:0.4;transform:scale(0.92)}50%{opacity:0.58;transform:scale(1.05)}}
@keyframes vibeui-security-002-shackle{
0%,42%{transform:translateY(-0.4rem) rotate(-7deg)}
58%{transform:translateY(0.08rem) rotate(3deg)}
74%{transform:translateY(-0.04rem) rotate(-1.4deg)}
90%,100%{transform:translateY(0) rotate(0deg)}
}
@keyframes vibeui-security-002-ping{
0%,56%{transform:scale(0.85);opacity:0}
62%{transform:scale(0.9);opacity:0.55}
88%,100%{transform:scale(1.35);opacity:0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="security-002"] [data-part="glow"]{animation:none;opacity:0.5;transform:scale(1)}
[data-vibeui-block="security-002"] [data-part="shackle"]{animation:none;transform:translateY(0) rotate(0deg)}
[data-vibeui-block="security-002"] [data-part="ping"]{animation:none;opacity:0}
}
`

/**
 * Замок с дужкой, которая защёлкивается сверху вниз с пружинным перелётом.
 * Один файл, ноль зависимостей, собственная палитра, анимации на чистом CSS.
 */
export function Security002({
  label = "Замок закрыт, доступ защищён",
  accent,
  glow = true,
  repeat = true,
  className,
  style,
  ...props
}: Security002Props) {
  const palette = {
    ...(accent ? { "--vibeui-security-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-security-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="security-002"
        data-slot="lock-latch"
        data-glow={glow ? undefined : "false"}
        data-repeat={repeat ? undefined : "false"}
        className={className}
        style={palette}
        role="img"
        aria-label={label}
      >
        <div data-part="stage">
          <div data-part="glow" aria-hidden="true" />
          <div data-part="wrap" aria-hidden="true">
            <div data-part="ping" aria-hidden="true" />
            <svg
              data-part="lock"
              viewBox="0 0 24 24"
              aria-hidden="true"
              overflow="visible"
            >
              <path
                data-part="shackle"
                d="M7.5 11V7.5a4.5 4.5 0 0 1 9 0V11"
              />
              <rect data-part="body" x="4.5" y="11" width="15" height="10" rx="2" />
              <circle data-part="keyhole" cx="12" cy="15" r="1.15" />
              <rect
                data-part="keyhole"
                x="11.4"
                y="15"
                width="1.2"
                height="2.75"
                rx="0.5"
              />
            </svg>
          </div>
        </div>
      </section>
    </>
  )
}
