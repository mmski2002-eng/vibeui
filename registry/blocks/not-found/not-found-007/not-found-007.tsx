import type { ComponentProps, CSSProperties } from "react"

export type NotFound007Props = Omit<ComponentProps<"section">, "children"> & {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Цвет полотна; солнце и текст подстраиваются под него. */
  accent?: string
}

// Солнечная 404 для дружелюбных брендов: ноль в коде — улыбающееся солнце с
// медленно вращающимися лучами и моргающими глазами. Крупный округлый
// шрифт, мягкие кнопки-таблетки. Ошибка выглядит как приглашение, а не тупик.
const STYLES = `
:where([data-vibeui-block="not-found-007"]){
--vibeui-not-found-007-accent:oklch(0.88 0.13 90);
--vibeui-not-found-007-fg:oklch(from var(--vibeui-not-found-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-not-found-007-sun:oklch(from var(--vibeui-not-found-007-accent) calc(l + 0.06) calc(c + 0.04) calc(h - 20));
--vibeui-not-found-007-ray:oklch(from var(--vibeui-not-found-007-accent) calc(l - 0.12) calc(c + 0.06) calc(h - 30));
--vibeui-not-found-007-font:ui-rounded,"SF Pro Rounded","Nunito","Arial Rounded MT Bold",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="not-found-007"]{display:block;overflow:hidden;background:var(--vibeui-not-found-007-accent);color:var(--vibeui-not-found-007-fg);font-family:var(--vibeui-not-found-007-font)}
[data-vibeui-block="not-found-007"] [data-part="layout"]{display:flex;flex-direction:column;align-items:center;box-sizing:border-box;padding:3rem 1.5rem 3.5rem;text-align:center}
[data-vibeui-block="not-found-007"] [data-part="code"]{display:flex;align-items:center;gap:0.08em;margin:0;font-size:clamp(5.5rem,22cqi,11rem);font-weight:900;line-height:1;letter-spacing:-0.03em}
[data-vibeui-block="not-found-007"] [data-part="sun"]{position:relative;display:grid;place-items:center;width:0.9em;aspect-ratio:1}
[data-vibeui-block="not-found-007"] [data-part="rays"]{
position:absolute;inset:-14%;border-radius:50%;
background:repeating-conic-gradient(var(--vibeui-not-found-007-ray) 0 8deg,transparent 8deg 30deg);
mask:radial-gradient(circle,transparent 52%,#000 53%,#000 70%,transparent 71%);
animation:vibeui-not-found-007-spin 18s linear infinite;
}
[data-vibeui-block="not-found-007"] [data-part="face"]{
position:relative;width:72%;aspect-ratio:1;border-radius:50%;
background:radial-gradient(circle at 35% 30%,oklch(from var(--vibeui-not-found-007-sun) calc(l + 0.08) c h),var(--vibeui-not-found-007-sun));
box-shadow:inset 0 -0.06em 0.1em oklch(0 0 0 / 12%);
}
[data-vibeui-block="not-found-007"] [data-part="eye"]{
position:absolute;top:38%;width:9%;aspect-ratio:1/1.3;border-radius:50%;background:var(--vibeui-not-found-007-fg);
animation:vibeui-not-found-007-blink 4s ease-in-out infinite;
}
[data-vibeui-block="not-found-007"] [data-part="eye"]:first-child{left:32%}
[data-vibeui-block="not-found-007"] [data-part="eye"]:nth-child(2){right:32%}
[data-vibeui-block="not-found-007"] [data-part="smile"]{
position:absolute;left:30%;top:52%;width:40%;height:22%;border:0.035em solid var(--vibeui-not-found-007-fg);border-top:0;border-radius:0 0 999px 999px;box-sizing:border-box;
}
@keyframes vibeui-not-found-007-spin{to{rotate:360deg}}
@keyframes vibeui-not-found-007-blink{0%,92%,100%{scale:1 1}96%{scale:1 .1}}
[data-vibeui-block="not-found-007"] [data-part="title"]{margin:1.75rem 0 0;font-size:clamp(1.75rem,5cqi,2.5rem);font-weight:800;letter-spacing:-0.02em;text-wrap:balance}
[data-vibeui-block="not-found-007"] [data-part="text"]{margin:0.75rem 0 0;max-width:30rem;font-size:1.0625rem;line-height:1.5;opacity:.8}
[data-vibeui-block="not-found-007"] [data-part="actions"]{display:flex;flex-wrap:wrap;justify-content:center;gap:0.75rem;margin-top:1.75rem}
[data-vibeui-block="not-found-007"] :is([data-part="primary"],[data-part="secondary"]){
display:inline-flex;align-items:center;min-height:3rem;padding:0 1.5rem;border-radius:999px;font-size:1rem;font-weight:800;text-decoration:none;transition:transform .2s cubic-bezier(.3,1.6,.5,1);
}
[data-vibeui-block="not-found-007"] [data-part="primary"]{background:var(--vibeui-not-found-007-fg);color:var(--vibeui-not-found-007-accent)}
[data-vibeui-block="not-found-007"] [data-part="secondary"]{color:inherit;box-shadow:inset 0 0 0 2px currentColor}
[data-vibeui-block="not-found-007"] :is([data-part="primary"],[data-part="secondary"]):hover{transform:scale(1.05) rotate(-2deg)}
[data-vibeui-block="not-found-007"] :is([data-part="primary"],[data-part="secondary"]):focus-visible{outline:3px solid currentColor;outline-offset:3px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="not-found-007"] *{animation:none!important;transition:none!important}}
`

export function NotFound007({
  title = "Ой, тут пусто — но не грустно!",
  description = "Такой страницы нет. Зато на главной светло, тепло и всё на своих местах.",
  actionLabel = "На главную",
  actionHref = "/",
  secondaryLabel = "Связаться с нами",
  secondaryHref = "/contact",
  accent,
  className,
  style,
  ...props
}: NotFound007Props) {
  const palette = {
    ...(accent ? { "--vibeui-not-found-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-not-found-007" precedence="medium">
        {STYLES}
      </style>
      <section {...props} data-vibeui-block="not-found-007" className={className} style={palette}>
        <div data-part="layout">
          <p data-part="code" aria-label="404">
            <span aria-hidden="true">4</span>
            <span data-part="sun" aria-hidden="true">
              <span data-part="rays" />
              <span data-part="face">
                <span data-part="eye" />
                <span data-part="eye" />
                <span data-part="smile" />
              </span>
            </span>
            <span aria-hidden="true">4</span>
          </p>
          <h1 data-part="title">{title}</h1>
          <p data-part="text">{description}</p>
          <div data-part="actions">
            <a data-part="primary" href={actionHref}>
              {actionLabel}
            </a>
            <a data-part="secondary" href={secondaryHref}>
              {secondaryLabel}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
