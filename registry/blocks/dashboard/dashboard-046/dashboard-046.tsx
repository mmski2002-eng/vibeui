import type { CSSProperties } from "react"

export type Dashboard046Record = {
  kind: "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS"
  host: string
  value: string
  ttl: string
  state: "Применена" | "Разъезжается" | "Ошибка"
  note?: string
}

export type Dashboard046Props = {
  domain?: string
  status?: string
  registrar?: string
  nameservers?: string[]
  records?: Dashboard046Record[]
  addLabel?: string
  checkLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: таблица DNS-записей, где значение набрано моноширинным шрифтом и
// переносится по символам: строка вида длинного TXT иначе растягивает таблицу
// и ломает раскладку. Тип записи вынесен в отдельную плашку с кодом — A, MX,
// TXT читаются как метки, а не как текст. Состояние распространения подписано
// словом и формой значка, потому что «уже применилось или ещё едет» — главный
// вопрос этого экрана. Имена серверов вынесены отдельным списком: их меняют
// у регистратора, а не здесь.
const STYLES = `
:where([data-vibeui-block="dashboard-046"]){
--vibeui-dashboard-046-bg:oklch(0.985 0.003 210);
--vibeui-dashboard-046-card:oklch(1 0 0);
--vibeui-dashboard-046-fg:oklch(0.22 0.014 210);
--vibeui-dashboard-046-muted:oklch(0.55 0.014 210);
--vibeui-dashboard-046-border:oklch(0.91 0.006 210);
--vibeui-dashboard-046-accent:oklch(0.5 0.13 210);
--vibeui-dashboard-046-soft:oklch(0.96 0.02 210);
--vibeui-dashboard-046-ok:oklch(0.56 0.13 155);
--vibeui-dashboard-046-wait:oklch(0.66 0.15 70);
--vibeui-dashboard-046-bad:oklch(0.58 0.19 25);
--vibeui-dashboard-046-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-dashboard-046-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
container-type:inline-size;
}
[data-vibeui-block="dashboard-046"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-046-bg);
color:var(--vibeui-dashboard-046-fg);
font-family:var(--vibeui-dashboard-046-sans);
border:1px solid var(--vibeui-dashboard-046-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-046"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-046"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.75rem}
[data-vibeui-block="dashboard-046"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.875rem;
}
[data-vibeui-block="dashboard-046"] h2{
margin:0;font-family:var(--vibeui-dashboard-046-mono);
font-size:1.0625rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="dashboard-046"] [data-part="ok"]{
display:inline-flex;align-items:center;gap:0.375rem;
font-size:0.6875rem;font-weight:750;padding:0.1875rem 0.5rem;border-radius:9999px;
color:var(--vibeui-dashboard-046-ok);
border:1px solid color-mix(in oklab,var(--vibeui-dashboard-046-ok) 40%,white);
background:color-mix(in oklab,var(--vibeui-dashboard-046-ok) 10%,white);
}
[data-vibeui-block="dashboard-046"] [data-part="ok"]::before{
content:"";width:0.4375rem;height:0.4375rem;border-radius:50%;background:currentColor;
}
[data-vibeui-block="dashboard-046"] [data-part="reg"]{
margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-046-muted);
}
[data-vibeui-block="dashboard-046"] [data-part="acts"]{display:flex;gap:0.5rem;margin-left:auto}
[data-vibeui-block="dashboard-046"] [data-part="add"]{
appearance:none;border:0;cursor:pointer;font:inherit;
font-size:0.8125rem;font-weight:700;padding:0.5rem 0.9375rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-046-accent);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-046"] [data-part="check"]{
appearance:none;cursor:pointer;font:inherit;
font-size:0.8125rem;font-weight:650;padding:0.5rem 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-dashboard-046-border);background:var(--vibeui-dashboard-046-card);color:inherit;
}
[data-vibeui-block="dashboard-046"] [data-part="ns"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.625rem;
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-dashboard-046-card);
border:1px solid var(--vibeui-dashboard-046-border);
font-size:0.75rem;
}
[data-vibeui-block="dashboard-046"] [data-part="ns"] b{font-weight:700}
[data-vibeui-block="dashboard-046"] [data-part="ns"] code{
font-family:var(--vibeui-dashboard-046-mono);font-size:0.6875rem;
padding:0.125rem 0.375rem;border-radius:0.3125rem;
background:var(--vibeui-dashboard-046-soft);color:var(--vibeui-dashboard-046-accent);
}
[data-vibeui-block="dashboard-046"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="dashboard-046"] table{
width:100%;min-width:34rem;border-collapse:collapse;table-layout:fixed;
background:var(--vibeui-dashboard-046-card);
border:1px solid var(--vibeui-dashboard-046-border);border-radius:0.875rem;overflow:hidden;
}
[data-vibeui-block="dashboard-046"] th{
text-align:left;font-size:0.625rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-dashboard-046-muted);padding:0.625rem 0.75rem;
border-bottom:1px solid var(--vibeui-dashboard-046-border);white-space:nowrap;
}
[data-vibeui-block="dashboard-046"] th:nth-child(1){width:4.5rem}
[data-vibeui-block="dashboard-046"] th:nth-child(2){width:9rem}
[data-vibeui-block="dashboard-046"] th:nth-child(4){width:5rem}
[data-vibeui-block="dashboard-046"] th:nth-child(5){width:9rem}
[data-vibeui-block="dashboard-046"] td{
padding:0.625rem 0.75rem;font-size:0.75rem;vertical-align:top;
border-bottom:1px solid var(--vibeui-dashboard-046-border);
}
[data-vibeui-block="dashboard-046"] tbody tr:last-child td{border-bottom:0}
[data-vibeui-block="dashboard-046"] [data-part="kind"]{
display:inline-block;min-width:2.75rem;text-align:center;
font-family:var(--vibeui-dashboard-046-mono);font-size:0.6875rem;font-weight:700;
padding:0.125rem 0.375rem;border-radius:0.3125rem;
background:var(--vibeui-dashboard-046-soft);color:var(--vibeui-dashboard-046-accent);
}
[data-vibeui-block="dashboard-046"] [data-part="host"],
[data-vibeui-block="dashboard-046"] [data-part="value"]{
font-family:var(--vibeui-dashboard-046-mono);font-size:0.6875rem;line-height:1.5;
overflow-wrap:anywhere;
}
[data-vibeui-block="dashboard-046"] [data-part="note"]{
display:block;margin-top:0.25rem;font-family:var(--vibeui-dashboard-046-sans);
font-size:0.625rem;color:var(--vibeui-dashboard-046-muted);
}
[data-vibeui-block="dashboard-046"] [data-part="ttl"]{font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="dashboard-046"] [data-part="state"]{
display:inline-flex;align-items:center;gap:0.375rem;font-weight:650;white-space:nowrap;
color:var(--vibeui-dashboard-046-ok);
}
[data-vibeui-block="dashboard-046"] [data-part="state"]::before{
content:"";width:0.5rem;height:0.5rem;border-radius:50%;background:currentColor;flex:none;
}
[data-vibeui-block="dashboard-046"] tr[data-state="Разъезжается"] [data-part="state"]{color:var(--vibeui-dashboard-046-wait)}
[data-vibeui-block="dashboard-046"] tr[data-state="Разъезжается"] [data-part="state"]::before{
background:transparent;box-shadow:inset 0 0 0 1.5px currentColor;
}
[data-vibeui-block="dashboard-046"] tr[data-state="Ошибка"] [data-part="state"]{color:var(--vibeui-dashboard-046-bad)}
[data-vibeui-block="dashboard-046"] tr[data-state="Ошибка"] [data-part="state"]::before{border-radius:0.125rem}
[data-vibeui-block="dashboard-046"] [data-part="edit"]{
display:block;margin-top:0.25rem;font-size:0.6875rem;font-weight:700;
color:var(--vibeui-dashboard-046-accent);text-decoration:none;
}
[data-vibeui-block="dashboard-046"] [data-part="edit"]:hover{text-decoration:underline}
[data-vibeui-block="dashboard-046"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-046-accent);outline-offset:2px;
}
@container (min-width: 48rem){
[data-vibeui-block="dashboard-046"] [data-part="scroll"] table{min-width:0}
}
`

const DEFAULT_RECORDS: Dashboard046Record[] = [
  {
    kind: "A",
    host: "@",
    value: "185.12.44.19",
    ttl: "3600",
    state: "Применена",
  },
  {
    kind: "A",
    host: "www",
    value: "185.12.44.19",
    ttl: "3600",
    state: "Применена",
  },
  {
    kind: "CNAME",
    host: "app",
    value: "kontur-app.hosting.example.net.",
    ttl: "300",
    state: "Разъезжается",
    note: "изменена 12 минут назад, часть резолверов ещё отдаёт старое значение",
  },
  {
    kind: "MX",
    host: "@",
    value: "10 mx1.mailhost.ru.",
    ttl: "3600",
    state: "Применена",
  },
  {
    kind: "TXT",
    host: "@",
    value: "v=spf1 include:_spf.mailhost.ru include:_spf.kontur.ru ~all",
    ttl: "3600",
    state: "Применена",
  },
  {
    kind: "TXT",
    host: "_dmarc",
    value: "v=DMARC1; p=none; rua=mailto:dmarc@kontur.ru",
    ttl: "3600",
    state: "Ошибка",
    note: "две записи _dmarc одновременно — почтовые провайдеры игнорируют обе",
  },
]

/**
 * Страница домена: состояние домена, имена серверов и таблица DNS-записей с
 * моноширинными значениями и состоянием распространения. Один файл, ноль
 * зависимостей, клиентского JS нет.
 */
export function Dashboard046({
  domain = "kontur.ru",
  status = "домен подтверждён",
  registrar = "регистратор RU-CENTER · продлён до 14.08.2027",
  nameservers = ["ns1.hosting.example.net", "ns2.hosting.example.net"],
  records = DEFAULT_RECORDS,
  addLabel = "Добавить запись",
  checkLabel = "Проверить распространение",
  accent,
  className,
  style,
}: Dashboard046Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-046-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-046" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-046"
        className={className}
        style={palette}
        aria-label={`Домен ${domain}`}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{domain}</h2>
            <span data-part="ok">{status}</span>
            <p data-part="reg">{registrar}</p>
            <div data-part="acts">
              <button type="button" data-part="add">
                {addLabel}
              </button>
              <button type="button" data-part="check">
                {checkLabel}
              </button>
            </div>
          </div>

          <p data-part="ns">
            <b>Имена серверов:</b>
            {nameservers.map((server) => (
              <code key={server}>{server}</code>
            ))}
            <span data-part="reg">меняются у регистратора, не здесь</span>
          </p>

          <div data-part="scroll">
            <table>
              <caption hidden>DNS-записи домена {domain}</caption>
              <thead>
                <tr>
                  <th scope="col">Тип</th>
                  <th scope="col">Имя</th>
                  <th scope="col">Значение</th>
                  <th scope="col">TTL</th>
                  <th scope="col">Состояние</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr
                    key={record.kind + record.host + record.value}
                    data-state={record.state}
                  >
                    <td>
                      <span data-part="kind">{record.kind}</span>
                    </td>
                    <td data-part="host">{record.host}</td>
                    <td>
                      <span data-part="value">{record.value}</span>
                      {record.note ? (
                        <span data-part="note">{record.note}</span>
                      ) : null}
                    </td>
                    <td data-part="ttl">{record.ttl}</td>
                    <td>
                      <span data-part="state">{record.state}</span>
                      <a href="#dashboard-046" data-part="edit">
                        Изменить
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}
