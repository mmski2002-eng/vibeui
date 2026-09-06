import type { ComponentProps, CSSProperties } from "react"

export type Rating002Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  name?: string
  defaultValue?: number
  /** Подпись деления для скринридера. {value} — оценка. */
  stepLabel?: string
  /** Строка под рядом. {value} — выбранная оценка. */
  valueText?: string
  /** Локаль записи числа: от неё зависит разделитель дроби. */
  locale?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: половинки звёзд без единой строки JS. Пять целых делений —
// грубая шкала: «четыре с половиной» люди говорят постоянно, а поставить не
// могут. Половинки сделаны не разрезанными звёздами, а полосой закраски поверх
// серого ряда: ширина полосы задаётся по отмеченному радио через :has(), и
// любая дробность сводится к одному числу процентов. Зоны нажатия — десять
// прозрачных меток поверх ряда, по половине звезды каждая, поэтому выбор
// работает мышью, а стрелками — как в обычной группе радиокнопок.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
//
// Радиокнопки лежат в собственной <form data-part="stars">: одинаковое имя
// в двух блоках на одной странице иначе объединило бы их в одну группу, и
// первый блок остался бы без отмеченной оценки.
const STYLES = `
:where([data-vibeui-block="rating-002"]){
--vibeui-rating-002-surface:transparent;
--vibeui-rating-002-shell:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-rating-002-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-rating-002-muted:color-mix(in oklab,var(--vibeui-rating-002-fg) 68%,transparent);
/* Звёзды — текстовые глифы, а не иконки, поэтому обе краски держат 4.5:1 к
   фону. На светлой странице это загоняет обе в узкую тёмную полосу, и чтобы
   закраска всё же читалась ярче пустой звезды, серый уведён темнее охры —
   как в тёмной ветке, где золото светлее серого. */
--vibeui-rating-002-empty:light-dark(oklch(0.42 0 265),oklch(0.58 0 265));
--vibeui-rating-002-accent:light-dark(oklch(0.54 0.16 39.8),oklch(0.84 0.15 39.8));
--vibeui-rating-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-rating-002-fill:0%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="rating-002"]{color-scheme:dark}
/* Подложки по умолчанию нет: оценка ложится на фон страницы. */
[data-vibeui-block="rating-002"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:17rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-rating-002-surface);
border:1px solid var(--vibeui-rating-002-shell);border-radius:0.875rem;
font-family:var(--vibeui-rating-002-font);color:var(--vibeui-rating-002-fg);
}
/* legend во float даёт обтекание: clear возвращает нормальный поток. */
[data-vibeui-block="rating-002"] legend{
float:left;width:100%;padding:0;margin-bottom:0.5rem;font-size:0.875rem;font-weight:650;
}
/* Межбуквенного зазора нет намеренно: он добавляется и после последней
   звезды, поэтому доля закраски в процентах переставала совпадать с
   оценкой — «четыре» заливало чуть меньше четырёх звёзд. */
/* Ряд занимает ровно ширину пяти звёзд: как flex-элемент он растягивался
   на всю карточку, и доля закраски в процентах считалась от неё, а не от
   звёзд — «три с половиной» заливало все пять. Межбуквенного зазора нет по
   той же причине: он добавляется и после последней звезды. */
[data-vibeui-block="rating-002"] [data-part="stars"]{
clear:both;position:relative;display:inline-block;
align-self:flex-start;width:max-content;
font-size:1.75rem;line-height:1;letter-spacing:0;
}
[data-vibeui-block="rating-002"] [data-part="track"]{color:var(--vibeui-rating-002-empty)}
/* Закраска — полоса поверх серого ряда: дробность сводится к процентам. */
[data-vibeui-block="rating-002"] [data-part="fill"]{
position:absolute;inset:0 auto 0 0;overflow:hidden;white-space:nowrap;
width:var(--vibeui-rating-002-fill);color:var(--vibeui-rating-002-accent);
pointer-events:none;
}
[data-vibeui-block="rating-002"] input{position:absolute;opacity:0;pointer-events:none}
/* Десять прозрачных зон по половине звезды: мышь попадает в половинку. */
[data-vibeui-block="rating-002"] [data-part="hit"]{
position:absolute;top:0;bottom:0;width:10%;cursor:pointer;border-radius:0.25rem;
}
[data-vibeui-block="rating-002"] input:focus-visible + [data-part="hit"]{
outline:2px solid var(--vibeui-rating-002-accent);outline-offset:2px;
}
[data-vibeui-block="rating-002"]:has(input[value="0.5"]:checked){--vibeui-rating-002-fill:10%}
[data-vibeui-block="rating-002"]:has(input[value="1"]:checked){--vibeui-rating-002-fill:20%}
[data-vibeui-block="rating-002"]:has(input[value="1.5"]:checked){--vibeui-rating-002-fill:30%}
[data-vibeui-block="rating-002"]:has(input[value="2"]:checked){--vibeui-rating-002-fill:40%}
[data-vibeui-block="rating-002"]:has(input[value="2.5"]:checked){--vibeui-rating-002-fill:50%}
[data-vibeui-block="rating-002"]:has(input[value="3"]:checked){--vibeui-rating-002-fill:60%}
[data-vibeui-block="rating-002"]:has(input[value="3.5"]:checked){--vibeui-rating-002-fill:70%}
[data-vibeui-block="rating-002"]:has(input[value="4"]:checked){--vibeui-rating-002-fill:80%}
[data-vibeui-block="rating-002"]:has(input[value="4.5"]:checked){--vibeui-rating-002-fill:90%}
[data-vibeui-block="rating-002"]:has(input[value="5"]:checked){--vibeui-rating-002-fill:100%}
/* Пока курсор в ряду, показываем не выбор, а то, что будет выбрано. */
[data-vibeui-block="rating-002"]:has([data-value="0.5"]:hover){--vibeui-rating-002-fill:10%}
[data-vibeui-block="rating-002"]:has([data-value="1"]:hover){--vibeui-rating-002-fill:20%}
[data-vibeui-block="rating-002"]:has([data-value="1.5"]:hover){--vibeui-rating-002-fill:30%}
[data-vibeui-block="rating-002"]:has([data-value="2"]:hover){--vibeui-rating-002-fill:40%}
[data-vibeui-block="rating-002"]:has([data-value="2.5"]:hover){--vibeui-rating-002-fill:50%}
[data-vibeui-block="rating-002"]:has([data-value="3"]:hover){--vibeui-rating-002-fill:60%}
[data-vibeui-block="rating-002"]:has([data-value="3.5"]:hover){--vibeui-rating-002-fill:70%}
[data-vibeui-block="rating-002"]:has([data-value="4"]:hover){--vibeui-rating-002-fill:80%}
[data-vibeui-block="rating-002"]:has([data-value="4.5"]:hover){--vibeui-rating-002-fill:90%}
[data-vibeui-block="rating-002"]:has([data-value="5"]:hover){--vibeui-rating-002-fill:100%}
/* Число тоже без JS: видна та строка, чей value отмечен. */
[data-vibeui-block="rating-002"] [data-part="value"]{
display:none;margin:0;font-size:0.75rem;color:var(--vibeui-rating-002-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="rating-002"] [data-part="values"]{min-height:1rem}
[data-vibeui-block="rating-002"]:has(input[value="0.5"]:checked) [data-part="value"][data-value="0.5"],
[data-vibeui-block="rating-002"]:has(input[value="1"]:checked) [data-part="value"][data-value="1"],
[data-vibeui-block="rating-002"]:has(input[value="1.5"]:checked) [data-part="value"][data-value="1.5"],
[data-vibeui-block="rating-002"]:has(input[value="2"]:checked) [data-part="value"][data-value="2"],
[data-vibeui-block="rating-002"]:has(input[value="2.5"]:checked) [data-part="value"][data-value="2.5"],
[data-vibeui-block="rating-002"]:has(input[value="3"]:checked) [data-part="value"][data-value="3"],
[data-vibeui-block="rating-002"]:has(input[value="3.5"]:checked) [data-part="value"][data-value="3.5"],
[data-vibeui-block="rating-002"]:has(input[value="4"]:checked) [data-part="value"][data-value="4"],
[data-vibeui-block="rating-002"]:has(input[value="4.5"]:checked) [data-part="value"][data-value="4.5"],
[data-vibeui-block="rating-002"]:has(input[value="5"]:checked) [data-part="value"][data-value="5"]{display:block}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="rating-002"] *{animation:none!important;transition:none!important}}
`

