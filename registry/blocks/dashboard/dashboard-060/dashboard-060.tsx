import type { CSSProperties } from "react"

export type Dashboard060Rule = {
  id: string
  field: string
  condition: string
  action: "block" | "warn" | "fix"
  enabled: boolean
  hits: number
  scope: string
}

export type Dashboard060Props = {
  title?: string
  subtitle?: string
  rules?: Dashboard060Rule[]
  draftField?: string
  fields?: string[]
  addLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: правило валидации бесполезно, пока непонятно, что оно делает при
// срабатывании. Поэтому у каждого правила названо действие словом — «блокирует»,
// «предупреждает», «исправляет», — и рядом стоит счётчик срабатываний за месяц:
// правило с нулём срабатываний либо лишнее, либо сломано. Выключенное правило
// не прячется, а гаснет: спрятанное правило потом ищут часами. Форма нового
// правила собрана как одно предложение «поле · условие · действие»: так его
// читают вслух и так проверяют смысл до сохранения.
const STYLES = `
:where([data-vibeui-block="dashboard-060"]){
--vibeui-dashboard-060-bg:oklch(0.985 0.003 145);
--vibeui-dashboard-060-card:oklch(1 0 0);
--vibeui-dashboard-060-fg:oklch(0.21 0.014 145);
--vibeui-dashboard-060-muted:oklch(0.54 0.014 145);
--vibeui-dashboard-060-border:oklch(0.91 0.006 145);
--vibeui-dashboard-060-accent:oklch(0.5 0.13 160);
--vibeui-dashboard-060-soft:oklch(0.965 0.02 160);
--vibeui-dashboard-060-block:oklch(0.57 0.19 25);
--vibeui-dashboard-060-warn:oklch(0.68 0.15 72);
--vibeui-dashboard-060-fix:oklch(0.55 0.14 250);
--vibeui-dashboard-060-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--vibeui-dashboard-060-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="dashboard-060"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-060-bg);
color:var(--vibeui-dashboard-060-fg);
font-family:var(--vibeui-dashboard-060-sans);
border:1px solid var(--vibeui-dashboard-060-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-060"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-060"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.875rem}
[data-vibeui-block="dashboard-060"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-060"] [data-part="sub"]{margin:0.25rem 0 0;font-size:0.75rem;color:var(--vibeui-dashboard-060-muted);max-width:52ch}
[data-vibeui-block="dashboard-060"] [data-part="rules"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.4375rem}
[data-vibeui-block="dashboard-060"] [data-part="rule"]{
display:grid;grid-template-columns:1fr auto;gap:0.375rem 0.75rem;align-items:start;
padding:0.6875rem 0.8125rem;border-radius:0.8125rem;
background:var(--vibeui-dashboard-060-card);border:1px solid var(--vibeui-dashboard-060-border);
}
[data-vibeui-block="dashboard-060"] [data-part="rule"][data-enabled="false"]{background:var(--vibeui-dashboard-060-bg)}
[data-vibeui-block="dashboard-060"] [data-part="rule"][data-enabled="false"] [data-part="text"]{opacity:0.5}
[data-vibeui-block="dashboard-060"] [data-part="text"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.4375rem;font-size:0.8125rem}
[data-vibeui-block="dashboard-060"] [data-part="field"]{font-family:var(--vibeui-dashboard-060-mono);font-weight:700}
[data-vibeui-block="dashboard-060"] [data-part="cond"]{color:var(--vibeui-dashboard-060-muted)}
[data-vibeui-block="dashboard-060"] [data-part="act"]{
font-size:0.6875rem;font-weight:750;padding:0.125rem 0.4375rem;border-radius:0.375rem;white-space:nowrap;
}
[data-vibeui-block="dashboard-060"] [data-action="block"] [data-part="act"]{
color:var(--vibeui-dashboard-060-block);
background:color-mix(in oklab,var(--vibeui-dashboard-060-block) 12%,white);
}
[data-vibeui-block="dashboard-060"] [data-action="warn"] [data-part="act"]{
color:color-mix(in oklab,var(--vibeui-dashboard-060-warn) 78%,black);
background:color-mix(in oklab,var(--vibeui-dashboard-060-warn) 18%,white);
}
[data-vibeui-block="dashboard-060"] [data-action="fix"] [data-part="act"]{
color:var(--vibeui-dashboard-060-fix);
background:color-mix(in oklab,var(--vibeui-dashboard-060-fix) 12%,white);
}
[data-vibeui-block="dashboard-060"] [data-part="meta"]{
grid-column:1;margin:0;display:flex;flex-wrap:wrap;gap:0.25rem 0.625rem;
font-size:0.6875rem;color:var(--vibeui-dashboard-060-muted);
}
[data-vibeui-block="dashboard-060"] [data-part="hits"]{font-weight:700;font-variant-numeric:tabular-nums;color:var(--vibeui-dashboard-060-fg)}
[data-vibeui-block="dashboard-060"] [data-part="hits"][data-zero="true"]{color:var(--vibeui-dashboard-060-muted);font-weight:400}
[data-vibeui-block="dashboard-060"] [data-part="switch"]{
grid-row:1 / span 2;display:inline-flex;align-items:center;gap:0.4375rem;cursor:pointer;
font-size:0.6875rem;font-weight:700;color:var(--vibeui-dashboard-060-muted);white-space:nowrap;
}
[data-vibeui-block="dashboard-060"] [data-part="switch"] input{
appearance:none;margin:0;width:2rem;height:1.125rem;border-radius:9999px;cursor:pointer;
background:var(--vibeui-dashboard-060-border);position:relative;transition:background 0.15s ease;
}
[data-vibeui-block="dashboard-060"] [data-part="switch"] input::after{
content:"";position:absolute;top:0.1875rem;left:0.1875rem;width:0.75rem;height:0.75rem;border-radius:50%;
background:oklch(1 0 0);transition:transform 0.15s ease;
}
[data-vibeui-block="dashboard-060"] [data-part="switch"] input:checked{background:var(--vibeui-dashboard-060-accent)}
[data-vibeui-block="dashboard-060"] [data-part="switch"] input:checked::after{transform:translateX(0.875rem)}
[data-vibeui-block="dashboard-060"] [data-part="new"]{
display:flex;flex-wrap:wrap;align-items:flex-end;gap:0.5rem;
padding:0.8125rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-060-soft);
border:1px solid color-mix(in oklab,var(--vibeui-dashboard-060-accent) 25%,white);
}
[data-vibeui-block="dashboard-060"] [data-part="new"] legend{
float:left;width:100%;clear:both;margin-bottom:0.4375rem;padding:0;
font-size:0.75rem;font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
color:var(--vibeui-dashboard-060-muted);
}
[data-vibeui-block="dashboard-060"] [data-part="new"] label{display:flex;flex-direction:column;gap:0.1875rem;font-size:0.6875rem;font-weight:700}
[data-vibeui-block="dashboard-060"] :is(select,input[type="text"]){
font:inherit;font-size:0.8125rem;padding:0.375rem 0.5rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-060-card);color:inherit;
border:1px solid var(--vibeui-dashboard-060-border);min-width:9rem;
}
[data-vibeui-block="dashboard-060"] [data-part="add"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:700;
padding:0.4375rem 0.875rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-060-accent);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-060"] :is(a,button,input,select,label):focus-visible{
outline:2px solid var(--vibeui-dashboard-060-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-060"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_RULES: Dashboard060Rule[] = [
  {
    id: "inn",
    field: "ИНН",
    condition: "не 10 или 12 цифр либо не проходит контрольную сумму",
    action: "block",
    enabled: true,
    hits: 218,
    scope: "форма клиента, импорт CSV",
  },
  {
    id: "email",
    field: "Почта",
    condition: "домен из списка одноразовых адресов",
    action: "warn",
    enabled: true,
    hits: 47,
    scope: "форма на сайте",
  },
  {
    id: "phone",
    field: "Телефон",
    condition: "номер записан без кода страны",
    action: "fix",
    enabled: true,
    hits: 1904,
    scope: "все источники",
  },
  {
    id: "amount",
    field: "Сумма сделки",
    condition: "больше 5 000 000 ₽ без приложенного основания",
    action: "block",
    enabled: true,
    hits: 6,
    scope: "заявки",
  },
  {
    id: "name-case",
    field: "Название компании",
    condition: "записано полностью заглавными",
    action: "fix",
    enabled: false,
    hits: 0,
    scope: "импорт CSV",
  },
  {
    id: "duplicate",
    field: "Пара ИНН + КПП",
    condition: "совпадает с существующим клиентом",
    action: "warn",
    enabled: true,
    hits: 83,
    scope: "форма клиента",
  },
]

const ACTION_LABELS: Record<Dashboard060Rule["action"], string> = {
  block: "блокирует сохранение",
  warn: "предупреждает",
  fix: "исправляет молча",
}

/**
 * Экран правил валидации: правило читается одним предложением «поле · условие ·
 * действие», рядом счётчик срабатываний, выключённые гаснут, а не прячутся.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard060({
  title = "Правила проверки данных",
  subtitle = "Правила применяются в порядке списка: блокирующее срабатывает раньше исправляющего, поэтому запись до автозамены может не дойти.",
  rules = DEFAULT_RULES,
  draftField = "Город",
  fields = [
    "Город",
    "ИНН",
    "КПП",
    "Название компании",
    "Почта",
    "Сумма сделки",
    "Телефон",
  ],
  addLabel = "Добавить правило",
  accent,
  className,
  style,
}: Dashboard060Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-060-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-060" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-060"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <h2>{title}</h2>
            <p data-part="sub">{subtitle}</p>
          </div>

          <ul data-part="rules">
            {rules.map((rule) => (
              <li
                key={rule.id}
                data-part="rule"
                data-action={rule.action}
                data-enabled={rule.enabled}
              >
                <p data-part="text">
                  <span data-part="field">{rule.field}</span>
                  <span data-part="cond">{rule.condition}</span>
                  <span data-part="act">{ACTION_LABELS[rule.action]}</span>
                </p>
                <p data-part="meta">
                  <span>
                    срабатываний за 30 дней:{" "}
                    <span data-part="hits" data-zero={rule.hits === 0}>
                      {rule.hits.toLocaleString("ru-RU")}
                    </span>
                  </span>
                  <span>область: {rule.scope}</span>
                </p>
                <label data-part="switch">
                  <input type="checkbox" defaultChecked={rule.enabled} />
                  {rule.enabled ? "включено" : "выключено"}
                </label>
              </li>
            ))}
          </ul>

          <fieldset data-part="new">
            <legend>Новое правило</legend>
            <label>
              Поле
              <select defaultValue={draftField}>
                {fields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Условие
              <input
                type="text"
                defaultValue="пустое значение"
                aria-label="Условие срабатывания"
              />
            </label>
            <label>
              Действие
              <select defaultValue="предупреждает">
                <option>блокирует сохранение</option>
                <option>предупреждает</option>
                <option>исправляет молча</option>
              </select>
            </label>
            <button type="button" data-part="add">
              {addLabel}
            </button>
          </fieldset>
        </div>
      </section>
    </>
  )
}
