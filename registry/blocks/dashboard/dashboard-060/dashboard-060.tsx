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
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подписи действий: ключ — значение action. */
  actionText?: Record<string, string>
  /** Подпись счётчика срабатываний. */
  hitsLabel?: string
  /** Подпись области применения: {scope}. */
  scopeText?: string
  /** Подпись включённого правила. */
  enabledLabel?: string
  /** Подпись выключенного правила. */
  disabledLabel?: string
  /** Заголовок формы нового правила. */
  newRuleLabel?: string
  /** Подпись поля выбора поля. */
  fieldLabel?: string
  /** Подпись поля условия. */
  conditionLabel?: string
  /** Подпись поля условия для скринридера. */
  conditionAriaLabel?: string
  /** Условие в форме нового правила. */
  draftCondition?: string
  /** Подпись поля действия. */
  actionLabel?: string
  /** Действие, выбранное в форме нового правила. */
  draftAction?: Dashboard060Rule["action"]
  /** Локаль форматирования чисел. */
  numberLocale?: string
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
--vibeui-dashboard-060-bg:transparent;
/* Карточки правил и поля формы: подложка блока прозрачна. */
--vibeui-dashboard-060-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 145));
--vibeui-dashboard-060-inset:light-dark(oklch(0.97 0.004 145),oklch(0.22 0.012 145));
--vibeui-dashboard-060-fg:light-dark(oklch(0.21 0.014 145),oklch(0.94 0.005 145));
--vibeui-dashboard-060-muted:light-dark(oklch(0.54 0.014 145),oklch(0.72 0.012 145));
--vibeui-dashboard-060-border:light-dark(oklch(0.91 0.006 145),oklch(0.36 0.012 145));
--vibeui-dashboard-060-accent:light-dark(oklch(0.5 0.13 160),oklch(0.76 0.12 160));
--vibeui-dashboard-060-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.03 160));
--vibeui-dashboard-060-accent-line:light-dark(oklch(0.85 0.05 160),oklch(0.44 0.07 160));
--vibeui-dashboard-060-knob:light-dark(oklch(1 0 0),oklch(0.96 0.004 145));
--vibeui-dashboard-060-soft:light-dark(oklch(0.965 0.02 160),oklch(0.31 0.04 160));
--vibeui-dashboard-060-block:light-dark(oklch(0.57 0.19 25),oklch(0.73 0.17 25));
--vibeui-dashboard-060-block-soft:light-dark(oklch(0.96 0.025 25),oklch(0.3 0.05 25));
--vibeui-dashboard-060-warn:light-dark(oklch(0.68 0.15 72),oklch(0.79 0.14 72));
--vibeui-dashboard-060-warn-ink:light-dark(oklch(0.47 0.11 72),oklch(0.85 0.12 72));
--vibeui-dashboard-060-warn-soft:light-dark(oklch(0.955 0.035 72),oklch(0.3 0.05 72));
--vibeui-dashboard-060-fix:light-dark(oklch(0.55 0.14 250),oklch(0.76 0.12 250));
--vibeui-dashboard-060-fix-soft:light-dark(oklch(0.96 0.02 250),oklch(0.3 0.045 250));
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
[data-vibeui-block="dashboard-060"] [data-part="rule"][data-enabled="false"]{background:var(--vibeui-dashboard-060-inset)}
[data-vibeui-block="dashboard-060"] [data-part="rule"][data-enabled="false"] [data-part="text"]{opacity:0.5}
[data-vibeui-block="dashboard-060"] [data-part="text"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.4375rem;font-size:0.8125rem}
[data-vibeui-block="dashboard-060"] [data-part="field"]{font-family:var(--vibeui-dashboard-060-mono);font-weight:700}
[data-vibeui-block="dashboard-060"] [data-part="cond"]{color:var(--vibeui-dashboard-060-muted)}
[data-vibeui-block="dashboard-060"] [data-part="act"]{
font-size:0.6875rem;font-weight:750;padding:0.125rem 0.4375rem;border-radius:0.375rem;white-space:nowrap;
}
[data-vibeui-block="dashboard-060"] [data-action="block"] [data-part="act"]{
color:var(--vibeui-dashboard-060-block);
background:var(--vibeui-dashboard-060-block-soft);
}
[data-vibeui-block="dashboard-060"] [data-action="warn"] [data-part="act"]{
color:var(--vibeui-dashboard-060-warn-ink);
background:var(--vibeui-dashboard-060-warn-soft);
}
[data-vibeui-block="dashboard-060"] [data-action="fix"] [data-part="act"]{
color:var(--vibeui-dashboard-060-fix);
background:var(--vibeui-dashboard-060-fix-soft);
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
background:var(--vibeui-dashboard-060-knob);transition:transform 0.15s ease;
}
[data-vibeui-block="dashboard-060"] [data-part="switch"] input:checked{background:var(--vibeui-dashboard-060-accent)}
[data-vibeui-block="dashboard-060"] [data-part="switch"] input:checked::after{transform:translateX(0.875rem)}
[data-vibeui-block="dashboard-060"] [data-part="new"]{
display:flex;flex-wrap:wrap;align-items:flex-end;gap:0.5rem;
padding:0.8125rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-060-soft);
border:1px solid var(--vibeui-dashboard-060-accent-line);
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
background:var(--vibeui-dashboard-060-accent);color:var(--vibeui-dashboard-060-on-accent);
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

const ACTION_LABELS: Record<string, string> = {
  block: "блокирует сохранение",
  warn: "предупреждает",
  fix: "исправляет молча",
}

const ACTION_ORDER: Dashboard060Rule["action"][] = ["block", "warn", "fix"]

/**
 * Ветка темы для заданного фона: светлая подложка не должна доставаться
 * тексту тёмной ветки light-dark().
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
  background = "",
  actionText = ACTION_LABELS,
  hitsLabel = "срабатываний за 30 дней:",
  scopeText = "область: {scope}",
  enabledLabel = "включено",
  disabledLabel = "выключено",
  newRuleLabel = "Новое правило",
  fieldLabel = "Поле",
  conditionLabel = "Условие",
  conditionAriaLabel = "Условие срабатывания",
  draftCondition = "пустое значение",
  actionLabel = "Действие",
  draftAction = "warn",
  numberLocale = "ru-RU",
  className,
  style,
}: Dashboard060Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-060-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-060-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
                  <span data-part="act">
                    {actionText[rule.action] ?? rule.action}
                  </span>
                </p>
                <p data-part="meta">
                  <span>
                    {hitsLabel}{" "}
                    <span data-part="hits" data-zero={rule.hits === 0}>
                      {rule.hits.toLocaleString(numberLocale)}
                    </span>
                  </span>
                  <span>{scopeText.replace("{scope}", rule.scope)}</span>
                </p>
                <label data-part="switch">
                  <input type="checkbox" defaultChecked={rule.enabled} />
                  {rule.enabled ? enabledLabel : disabledLabel}
                </label>
              </li>
            ))}
          </ul>

          <fieldset data-part="new">
            <legend>{newRuleLabel}</legend>
            <label>
              {fieldLabel}
              <select defaultValue={draftField}>
                {fields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {conditionLabel}
              <input
                type="text"
                defaultValue={draftCondition}
                aria-label={conditionAriaLabel}
              />
            </label>
            <label>
              {actionLabel}
              <select
                defaultValue={actionText[draftAction] ?? draftAction}
                aria-label={actionLabel}
              >
                {ACTION_ORDER.map((action) => (
                  <option key={action}>{actionText[action] ?? action}</option>
                ))}
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
