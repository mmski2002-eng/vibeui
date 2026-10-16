import type { ComponentProps, CSSProperties } from "react"

export type Error404018Props = Omit<ComponentProps<"section">, "children"> & {
  lead?: string
  title?: string
  actionLabel?: string
  actionHref?: string
  /** Цвет кнопки и пятна-талисмана. */
  accent?: string
  /** Пусто — подложки нет, страница ложится на фон сайта. */
  background?: string
}

// Заголовок проявляется из размытия буква за буквой, а рядом дышит
// мягкий талисман-капля с глазами: он моргает и покачивается. Капля — один
// border-radius с анимированной формой, глаза — псевдоэлементы.
const STYLES = `
:where([data-vibeui-block="error-404-018"]){
--vibeui-error-404-018-bg:transparent;
--vibeui-error-404-018-fg:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-error-404-018-muted:light-dark(oklch(0.55 0 0),oklch(0.7 0 0));
--vibeui-error-404-018-accent:light-dark(oklch(0.5 0.25 265),oklch(0.65 0.2 265));
--vibeui-error-404-018-blob:light-dark(oklch(0.88 0.04 265),oklch(0.35 0.05 265));
--vibeui-error-404-018-font:ui-serif,Georgia,Cambria,"Times New Roman",serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-404-018"]{color-scheme:dark}
[data-vibeui-block="error-404-018"] [data-part="layout"]{
position:relative;display:grid;gap:2rem;align-items:center;box-sizing:border-box;min-height:24rem;padding:3rem 1.5rem;overflow:hidden;
background:var(--vibeui-error-404-018-bg);color:var(--vibeui-error-404-018-fg);
}
[data-vibeui-block="error-404-018"] [data-part="lead"]{margin:0;color:var(--vibeui-error-404-018-muted);font-family:ui-sans-serif,system-ui,sans-serif;font-size:0.875rem}
[data-vibeui-block="error-404-018"] [data-part="title"]{margin:0.25rem 0 0;font-family:var(--vibeui-error-404-018-font);font-size:clamp(3rem,11cqi,6rem);font-weight:400;line-height:1;letter-spacing:-0.03em}
[data-vibeui-block="error-404-018"] [data-part="word"]{white-space:nowrap}
[data-vibeui-block="error-404-018"] [data-part="char"]{
display:inline-block;white-space:pre;filter:blur(12px);opacity:0;
animation:vibeui-error-404-018-focus .9s cubic-bezier(.2,.7,.2,1) calc(var(--vibeui-error-404-018-i) * 70ms + 200ms) forwards;
}
@keyframes vibeui-error-404-018-focus{to{filter:blur(0);opacity:1}}
[data-vibeui-block="error-404-018"] [data-part="action"]{
display:inline-block;margin-top:1.5rem;padding:0.625rem 1.125rem;border-radius:0.375rem;background:var(--vibeui-error-404-018-accent);color:oklch(0.99 0 0);
font-family:ui-sans-serif,system-ui,sans-serif;font-size:0.875rem;font-weight:600;text-decoration:none;transition:transform .2s ease;
}
[data-vibeui-block="error-404-018"] [data-part="action"]:hover{transform:translateY(-2px)}
[data-vibeui-block="error-404-018"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-error-404-018-accent);outline-offset:3px}
[data-vibeui-block="error-404-018"] [data-part="mascot"]{
position:relative;justify-self:center;width:min(60cqi,16rem);aspect-ratio:1;background:var(--vibeui-error-404-018-blob);
border-radius:46% 54% 42% 58% / 52% 44% 56% 48%;
animation:vibeui-error-404-018-morph 7s ease-in-out infinite alternate,vibeui-error-404-018-sway 4s ease-in-out infinite alternate;
}
[data-vibeui-block="error-404-018"] [data-part="mascot"]::before,
[data-vibeui-block="error-404-018"] [data-part="mascot"]::after{
content:"";position:absolute;top:38%;width:9%;aspect-ratio:1/1.4;border-radius:50%;background:var(--vibeui-error-404-018-fg);
animation:vibeui-error-404-018-blink 4.5s ease-in-out infinite;
}
[data-vibeui-block="error-404-018"] [data-part="mascot"]::before{left:34%}
[data-vibeui-block="error-404-018"] [data-part="mascot"]::after{right:34%}
[data-vibeui-block="error-404-018"] [data-part="beak"]{
position:absolute;left:50%;top:54%;width:30%;height:16%;translate:-50% 0;border-radius:40% 40% 60% 60%;background:var(--vibeui-error-404-018-accent);
}
@keyframes vibeui-error-404-018-morph{to{border-radius:58% 42% 55% 45% / 45% 58% 42% 55%}}
@keyframes vibeui-error-404-018-sway{from{rotate:-5deg;translate:0 0}to{rotate:5deg;translate:0 -0.75rem}}
@keyframes vibeui-error-404-018-blink{0%,92%,100%{scale:1 1}95%{scale:1 .1}}
@container (min-width:44rem){
[data-vibeui-block="error-404-018"] [data-part="layout"]{grid-template-columns:1.2fr 1fr;padding:4rem 3rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="error-404-018"] *,[data-vibeui-block="error-404-018"] *::before,[data-vibeui-block="error-404-018"] *::after{animation:none!important;transition:none!important}
[data-vibeui-block="error-404-018"] [data-part="char"]{filter:none;opacity:1}
}
[data-vibeui-block="error-404-018"]{display:block;background:var(--vibeui-error-404-018-bg)}
[data-vibeui-block="error-404-018"]{width:100%}
`

export function Error404018({
  lead = "Простите, мы не нашли эту страницу.",
  title = "Ошибка 404",
  actionLabel = "На главную",
  actionHref = "/",
  accent,
  background,
  className,
  style,
  ...props
}: Error404018Props) {
  const palette = {
    ...(accent ? { "--vibeui-error-404-018-accent": accent } : null),
    ...(background ? { "--vibeui-error-404-018-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-018" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-404-018"
        data-slot="not-found"
        className={className}
        style={palette}
      >
        <div data-part="layout">
        <div>
          <p data-part="lead">{lead}</p>
          <h1 data-part="title" aria-label={title}>
            {title.split(" ").map((word, wordIndex, words) => {
              const offset = words.slice(0, wordIndex).join(" ").length + (wordIndex ? 1 : 0)
              return (
                <span key={wordIndex} data-part="word" aria-hidden="true">
                  {wordIndex > 0 ? " " : null}
                  {word.split("").map((character, index) => (
                    <span
                      key={index}
                      data-part="char"
                      style={{ "--vibeui-error-404-018-i": offset + index } as CSSProperties}
                    >
                      {character}
                    </span>
                  ))}
                </span>
              )
            })}
          </h1>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
        <span data-part="mascot" aria-hidden="true">
          <span data-part="beak" />
        </span>
        </div>
      </section>
    </>
  )
}
