import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"

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
--vibeui-auth-005-ink:oklch(0.98 0 265);
--vibeui-auth-005-panel:oklch(0.24 0 265);
--vibeui-auth-005-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-auth-005-muted:light-dark(oklch(0.55 0 265),oklch(0.69 0 265));
--vibeui-auth-005-dim:light-dark(oklch(0.75 0 265),oklch(0.58 0 265));
--vibeui-auth-005-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-auth-005-accent:light-dark(oklch(0.305 0 0),oklch(0.906 0 0));
--vibeui-auth-005-on-accent:oklch(from var(--vibeui-auth-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
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
[data-vibeui-block="auth-005"] [data-part="heading"]{margin-bottom:0.25rem}
[data-vibeui-block="auth-005"] form{display:grid;gap:0.75rem}
[data-vibeui-block="auth-005"] [data-part="submit"]{width:100%;margin-top:0.25rem}
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
radial-gradient(120% 90% at 20% 0%, oklch(0.36 0.09 25), transparent 65%),
var(--vibeui-auth-005-panel);
color:var(--vibeui-auth-005-ink);
}
[data-vibeui-block="auth-005"] [data-part="brand"]{font-size:0.875rem;font-weight:700;letter-spacing:0.01em}
[data-vibeui-block="auth-005"] [data-part="claim"]{
margin:0.75rem 0 1rem;font-size:1.375rem;font-weight:700;line-height:1.2;letter-spacing:-0.02em;
}
[data-vibeui-block="auth-005"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.625rem}
[data-vibeui-block="auth-005"] li{display:flex;gap:0.5rem;font-size:0.8125rem;line-height:1.45}
[data-vibeui-block="auth-005"] [data-part="ftitle"]{font-weight:650}
[data-vibeui-block="auth-005"] [data-part="ftext"]{color:oklch(1 0 0 / 72%)}
[data-vibeui-block="auth-005"] figure{margin:0}
[data-vibeui-block="auth-005"] blockquote{
margin:0;padding-top:1rem;border-top:1px solid oklch(1 0 0 / 16%);
font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="auth-005"] figcaption{margin-top:0.375rem;font-size:0.6875rem;color:oklch(1 0 0 / 66%)}
[data-vibeui-block="auth-005"] [data-part="form"]{padding:1.5rem}
[data-vibeui-block="auth-005"] [data-part="lead"]{margin:0 0 1rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-auth-005-muted)}
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
            <Heading001
              data-part="heading"
              title={title}
              size="xs"
              accent={accent}
            />
            <p data-part="lead">{lead}</p>
            <form>
              <Input001
                name="email"
                type="email"
                autoComplete="username"
                required
                label={emailLabel}
                accent={accent}
              />
              <Input001
                name="password"
                type="password"
                autoComplete="current-password"
                required
                label={passwordLabel}
                accent={accent}
              />
              <Button001 type="submit" data-part="submit" size="lg" accent={accent}>
                {submit}
              </Button001>
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
