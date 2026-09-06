import type { CSSProperties } from "react"

export type Auth022Props = {
  title?: string
  lead?: string
  account?: string
  submit?: string
  leave?: string
  /** Метка над заголовком: блок несёт русскую. */
  badgeText?: string
  /** Строка о сохранённом черновике. */
  savedText?: string
  /** Подпись поля пароля. */
  passwordLabel?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: «сессия истекла» показывается не отдельной страницей, а окном
// поверх замороженной работы. Это принципиально: редирект на страницу входа
// стирает контекст, и человек не понимает, сохранилась ли форма, которую он
// заполнял двадцать минут. Здесь под окном намеренно виден размытый макет
// страницы — он говорит «всё на месте, вы вернётесь сюда же», — и это
// подтверждено строкой про сохранённый черновик.
// Размытый слой собран из простых полос и помечен aria-hidden: для
// скринридера это шум, а не содержимое. Выход «совсем» стоит рядом как
// равноправная кнопка — на общем компьютере это единственный правильный
// исход, и прятать его в мелкую ссылку нечестно.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственной подложки.
//
// Демонстрация интерфейса: срок жизни сессии и её продление — на сервере.
const STYLES = `
:where([data-vibeui-block="auth-022"]){
--vibeui-auth-022-bg:transparent;
--vibeui-auth-022-card:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-auth-022-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-auth-022-muted:light-dark(oklch(0.54 0 265),oklch(0.7 0 265));
--vibeui-auth-022-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-auth-022-accent:light-dark(oklch(0.53 0.17 262),oklch(0.75 0.14 262));
--vibeui-auth-022-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 265));
--vibeui-auth-022-tint:light-dark(oklch(0.53 0.17 262 / 12%),oklch(0.75 0.14 262 / 18%));
--vibeui-auth-022-ok-bg:light-dark(oklch(0.55 0.13 152 / 10%),oklch(0.76 0.12 152 / 16%));
--vibeui-auth-022-shadow:light-dark(oklch(0.2 0 265 / 18%),oklch(0 0 0 / 48%));
--vibeui-auth-022-ghost:light-dark(oklch(0.85 0 265),oklch(0.32 0 265));
--vibeui-auth-022-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-022"]{color-scheme:dark}
[data-vibeui-block="auth-022"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
position:relative;box-sizing:border-box;overflow:hidden;
padding:1.5rem 1rem;
background:var(--vibeui-auth-022-bg);color:var(--vibeui-auth-022-fg);
font-family:var(--vibeui-auth-022-sans);
}
[data-vibeui-block="auth-022"] *{box-sizing:border-box}
[data-vibeui-block="auth-022"] [data-part="behind"]{
position:absolute;inset:0;padding:1.5rem;
display:flex;flex-direction:column;gap:0.75rem;
filter:blur(6px);opacity:.55;pointer-events:none;
}
[data-vibeui-block="auth-022"] [data-part="line"]{
height:0.875rem;border-radius:9999px;background:var(--vibeui-auth-022-ghost);
}
[data-vibeui-block="auth-022"] [data-part="tile"]{
height:5rem;border-radius:0.875rem;background:var(--vibeui-auth-022-ghost);
}
[data-vibeui-block="auth-022"] [data-part="tiles"]{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
[data-vibeui-block="auth-022"] [data-part="shell"]{
position:relative;
width:100%;max-width:23rem;margin:0 auto;padding:1.5rem;
background:var(--vibeui-auth-022-card);
border:1px solid var(--vibeui-auth-022-border);border-radius:1rem;
box-shadow:0 1.5rem 3rem var(--vibeui-auth-022-shadow);
}
@container (min-width: 42rem){
[data-vibeui-block="auth-022"] [data-part="shell"]{max-width:25rem;padding:2rem;margin:2rem auto}
[data-vibeui-block="auth-022"] [data-part="tiles"]{grid-template-columns:repeat(3,1fr)}
[data-vibeui-block="auth-022"] [data-part="actions"]{flex-direction:row}
}
[data-vibeui-block="auth-022"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.375rem;margin-bottom:0.75rem;
padding:0.1875rem 0.5rem;border-radius:9999px;
background:var(--vibeui-auth-022-tint);color:var(--vibeui-auth-022-accent);
font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="auth-022"] h2{margin:0 0 0.375rem;font-size:1.1875rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-022"] [data-part="lead"]{margin:0 0 0.875rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-022-muted)}
[data-vibeui-block="auth-022"] [data-part="saved"]{
display:flex;gap:0.5rem;margin:0 0 1rem;padding:0.625rem 0.75rem;
border-radius:0.625rem;background:var(--vibeui-auth-022-ok-bg);
font-size:0.75rem;line-height:1.45;
}
[data-vibeui-block="auth-022"] [data-part="who"]{
display:flex;align-items:center;gap:0.5rem;margin-bottom:0.875rem;
padding:0.5rem 0.625rem;border-radius:0.625rem;
border:1px solid var(--vibeui-auth-022-border);
font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="auth-022"] [data-part="face"]{
flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;border-radius:9999px;
background:var(--vibeui-auth-022-accent);color:var(--vibeui-auth-022-on-accent);
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="auth-022"] label{display:block;margin-bottom:0.3125rem;font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-022"] input{
width:100%;height:2.5rem;padding:0 0.75rem;margin-bottom:0.875rem;
border:1px solid var(--vibeui-auth-022-border);border-radius:0.625rem;
background:var(--vibeui-auth-022-card);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-022"] input:focus-visible{outline:2px solid var(--vibeui-auth-022-accent);outline-offset:1px;border-color:var(--vibeui-auth-022-accent)}
[data-vibeui-block="auth-022"] [data-part="actions"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="auth-022"] [data-part="submit"],
[data-vibeui-block="auth-022"] [data-part="leave"]{
flex:1;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.625rem;padding:0.375rem 1rem;
border-radius:0.625rem;font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-022"] [data-part="submit"]{border:0;background:var(--vibeui-auth-022-accent);color:var(--vibeui-auth-022-on-accent)}
[data-vibeui-block="auth-022"] [data-part="leave"]{border:1px solid var(--vibeui-auth-022-border);background:none;color:inherit}
[data-vibeui-block="auth-022"] [data-part="submit"]:focus-visible,
[data-vibeui-block="auth-022"] [data-part="leave"]:focus-visible{outline:2px solid var(--vibeui-auth-022-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-022"] *{animation:none!important;transition:none!important}}
`

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
 * «Сессия истекла» окном поверх замороженной страницы: пароль
 * для возврата и честный выход. Один файл, ноль зависимостей.
 */
export function Auth022({
  title = "Сессия истекла",
  lead = "Прошло больше двух часов без действий, и мы закрыли доступ. Введите пароль — вернётесь на ту же страницу.",
  account = "anna@vibeui.ru",
  submit = "Продолжить работу",
  leave = "Выйти совсем",
  badgeText = "Требуется вход",
  savedText = "Черновик страницы сохранён — ничего не потеряется.",
  passwordLabel = "Пароль",
  background = "",
  accent,
  className,
  style,
}: Auth022Props) {
  const palette = {
    ...(accent ? { "--vibeui-auth-022-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-022-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-022" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-022"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="behind" aria-hidden="true">
          <span data-part="line" />
          <span data-part="line" />
          <span data-part="tiles">
            <span data-part="tile" />
            <span data-part="tile" />
            <span data-part="tile" />
          </span>
          <span data-part="line" />
        </div>

        <div
          data-part="shell"
          role="alertdialog"
          aria-labelledby="vibeui-auth-022-title"
        >
          <span data-part="badge">{badgeText}</span>
          <h2 id="vibeui-auth-022-title">{title}</h2>
          <p data-part="lead">{lead}</p>

          <p data-part="saved">
            <span aria-hidden="true">✓</span>
            <span>{savedText}</span>
          </p>

          <p data-part="who">
            <span data-part="face" aria-hidden="true">
              {account.slice(0, 2).toUpperCase()}
            </span>
            <span>{account}</span>
          </p>

          <form>
            <label htmlFor="vibeui-auth-022-password">{passwordLabel}</label>
            <input
              id="vibeui-auth-022-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
            <div data-part="actions">
              <button type="submit" data-part="submit">
                {submit}
              </button>
              <button type="button" data-part="leave">
                {leave}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
