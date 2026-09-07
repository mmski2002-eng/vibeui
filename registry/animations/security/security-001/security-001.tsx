import type { ComponentProps, CSSProperties } from "react"

export type Security001Props = Omit<ComponentProps<"section">, "children"> & {
  /** Текст для aria-label: секция декоративна, содержимого для чтения нет. */
  label?: string
  accent?: string
  /** Размытый ореол за отпечатком. false — отпечаток без подсветки. */
  glow?: boolean
  /** Цикл «скан → успех» повторяется бесконечно. false — один проход и пауза на галочке. */
  repeat?: boolean
}

// Идея: отпечаток пальца в кольце сканера. Полоса сканирования проходит
// сверху вниз по отпечатку, линии на миг подсвечиваются акцентом, а следом
// проступает галочка успеха зелёным — весь цикл повторяется. Это и есть
// анимация категории: наглядная проверка биометрии.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="security-001"]){
--vibeui-security-001-bg-top:light-dark(oklch(0.95 0 250),oklch(0.2 0 250));
--vibeui-security-001-bg-bottom:light-dark(oklch(0.89 0 250),oklch(0.1 0 250));
--vibeui-security-001-fg:light-dark(oklch(0.28 0 255),oklch(0.92 0 255));
--vibeui-security-001-border:light-dark(oklch(0.86 0 255),oklch(0.32 0 255));
--vibeui-security-001-accent:light-dark(oklch(0.56 0.17 255),oklch(0.75 0.14 255));
--vibeui-security-001-success:oklch(0.72 0.17 150);
--vibeui-security-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="security-001"]{color-scheme:dark}
[data-vibeui-block="security-001"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-security-001-fg);font-family:var(--vibeui-security-001-font);
}
[data-vibeui-block="security-001"] *{box-sizing:border-box}
/* Сцена без рамки и подложки: раньше здесь были скруглённый контур и
   градиент, и знак читался как экран устройства, а не как самостоятельный
   значок. Осталось только центрирование и место под свечение. */
