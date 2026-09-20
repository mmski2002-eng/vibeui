"use client"

import { useState, type CSSProperties, type ReactNode } from "react"

export type Comparison015Row = {
  label: string
  /** Значения по колонкам в порядке columns: первое — «мы». */
  values: readonly string[]
  /** Что раскрывается по клику: пояснение и пример ответа. */
  detail: string
  /** Строки примера ответа моноширинным. */
  sample?: readonly string[]
}

export type Comparison015Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Имена колонок; первая — наш продукт, подсвечивается. */
  columns?: readonly string[]
  rows?: readonly Comparison015Row[]
  note?: string
  /** Заголовок колонки и aria чужих значений. */
  criterionLabel?: string
  othersLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Сравнение с конкурентами таблицей-списком: колонка «мы» подсвечена
// акцентом, каждая строка — кнопка; по клику строка раскрывается через
// grid-template-rows 0fr → 1fr (высота анимируется без JS-замеров) и
// показывает пояснение и пример ответа моноширинным с подсветкой. На узком
// экране видны только критерий и наше значение, остальные конкуренты
// уезжают в раскрытие.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="comparison-015"]){
--vibeui-comparison-015-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-comparison-015-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-comparison-015-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-comparison-015-muted:color-mix(in oklab,var(--vibeui-comparison-015-fg) 60%,var(--vibeui-comparison-015-bg));
--vibeui-comparison-015-line:color-mix(in oklab,var(--vibeui-comparison-015-fg) 12%,transparent);
--vibeui-comparison-015-panel:color-mix(in oklab,var(--vibeui-comparison-015-fg) 4%,var(--vibeui-comparison-015-bg));
--vibeui-comparison-015-number:color-mix(in oklab,var(--vibeui-comparison-015-accent) 60%,#ffb454);
--vibeui-comparison-015-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-comparison-015-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="comparison-015"]{color-scheme:dark}
:where([data-vibeui-block="comparison-015"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="comparison-015"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="comparison-015"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-comparison-015-bg);color:var(--vibeui-comparison-015-fg);font-family:var(--vibeui-comparison-015-display);font-size:1rem;line-height:1.5}
[data-vibeui-block="comparison-015"] *{box-sizing:border-box}
[data-vibeui-block="comparison-015"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="comparison-015"] [data-part="head"]{max-width:42rem;margin:0 0 2.2rem}
[data-vibeui-block="comparison-015"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-comparison-015-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-comparison-015-accent)}
[data-vibeui-block="comparison-015"] [data-part="eyebrow"]::before{content:"// "}
[data-vibeui-block="comparison-015"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.02;letter-spacing:-.04em}
[data-vibeui-block="comparison-015"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-comparison-015-muted)}
[data-vibeui-block="comparison-015"] [data-part="table"]{border:1px solid var(--vibeui-comparison-015-line);border-radius:1.1rem;background:var(--vibeui-comparison-015-panel);overflow:hidden}
[data-vibeui-block="comparison-015"] [data-part="cols"],[data-vibeui-block="comparison-015"] [data-part="row"]{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) 1.5rem;align-items:center;gap:.8rem;padding:.9rem 1.1rem}
[data-vibeui-block="comparison-015"] [data-part="cols"]{border-bottom:1px solid var(--vibeui-comparison-015-line);font-family:var(--vibeui-comparison-015-mono);font-size:.7rem;color:var(--vibeui-comparison-015-muted)}
[data-vibeui-block="comparison-015"] [data-part="cols"] span:nth-child(n+3){display:none}
[data-vibeui-block="comparison-015"] [data-part="cols"] [data-us]{color:var(--vibeui-comparison-015-accent);font-weight:600}
[data-vibeui-block="comparison-015"] [data-part="list"]{margin:0;padding:0;list-style:none}
[data-vibeui-block="comparison-015"] [data-part="item"]{border-bottom:1px solid var(--vibeui-comparison-015-line)}
[data-vibeui-block="comparison-015"] [data-part="item"]:last-child{border-bottom:0}
[data-vibeui-block="comparison-015"] [data-part="row"]{width:100%;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;transition:background .2s}
[data-vibeui-block="comparison-015"] [data-part="row"]:hover{background:color-mix(in oklab,var(--vibeui-comparison-015-fg) 3%,transparent)}
[data-vibeui-block="comparison-015"] [data-part="row"]:focus-visible{outline:2px solid var(--vibeui-comparison-015-accent);outline-offset:-2px}
[data-vibeui-block="comparison-015"] [data-part="row"] [data-part="label"]{font-weight:600;font-size:.95rem}
[data-vibeui-block="comparison-015"] [data-part="row"] [data-part="value"]{font-family:var(--vibeui-comparison-015-mono);font-size:.82rem;color:var(--vibeui-comparison-015-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="comparison-015"] [data-part="row"] [data-part="value"]:nth-child(n+3):not([data-part="chev"]){display:none}
[data-vibeui-block="comparison-015"] [data-part="row"] [data-part="value"][data-us]{color:var(--vibeui-comparison-015-fg);font-weight:600;display:block}
[data-vibeui-block="comparison-015"] [data-part="row"] [data-part="value"][data-us]::before{content:"";display:inline-block;width:.4rem;height:.4rem;margin-right:.45rem;border-radius:50%;background:var(--vibeui-comparison-015-accent);box-shadow:0 0 6px var(--vibeui-comparison-015-accent);vertical-align:.1em}
[data-vibeui-block="comparison-015"] [data-part="chev"]{display:grid;place-items:center;width:1.5rem;height:1.5rem;border:1px solid var(--vibeui-comparison-015-line);border-radius:.4rem;color:var(--vibeui-comparison-015-muted);transition:transform .3s,color .2s,border-color .2s}
[data-vibeui-block="comparison-015"] [data-part="chev"] svg{width:.8rem;height:.8rem}
[data-vibeui-block="comparison-015"] [data-part="row"][aria-expanded="true"] [data-part="chev"]{transform:rotate(180deg);color:var(--vibeui-comparison-015-accent);border-color:var(--vibeui-comparison-015-accent)}
[data-vibeui-block="comparison-015"] [data-part="detail"]{display:grid;grid-template-rows:0fr;transition:grid-template-rows .4s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="comparison-015"] [data-part="item"][data-open="true"] [data-part="detail"]{grid-template-rows:1fr}
[data-vibeui-block="comparison-015"] [data-part="detail"] > div{overflow:hidden}
[data-vibeui-block="comparison-015"] [data-part="inner"]{display:grid;gap:1rem;padding:0 1.1rem 1.1rem}
[data-vibeui-block="comparison-015"] [data-part="sr"]{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
[data-vibeui-block="comparison-015"] [data-part="others"]{display:grid;gap:.3rem;margin:0 0 .8rem;padding:0;list-style:none;font-family:var(--vibeui-comparison-015-mono);font-size:.76rem;color:var(--vibeui-comparison-015-muted)}
[data-vibeui-block="comparison-015"] [data-part="others"] li{display:flex;justify-content:space-between;gap:1rem;padding:.35rem 0;border-bottom:1px dashed var(--vibeui-comparison-015-line)}
[data-vibeui-block="comparison-015"] [data-part="others"] b{color:var(--vibeui-comparison-015-fg);font-weight:500}
[data-vibeui-block="comparison-015"] [data-part="text"]{margin:0;font-size:.9rem;color:var(--vibeui-comparison-015-muted);max-width:40rem}
[data-vibeui-block="comparison-015"] [data-part="sample"]{margin:0;padding:.8rem 1rem;border:1px solid var(--vibeui-comparison-015-line);border-radius:.6rem;background:var(--vibeui-comparison-015-bg);font-family:var(--vibeui-comparison-015-mono);font-size:.74rem;line-height:1.6;color:var(--vibeui-comparison-015-muted);white-space:pre;overflow-x:auto}
[data-vibeui-block="comparison-015"] [data-part="sample"] [data-t="k"]{color:var(--vibeui-comparison-015-fg)}
[data-vibeui-block="comparison-015"] [data-part="sample"] [data-t="s"]{color:var(--vibeui-comparison-015-accent)}
[data-vibeui-block="comparison-015"] [data-part="sample"] [data-t="n"]{color:var(--vibeui-comparison-015-number)}
[data-vibeui-block="comparison-015"] [data-part="note"]{margin:1rem 0 0;font-size:.78rem;color:var(--vibeui-comparison-015-muted)}
@container (min-width: 56rem){[data-vibeui-block="comparison-015"] [data-part="cols"],[data-vibeui-block="comparison-015"] [data-part="row"]{grid-template-columns:minmax(0,1.6fr) repeat(var(--vibeui-comparison-015-n),minmax(0,1fr)) 1.5rem}[data-vibeui-block="comparison-015"] [data-part="cols"] span:nth-child(n+3),[data-vibeui-block="comparison-015"] [data-part="row"] [data-part="value"]:nth-child(n+3):not([data-part="chev"]){display:block}[data-vibeui-block="comparison-015"] [data-part="others"]{display:none}[data-vibeui-block="comparison-015"] [data-part="inner"]{grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);align-items:start}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="comparison-015"] *{animation:none!important;transition:none!important}}`

const DEFAULT_ROWS: Comparison015Row[] = [
  { label: "Точность до дома по России", values: ["98,4 %", "96,1 %", "97,2 %", "88,0 %"], detail: "Считаем по контрольной выборке из 50 000 адресов доставки в 85 регионах: доля ответов с точностью «дом» и ошибкой меньше 30 метров.", sample: ["\"precision\": \"house\",", "\"confidence\": 0.98,", "\"distance_m\": 4"] },
  { label: "Медиана ответа", values: ["42 ms", "120 ms", "85 ms", "210 ms"], detail: "Замер из Москвы за последние 30 дней, p50 по эндпоинту /geocode. Запрос уходит в ближайший регион автоматически.", sample: ["\"took_ms\": 42,", "\"region\": \"msk-1\",", "\"cached\": false"] },
  { label: "Цена за 1 000 запросов", values: ["0,40 ₽", "1,20 ₽", "0,90 ₽", "4,50 ₽"], detail: "Ставка первой платной ступени. С объёмом дешевле: от миллиона — 0,25 ₽, от десяти — 0,12 ₽. Округляем в вашу пользу.", sample: ["\"billing\": {", "  \"tier\": \"1m\",", "  \"per_1000\": 0.40", "}"] },
  { label: "Бесплатно в месяц", values: ["10 000", "1 000", "25 000*", "0"], detail: "Десять тысяч запросов в месяц без карты и без брендирования. Звёздочка у конкурента — бесплатный лимит только с показом их карты.", sample: ["\"quota\": {", "  \"free\": 10000,", "  \"used\": 2, ", "  \"resets_at\": \"2026-10-01\"", "}"] },
  { label: "Пакетная обработка", values: ["до 1 млн", "нет", "до 100 тыс.", "нет"], detail: "Загружаете CSV — забираете CSV. Миллион адресов обрабатывается за двенадцать минут, статус можно опрашивать или получить вебхуком.", sample: ["\"job\": \"btch_91ka\",", "\"rows\": 1000000,", "\"eta_s\": 720"] },
  { label: "Данные в России", values: ["да", "да", "да", "нет"], detail: "Все регионы обработки и хранение логов — в дата-центрах на территории РФ. Трансграничной передачи нет, это записано в договоре.", sample: ["\"storage\": \"ru\",", "\"log_retention_days\": 30"] },
  { label: "SLA в договоре", values: ["99,9 %", "—", "99,5 %", "99,9 %"], detail: "На всех платных объёмах. За каждые 0,1 % ниже — возвращаем 10 % месячного счёта, без заявок и переписки.", sample: ["\"sla\": 0.999,", "\"credit_policy\": \"auto\""] },
]

const JSON_TOKEN = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?)/g

function highlight(line: string) {
  const parts: ReactNode[] = []
  let last = 0
  for (const match of line.matchAll(JSON_TOKEN)) {
    const index = match.index ?? 0
    if (index > last) parts.push(line.slice(last, index))
    if (match[1]) {
      parts.push(
        <span key={index} data-t={match[2] ? "k" : "s"}>
          {match[1]}
        </span>,
      )
      if (match[2]) parts.push(match[2])
    } else {
      parts.push(
        <span key={index} data-t="n">
          {match[0]}
        </span>,
      )
    }
    last = index + match[0].length
  }
  if (last < line.length) parts.push(line.slice(last))
  return parts
}

/** Сравнение с конкурентами: строки раскрываются с примером ответа. */
export function Comparison015({
  eyebrow = "Сравнение",
  title = "Честно против трёх других",
  lede = "Цифры из публичных прайсов и наших замеров на сентябрь 2026. Нажмите на строку — покажем, как это выглядит в ответе API.",
  columns = ["Геокод", "AddrPro", "MapOne", "GeoCloud"],
  rows = DEFAULT_ROWS,
  note = "* — бесплатный лимит конкурента действует только с показом его карты и логотипа.",
  criterionLabel = "критерий",
  othersLabel = "У других",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Comparison015Props) {
  const [open, setOpen] = useState<number | null>(0)

  const palette = {
    ...(accent ? { "--vibeui-comparison-015-accent": accent } : null),
    ...(ink ? { "--vibeui-comparison-015-fg": ink } : null),
    ...(background ? { "--vibeui-comparison-015-bg": background } : null),
    ["--vibeui-comparison-015-n" as string]: columns.length,
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-comparison-015" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="comparison-015" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="table">
            <div data-part="cols" aria-hidden="true">
              <span>{criterionLabel}</span>
              {columns.map((column, index) => (
                <span key={column} data-us={index === 0 ? "" : undefined}>
                  {column}
                </span>
              ))}
              <span />
            </div>
            <ul data-part="list">
              {rows.map((row, index) => {
                const isOpen = open === index
                const id = `vibeui-comparison-015-${index}`
                const sample = row.sample ?? []
                return (
                  <li key={row.label} data-part="item" data-open={isOpen ? "true" : undefined}>
                    <button data-part="row" type="button" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpen(isOpen ? null : index)}>
                      <span data-part="label">{row.label}</span>
                      {row.values.map((value, column) => (
                        <span key={column} data-part="value" data-us={column === 0 ? "" : undefined}>
                          <span data-part="sr">{columns[column]}: </span>
                          {value}
                        </span>
                      ))}
                      <span data-part="chev" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </span>
                    </button>
                    <div data-part="detail" id={id}>
                      <div>
                        <div data-part="inner">
                          <div>
                            <ul data-part="others" aria-label={othersLabel}>
                              {columns.slice(1).map((column, other) => (
                                <li key={column}>
                                  <span>{column}</span>
                                  <b>{row.values[other + 1] ?? "—"}</b>
                                </li>
                              ))}
                            </ul>
                            <p data-part="text">{row.detail}</p>
                          </div>
                          {sample.length > 0 ? (
                            <pre data-part="sample">
                              {sample.map((line, lineIndex) => (
                                <span key={lineIndex}>
                                  {highlight(line)}
                                  {lineIndex < sample.length - 1 ? "\n" : null}
                                </span>
                              ))}
                            </pre>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
          {note ? <p data-part="note">{note}</p> : null}
        </div>
      </section>
    </>
  )
}
