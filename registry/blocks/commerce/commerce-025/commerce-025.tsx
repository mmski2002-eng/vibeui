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
  cta?: string
  reset?: string
  accent?: string
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
--vibeui-commerce-025-bg:oklch(1 0 0);
--vibeui-commerce-025-fg:oklch(0.21 0.014 265);
--vibeui-commerce-025-muted:oklch(0.55 0.014 265);
--vibeui-commerce-025-border:oklch(0.91 0.006 265);
--vibeui-commerce-025-soft:oklch(0.975 0.004 265);
--vibeui-commerce-025-accent:oklch(0.55 0.2 262);
--vibeui-commerce-025-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-025"]{
box-sizing:border-box;
background:var(--vibeui-commerce-025-bg);
font-family:var(--vibeui-commerce-025-sans);color:var(--vibeui-commerce-025-fg);
}
[data-vibeui-block="commerce-025"] *{box-sizing:border-box}
[data-vibeui-block="commerce-025"] [data-part="shell"]{padding:1rem;max-width:20rem;margin:0 auto}
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
box-shadow:inset 0 0 0 1px oklch(0 0 0 / 15%);
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
height:2.5rem;border-radius:0.75rem;
background:var(--vibeui-commerce-025-accent);color:oklch(1 0 0);font:inherit;font-size:0.875rem;font-weight:650;
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
  cta = "Показать",
  reset = "Сбросить",
  accent,
  className,
  style,
}: Commerce025Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-025-accent": accent } : null),
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
            <ul data-part="chips" aria-label="Выбранные фильтры">
              {chips.map((chip) => (
                <li key={chip} data-part="chip">
                  {chip}
                  <button type="button" aria-label={`Снять фильтр «${chip}»`}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <details open>
            <summary>Цена, ₽</summary>
            <div data-part="range">
              <label htmlFor="commerce-025-min" data-part="vh">
                Цена от
              </label>
              <input
                id="commerce-025-min"
                type="text"
                inputMode="numeric"
                defaultValue={min.toLocaleString("ru-RU")}
              />
              <span data-part="dash" aria-hidden="true">
                —
              </span>
              <label htmlFor="commerce-025-max" data-part="vh">
                Цена до
              </label>
              <input
                id="commerce-025-max"
                type="text"
                inputMode="numeric"
                defaultValue={max.toLocaleString("ru-RU")}
              />
            </div>
          </details>

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

          <button type="button" data-part="apply">
            {cta} {found} товаров
          </button>
        </div>
      </aside>
    </>
  )
}