const STEPS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Оценка звёздами с половинками, собранная на радиокнопках и :has().
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Rating002({
  legend = "Насколько понравилось",
  name = "vibeui-rating-002",
  defaultValue = 3.5,
  stepLabel = "{value} из 5",
  valueText = "Ваша оценка: {value} из 5",
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
  ...props
}: Rating002Props) {
  const palette = {
    ...(accent ? { "--vibeui-rating-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-rating-002-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-rating-002" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="rating"
        data-vibeui-block="rating-002"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <form data-part="stars">
          <span data-part="track" aria-hidden="true">
            ★★★★★
          </span>
          <span data-part="fill" aria-hidden="true">
            ★★★★★
          </span>
          {STEPS.map((step, index) => (
            <label key={step}>
              <input
                type="radio"
                name={name}
                value={step}
                defaultChecked={step === defaultValue}
                aria-label={stepLabel.replace(
                  "{value}",
                  step.toLocaleString(locale),
                )}
              />
              <span
                data-part="hit"
                data-value={step}
                style={{ left: `${index * 10}%` }}
              />
            </label>
          ))}
        </form>
        <div data-part="values" aria-live="polite">
          {STEPS.map((step) => (
            <p key={step} data-part="value" data-value={step}>
              {valueText.replace("{value}", step.toLocaleString(locale))}
            </p>
          ))}
        </div>
      </fieldset>
    </>
  )
}
