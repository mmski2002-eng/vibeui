import type { CSSProperties } from "react"
import { Card094 } from "@/registry/components/card/card-094/card-094"

export type Realty005Step = {
  title: string
  text: string
  /** Срок шага: «1 день», «до 2 недель». */
  time?: string
}

export type Realty005Props = {
  eyebrow?: string
  title?: string
  lede?: string
  steps?: readonly Realty005Step[]
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Как проходит сделка: пять шагов в ряд, номера крупным серифом, между
// ними латунная линия, у каждого срок. На узком экране — вертикальная
// лента с той же линией слева. Без состояния: статичная секция.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="realty-005"]){
--vibeui-realty-005-bg:light-dark(#1a1a1a,#0f0f0f);
--vibeui-realty-005-fg:#f2f2f2;
--vibeui-realty-005-muted:color-mix(in oklab,var(--vibeui-realty-005-fg) 68%,transparent);
--vibeui-realty-005-line:color-mix(in oklab,var(--vibeui-realty-005-fg) 18%,transparent);
--vibeui-realty-005-accent:#f2f2f2;
--vibeui-realty-005-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-realty-005-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="realty-005"]{color-scheme:dark}
:where([data-vibeui-block="realty-005"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="realty-005"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="realty-005"]{box-sizing:border-box;display:block;background:var(--vibeui-realty-005-bg);color:var(--vibeui-realty-005-fg);font-family:var(--vibeui-realty-005-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="realty-005"] *{box-sizing:border-box}
[data-vibeui-block="realty-005"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="realty-005"] [data-part="eyebrow"]{margin:0 0 .5rem;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-realty-005-accent);font-weight:600}
[data-vibeui-block="realty-005"] [data-part="title"]{margin:0;font-family:var(--vibeui-realty-005-display);font-weight:500;font-size:clamp(2rem,4.5cqi,3.25rem);line-height:1.05}
[data-vibeui-block="realty-005"] [data-part="lede"]{margin:.75rem 0 0;max-width:36rem;color:var(--vibeui-realty-005-muted)}
[data-vibeui-block="realty-005"] [data-part="steps"]{position:relative;display:grid;gap:2rem;margin:3rem 0 0;padding:0 0 0 2.5rem;list-style:none}
[data-vibeui-block="realty-005"] [data-part="steps"]::before{content:"";position:absolute;left:.9rem;top:.5rem;bottom:.5rem;width:1px;background:var(--vibeui-realty-005-line)}
@container (min-width: 60rem){
[data-vibeui-block="realty-005"] [data-part="shell"]{padding:5.5rem 2rem}
[data-vibeui-block="realty-005"] [data-part="steps"]{grid-template-columns:repeat(5,minmax(0,1fr));gap:2rem;padding:3rem 0 0}
[data-vibeui-block="realty-005"] [data-part="steps"]::before{left:.9rem;right:.9rem;top:.9rem;bottom:auto;width:auto;height:1px}
}`

const DEFAULT_STEPS: Realty005Step[] = [
  { title: "Разговор", text: "Слушаем, зачем вам квартира и на сколько лет. Согласуем бюджет и районы.", time: "1 день" },
  { title: "Подбор", text: "Из базы и закрытых предложений отбираем 5–7 объектов, которые стоит смотреть.", time: "3–5 дней" },
  { title: "Показы", text: "Смотрим вместе: агент говорит и о плюсах, и о том, что вас может расстроить.", time: "1–2 недели" },
  { title: "Проверка", text: "Юрист проверяет историю квартиры, долги и собственников. Торгуемся за вас.", time: "до 10 дней" },
  { title: "Сделка и ключи", text: "Сопровождаем в банке и у нотариуса, принимаем квартиру, отдаём ключи.", time: "1 день" },
]

/** Как проходит сделка: пять шагов в ряд с серифными номерами и сроками. */
export function Realty005({
  eyebrow = "Как мы работаем",
  title = "От первого звонка до ключей — пять шагов",
  lede = "Сроки реальные: так проходит средняя сделка на вторичном рынке.",
  steps = DEFAULT_STEPS,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Realty005Props) {
  const palette = {
    ...(accent ? { "--vibeui-realty-005-accent": accent } : null),
    ...(ink ? { "--vibeui-realty-005-fg": ink } : null),
    ...(background ? { "--vibeui-realty-005-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-realty-005" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="realty-005" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <ol data-part="steps">
            {steps.map((step, index) => (
              <Card094 key={step.title} data-part="step" title={step.title} text={step.text} time={step.time} index={index} accent={accent} />
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
