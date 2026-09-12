import type { CSSProperties } from "react"

export type Hero019Props = {
  eyebrow?: string
  title?: string
  lede?: string
  points?: string[]
  proof?: string
  formTitle?: string
  formLede?: string
  emailLabel?: string
  emailPlaceholder?: string
  submitLabel?: string
  terms?: string
  signinPrompt?: string
  signinLabel?: string
  signinHref?: string
  accent?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  className?: string
  style?: CSSProperties
}

// Идея блока: первый экран, у которого правая половина — не мокап продукта, а
// сама форма регистрации. Классика SaaS: слева обещание и три коротких довода,
// справа карточка с одним полем, кнопкой и мелким текстом про условия. Форма
// открыта сразу, без перехода на отдельную страницу, поэтому шаг между
// «прочитал» и «зарегистрировался» ровно один.
//
// Поле — настоящий <input type="email"> внутри <form>, а не имитация: браузер
// сам проверит адрес и подставит сохранённый. Кнопка — <button type="submit">,
// поэтому Enter в поле отправляет форму.
//
// Тема берётся из color-scheme окружения через light-dark(): по умолчанию
// секция светлая, а в тёмном контексте карточка светлее фона.
const STYLES = `
:where([data-vibeui-block="hero-019"]){
--vibeui-hero-019-bg:light-dark(oklch(0.985 0 250),oklch(0.19 0 258));
--vibeui-hero-019-fg:light-dark(oklch(0.21 0 258),oklch(0.95 0 258));
--vibeui-hero-019-muted:light-dark(oklch(0.51 0 258),oklch(0.72 0 258));
--vibeui-hero-019-card:light-dark(oklch(1 0 0),oklch(0.25 0 258));
--vibeui-hero-019-field:light-dark(oklch(0.985 0 258),oklch(0.22 0 258));
--vibeui-hero-019-line:light-dark(oklch(0.89 0 258),oklch(0.36 0 258));
--vibeui-hero-019-accent:light-dark(oklch(0.2 0 0),oklch(0.92 0 0));
--vibeui-hero-019-accent-fg:oklch(from var(--vibeui-hero-019-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-019"]{color-scheme:dark}
:where([data-vibeui-block="hero-019"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-019"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-019"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-hero-019-bg);color:var(--vibeui-hero-019-fg);
font-family:var(--vibeui-hero-019-font);
}
[data-vibeui-block="hero-019"] *{box-sizing:border-box}
[data-vibeui-block="hero-019"] [data-part="frame"]{
max-width:76rem;margin:0 auto;padding:3.5rem 1.25rem;
display:grid;grid-template-columns:minmax(0,1fr);gap:2rem;align-items:center;
}
[data-vibeui-block="hero-019"] [data-part="eyebrow"]{
margin:0 0 1rem;font-size:0.8125rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-hero-019-accent);
}
[data-vibeui-block="hero-019"] h1{
margin:0;font-size:clamp(1.875rem,5.2cqi,3.25rem);line-height:1.06;letter-spacing:-0.03em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="hero-019"] [data-part="lede"]{
margin:1rem 0 0;max-width:34rem;font-size:clamp(1rem,1.5cqi,1.125rem);line-height:1.6;
color:var(--vibeui-hero-019-muted);text-wrap:pretty;
}
[data-vibeui-block="hero-019"] [data-part="points"]{list-style:none;margin:1.75rem 0 0;padding:0;display:grid;gap:0.75rem}
[data-vibeui-block="hero-019"] [data-part="points"] li{
display:flex;align-items:flex-start;gap:0.625rem;font-size:1rem;line-height:1.45;
}
[data-vibeui-block="hero-019"] [data-part="tick"]{
flex:0 0 auto;display:flex;align-items:center;justify-content:center;margin-top:0.0625rem;
width:1.25rem;height:1.25rem;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-hero-019-accent) 16%,transparent);color:var(--vibeui-hero-019-accent);
}
[data-vibeui-block="hero-019"] [data-part="proof"]{
margin:1.75rem 0 0;font-size:0.875rem;color:var(--vibeui-hero-019-muted);
}
[data-vibeui-block="hero-019"] [data-part="card"]{
min-width:0;padding:1.75rem;border:1px solid var(--vibeui-hero-019-line);border-radius:1.25rem;
background:var(--vibeui-hero-019-card);
box-shadow:0 18px 40px color-mix(in oklab,var(--vibeui-hero-019-fg) 8%,transparent);
}
[data-vibeui-block="hero-019"] h2{margin:0;font-size:1.375rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="hero-019"] [data-part="form-lede"]{
margin:0.5rem 0 1.5rem;font-size:0.9375rem;line-height:1.5;color:var(--vibeui-hero-019-muted);
}
[data-vibeui-block="hero-019"] label{
display:block;margin-bottom:0.5rem;font-size:0.875rem;font-weight:600;color:var(--vibeui-hero-019-fg);
}
[data-vibeui-block="hero-019"] input{
display:block;width:100%;min-width:0;min-height:3rem;padding:0.75rem 0.9375rem;
border:1px solid var(--vibeui-hero-019-line);border-radius:0.75rem;
background:var(--vibeui-hero-019-field);color:var(--vibeui-hero-019-fg);
font:inherit;font-size:1rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="hero-019"] input::placeholder{color:color-mix(in oklab,var(--vibeui-hero-019-muted) 80%,transparent)}
[data-vibeui-block="hero-019"] input:focus-visible{
outline:none;border-color:var(--vibeui-hero-019-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-hero-019-accent) 24%,transparent);
}
[data-vibeui-block="hero-019"] [data-part="submit"]{
margin-top:0.875rem;display:flex;align-items:center;justify-content:center;
width:100%;min-height:3rem;padding:0.75rem 1.25rem;border:1px solid transparent;border-radius:0.75rem;
background:var(--vibeui-hero-019-accent);color:oklch(from var(--vibeui-hero-019-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font:inherit;font-size:1rem;font-weight:650;cursor:pointer;
box-shadow:0 0.375rem 1.25rem color-mix(in oklab,var(--vibeui-hero-019-accent) 38%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 42%,transparent);
transition:transform .2s cubic-bezier(.32,.72,0,1),box-shadow .25s ease;
}
[data-vibeui-block="hero-019"] [data-part="submit"]:hover{
transform:translateY(-1px);
box-shadow:0 0.625rem 1.75rem color-mix(in oklab,var(--vibeui-hero-019-accent) 48%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 52%,transparent);
}
[data-vibeui-block="hero-019"] [data-part="submit"]:hover{transform:translateY(-1px)}
[data-vibeui-block="hero-019"] [data-part="submit"]:focus-visible{
outline:3px solid color-mix(in oklab,var(--vibeui-hero-019-accent) 55%,transparent);outline-offset:2px;
}
[data-vibeui-block="hero-019"] [data-part="terms"]{
margin:1rem 0 0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-hero-019-muted);
}
[data-vibeui-block="hero-019"] [data-part="signin"]{
margin:1.25rem 0 0;padding-top:1.25rem;border-top:1px solid var(--vibeui-hero-019-line);
font-size:0.875rem;color:var(--vibeui-hero-019-muted);
}
[data-vibeui-block="hero-019"] [data-part="signin"] a{color:var(--vibeui-hero-019-accent);font-weight:650}
[data-vibeui-block="hero-019"] a:focus-visible{
outline:2px solid color-mix(in oklab,var(--vibeui-hero-019-accent) 55%,transparent);outline-offset:2px;border-radius:0.25rem;
}
@container (min-width: 52rem){
[data-vibeui-block="hero-019"] [data-part="frame"]{
grid-template-columns:minmax(0,1.15fr) minmax(0,22rem);gap:3.5rem;padding:5rem 2rem;
}
[data-vibeui-block="hero-019"] [data-part="card"]{padding:2rem}
}
@container (min-width: 68rem){
[data-vibeui-block="hero-019"] [data-part="frame"]{grid-template-columns:minmax(0,1.2fr) minmax(0,25rem);padding:6rem 3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-019"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_POINTS = [
  "Полторы тысячи секций и компонентов",
  "Установка одной командой в ваш проект",
  "Ноль зависимостей — код остаётся вашим",
]

/** Первый экран с регистрацией: обещание слева, карточка формы справа. */
export function Hero019({
  eyebrow = "Бесплатный старт",
  title = "Соберите первую страницу сегодня вечером",
  lede = "Заведите аккаунт, откройте каталог и поставьте нужные секции своим агентом — сборка занимает один вечер, а не спринт.",
  points = DEFAULT_POINTS,
  proof = "Уже с нами 12 400 команд — от одиночных разработчиков до продуктовых студий.",
  formTitle = "Создать аккаунт",
  formLede = "Начните с бесплатного плана. Карту вводить не нужно.",
  emailLabel = "Рабочая почта",
  emailPlaceholder = "name@company.com",
  submitLabel = "Создать аккаунт",
  terms = "Нажимая кнопку, вы соглашаетесь с условиями использования и политикой конфиденциальности.",
  signinPrompt = "Уже есть аккаунт?",
  signinLabel = "Войти",
  signinHref = "#",
  accent,
  tone = "auto",
  className,
  style,
}: Hero019Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-019-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-019" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-019"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="copy">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h1>{title}</h1>
            {lede ? <p data-part="lede">{lede}</p> : null}

            <ul data-part="points">
              {points.slice(0, 4).map((point) => (
                <li key={point}>
                  <span data-part="tick" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="11" height="11" fill="none">
                      <path
                        d="M3.5 8.5 6.5 11.5 12.5 4.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            {proof ? <p data-part="proof">{proof}</p> : null}
          </div>

          <form data-part="card">
            <h2>{formTitle}</h2>
            {formLede ? <p data-part="form-lede">{formLede}</p> : null}

            <label htmlFor="vibeui-hero-019-email">{emailLabel}</label>
            <input
              id="vibeui-hero-019-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={emailPlaceholder}
              required
            />

            <button data-part="submit" type="submit">
              {submitLabel}
            </button>

            {terms ? <p data-part="terms">{terms}</p> : null}

            <p data-part="signin">
              {signinPrompt} <a href={signinHref}>{signinLabel}</a>
            </p>
          </form>
        </div>
      </section>
    </>
  )
}
