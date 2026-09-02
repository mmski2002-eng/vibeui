import type { CSSProperties } from "react"

export type Commerce052Chapter = {
  id: string
  at: string
  title: string
}

export type Commerce052Props = {
  brand?: string
  title?: string
  price?: string
  lead?: string
  duration?: string
  reviewer?: string
  playLabel?: string
  chaptersTitle?: string
  chapters?: Commerce052Chapter[]
  transcriptTitle?: string
  transcript?: string
  cta?: string
  secondary?: string
  note?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: страница товара, где главное — видеообзор. Плеер стоит
// заглушкой с кнопкой запуска: автовоспроизведение съедает трафик и пугает
// звуком, поэтому запуск всегда ручной. Рядом лежат главы с таймкодами —
// по ним обзор смотрят выборочно, — и расшифровка в details: она нужна
// тем, у кого звук выключен, и поисковым роботам.
const STYLES = `
:where([data-vibeui-block="commerce-052"]){
--vibeui-commerce-052-bg:transparent;
--vibeui-commerce-052-fg:light-dark(oklch(0.2 0.014 275),oklch(0.93 0.006 275));
--vibeui-commerce-052-muted:light-dark(oklch(0.53 0.014 275),oklch(0.72 0.012 275));
--vibeui-commerce-052-border:light-dark(oklch(0.91 0.006 275),oklch(0.36 0.012 275));
--vibeui-commerce-052-soft:light-dark(oklch(0.97 0.004 275),oklch(0.28 0.008 275));
--vibeui-commerce-052-accent:light-dark(oklch(0.53 0.2 20),oklch(0.76 0.16 25));
--vibeui-commerce-052-onaccent:light-dark(oklch(0.99 0 0),oklch(0.18 0.03 25));
--vibeui-commerce-052-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-052"]{
box-sizing:border-box;background:var(--vibeui-commerce-052-bg);
color:var(--vibeui-commerce-052-fg);font-family:var(--vibeui-commerce-052-sans);
}
[data-vibeui-block="commerce-052"] *{box-sizing:border-box}
[data-vibeui-block="commerce-052"] [data-part="shell"]{max-width:68rem;margin:0 auto;padding:1.25rem 1rem 2rem;display:grid;gap:1.25rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-052"] [data-part="player"]{
position:relative;border-radius:1rem;overflow:hidden;aspect-ratio:16/9;
background:linear-gradient(135deg,oklch(0.32 0.06 285),oklch(0.24 0.05 250) 60%,oklch(0.3 0.08 20));
display:flex;align-items:center;justify-content:center;
}
[data-vibeui-block="commerce-052"] [data-part="play"]{
appearance:none;border:0;cursor:pointer;width:4.5rem;height:4.5rem;border-radius:9999px;
background:oklch(1 0 0 / 92%);color:oklch(0.2 0.014 275);
display:flex;align-items:center;justify-content:center;
transition:transform .16s ease;
}
[data-vibeui-block="commerce-052"] [data-part="play"]:hover{transform:scale(1.06)}
[data-vibeui-block="commerce-052"] [data-part="play"]:focus-visible{outline:3px solid oklch(1 0 0);outline-offset:3px}
[data-vibeui-block="commerce-052"] [data-part="play"]::before{
content:"";width:0;height:0;margin-left:0.375rem;
border-left:1.25rem solid currentColor;border-top:0.75rem solid transparent;border-bottom:0.75rem solid transparent;
}
[data-vibeui-block="commerce-052"] [data-part="meta"]{
position:absolute;left:0.75rem;bottom:0.75rem;display:flex;gap:0.375rem;flex-wrap:wrap;
}
[data-vibeui-block="commerce-052"] [data-part="tag"]{
display:inline-flex;align-items:center;height:1.625rem;padding:0 0.625rem;border-radius:9999px;
background:oklch(0.2 0.02 275 / 72%);color:oklch(0.99 0 0);font-size:0.6875rem;font-weight:650;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-052"] [data-part="brand"]{margin:0;font-size:0.75rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-commerce-052-accent)}
[data-vibeui-block="commerce-052"] h2{margin:0.375rem 0 0.5rem;font-size:clamp(1.25rem,4cqi,1.875rem);line-height:1.12;letter-spacing:-0.02em}
[data-vibeui-block="commerce-052"] [data-part="price"]{margin:0;font-size:1.5rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-052"] [data-part="lead"]{margin:0.5rem 0 0;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-052-muted)}
[data-vibeui-block="commerce-052"] [data-part="buttons"]{display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:1rem}
[data-vibeui-block="commerce-052"] [data-part="buy"]{
appearance:none;border:0;cursor:pointer;height:2.75rem;padding:0 1.5rem;border-radius:0.875rem;
background:var(--vibeui-commerce-052-accent);color:var(--vibeui-commerce-052-onaccent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-052"] [data-part="alt"]{
appearance:none;cursor:pointer;height:2.75rem;padding:0 1.25rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-052-border);background:var(--vibeui-commerce-052-bg);
color:inherit;font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="commerce-052"] [data-part="buy"]:focus-visible,
[data-vibeui-block="commerce-052"] [data-part="alt"]:focus-visible,
[data-vibeui-block="commerce-052"] [data-part="chapter"]:focus-visible,
[data-vibeui-block="commerce-052"] summary:focus-visible{outline:2px solid var(--vibeui-commerce-052-accent);outline-offset:2px}
[data-vibeui-block="commerce-052"] h3{margin:1.25rem 0 0.5rem;font-size:0.75rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-commerce-052-muted)}
[data-vibeui-block="commerce-052"] ol{list-style:none;margin:0;padding:0;display:grid;gap:0.25rem}
[data-vibeui-block="commerce-052"] [data-part="chapter"]{
width:100%;text-align:left;appearance:none;cursor:pointer;border:0;background:transparent;
display:flex;gap:0.625rem;align-items:baseline;padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.875rem;color:inherit;
transition:background-color .14s ease;
}
[data-vibeui-block="commerce-052"] [data-part="chapter"]:hover{background:var(--vibeui-commerce-052-soft)}
[data-vibeui-block="commerce-052"] [data-part="at"]{
flex:none;min-width:2.75rem;font-variant-numeric:tabular-nums;font-weight:700;color:var(--vibeui-commerce-052-accent);
}
[data-vibeui-block="commerce-052"] details{margin-top:1rem;border:1px solid var(--vibeui-commerce-052-border);border-radius:0.875rem;background:var(--vibeui-commerce-052-soft)}
[data-vibeui-block="commerce-052"] summary{cursor:pointer;padding:0.75rem 0.875rem;font-size:0.875rem;font-weight:650;border-radius:0.875rem}
[data-vibeui-block="commerce-052"] details p{margin:0;padding:0 0.875rem 0.875rem;font-size:0.8125rem;line-height:1.6;color:var(--vibeui-commerce-052-muted)}
[data-vibeui-block="commerce-052"] [data-part="note"]{margin:1rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-052-muted)}
@container (min-width: 46rem){
[data-vibeui-block="commerce-052"] [data-part="shell"]{padding:2rem 2rem 3rem;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:1.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-052"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CHAPTERS: Commerce052Chapter[] = [
  { id: "1", at: "0:00", title: "Что в коробке и как собирается" },
  { id: "2", at: "1:24", title: "Ткань вблизи: как выглядит после года" },
  { id: "3", at: "3:07", title: "Механизм раскладывания, замер шума" },
  { id: "4", at: "5:41", title: "Сравнение с моделью прошлого года" },
  { id: "5", at: "7:52", title: "Кому не подойдёт" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Страница товара с видеообзором: ручной запуск, главы с таймкодами и
 * расшифровка в details. Один файл, ноль зависимостей, палитра своя.
 */
export function Commerce052({
  brand = "Мастерская «Плёс»",
  title = "Диван «Отмель» с механизмом «еврокнижка»",
  price = "89 400 ₽",
  lead = "Девятиминутный обзор снят в шоуруме: показываем ткань вблизи, замеряем шум механизма и раскладываем диван три раза подряд.",
  duration = "9:12",
  reviewer = "Обзор редакции",
  playLabel = "Запустить видеообзор",
  chaptersTitle = "Главы обзора",
  chapters = DEFAULT_CHAPTERS,
  transcriptTitle = "Текстовая расшифровка обзора",
  transcript = "Собирается диван из четырёх частей и занимает около двадцати минут вдвоём. Ткань — рогожка плотностью 380 г/м², после года ежедневного использования на образце из шоурума нет катышков, но есть заметный залом в месте сгиба. Механизм раскладывания работает одной рукой, замеренный шум — 44 дБ. Не подойдёт, если проём двери уже 78 сантиметров: короб не проходит в собранном виде.",
  cta = "В корзину",
  secondary = "Сравнить с прошлой моделью",
  note = "Видео не запускается само: обзор весит 240 МБ, и на мобильном интернете это половина дневного пакета.",
  accent,
  background = "",
  className,
  style,
}: Commerce052Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-052-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-052-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-052" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-052"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <div data-part="player">
              <button type="button" data-part="play" aria-label={playLabel} />
              <div data-part="meta">
                <span data-part="tag">{duration}</span>
                <span data-part="tag">{reviewer}</span>
              </div>
            </div>

            <h3>{chaptersTitle}</h3>
            <ol>
              {chapters.map((chapter) => (
                <li key={chapter.id}>
                  <button type="button" data-part="chapter">
                    <span data-part="at">{chapter.at}</span>
                    <span>{chapter.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p data-part="brand">{brand}</p>
            <h2>{title}</h2>
            <p data-part="price">{price}</p>
            <p data-part="lead">{lead}</p>
            <div data-part="buttons">
              <button type="button" data-part="buy">
                {cta}
              </button>
              <button type="button" data-part="alt">
                {secondary}
              </button>
            </div>
            <details>
              <summary>{transcriptTitle}</summary>
              <p>{transcript}</p>
            </details>
            <p data-part="note">{note}</p>
          </div>
        </div>
      </section>
    </>
  )
}
