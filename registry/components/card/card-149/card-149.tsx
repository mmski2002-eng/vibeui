import type { ComponentProps, CSSProperties } from "react"

export type Card149Props = Omit<ComponentProps<"details">, "title" | "children"> & {
  question?: string
  answer?: string
  imageLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока faq-015, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-149"]){
--vibeui-card-149-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-card-149-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-card-149-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-card-149-dur-2:180ms;
--vibeui-card-149-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-149"]{color-scheme:dark}
[data-vibeui-block="card-149"]{box-sizing:border-box}
[data-vibeui-block="card-149"] *{box-sizing:border-box}
[data-vibeui-block="card-149"]{border:1px solid var(--vibeui-card-149-border);border-radius:1rem;
background:var(--vibeui-card-149-card);
transition:border-color var(--vibeui-card-149-dur-2) ease;}
[data-vibeui-block="card-149"]:hover,[data-vibeui-block="card-149"][open]{border-color:color-mix(in oklab,var(--vibeui-card-149-accent) 40%,var(--vibeui-card-149-border));}
[data-vibeui-block="card-149"] [data-part="question"]{display:flex;align-items:baseline;gap:0.75rem;
padding:1.125rem 1.25rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:640;line-height:1.4;}
[data-vibeui-block="card-149"] [data-part="question"]::-webkit-details-marker{display:none}
[data-vibeui-block="card-149"] [data-part="question"]:focus-visible{outline:2px solid var(--vibeui-card-149-accent);outline-offset:2px;border-radius:1rem;}
[data-vibeui-block="card-149"] [data-part="sign"]{margin-left:auto;flex:none;align-self:center;width:0.875rem;height:0.875rem;position:relative;
color:var(--vibeui-card-149-accent);
transition:transform var(--vibeui-card-149-dur-2) ease;}
[data-vibeui-block="card-149"] [data-part="sign"]::before,[data-vibeui-block="card-149"] [data-part="sign"]::after{content:"";position:absolute;inset:0;margin:auto;background:currentColor;border-radius:1px;}
[data-vibeui-block="card-149"] [data-part="sign"]::before{width:100%;height:2px}
[data-vibeui-block="card-149"] [data-part="sign"]::after{width:2px;height:100%}
[data-vibeui-block="card-149"][open] [data-part="sign"]{transform:rotate(45deg)}
[data-vibeui-block="card-149"] [data-part="answer"]{margin:0;padding:0 1.25rem 1.25rem;max-width:62ch;
color:var(--vibeui-card-149-muted);font-size:0.9375rem;line-height:1.6;}
[data-vibeui-block="card-149"] [data-part="slot"]{margin:0 1.25rem 1.25rem;aspect-ratio:16/9;
display:grid;place-items:center;padding:1rem;
border:1px dashed color-mix(in oklab,var(--vibeui-card-149-accent) 45%,var(--vibeui-card-149-border));
border-radius:0.75rem;
background:linear-gradient(135deg,
color-mix(in oklab,var(--vibeui-card-149-accent) 12%,var(--vibeui-card-149-card)),
color-mix(in oklab,var(--vibeui-card-149-accent) 3%,var(--vibeui-card-149-card)) 55%,
color-mix(in oklab,var(--vibeui-card-149-accent) 9%,var(--vibeui-card-149-card)));}
[data-vibeui-block="card-149"] [data-part="slot-label"]{color:color-mix(in oklab,var(--vibeui-card-149-accent) 70%,var(--vibeui-card-149-muted));
font-size:0.8125rem;font-weight:600;text-align:center;line-height:1.4;}
@container (min-width: 40rem){
[data-vibeui-block="card-149"] [data-part="question"]{font-size:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-149"] *{animation:none!important;transition:none!important}}
`

/** Элемент details/summary: вопрос с маркером и ответ, раскрывается нативно. */
export function Card149({
  question = "Где на карточке блока кнопка Copy for AI?",
  answer = "В правом верхнем углу карточки и на странице блока рядом с превью. Нажатие кладёт в буфер готовую инструкцию для агента.",
  imageLabel = "/demo/realty/object-01.webp",
  accent,
  className,
  style,
  ...props
}: Card149Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-149-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-149" precedence="medium">
        {STYLES}
      </style>
      <details
        {...props}
        data-slot="card"
        data-vibeui-block="card-149"
        className={className}
        style={palette}
      >
        <summary data-part="question">
          <span>{question}</span>
          <span data-part="sign" aria-hidden="true" />
        </summary>
        <p data-part="answer">{answer}</p>
        {imageLabel ? (
          <figure data-part="slot">
            <figcaption data-part="slot-label">
              {imageLabel}
            </figcaption>
          </figure>
        ) : null}
      </details>
    </>
  )
}
