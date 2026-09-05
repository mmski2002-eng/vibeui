import type { CSSProperties } from "react"

export type Auth031Stat = {
  value: string
  label: string
}

export type Auth031Props = {
  brand?: string
  claim?: string
  stats?: Auth031Stat[]
  quote?: string
  quoteAuthor?: string
  quoteRole?: string
  title?: string
  lead?: string
  submit?: string
  emailLabel?: string
  emailPlaceholder?: string
  passwordLabel?: string
  forgotText?: string
  switchText?: string
  switchLink?: string
  accent?: string
  /** Базовый цвет брендовой панели: градиент и паттерн строятся от него. */
  panel?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: вход, у которого брендовая панель — главный элемент кадра, а не
// приложение к форме. Пропорции перевёрнуты относительно привычного пополам:
// форма занимает узкую колонку слева, панель — всю оставшуюся ширину справа.
// Панель плотная: сетчатый градиент, диагональный паттерн, крупные цифры и
// подписанная цитата клиента.
//
// На узкой ширине панель не исчезает, а ужимается в полосу с одним обещанием:
// цифры и цитата уходят, бренд остаётся. Порядок в разметке — форма первой,
// поэтому с клавиатуры до полей доходят раньше рекламы, а визуальный порядок
// колонок гриду задавать не нужно.
//
// Тема формы берётся из color-scheme окружения через light-dark(). Панель
// остаётся тёмной в обеих ветках — это дизайн-идея блока.
const STYLES = `
:where([data-vibeui-block="auth-031"]){
--vibeui-auth-031-accent:oklch(0.62 0.19 292);
--vibeui-auth-031-panel:oklch(0.22 0.05 292);
--vibeui-auth-031-ink:oklch(0.98 0.004 292);
--vibeui-auth-031-fg:light-dark(oklch(0.21 0.014 292),oklch(0.95 0.006 292));
--vibeui-auth-031-dim:light-dark(oklch(0.52 0.014 292),oklch(0.72 0.012 292));
--vibeui-auth-031-line:light-dark(oklch(0.9 0.006 292),oklch(0.33 0.012 292));
--vibeui-auth-031-field:light-dark(oklch(1 0 0),oklch(0.19 0.014 292));
--vibeui-auth-031-shell:light-dark(oklch(0.99 0.002 292),oklch(0.16 0.014 292));
--vibeui-auth-031-on-accent:oklch(from var(--vibeui-auth-031-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-auth-031-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* light-dark() смотрит только на color-scheme, а next-themes и shadcn ставят
   класс: без этой строки блок останется светлым на тёмной странице. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-031"]{color-scheme:dark}
[data-vibeui-block="auth-031"]{
/* container-type отрывает ширину от содержимого: без нижней границы блок
   схлопывается внутри flex-кадра. */
min-width:min(100%,17rem);
box-sizing:border-box;
font-family:var(--vibeui-auth-031-font);
color:var(--vibeui-auth-031-fg);
}
[data-vibeui-block="auth-031"] *{box-sizing:border-box}
/* Раскладка живёт на внутренней обёртке: контейнер себя не измеряет. */
[data-vibeui-block="auth-031"] [data-part="shell"]{
display:grid;grid-template-columns:1fr;
max-width:72rem;margin:0 auto;overflow:hidden;
background:var(--vibeui-auth-031-shell);
border:1px solid var(--vibeui-auth-031-line);border-radius:1.25rem;
}
[data-vibeui-block="auth-031"] [data-part="form"]{
display:flex;flex-direction:column;justify-content:center;
padding:1.75rem 1.5rem;
}
[data-vibeui-block="auth-031"] [data-part="panel"]{
position:relative;isolation:isolate;overflow:hidden;
display:flex;flex-direction:column;justify-content:flex-end;gap:1.5rem;
padding:1.5rem;
color:var(--vibeui-auth-031-ink);
background:
radial-gradient(72% 62% at 10% 6%,color-mix(in oklab,var(--vibeui-auth-031-accent) 78%,transparent),transparent 62%),
radial-gradient(64% 74% at 94% 20%,oklch(0.63 0.2 342 / 62%),transparent 64%),
radial-gradient(88% 84% at 68% 104%,oklch(0.6 0.16 214 / 56%),transparent 62%),
var(--vibeui-auth-031-panel);
}
/* Паттерн поверх градиента: панель должна читаться плотной, а не пустой
   заливкой. Маска гасит штрихи к низу, чтобы текст не спорил с ними. */
[data-vibeui-block="auth-031"] [data-part="panel"]::before{
content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;
background-image:repeating-linear-gradient(118deg,oklch(1 0 0 / 9%) 0 1px,transparent 1px 13px);
mask-image:radial-gradient(120% 96% at 46% 4%,oklch(0 0 0) 26%,transparent 84%);
}
[data-vibeui-block="auth-031"] [data-part="mark"]{
display:inline-flex;align-items:center;gap:0.5rem;
font-size:0.8125rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
}
[data-vibeui-block="auth-031"] [data-part="chip"]{
display:inline-block;width:0.75rem;height:0.75rem;border-radius:0.25rem;
background:oklch(1 0 0 / 88%);
}
[data-vibeui-block="auth-031"] [data-part="claim"]{
margin:0.875rem 0 0;max-width:22ch;
font-size:clamp(1.5rem,3.4cqi,2.5rem);font-weight:700;line-height:1.08;letter-spacing:-0.025em;
}
[data-vibeui-block="auth-031"] [data-part="stats"]{
display:none;list-style:none;margin:0;padding:0;gap:1.5rem;
}
[data-vibeui-block="auth-031"] [data-part="stats"] li{min-inline-size:0}
[data-vibeui-block="auth-031"] [data-part="value"]{
display:block;font-size:1.5rem;font-weight:700;letter-spacing:-0.02em;line-height:1.1;
}
[data-vibeui-block="auth-031"] [data-part="unit"]{
display:block;margin-top:0.125rem;font-size:0.75rem;line-height:1.35;color:oklch(1 0 0 / 70%);
}
[data-vibeui-block="auth-031"] figure{display:none;margin:0}
[data-vibeui-block="auth-031"] blockquote{
margin:0;padding-top:1rem;border-top:1px solid oklch(1 0 0 / 20%);
font-size:0.875rem;line-height:1.5;
}
[data-vibeui-block="auth-031"] figcaption{
margin-top:0.5rem;font-size:0.75rem;line-height:1.4;color:oklch(1 0 0 / 72%);
}
[data-vibeui-block="auth-031"] figcaption b{font-weight:650;color:oklch(1 0 0 / 92%)}
[data-vibeui-block="auth-031"] h2{
margin:0 0 0.375rem;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em;line-height:1.15;
color:var(--vibeui-auth-031-fg);
}
[data-vibeui-block="auth-031"] [data-part="lead"]{
margin:0 0 1.25rem;font-size:0.875rem;line-height:1.5;color:var(--vibeui-auth-031-dim);
}
[data-vibeui-block="auth-031"] [data-part="field"]{
display:flex;flex-direction:column;gap:0.375rem;margin-bottom:0.875rem;
}
[data-vibeui-block="auth-031"] [data-part="row"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="auth-031"] label{font-size:0.8125rem;font-weight:600;color:var(--vibeui-auth-031-fg)}
[data-vibeui-block="auth-031"] [data-part="forgot"]{
font-size:0.75rem;font-weight:600;color:var(--vibeui-auth-031-accent);
}
[data-vibeui-block="auth-031"] input{
width:100%;min-height:2.625rem;padding:0.5rem 0.75rem;min-inline-size:0;
border:1px solid var(--vibeui-auth-031-line);border-radius:0.75rem;
background:var(--vibeui-auth-031-field);color:var(--vibeui-auth-031-fg);
font:inherit;font-size:0.875rem;
transition:border-color 120ms ease;
}
[data-vibeui-block="auth-031"] input::placeholder{color:var(--vibeui-auth-031-dim)}
[data-vibeui-block="auth-031"] input:focus-visible{
outline:2px solid var(--vibeui-auth-031-accent);outline-offset:1px;
border-color:var(--vibeui-auth-031-accent);
}
[data-vibeui-block="auth-031"] [data-part="submit"]{
width:100%;margin-top:0.5rem;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.75rem;padding:0.5rem 1rem;
border:0;border-radius:0.75rem;
background:var(--vibeui-auth-031-accent);color:var(--vibeui-auth-031-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
transition:filter 120ms ease;
}
[data-vibeui-block="auth-031"] [data-part="submit"]:hover{filter:brightness(1.08)}
[data-vibeui-block="auth-031"] [data-part="submit"]:focus-visible{
outline:2px solid var(--vibeui-auth-031-accent);outline-offset:2px;
}
[data-vibeui-block="auth-031"] [data-part="switch"]{
margin:1rem 0 0;font-size:0.8125rem;color:var(--vibeui-auth-031-dim);
}
[data-vibeui-block="auth-031"] [data-part="switch"] a{
color:var(--vibeui-auth-031-accent);font-weight:650;
}
/* Форма занимает узкую колонку, панель забирает остальную ширину: перевёрнутая
   пропорция и есть характер блока. */
@container (min-width: 52rem){
[data-vibeui-block="auth-031"] [data-part="shell"]{grid-template-columns:minmax(0,23rem) 1fr}
[data-vibeui-block="auth-031"] [data-part="form"]{padding:2.5rem 2rem}
[data-vibeui-block="auth-031"] [data-part="panel"]{min-height:27rem;padding:2.25rem}
[data-vibeui-block="auth-031"] [data-part="stats"]{display:flex}
[data-vibeui-block="auth-031"] figure{display:block}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-031"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STATS: Auth031Stat[] = [
  { value: "1 480", label: "блоков в каталоге" },
  { value: "12 с", label: "от выбора до вставки" },
  { value: "0", label: "зависимостей у блока" },
]

/**
 * Вход с брендовой панелью: узкая колонка формы слева, широкая декоративная
 * панель справа. Один файл, ноль зависимостей, собственная палитра.
 */
export function Auth031({
  brand = "VibeUI",
  claim = "Дизайн, который агент ставит без правок",
  stats = DEFAULT_STATS,
  quote = "Мы перестали спорить о вёрстке. Дизайнер выбирает блок, агент ставит, фронтенд занимается логикой.",
  quoteAuthor = "Анна Мерц",
  quoteRole = "техдиректор, «Полдень»",
  title = "С возвращением",
  lead = "Войдите, чтобы продолжить сборку.",
  submit = "Войти",
  emailLabel = "Рабочая почта",
  emailPlaceholder = "name@company.ru",
  passwordLabel = "Пароль",
  forgotText = "Забыли?",
  switchText = "Ещё нет аккаунта?",
  switchLink = "Создать",
  accent,
  panel,
  className,
  style,
}: Auth031Props) {
  const palette = {
    ...(accent ? { "--vibeui-auth-031-accent": accent } : null),
    ...(panel ? { "--vibeui-auth-031-panel": panel } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-031" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-031"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          {/* Форма первой в разметке: до полей доходят раньше обещания. */}
          <div data-part="form">
            <h2>{title}</h2>
            <p data-part="lead">{lead}</p>
            <form>
              <div data-part="field">
                <label htmlFor="vibeui-auth-031-email">{emailLabel}</label>
                <input
                  id="vibeui-auth-031-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder={emailPlaceholder}
                  required
                />
              </div>
              <div data-part="field">
                <span data-part="row">
                  <label htmlFor="vibeui-auth-031-password">
                    {passwordLabel}
                  </label>
                  <a href="#" data-part="forgot">
                    {forgotText}
                  </a>
                </span>
                <input
                  id="vibeui-auth-031-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>
              <button type="submit" data-part="submit">
                {submit}
              </button>
            </form>
            <p data-part="switch">
              {switchText} <a href="#">{switchLink}</a>
            </p>
          </div>

          {/* Панель декоративна: ничего, без чего нельзя войти, тут нет. */}
          <aside data-part="panel">
            <div>
              <span data-part="mark">
                <span data-part="chip" aria-hidden="true" />
                {brand}
              </span>
              <p data-part="claim">{claim}</p>
            </div>
            <ul data-part="stats">
              {stats.map((stat) => (
                <li key={stat.label}>
                  <span data-part="value">{stat.value}</span>
                  <span data-part="unit">{stat.label}</span>
                </li>
              ))}
            </ul>
            <figure>
              <blockquote>{quote}</blockquote>
              <figcaption>
                <b>{quoteAuthor}</b> — {quoteRole}
              </figcaption>
            </figure>
          </aside>
        </div>
      </section>
    </>
  )
}
