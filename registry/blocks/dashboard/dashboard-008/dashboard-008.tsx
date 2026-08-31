import type { CSSProperties } from "react"

export type Dashboard008Row = {
  title: string
  meta: string
  status: "ok" | "wait" | "fail"
  statusLabel: string
  amount?: string
  href?: string
}

export type Dashboard008Props = {
  title?: string
  hint?: string
  tabs?: string[]
  activeTab?: string
  rows?: Dashboard008Row[]
  more?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: список записей вместо таблицы. Таблица нужна, когда колонки
// сравнивают между строками; здесь важнее одна запись целиком, поэтому строка
// собрана из заголовка, служебной строки и статуса. Статус помечен формой
// значка, а не только цветом. Ссылка растянута по строке, но статус и сумма
// остаются текстом — их не нужно нажимать. Вкладки сделаны ссылками: у
// отфильтрованного списка должен быть свой адрес.
const STYLES = `
:where([data-vibeui-block="dashboard-008"]){
--vibeui-dashboard-008-bg:oklch(1 0 0);
--vibeui-dashboard-008-fg:oklch(0.22 0.014 265);
--vibeui-dashboard-008-muted:oklch(0.55 0.014 265);
--vibeui-dashboard-008-border:oklch(0.91 0.006 265);
--vibeui-dashboard-008-hover:oklch(0.55 0.02 265 / 5%);
--vibeui-dashboard-008-accent:oklch(0.55 0.2 262);
--vibeui-dashboard-008-ok:oklch(0.58 0.14 152);
--vibeui-dashboard-008-wait:oklch(0.72 0.15 75);
--vibeui-dashboard-008-fail:oklch(0.57 0.19 25);
--vibeui-dashboard-008-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-008"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-dashboard-008-bg);
border:1px solid var(--vibeui-dashboard-008-border);border-radius:1rem;
font-family:var(--vibeui-dashboard-008-sans);color:var(--vibeui-dashboard-008-fg);
}
[data-vibeui-block="dashboard-008"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-008"] [data-part="head"]{padding:0.875rem 1rem 0.625rem}
[data-vibeui-block="dashboard-008"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="dashboard-008"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-008-muted)}
/* Вкладки ссылками: у отфильтрованного списка должен быть свой адрес. */
[data-vibeui-block="dashboard-008"] [data-part="tabs"]{
display:flex;gap:0.25rem;padding:0 1rem;overflow-x:auto;scrollbar-width:none;
border-bottom:1px solid var(--vibeui-dashboard-008-border);
}
[data-vibeui-block="dashboard-008"] [data-part="tabs"]::-webkit-scrollbar{display:none}
[data-vibeui-block="dashboard-008"] [data-part="tab"]{
position:relative;white-space:nowrap;
padding:0.5rem 0.5rem 0.625rem;
color:var(--vibeui-dashboard-008-muted);text-decoration:none;font-size:0.8125rem;
}
[data-vibeui-block="dashboard-008"] [data-part="tab"][aria-current="page"]{color:var(--vibeui-dashboard-008-fg);font-weight:650}
[data-vibeui-block="dashboard-008"] [data-part="tab"][aria-current="page"]::after{
content:"";position:absolute;left:0.25rem;right:0.25rem;bottom:-1px;height:2px;
background:var(--vibeui-dashboard-008-accent);
}
[data-vibeui-block="dashboard-008"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-dashboard-008-accent);outline-offset:-2px;border-radius:0.375rem}
[data-vibeui-block="dashboard-008"] ul{list-style:none;margin:0;padding:0}
[data-vibeui-block="dashboard-008"] [data-part="row"]{
position:relative;display:grid;grid-template-columns:auto 1fr auto;align-items:center;
gap:0.625rem;padding:0.625rem 1rem;
border-bottom:1px solid var(--vibeui-dashboard-008-border);
}
[data-vibeui-block="dashboard-008"] [data-part="row"]:hover{background:var(--vibeui-dashboard-008-hover)}
[data-vibeui-block="dashboard-008"] [data-part="row"]:has(a:focus-visible){outline:2px solid var(--vibeui-dashboard-008-accent);outline-offset:-2px}
/* Статус формой значка: круг, кольцо и квадрат различимы без цвета. */
[data-vibeui-block="dashboard-008"] [data-part="mark"]{
width:0.625rem;height:0.625rem;border-radius:9999px;
background:var(--vibeui-dashboard-008-ok);
}
[data-vibeui-block="dashboard-008"] [data-status="wait"] [data-part="mark"]{
background:none;box-shadow:inset 0 0 0 2px var(--vibeui-dashboard-008-wait);
}
[data-vibeui-block="dashboard-008"] [data-status="fail"] [data-part="mark"]{
border-radius:0.125rem;background:var(--vibeui-dashboard-008-fail);
}
[data-vibeui-block="dashboard-008"] [data-part="title"]{margin:0;font-size:0.8125rem;font-weight:600;line-height:1.3}
[data-vibeui-block="dashboard-008"] [data-part="title"] a{color:inherit;text-decoration:none}
[data-vibeui-block="dashboard-008"] [data-part="title"] a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="dashboard-008"] [data-part="meta"]{margin:0.0625rem 0 0;font-size:0.6875rem;color:var(--vibeui-dashboard-008-muted)}
[data-vibeui-block="dashboard-008"] [data-part="right"]{display:flex;flex-direction:column;align-items:flex-end;gap:0.125rem}
[data-vibeui-block="dashboard-008"] [data-part="amount"]{font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="dashboard-008"] [data-part="status"]{font-size:0.6875rem;color:var(--vibeui-dashboard-008-muted)}
[data-vibeui-block="dashboard-008"] [data-part="more"]{
display:block;width:100%;padding:0.625rem;
appearance:none;border:0;background:none;cursor:pointer;
color:var(--vibeui-dashboard-008-accent);font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="dashboard-008"] [data-part="more"]:focus-visible{outline:2px solid var(--vibeui-dashboard-008-accent);outline-offset:-2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Dashboard008Row[] = [
  {
    title: "Счёт № 300 · ООО «Полёт»",
    meta: "Выставлен 12 марта, срок 20 марта",
    status: "wait",
    statusLabel: "ожидает оплаты",
    amount: "24 000 ₽",
  },
  {
    title: "Счёт № 301 · ИП Гаврилов",
    meta: "Оплачен 13 марта картой",
    status: "ok",
    statusLabel: "оплачен",
    amount: "5 900 ₽",
  },
  {
    title: "Счёт № 302 · ООО «Ветка»",
    meta: "Платёж отклонён банком",
    status: "fail",
    statusLabel: "ошибка оплаты",
    amount: "12 400 ₽",
  },
  {
    title: "Счёт № 303 · Студия «Мера»",
    meta: "Черновик, не отправлен",
    status: "wait",
    statusLabel: "черновик",
    amount: "8 100 ₽",
  },
]

/**
 * Список записей со статусами: строка целиком важнее сравнения колонок.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard008({
  title = "Последние счета",
  hint = "Обновляется при каждом платеже",
  tabs = ["Все", "Ожидают", "Оплачены", "Ошибки"],
  activeTab = "Все",
  rows = DEFAULT_ROWS,
  more = "Показать все счета",
  accent,
  className,
  style,
}: Dashboard008Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-008" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-008"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <h2>{title}</h2>
          <p data-part="hint">{hint}</p>
        </header>

        <nav data-part="tabs" aria-label="Отбор списка">
          {tabs.map((tab) => (
            <a
              key={tab}
              data-part="tab"
              href="#"
              aria-current={tab === activeTab ? "page" : undefined}
            >
              {tab}
            </a>
          ))}
        </nav>

        <ul>
          {rows.map((row) => (
            <li key={row.title} data-part="row" data-status={row.status}>
              <span data-part="mark" aria-hidden="true" />
              <div>
                <p data-part="title">
                  <a href={row.href ?? "#"}>{row.title}</a>
                </p>
                <p data-part="meta">{row.meta}</p>
              </div>
              <div data-part="right">
                {row.amount ? (
                  <span data-part="amount">{row.amount}</span>
                ) : null}
                <span data-part="status">{row.statusLabel}</span>
              </div>
            </li>
          ))}
        </ul>

        <button type="button" data-part="more">
          {more}
        </button>
      </section>
    </>
  )
}
