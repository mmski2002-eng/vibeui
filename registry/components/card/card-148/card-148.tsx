import type { ComponentProps, CSSProperties } from "react"

export type Card148Props = Omit<ComponentProps<"article">, "title" | "children"> & {
  question?: string
  answer?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока faq-012, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-148"]){
--vibeui-card-148-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-card-148-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-card-148-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-card-148-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-148"]{color-scheme:dark}
[data-vibeui-block="card-148"]{box-sizing:border-box}
[data-vibeui-block="card-148"] *{box-sizing:border-box}
[data-vibeui-block="card-148"]{min-inline-size:0;
padding:1.375rem 1.5rem;border:1px solid var(--vibeui-card-148-border);border-radius:1rem;
background:var(--vibeui-card-148-card);}
[data-vibeui-block="card-148"] [data-part="question"]{margin:0 0 0.625rem;
padding-left:0.875rem;position:relative;
font-size:1rem;font-weight:700;line-height:1.4;letter-spacing:-0.01em;}
[data-vibeui-block="card-148"] [data-part="question"]::before{content:"";position:absolute;left:0;top:0.2em;bottom:0.2em;width:3px;border-radius:2px;
background:var(--vibeui-card-148-accent);color:oklch(from var(--vibeui-card-148-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="card-148"] [data-part="answer"]{margin:0;color:var(--vibeui-card-148-muted);font-size:0.9375rem;line-height:1.6;}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-148"] *{animation:none!important;transition:none!important}}
`

/** Карточка FAQ с микроразметкой schema.org: вопрос и развёрнутый ответ. */
export function Card148({
  question = "Что такое VibeUI?",
  answer = "Каталог готовых секций для сайтов, рассчитанный на работу с AI-агентом: выбираете дизайн, копируете инструкцию — агент ставит настоящий компонент в проект.",
  accent,
  className,
  style,
  ...props
}: Card148Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-148-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-148" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-148"
        itemScope
        itemProp="mainEntity"
        itemType="https://schema.org/Question"
        className={className}
        style={palette}
      >
        <h3 data-part="question" itemProp="name">
          {question}
        </h3>
        <div
          itemScope
          itemProp="acceptedAnswer"
          itemType="https://schema.org/Answer"
        >
          <p data-part="answer" itemProp="text">
            {answer}
          </p>
        </div>
      </article>
    </>
  )
}
