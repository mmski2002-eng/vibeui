import type { CSSProperties } from "react"

export type Commerce025Group = {
  title: string
  kind?: "check" | "color" | "rate"
  open?: boolean
  options: { label: string; count?: number; hue?: number; checked?: boolean }[]
}

export type Commerce025Props = {
  title?: string
  chips?: string[]
  groups?: Commerce025Group[]
  min?: number
  max?: number
  found?: number
  /** Подпись кнопки: {count} подставляет число найденных товаров. */
  cta?: string
  reset?: string
  /** Заголовок группы с диапазоном цены. */
  priceTitle?: string
  /** Скрытые подписи полей диапазона. */
  priceFromLabel?: string
  priceToLabel?: string
  /** Подпись списка выбранных фильтров для скринридера. */
  chipsLabel?: string
  /** Подпись крестика на чипе: {chip} подставляет название фильтра. */
  removeText?: string
  /** Локаль форматирования чисел в полях цены. */
  numberLocale?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: боковые фильтры, где у каждого значения стоит число товаров.
// Фильтр без числа приводит в пустой список, и это выглядит поломкой каталога.
// Группы свёрнуты в details, поэтому длинная колонка не требует прокрутки и
// работает с клавиатуры без JS. Выбранное собрано в чипы наверху: иначе через
// три группы человек перестаёт помнить, что уже отметил.
const STYLES = `
:where([data-vibeui-block="commerce-025"]){
--vibeui-commerce-025-bg:transparent;
--vibeui-commerce-025-radius:0;
--vibeui-commerce-025-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-commerce-025-muted:light-dark(oklch(0.55 0 265),oklch(0.7 0 265));
--vibeui-commerce-025-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-commerce-025-soft:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-commerce-025-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-commerce-025-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 262));
--vibeui-commerce-025-ring:light-dark(oklch(0 0 0 / 15%),oklch(1 0 0 / 24%));
--vibeui-commerce-025-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-025"]{color-scheme:dark}
[data-vibeui-block="commerce-025"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-commerce-025-bg);
border-radius:var(--vibeui-commerce-025-radius);
font-family:var(--vibeui-commerce-025-sans);color:var(--vibeui-commerce-025-fg);
}
[data-vibeui-block="commerce-025"] *{box-sizing:border-box}
[data-vibeui-block="commerce-025"] [data-part="shell"]{padding:1rem;max-width:20rem;margin:0 auto}
[data-vibeui-block="commerce-025"] form{display:contents}
@container (min-width: 24rem){
[data-vibeui-block="commerce-025"] [data-part="shell"]{max-width:22rem}
}
[data-vibeui-block="commerce-025"] [data-part="vh"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="commerce-025"] [data-part="top"]{display:flex;align-items:baseline;gap:0.5rem;margin-bottom:0.625rem}
[data-vibeui-block="commerce-025"] h2{margin:0;font-size:1rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="commerce-025"] [data-part="reset"]{
margin-left:auto;appearance:none;border:0;background:none;padding:0;cursor:pointer;
color:var(--vibeui-commerce-025-accent);font:inherit;font-size:0.75rem;font-weight:600;text-decoration:underline;
}
[data-vibeui-block="commerce-025"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-commerce-025-accent);outline-offset:2px}
/* Выбранное — чипами наверху: через три группы список отметок забывается. */
[data-vibeui-block="commerce-025"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:0.3125rem;margin:0 0 0.75rem;padding:0;list-style:none}
[data-vibeui-block="commerce-025"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.375rem;padding:0.1875rem 0.375rem 0.1875rem 0.5rem;
border-radius:9999px;background:var(--vibeui-commerce-025-soft);border:1px solid var(--vibeui-commerce-025-border);
font-size:0.6875rem;
}
[data-vibeui-block="commerce-025"] [data-part="chip"] button{
appearance:none;border:0;background:none;padding:0;cursor:pointer;color:var(--vibeui-commerce-025-muted);font:inherit;line-height:1;
}
[data-vibeui-block="commerce-025"] [data-part="chip"] button:focus-visible{outline:2px solid var(--vibeui-commerce-025-accent);outline-offset:2px;border-radius:9999px}
[data-vibeui-block="commerce-025"] details{border-top:1px solid var(--vibeui-commerce-025-border);padding:0.625rem 0}
[data-vibeui-block="commerce-025"] summary{
display:flex;align-items:center;gap:0.5rem;cursor:pointer;list-style:none;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-025"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="commerce-025"] summary::after{content:"+";margin-left:auto;color:var(--vibeui-commerce-025-muted);font-weight:500}
[data-vibeui-block="commerce-025"] details[open] summary::after{content:"−"}
[data-vibeui-block="commerce-025"] summary:focus-visible{outline:2px solid var(--vibeui-commerce-025-accent);outline-offset:2px;border-radius:0.375rem}
[data-vibeui-block="commerce-025"] [data-part="options"]{display:flex;flex-direction:column;gap:0.375rem;margin-top:0.5rem}
[data-vibeui-block="commerce-025"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.8125rem;line-height:1.3;
}
[data-vibeui-block="commerce-025"] input[type="checkbox"],
[data-vibeui-block="commerce-025"] input[type="radio"]{accent-color:var(--vibeui-commerce-025-accent);width:1rem;height:1rem;margin:0;flex:none}
[data-vibeui-block="commerce-025"] [data-part="option"]:has(input:focus-visible){outline:2px solid var(--vibeui-commerce-025-accent);outline-offset:2px;border-radius:0.375rem}
/* Число рядом со значением: фильтр, ведущий в пустоту, читается как поломка. */
[data-vibeui-block="commerce-025"] [data-part="num"]{margin-left:auto;font-size:0.6875rem;color:var(--vibeui-commerce-025-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-025"] [data-part="dot"]{
width:1rem;height:1rem;border-radius:9999px;flex:none;
box-shadow:inset 0 0 0 1px var(--vibeui-commerce-025-ring);
background:oklch(0.72 0.14 var(--vibeui-commerce-025-hue,262));
}
[data-vibeui-block="commerce-025"] [data-part="range"]{display:flex;align-items:center;gap:0.5rem;margin-top:0.5rem}
[data-vibeui-block="commerce-025"] [data-part="range"] input{
width:100%;min-width:0;font:inherit;font-size:0.8125rem;height:2.125rem;padding:0 0.5rem;color:inherit;
border:1px solid var(--vibeui-commerce-025-border);border-radius:0.5rem;background:var(--vibeui-commerce-025-bg);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-025"] [data-part="range"] input:focus-visible{outline:2px solid var(--vibeui-commerce-025-accent);outline-offset:1px}
[data-vibeui-block="commerce-025"] [data-part="dash"]{color:var(--vibeui-commerce-025-muted)}
[data-vibeui-block="commerce-025"] [data-part="apply"]{
position:sticky;bottom:0;width:100%;margin-top:0.875rem;appearance:none;border:0;cursor:pointer;
display:flex;align-items:center;justify-content:center;
min-height:2.5rem;padding:0.25rem 0.875rem;border-radius:0.75rem;
background:var(--vibeui-commerce-025-accent);color:var(--vibeui-commerce-025-on-accent);font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-025"] [data-part="apply"]:focus-visible{outline:2px solid var(--vibeui-commerce-025-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-025"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Commerce025Group[] = [
  {
    title: "Материал",
    open: true,
    options: [
      { label: "Дуб", count: 42, checked: true },
      { label: "Ясень", count: 18 },
      { label: "Металл", count: 9 },
      { label: "Ротанг", count: 4 },
    ],
  },
  {
    title: "Цвет",
    kind: "color",
    open: true,
    options: [
      { label: "Песочный", count: 26, hue: 75, checked: true },
      { label: "Мох", count: 14, hue: 150 },
      { label: "Чернила", count: 11, hue: 262 },
      { label: "Кирпич", count: 6, hue: 30 },
    ],
  },
  {
    title: "Оценка",
    kind: "rate",
    options: [
      { label: "От 4,5 и выше", count: 51 },
      { label: "От 4,0 и выше", count: 88 },
      { label: "Любая", count: 128 },
    ],
  },
  {
    title: "Доставка",
    options: [
      { label: "Завтра", count: 37 },
      { label: "До трёх дней", count: 76 },
      { label: "Самовывоз сегодня", count: 12 },
    ],
  },
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
 * Боковые фильтры каталога: числа у значений, группы в details, чипы наверху.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce025({
  title = "Фильтры",
  chips = ["Дуб", "Песочный"],
  groups = DEFAULT_GROUPS,
  min = 5000,
  max = 60000,
  found = 128,
  cta = "Показать {count} товаров",
  reset = "Сбросить",
  priceTitle = "Цена, ₽",
  priceFromLabel = "Цена от",
  priceToLabel = "Цена до",
  chipsLabel = "Выбранные фильтры",
  removeText = "Снять фильтр «{chip}»",
  numberLocale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Commerce025Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-025-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-025-bg": background,
          "--vibeui-commerce-025-radius": "0.875rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-025" precedence="medium">
        {STYLES}
      </style>
      <aside
        data-vibeui-block="commerce-025"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="top">
            <h2>{title}</h2>
            <button type="button" data-part="reset">
              {reset}
            </button>
          </div>

          {chips.length > 0 ? (
            <ul data-part="chips" aria-label={chipsLabel}>
              {chips.map((chip) => (
                <li key={chip} data-part="chip">
                  {chip}
                  <button
                    type="button"
                    aria-label={removeText.replace("{chip}", chip)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <details open>
            <summary>{priceTitle}</summary>
            <div data-part="range">
              <label htmlFor="commerce-025-min" data-part="vh">
                {priceFromLabel}
              </label>
              <input
                id="commerce-025-min"
                type="text"
                inputMode="numeric"
                defaultValue={min.toLocaleString(numberLocale)}
              />
              <span data-part="dash" aria-hidden="true">
                —
              </span>
              <label htmlFor="commerce-025-max" data-part="vh">
                {priceToLabel}
              </label>
              <input
                id="commerce-025-max"
                type="text"
                inputMode="numeric"
                defaultValue={max.toLocaleString(numberLocale)}
              />
            </div>
          </details>

          <form>
            {groups.map((group) => (
              <details key={group.title} open={group.open}>
                <summary>{group.title}</summary>
                <div data-part="options">
                  {group.options.map((option, index) => (
                    <label key={option.label} data-part="option">
                      <input
                        type={group.kind === "rate" ? "radio" : "checkbox"}
                        name={
                          group.kind === "rate"
                            ? `commerce-025-${group.title}`
                            : undefined
                        }
                        defaultChecked={
                          group.kind === "rate" ? index === 0 : option.checked
                        }
                      />
                      {group.kind === "color" ? (
                        <span
                          data-part="dot"
                          aria-hidden="true"
                          style={
                            {
                              "--vibeui-commerce-025-hue": option.hue ?? 262,
                            } as CSSProperties
                          }
                        />
                      ) : null}
                      {option.label}
                      {option.count !== undefined ? (
                        <span data-part="num">{option.count}</span>
                      ) : null}
                    </label>
                  ))}
                </div>
              </details>
            ))}
          </form>

          <button type="button" data-part="apply">
            {cta.replace("{count}", String(found))}
          </button>
        </div>
      </aside>
    </>
  )
}
