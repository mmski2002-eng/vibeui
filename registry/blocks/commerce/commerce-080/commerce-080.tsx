import type { CSSProperties } from "react"

export type Commerce080Props = {
  /** Подпись оценки: {value} — балл, {max} — максимум, {label} — слово. */
  ratingTemplate?: string
  id?: string
  title?: string
  product?: string
  legend?: string
  stars?: [string, string, string, string, string]
  ratingHint?: string
  nameLabel?: string
  namePlaceholder?: string
  headlineLabel?: string
  headlinePlaceholder?: string
  bodyLabel?: string
  bodyPlaceholder?: string
  bodyHint?: string
  recommendLabel?: string
  guidelinesTitle?: string
  guidelines?: string[]
  cta?: string
  moderationNote?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: форма отзыва, где оценка звёздами не бросает пишущего в пустоту —
// под рядом сразу написано словами, что именно он поставил: «Отлично — 5 из
// 5», а не голое число, которое ещё нужно перевести в впечатление. Оценка и
// её подпись собраны на радиокнопках и :has(), поэтому блок остаётся
// серверным. Памятка «что писать» стоит рядом с полем текста, а не в
// подсказке под ним: её читают до, а не после того, как бросили писать.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// по умолчанию нет, он лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="commerce-080"]){
--vibeui-commerce-080-bg:transparent;
--vibeui-commerce-080-paper:light-dark(oklch(1 0 0),oklch(0.2 0 265));
--vibeui-commerce-080-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-commerce-080-muted:light-dark(oklch(0.55 0 265),oklch(0.7 0 265));
--vibeui-commerce-080-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-commerce-080-soft:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-commerce-080-accent:light-dark(oklch(0.55 0.2 262),oklch(0.73 0.16 262));
--vibeui-commerce-080-star:light-dark(oklch(0.54 0.16 78),oklch(0.84 0.15 80));
--vibeui-commerce-080-star-empty:light-dark(oklch(0.42 0 265),oklch(0.58 0 265));
--vibeui-commerce-080-fill:0%;
--vibeui-commerce-080-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-080"]{color-scheme:dark}
[data-vibeui-block="commerce-080"]{
min-width:min(100%,18rem);box-sizing:border-box;
background:var(--vibeui-commerce-080-bg);
font-family:var(--vibeui-commerce-080-sans);color:var(--vibeui-commerce-080-fg);
}
[data-vibeui-block="commerce-080"] *{box-sizing:border-box}
[data-vibeui-block="commerce-080"] [data-part="shell"]{padding:1.25rem;max-width:40rem;margin:0 auto}
[data-vibeui-block="commerce-080"] [data-part="kicker"]{margin:0 0 0.125rem;font-size:0.75rem;color:var(--vibeui-commerce-080-muted)}
[data-vibeui-block="commerce-080"] h2{margin:0 0 1rem;font-size:1.125rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-080"] [data-part="grid"]{display:grid;gap:1.125rem}
@container (min-width: 34rem){
[data-vibeui-block="commerce-080"] [data-part="fields"]{display:grid;grid-template-columns:1fr 1fr;gap:1.125rem}
}
[data-vibeui-block="commerce-080"] fieldset{border:0;margin:0;padding:0}
[data-vibeui-block="commerce-080"] legend{padding:0;margin:0 0 0.5rem;font-size:0.8125rem;font-weight:650}
/* Ряд звёзд: закраска — полоса поверх серого ряда, ширина от :has(). */
[data-vibeui-block="commerce-080"] [data-part="stars"]{
position:relative;display:inline-block;font-size:1.625rem;line-height:1;letter-spacing:0.2rem;
}
[data-vibeui-block="commerce-080"] [data-part="track"]{color:var(--vibeui-commerce-080-star-empty)}
[data-vibeui-block="commerce-080"] [data-part="fill"]{
position:absolute;inset:0 auto 0 0;overflow:hidden;white-space:nowrap;
width:var(--vibeui-commerce-080-fill);color:var(--vibeui-commerce-080-star);pointer-events:none;
}
[data-vibeui-block="commerce-080"] [data-part="stars"] input{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-block="commerce-080"] [data-part="hit"]{
position:absolute;top:0;bottom:0;width:20%;cursor:pointer;border-radius:0.25rem;
}
[data-vibeui-block="commerce-080"] [data-part="stars"] input:focus-visible + [data-part="hit"]{
outline:2px solid var(--vibeui-commerce-080-accent);outline-offset:2px;
}
[data-vibeui-block="commerce-080"] [data-part="stars"]:has(input[value="1"]:checked){--vibeui-commerce-080-fill:20%}
[data-vibeui-block="commerce-080"] [data-part="stars"]:has(input[value="2"]:checked){--vibeui-commerce-080-fill:40%}
[data-vibeui-block="commerce-080"] [data-part="stars"]:has(input[value="3"]:checked){--vibeui-commerce-080-fill:60%}
[data-vibeui-block="commerce-080"] [data-part="stars"]:has(input[value="4"]:checked){--vibeui-commerce-080-fill:80%}
[data-vibeui-block="commerce-080"] [data-part="stars"]:has(input[value="5"]:checked){--vibeui-commerce-080-fill:100%}
[data-vibeui-block="commerce-080"] [data-part="stars"]:has([data-value="1"]:hover){--vibeui-commerce-080-fill:20%}
[data-vibeui-block="commerce-080"] [data-part="stars"]:has([data-value="2"]:hover){--vibeui-commerce-080-fill:40%}
[data-vibeui-block="commerce-080"] [data-part="stars"]:has([data-value="3"]:hover){--vibeui-commerce-080-fill:60%}
[data-vibeui-block="commerce-080"] [data-part="stars"]:has([data-value="4"]:hover){--vibeui-commerce-080-fill:80%}
[data-vibeui-block="commerce-080"] [data-part="stars"]:has([data-value="5"]:hover){--vibeui-commerce-080-fill:100%}
/* Слово вместо голого числа: видна та строка, чей value отмечен. */
[data-vibeui-block="commerce-080"] [data-part="says"]{margin:0;font-size:0.8125rem;color:var(--vibeui-commerce-080-muted);min-height:1.125rem}
[data-vibeui-block="commerce-080"] [data-part="word"]{display:none}
[data-vibeui-block="commerce-080"] [data-part="rating"]:has(input[value="1"]:checked) [data-part="word"][data-value="1"],
[data-vibeui-block="commerce-080"] [data-part="rating"]:has(input[value="2"]:checked) [data-part="word"][data-value="2"],
[data-vibeui-block="commerce-080"] [data-part="rating"]:has(input[value="3"]:checked) [data-part="word"][data-value="3"],
[data-vibeui-block="commerce-080"] [data-part="rating"]:has(input[value="4"]:checked) [data-part="word"][data-value="4"],
[data-vibeui-block="commerce-080"] [data-part="rating"]:has(input[value="5"]:checked) [data-part="word"][data-value="5"]{display:inline}
[data-vibeui-block="commerce-080"] [data-part="word"][data-value="0"]{display:inline}
[data-vibeui-block="commerce-080"] [data-part="rating"]:has(input:checked) [data-part="word"][data-value="0"]{display:none}
[data-vibeui-block="commerce-080"] label{display:flex;flex-direction:column;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-commerce-080-muted)}
[data-vibeui-block="commerce-080"] input[type="text"],
[data-vibeui-block="commerce-080"] textarea{
font:inherit;font-size:0.875rem;color:var(--vibeui-commerce-080-fg);padding:0.625rem 0.75rem;
border:1px solid var(--vibeui-commerce-080-border);border-radius:0.625rem;background:var(--vibeui-commerce-080-paper);resize:vertical;
}
[data-vibeui-block="commerce-080"] input[type="text"]{height:2.5rem}
[data-vibeui-block="commerce-080"] textarea{min-height:6.5rem;line-height:1.5}
[data-vibeui-block="commerce-080"] input:focus-visible,
[data-vibeui-block="commerce-080"] textarea:focus-visible{outline:2px solid var(--vibeui-commerce-080-accent);outline-offset:1px}
[data-vibeui-block="commerce-080"] [data-part="hint"]{margin:0.25rem 0 0;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-commerce-080-muted)}
[data-vibeui-block="commerce-080"] [data-part="recommend"]{
display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem;color:var(--vibeui-commerce-080-fg);
}
[data-vibeui-block="commerce-080"] [data-part="recommend"] input{width:1.125rem;height:1.125rem;accent-color:var(--vibeui-commerce-080-accent)}
[data-vibeui-block="commerce-080"] [data-part="guidelines"]{
padding:0.875rem 1rem;border-radius:0.75rem;background:var(--vibeui-commerce-080-soft);
font-size:0.75rem;color:var(--vibeui-commerce-080-muted);
}
[data-vibeui-block="commerce-080"] [data-part="guidelines"] strong{display:block;margin-bottom:0.375rem;font-size:0.75rem;color:var(--vibeui-commerce-080-fg)}
[data-vibeui-block="commerce-080"] [data-part="guidelines"] ul{
margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="commerce-080"] [data-part="guidelines"] li{padding-left:1rem;position:relative}
[data-vibeui-block="commerce-080"] [data-part="guidelines"] li::before{content:"—";position:absolute;left:0}
[data-vibeui-block="commerce-080"] [data-part="foot"]{display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap}
[data-vibeui-block="commerce-080"] [data-part="submit"]{
appearance:none;border:0;cursor:pointer;border-radius:0.625rem;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.5rem;padding:0.25rem 1.25rem;
background:var(--vibeui-commerce-080-fg);color:var(--vibeui-commerce-080-paper);font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-080"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-commerce-080-accent);outline-offset:2px}
[data-vibeui-block="commerce-080"] [data-part="moderation"]{margin:0;font-size:0.6875rem;color:var(--vibeui-commerce-080-muted);max-width:16rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-080"] *{animation:none!important;transition:none!important}}
`

const RATING_LABELS = ["Плохо", "Так себе", "Нормально", "Хорошо", "Отлично"]

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
 * Форма отзыва о товаре: оценка звёздами читается словом рядом, а не только
 * числом. Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce080({
  ratingTemplate = "{value} из {max} — {label}",
  id = "commerce-080",
  title = "Оставить отзыв",
  product = "О товаре: беспроводные наушники Aria Pro",
  legend = "Оценка",
  stars = RATING_LABELS as [string, string, string, string, string],
  ratingHint = "Оценка обязательна",
  nameLabel = "Имя",
  namePlaceholder = "Как подписать отзыв",
  headlineLabel = "Заголовок",
  headlinePlaceholder = "Одной фразой: что важно узнать в первую очередь",
  bodyLabel = "Текст отзыва",
  bodyPlaceholder = "Что понравилось, что нет, для чего покупали",
  bodyHint = "Минимум 40 символов — короткое «супер, всё ок» модерация отклоняет",
  recommendLabel = "Порекомендую этот товар другу",
  guidelinesTitle = "Что стоит написать",
  guidelines = [
    "для чего покупали и подошло ли",
    "что было не так, если было",
    "сколько уже пользуетесь",
  ],
  cta = "Отправить отзыв",
  moderationNote = "Отзыв опубликуется после проверки модератором, обычно в течение суток.",
  accent,
  background = "",
  className,
  style,
}: Commerce080Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-080-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-080-bg": background,
          "--vibeui-commerce-080-paper": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const ratingName = `${id}-rating`

  return (
    <>
      <style href="vibeui-commerce-080" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-080"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <p data-part="kicker">{product}</p>
          <h2>{title}</h2>

          <form data-part="grid">
            <fieldset data-part="rating">
              <legend>{legend}</legend>
              <div data-part="stars">
                <span data-part="track" aria-hidden="true">
                  ★★★★★
                </span>
                <span data-part="fill" aria-hidden="true">
                  ★★★★★
                </span>
                {stars.map((label, index) => {
                  const value = index + 1
                  return (
                    <label key={value}>
                      <input
                        type="radio"
                        name={ratingName}
                        value={value}
                        required
                        aria-label={ratingTemplate
                          .replace("{value}", String(value))
                          .replace("{max}", String(stars.length))
                          .replace("{label}", label)}
                      />
                      <span
                        data-part="hit"
                        data-value={value}
                        style={{ left: `${index * 20}%` }}
                      />
                    </label>
                  )
                })}
              </div>
              <p data-part="says">
                {stars.map((label, index) => {
                  const value = index + 1
                  return (
                    <span key={value} data-part="word" data-value={value}>
                      {ratingTemplate
                        .replace("{value}", String(value))
                        .replace("{max}", String(stars.length))
                        .replace("{label}", label)}
                    </span>
                  )
                })}
                <span data-part="word" data-value="0">
                  {ratingHint}
                </span>
              </p>
            </fieldset>

            <div data-part="fields">
              <label htmlFor={`${id}-name`}>
                {nameLabel}
                <input
                  id={`${id}-name`}
                  type="text"
                  name="name"
                  placeholder={namePlaceholder}
                  autoComplete="name"
                />
              </label>
              <label htmlFor={`${id}-headline`}>
                {headlineLabel}
                <input
                  id={`${id}-headline`}
                  type="text"
                  name="headline"
                  placeholder={headlinePlaceholder}
                  maxLength={80}
                />
              </label>
            </div>

            <label htmlFor={`${id}-body`}>
              {bodyLabel}
              <textarea
                id={`${id}-body`}
                name="body"
                placeholder={bodyPlaceholder}
                minLength={40}
                required
              />
              <span data-part="hint">{bodyHint}</span>
            </label>

            <label data-part="recommend" htmlFor={`${id}-recommend`}>
              <input
                id={`${id}-recommend`}
                type="checkbox"
                name="recommend"
                defaultChecked
              />
              {recommendLabel}
            </label>

            <div data-part="guidelines">
              <strong>{guidelinesTitle}</strong>
              <ul>
                {guidelines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>

            <div data-part="foot">
              <button type="submit" data-part="submit">
                {cta}
              </button>
              <p data-part="moderation">{moderationNote}</p>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
