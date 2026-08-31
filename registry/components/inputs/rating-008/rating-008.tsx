import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Rating008Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  name?: string
  lowAnchor?: string
  highAnchor?: string
  accent?: string
}

// Идея компонента: NPS ровно такой, как его считают. Шкала обязана начинаться
// с нуля, а не с единицы, и делиться на три зоны: 0–6 критики, 7–8 нейтралы,
// 9–10 сторонники. Зоны раскрашены сразу, а не после ответа: человек должен
// видеть, что «семёрка» здесь не «хорошо», иначе метрика собирает не то, что
// считает. Всё на радиокнопках и :has(), поэтому клавиатура, отправка формы и
// смена ответной реплики работают без JS, а компонент остаётся серверным.
const STYLES = `
:where([data-vibeui-block="rating-008"]){
--vibeui-rating-008-surface:oklch(1 0 0);
--vibeui-rating-008-shell:oklch(0.9 0.006 265);
--vibeui-rating-008-fg:oklch(0.23 0.014 265);
--vibeui-rating-008-muted:oklch(0.55 0.014 265);
--vibeui-rating-008-border:oklch(0.9 0.006 265);
--vibeui-rating-008-low:oklch(0.58 0.18 25);
--vibeui-rating-008-mid:oklch(0.7 0.14 75);
--vibeui-rating-008-high:oklch(0.56 0.15 155);
--vibeui-rating-008-accent:oklch(0.55 0.17 265);
--vibeui-rating-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: опрос показывают поверх любого фона. */
[data-vibeui-block="rating-008"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-rating-008-surface);
border:1px solid var(--vibeui-rating-008-shell);border-radius:0.875rem;
font-family:var(--vibeui-rating-008-font);color:var(--vibeui-rating-008-fg);
}
/* legend во float даёт обтекание: clear возвращает нормальный поток. */
[data-vibeui-block="rating-008"] legend{
float:left;width:100%;padding:0;margin-bottom:0.5rem;
font-size:0.875rem;font-weight:650;line-height:1.35;
}
[data-vibeui-block="rating-008"] [data-part="scale"]{clear:both;display:flex;gap:0.1875rem}
[data-vibeui-block="rating-008"] input{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-block="rating-008"] label{
flex:1 1 0;min-width:0;display:grid;place-items:center;cursor:pointer;
height:2.25rem;border-radius:0.375rem;
border:1px solid var(--vibeui-rating-008-border);
font-size:0.75rem;font-weight:700;font-variant-numeric:tabular-nums;
transition:background-color .12s ease,color .12s ease,border-color .12s ease;
}
/* Зоны раскрашены до ответа: иначе «семёрку» ставят как «хорошо». */
[data-vibeui-block="rating-008"] label[data-zone="low"]{color:var(--vibeui-rating-008-low)}
[data-vibeui-block="rating-008"] label[data-zone="mid"]{color:var(--vibeui-rating-008-mid)}
[data-vibeui-block="rating-008"] label[data-zone="high"]{color:var(--vibeui-rating-008-high)}
[data-vibeui-block="rating-008"] label:hover{border-color:currentColor}
[data-vibeui-block="rating-008"] label:has(input:checked){color:oklch(1 0 0);border-color:transparent}
[data-vibeui-block="rating-008"] label[data-zone="low"]:has(input:checked){background:var(--vibeui-rating-008-low)}
[data-vibeui-block="rating-008"] label[data-zone="mid"]:has(input:checked){background:var(--vibeui-rating-008-mid)}
[data-vibeui-block="rating-008"] label[data-zone="high"]:has(input:checked){background:var(--vibeui-rating-008-high)}
[data-vibeui-block="rating-008"] label:has(input:focus-visible){outline:2px solid var(--vibeui-rating-008-accent);outline-offset:2px}
[data-vibeui-block="rating-008"] [data-part="anchors"]{
display:flex;justify-content:space-between;gap:1rem;margin:0;
font-size:0.6875rem;color:var(--vibeui-rating-008-muted);
}
/* Ответная реплика без JS: видна та, чья зона отмечена. */
[data-vibeui-block="rating-008"] [data-part="replies"]{min-height:1.125rem}
[data-vibeui-block="rating-008"] [data-part="reply"]{display:none;margin:0;font-size:0.75rem;line-height:1.4;font-weight:600}
[data-vibeui-block="rating-008"] [data-part="reply"][data-zone="low"]{color:var(--vibeui-rating-008-low)}
[data-vibeui-block="rating-008"] [data-part="reply"][data-zone="mid"]{color:var(--vibeui-rating-008-mid)}
[data-vibeui-block="rating-008"] [data-part="reply"][data-zone="high"]{color:var(--vibeui-rating-008-high)}
[data-vibeui-block="rating-008"]:has(input[value="0"]:checked) [data-part="reply"][data-zone="low"],
[data-vibeui-block="rating-008"]:has(input[value="1"]:checked) [data-part="reply"][data-zone="low"],
[data-vibeui-block="rating-008"]:has(input[value="2"]:checked) [data-part="reply"][data-zone="low"],
[data-vibeui-block="rating-008"]:has(input[value="3"]:checked) [data-part="reply"][data-zone="low"],
[data-vibeui-block="rating-008"]:has(input[value="4"]:checked) [data-part="reply"][data-zone="low"],
[data-vibeui-block="rating-008"]:has(input[value="5"]:checked) [data-part="reply"][data-zone="low"],
[data-vibeui-block="rating-008"]:has(input[value="6"]:checked) [data-part="reply"][data-zone="low"],
[data-vibeui-block="rating-008"]:has(input[value="7"]:checked) [data-part="reply"][data-zone="mid"],
[data-vibeui-block="rating-008"]:has(input[value="8"]:checked) [data-part="reply"][data-zone="mid"],
[data-vibeui-block="rating-008"]:has(input[value="9"]:checked) [data-part="reply"][data-zone="high"],
[data-vibeui-block="rating-008"]:has(input[value="10"]:checked) [data-part="reply"][data-zone="high"]{display:block}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="rating-008"] *{animation:none!important;transition:none!important}}
`

const REPLIES = [
  { zone: "low", text: "Жаль. Расскажете, что испортило впечатление?" },
  { zone: "mid", text: "Спасибо. Чего не хватило до девятки?" },
  { zone: "high", text: "Спасибо! Поделитесь ссылкой с коллегами." },
]

function zoneOf(score: number) {
  if (score <= 6) return "low"
  if (score <= 8) return "mid"
  return "high"
}

/**
 * Шкала NPS от нуля до десяти с зонами критиков, нейтралов и сторонников.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Rating008({
  legend = "Насколько вероятно, что вы порекомендуете нас коллеге?",
  name = "vibeui-rating-008",
  lowAnchor = "0 — точно нет",
  highAnchor = "10 — обязательно",
  accent,
  className,
  style,
  ...props
}: Rating008Props) {
  const scores = Array.from({ length: 11 }, (_, index) => index)

  const palette = {
    ...(accent ? { "--vibeui-rating-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-rating-008" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="rating-008"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="scale">
          {scores.map((score) => (
            <label key={score} data-zone={zoneOf(score)}>
              <input type="radio" name={name} value={score} />
              {score}
            </label>
          ))}
        </div>
        <p data-part="anchors">
          <span>{lowAnchor}</span>
          <span>{highAnchor}</span>
        </p>
        <div data-part="replies" aria-live="polite">
          {REPLIES.map((reply) => (
            <p key={reply.zone} data-part="reply" data-zone={reply.zone}>
              {reply.text}
            </p>
          ))}
        </div>
      </fieldset>
    </>
  )
}
