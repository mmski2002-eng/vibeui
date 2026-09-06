import type { ComponentProps, CSSProperties } from "react"

export type Rating004Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  name?: string
  faces?: { face: string; text: string }[]
  defaultValue?: number
  /** Сноска под рядом лиц. */
  note?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: оценка лицами вместо звёзд. Звёзды спрашивают «сколько», а
// эмодзи — «как это было», и на вопрос о впечатлении так отвечают быстрее.
// Невыбранные лица обесцвечены фильтром: цветной ряд из пяти рожиц выглядит
// нарядно, но не показывает выбор. Всё держится на радиокнопках и :has(),
// поэтому клавиатура, отправка формы и подпись под рядом работают без JS,
// а компонент остаётся серверным.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
//
// Радиокнопки лежат в собственной <form data-part="faces">: одинаковое имя
// в двух блоках на одной странице иначе объединило бы их в одну группу, и
// первый блок остался бы без отмеченной оценки.
const STYLES = `
:where([data-vibeui-block="rating-004"]){
--vibeui-rating-004-surface:transparent;
--vibeui-rating-004-shell:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-rating-004-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-rating-004-muted:color-mix(in oklab,var(--vibeui-rating-004-fg) 68%,transparent);
--vibeui-rating-004-hover:light-dark(oklch(0.96 0 265),oklch(0.29 0 265));
/* Светлая ветка притемнена до 0.56: на 0.58 подпись выбора давала 4.2:1. */
--vibeui-rating-004-accent:light-dark(oklch(0.56 0.16 39.8),oklch(0.77 0.14 39.8));
--vibeui-rating-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="rating-004"]{color-scheme:dark}
/* Подложки по умолчанию нет: оценка ложится на фон страницы. */
[data-vibeui-block="rating-004"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:19rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-rating-004-surface);
border:1px solid var(--vibeui-rating-004-shell);border-radius:0.875rem;
font-family:var(--vibeui-rating-004-font);color:var(--vibeui-rating-004-fg);
text-align:center;
}
/* legend во float даёт обтекание: clear возвращает нормальный поток. */
[data-vibeui-block="rating-004"] legend{
float:left;width:100%;padding:0;margin-bottom:0.5rem;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="rating-004"] [data-part="faces"]{
clear:both;display:flex;justify-content:space-between;gap:0.25rem;
}
[data-vibeui-block="rating-004"] input{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-block="rating-004"] label{
flex:1 1 0;display:grid;place-items:center;cursor:pointer;
height:3rem;border-radius:0.625rem;
}
[data-vibeui-block="rating-004"] label:hover,
[data-vibeui-block="rating-004"] label:focus-within{background:var(--vibeui-rating-004-hover)}
[data-vibeui-block="rating-004"] [data-part="face"]{
font-size:1.75rem;line-height:1;
filter:grayscale(1);opacity:.45;
transition:filter .16s ease,opacity .16s ease,transform .16s ease;
}
/* Обесцвечены все, кроме выбранного: иначе нарядный ряд не показывает выбор. */
[data-vibeui-block="rating-004"] label:has(input:checked) [data-part="face"]{
filter:none;opacity:1;transform:scale(1.2);
}
[data-vibeui-block="rating-004"] label:hover [data-part="face"],
/* Та же расцветка на фокусе: без мыши превью работает клавиатурой. */
[data-vibeui-block="rating-004"] label:focus-within [data-part="face"]{filter:none;opacity:.8}
[data-vibeui-block="rating-004"] label:has(input:focus-visible){outline:2px solid var(--vibeui-rating-004-accent);outline-offset:2px}
/* Подпись без JS: видна та строка, чей value отмечен. */
[data-vibeui-block="rating-004"] [data-part="captions"]{min-height:1.125rem}
[data-vibeui-block="rating-004"] [data-part="caption"]{
display:none;margin:0;font-size:0.8125rem;font-weight:650;color:var(--vibeui-rating-004-accent);
}
[data-vibeui-block="rating-004"]:has(input[value="1"]:checked) [data-part="caption"][data-value="1"],
[data-vibeui-block="rating-004"]:has(input[value="2"]:checked) [data-part="caption"][data-value="2"],
[data-vibeui-block="rating-004"]:has(input[value="3"]:checked) [data-part="caption"][data-value="3"],
[data-vibeui-block="rating-004"]:has(input[value="4"]:checked) [data-part="caption"][data-value="4"],
[data-vibeui-block="rating-004"]:has(input[value="5"]:checked) [data-part="caption"][data-value="5"]{display:block}
[data-vibeui-block="rating-004"] [data-part="hint"]{margin:0;font-size:0.6875rem;color:var(--vibeui-rating-004-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="rating-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FACES = [
  { face: "😠", text: "Ужасно" },
  { face: "🙁", text: "Не понравилось" },
  { face: "😐", text: "Нормально" },
  { face: "🙂", text: "Хорошо" },
  { face: "😍", text: "Восторг" },
]

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
 * Оценка эмодзи на радиокнопках: выбранное лицо цветное, остальные обесцвечены.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Rating004({
  legend = "Как вам заказ?",
  name = "vibeui-rating-004",
  faces = DEFAULT_FACES,
  defaultValue = 4,
  note = "Ответ анонимный, его видит только служба поддержки",
  background = "",
  accent,
  className,
  style,
  ...props
}: Rating004Props) {
  const palette = {
    ...(accent ? { "--vibeui-rating-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-rating-004-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-rating-004" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="rating"
        data-vibeui-block="rating-004"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <form data-part="faces">
          {faces.map((item, index) => (
            <label key={item.text} aria-label={item.text}>
              <input
                type="radio"
                name={name}
                value={index + 1}
                defaultChecked={index + 1 === defaultValue}
              />
              <span data-part="face" aria-hidden="true">
                {item.face}
              </span>
            </label>
          ))}
        </form>
        <div data-part="captions" aria-live="polite">
          {faces.map((item, index) => (
            <p key={item.text} data-part="caption" data-value={index + 1}>
              {item.text}
            </p>
          ))}
        </div>
        <p data-part="hint">{note}</p>
      </fieldset>
    </>
  )
}
