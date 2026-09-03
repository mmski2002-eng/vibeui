import type { CSSProperties } from "react"

export type Auth005Feature = {
  title: string
  text: string
}

export type Auth005Props = {
  brand?: string
  claim?: string
  features?: Auth005Feature[]
  quote?: string
  quoteAuthor?: string
  title?: string
  lead?: string
  submit?: string
  switchText?: string
  switchLink?: string
  emailLabel?: string
  emailPlaceholder?: string
  passwordLabel?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: экран входа на две колонки — обещание слева, форма справа.
// Левая колонка исчезает на узкой ширине, а не сжимается: обрезанное обещание
// хуже его отсутствия, и форма должна остаться целой. Порядок в разметке —
// форма первой: с клавиатуры и в мобильном порядке до полей доходят раньше
// рекламы, а на широком экране колонки меняются местами гридом. Цитата
// подписана именем и должностью: анонимный отзыв не работает.
//
// Тема берётся из color-scheme окружения через light-dark(): форма темнеет
// вместе с контекстом. Левая колонка остаётся тёмной в обеих темах — это
// дизайн-идея блока, а не забытая палитра.
const STYLES = `
:where([data-vibeui-block="auth-005"]){
--vibeui-auth-005-bg:transparent;
--vibeui-auth-005-ink:oklch(0.98 0.003 265);
--vibeui-auth-005-panel:oklch(0.24 0.03 265);
--vibeui-auth-005-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-auth-005-muted:light-dark(oklch(0.55 0.014 265),oklch(0.69 0.013 265));
--vibeui-auth-005-dim:light-dark(oklch(0.75 0.014 265),oklch(0.58 0.014 265));
--vibeui-auth-005-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.011 265));
--vibeui-auth-005-accent:light-dark(oklch(0.62 0.18 262),oklch(0.76 0.15 262));
--vibeui-auth-005-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.02 265));
--vibeui-auth-005-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-005"]{color-scheme:dark}
[data-vibeui-block="auth-005"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
font-family:var(--vibeui-auth-005-sans);color:var(--vibeui-auth-005-fg);
}
/* Раскладка живёт на внутренней обёртке: сам контейнер себя не измеряет. */
[data-vibeui-block="auth-005"] [data-part="shell"]{
display:grid;grid-template-columns:1fr;overflow:hidden;
background:var(--vibeui-auth-005-bg);
border:1px solid var(--vibeui-auth-005-border);border-radius:1rem;
}
[data-vibeui-block="auth-005"] *{box-sizing:border-box}
/* Обещание исчезает на узкой ширине: обрезанное хуже отсутствующего. */
[data-vibeui-block="auth-005"] [data-part="pitch"]{display:none}
@container (min-width: 44rem){
[data-vibeui-block="auth-005"] [data-part="shell"]{grid-template-columns:1fr 1fr}
[data-vibeui-block="auth-005"] [data-part="pitch"]{display:flex;grid-column:1;grid-row:1}
[data-vibeui-block="auth-005"] [data-part="form"]{grid-column:2;grid-row:1}
}
[data-vibeui-block="auth-005"] [data-part="pitch"]{
flex-direction:column;justify-content:space-between;gap:1.5rem;
padding:1.5rem;
background:
radial-gradient(120% 90% at 20% 0%, oklch(0.36 0.09 262), transparent 65%),
var(--vibeui-auth-005-panel);
color:var(--vibeui-auth-005-ink);
}
[data-vibeui-block="auth-005"] [data-part="brand"]{font-size:0.875rem;font-weight:700;letter-spacing:0.01em}
[data-vibeui-block="auth-005"] [data-part="claim"]{
margin:0.75rem 0 1rem;font-size:1.375rem;font-weight:700;line-height:1.2;letter-spacing:-0.02em;
}
[data-vibeui-block="auth-005"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.625rem}
[data-vibeui-block="auth-005"] li{display:flex;gap:0.5rem;font-size:0.8125rem;line-height:1.45}
[data-vibeui-block="auth-005"] [data-part="mark"]{
flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:1.125rem;height:1.125rem;margin-top:0.0625rem;border-radius:9999px;
background:oklch(1 0 0 / 16%);font-size:0.625rem;line-height:1;
}
[data-vibeui-block="auth-005"] [data-part="ftitle"]{font-weight:650}
[data-vibeui-block="auth-005"] [data-part="ftext"]{color:oklch(1 0 0 / 72%)}
[data-vibeui-block="auth-005"] figure{margin:0}
[data-vibeui-block="auth-005"] blockquote{
margin:0;padding-top:1rem;border-top:1px solid oklch(1 0 0 / 16%);
font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="auth-005"] figcaption{margin-top:0.375rem;font-size:0.6875rem;color:oklch(1 0 0 / 66%)}
[data-vibeui-block="auth-005"] [data-part="form"]{padding:1.5rem}
[data-vibeui-block="auth-005"] h2{margin:0 0 0.25rem;font-size:1.1875rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="auth-005"] [data-part="lead"]{margin:0 0 1rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-auth-005-muted)}
[data-vibeui-block="auth-005"] [data-part="field"]{display:flex;flex-direction:column;gap:0.3125rem;margin-bottom:0.75rem}
[data-vibeui-block="auth-005"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-005"] input{
width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-auth-005-border);border-radius:0.625rem;
background:var(--vibeui-auth-005-bg);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-005"] input:focus-visible{outline:2px solid var(--vibeui-auth-005-accent);outline-offset:1px;border-color:var(--vibeui-auth-005-accent)}
[data-vibeui-block="auth-005"] [data-part="submit"]{
width:100%;margin-top:0.25rem;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.625rem;padding:0.375rem 1rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-005-accent);color:var(--vibeui-auth-005-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-005"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-005-accent);outline-offset:2px}
[data-vibeui-block="auth-005"] [data-part="switch"]{
margin:0.875rem 0 0;font-size:0.8125rem;color:var(--vibeui-auth-005-muted);
}
[data-vibeui-block="auth-005"] [data-part="switch"] a{color:var(--vibeui-auth-005-accent);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FEATURES: Auth005Feature[] = [
  {
    title: "Каталог без зависимостей",
    text: "Каждый блок — один файл, который переносится в чужой проект как есть.",
  },
  {
    title: "Инструкция для агента",
    text: "К каждому компоненту приложена команда установки и правила правок.",
  },
  {
    title: "История установок",
    text: "Видно, кто и что поставил, и где сборка споткнулась.",
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
 * Экран входа на две колонки: обещание слева, форма справа.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Auth005({
  brand = "VibeUI",
  claim = "Выбери дизайн, отдай ИИ, получи сайт",
  features = DEFAULT_FEATURES,
  quote = "Раньше собирали лендинг неделю. Теперь агент ставит блоки за вечер, а мы правим тексты.",
  quoteAuthor = "Пётр Гай, студия «Мера»",
  title = "Вход в аккаунт",
  lead = "Продолжите с того места, где остановились.",
  submit = "Войти",
  switchText = "Нет аккаунта?",
  switchLink = "Создать",
  emailLabel = "Почта",
  emailPlaceholder = "name@company.ru",
  passwordLabel = "Пароль",
  background = "",
  accent,
  className,
  style,
}: Auth005Props) {
  const palette = {
    ...(accent ? { "--vibeui-auth-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-005"
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
                <label htmlFor="vibeui-auth-005-email">{emailLabel}</label>
                <input
                  id="vibeui-auth-005-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder={emailPlaceholder}
                  required
                />
              </div>
              <div data-part="field">
                <label htmlFor="vibeui-auth-005-password">
                  {passwordLabel}
                </label>
                <input
                  id="vibeui-auth-005-password"
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

          <aside data-part="pitch">
            <div>
              <span data-part="brand">{brand}</span>
              <p data-part="claim">{claim}</p>
              <ul>
                {features.map((feature) => (
                  <li key={feature.title}>
                    <span data-part="mark" aria-hidden="true">
                      ✓
                    </span>
                    <span>
                      <span data-part="ftitle">{feature.title}. </span>
                      <span data-part="ftext">{feature.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <figure>
              <blockquote>{quote}</blockquote>
              <figcaption>{quoteAuthor}</figcaption>
            </figure>
          </aside>
        </div>
      </section>
    </>
  )
}