[data-vibeui-block="security-001"] [data-part="stage"]{
position:relative;isolation:isolate;min-height:13rem;
display:flex;align-items:center;justify-content:center;
}
/* Ореол за отпечатком: размытый круг, дышит независимо от цикла скана. */
[data-vibeui-block="security-001"] [data-part="glow"]{
position:absolute;width:9.5rem;height:9.5rem;z-index:0;border-radius:9999px;
background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-security-001-accent) 55%,transparent),transparent 70%);
filter:blur(16px);opacity:0.55;transform:scale(0.95);
animation:vibeui-security-001-breathe 4.4s ease-in-out infinite;
}
[data-vibeui-block="security-001"][data-glow="false"] [data-part="glow"]{display:none}
[data-vibeui-block="security-001"] [data-part="ring"]{
position:relative;z-index:1;display:flex;align-items:center;justify-content:center;
width:8.5rem;height:8.5rem;border-radius:9999px;
border:1px solid var(--vibeui-security-001-border);
background:color-mix(in oklab,var(--vibeui-security-001-bg-top) 60%,transparent);
box-shadow:inset 0 1px 0 color-mix(in oklab,white 12%,transparent);
}
/* Обёртка ровно по границам SVG: сканирующая полоса клипуется по её высоте. */
[data-vibeui-block="security-001"] [data-part="wrap"]{
position:relative;overflow:hidden;width:5.25rem;height:5.25rem;
}
[data-vibeui-block="security-001"] [data-part="print"]{
display:block;width:100%;height:100%;
stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;fill:none;
color:var(--vibeui-security-001-fg);
animation:vibeui-security-001-print 3.8s ease-in-out infinite;
}
[data-vibeui-block="security-001"] [data-part="scan"]{
position:absolute;left:-10%;right:-10%;top:0;height:0.125rem;z-index:1;
background:linear-gradient(to right,transparent,var(--vibeui-security-001-accent) 20%,var(--vibeui-security-001-accent) 80%,transparent);
box-shadow:0 0 8px 1px color-mix(in oklab,var(--vibeui-security-001-accent) 70%,transparent);
animation:vibeui-security-001-scan 3.8s ease-in-out infinite;
}
[data-vibeui-block="security-001"] [data-part="check"]{
position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;
color:var(--vibeui-security-001-success);opacity:0;
animation:vibeui-security-001-check 3.8s ease-in-out infinite;
}
[data-vibeui-block="security-001"] [data-part="check"] svg{
width:2.25rem;height:2.25rem;
filter:drop-shadow(0 0 6px color-mix(in oklab,var(--vibeui-security-001-success) 60%,transparent));
}
/* Один проход: цикл замирает на успехе вместо бесконечного повтора. */
[data-vibeui-block="security-001"][data-repeat="false"] [data-part="print"],
[data-vibeui-block="security-001"][data-repeat="false"] [data-part="scan"],
[data-vibeui-block="security-001"][data-repeat="false"] [data-part="check"]{
animation-iteration-count:1;animation-fill-mode:forwards;
}
@keyframes vibeui-security-001-breathe{0%,100%{opacity:0.45;transform:scale(0.92)}50%{opacity:0.62;transform:scale(1.05)}}
@keyframes vibeui-security-001-scan{
0%{transform:translateY(-0.5rem);opacity:1}
52%{transform:translateY(5.5rem);opacity:1}
60%,100%{transform:translateY(5.5rem);opacity:0}
}
@keyframes vibeui-security-001-print{
0%,55%{color:var(--vibeui-security-001-fg)}
72%,100%{color:var(--vibeui-security-001-success)}
}
@keyframes vibeui-security-001-check{
0%,58%{opacity:0;transform:scale(0.5)}
68%{opacity:1;transform:scale(1.18)}
78%{transform:scale(1)}
100%{opacity:1;transform:scale(1)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="security-001"] [data-part="glow"]{animation:none;opacity:0.55;transform:scale(1)}
[data-vibeui-block="security-001"] [data-part="scan"]{animation:none;opacity:0}
[data-vibeui-block="security-001"] [data-part="print"]{animation:none;color:var(--vibeui-security-001-success)}
[data-vibeui-block="security-001"] [data-part="check"]{animation:none;opacity:1;transform:scale(1)}
}
`

const FINGERPRINT = (
  <svg viewBox="0 0 24 24" aria-hidden="true" data-part="print">
    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
    <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
    <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
    <path d="M2 12a10 10 0 0 1 18-6" />
    <path d="M2 16h.01" />
    <path d="M21.8 16c.2-2 .131-5.354 0-6" />
    <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
    <path d="M8.65 22c.21-.66.45-1.32.57-2" />
    <path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 .97-.03 1.5" />
  </svg>
)

const CHECK = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

/**
 * Сканер отпечатка пальца: полоса сканирования проходит по отпечатку,
 * следом проступает галочка успеха. Один файл, ноль зависимостей,
 * собственная палитра, анимации на чистом CSS.
 */
export function Security001({
  label = "Сканирование отпечатка пальца, успешно",
  accent,
  glow = true,
  repeat = true,
  className,
  style,
  ...props
}: Security001Props) {
  const palette = {
    ...(accent ? { "--vibeui-security-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-security-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="security-001"
        data-slot="fingerprint-scan"
        data-glow={glow ? undefined : "false"}
        data-repeat={repeat ? undefined : "false"}
        className={className}
        style={palette}
        role="img"
        aria-label={label}
      >
        <div data-part="stage">
          <div data-part="glow" aria-hidden="true" />
          <div data-part="ring" aria-hidden="true">
            <div data-part="wrap">
              {FINGERPRINT}
              <span data-part="scan" aria-hidden="true" />
              <span data-part="check" aria-hidden="true">
                {CHECK}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
