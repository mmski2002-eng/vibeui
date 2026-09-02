import type { CSSProperties } from "react"

export type Auth021Props = {
  action?: string
  target?: string
  effects?: string[]
  submit?: string
  cancel?: string
  /** Строка под заголовком; {target} подставляется из пропа target. */
  targetText?: string
  /** Подпись поля пароля: блок несёт русскую. */
  passwordLabel?: string
  /** Объяснение, почему пароль спрашивают повторно. */
  whyText?: string
  /** Сноска про журнал безопасности. */
  footText?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: повторный запрос пароля перед опасным действием. Такой запрос
// раздражает ровно до тех пор, пока не объяснишь, что именно защищает: если
// на экране только поле пароля, человек считает его придиркой и вводит
// пароль машинально — то есть защита не работает. Здесь сначала названо
// действие и его последствия списком, и только потом поле: пароль вводится
// уже осознанно, а половина людей на этом шаге просто закрывает окно, что
// и есть нужный результат.
// Кнопка подтверждения покрашена в опасный цвет и не является первой в
// разметке: отмена стоит рядом такой же по весу, а не ссылкой в углу.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственной подложки.
//
// Демонстрация интерфейса: пароль не проверяется, повторную проверку
// обязан выполнять сервер прямо перед выполнением действия.
const STYLES = `
:where([data-vibeui-block="auth-021"]){
--vibeui-auth-021-bg:transparent;
--vibeui-auth-021-card:light-dark(oklch(1 0 0),oklch(0.22 0.014 20));
--vibeui-auth-021-fg:light-dark(oklch(0.23 0.016 20),oklch(0.94 0.006 20));
--vibeui-auth-021-muted:light-dark(oklch(0.54 0.014 20),oklch(0.71 0.012 20));
--vibeui-auth-021-border:light-dark(oklch(0.9 0.008 20),oklch(0.35 0.014 20));
--vibeui-auth-021-accent:light-dark(oklch(0.55 0.19 25),oklch(0.76 0.15 25));
--vibeui-auth-021-on-accent:light-dark(oklch(1 0 0),oklch(0.2 0.02 20));
--vibeui-auth-021-tint:light-dark(oklch(0.55 0.19 25 / 12%),oklch(0.76 0.15 25 / 18%));
--vibeui-auth-021-sheet:light-dark(oklch(0.55 0.19 25 / 6%),oklch(0.76 0.15 25 / 10%));
--vibeui-auth-021-shadow:light-dark(oklch(0.2 0.02 20 / 10%),oklch(0 0 0 / 40%));
--vibeui-auth-021-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="auth-021"]{
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-021-bg);color:var(--vibeui-auth-021-fg);
font-family:var(--vibeui-auth-021-sans);
}
[data-vibeui-block="auth-021"] *{box-sizing:border-box}
[data-vibeui-block="auth-021"] [data-part="shell"]{
width:100%;max-width:24rem;margin:0 auto;padding:1.5rem;
background:var(--vibeui-auth-021-card);
border:1px solid var(--vibeui-auth-021-border);border-radius:1rem;
box-shadow:0 0.75rem 2rem var(--vibeui-auth-021-shadow);
}
@container (min-width: 42rem){
[data-vibeui-block="auth-021"] [data-part="shell"]{max-width:27rem;padding:2rem}
[data-vibeui-block="auth-021"] [data-part="actions"]{flex-direction:row-reverse}
[data-vibeui-block="auth-021"] [data-part="confirm"]{flex:1.2}
[data-vibeui-block="auth-021"] [data-part="cancel"]{flex:1}
}
[data-vibeui-block="auth-021"] [data-part="head"]{display:flex;gap:0.75rem;margin-bottom:0.875rem}
[data-vibeui-block="auth-021"] [data-part="glyph"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;border-radius:0.625rem;
background:var(--vibeui-auth-021-tint);color:var(--vibeui-auth-021-accent);
font-size:1rem;font-weight:700;line-height:1;
}
[data-vibeui-block="auth-021"] h2{margin:0 0 0.1875rem;font-size:1.125rem;font-weight:700;line-height:1.25;letter-spacing:-0.01em}
[data-vibeui-block="auth-021"] [data-part="target"]{margin:0;font-size:0.8125rem;color:var(--vibeui-auth-021-muted)}
[data-vibeui-block="auth-021"] [data-part="target"] b{color:var(--vibeui-auth-021-fg);font-weight:650}
[data-vibeui-block="auth-021"] [data-part="effects"]{
list-style:none;margin:0 0 1.125rem;padding:0.875rem;
border-radius:0.75rem;background:var(--vibeui-auth-021-sheet);
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="auth-021"] [data-part="effect"]{display:flex;gap:0.5rem;font-size:0.8125rem;line-height:1.45}
[data-vibeui-block="auth-021"] [data-part="bullet"]{flex:none;color:var(--vibeui-auth-021-accent);font-weight:700}
[data-vibeui-block="auth-021"] label{display:block;margin-bottom:0.3125rem;font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-021"] input{
width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-auth-021-border);border-radius:0.625rem;
background:var(--vibeui-auth-021-card);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-021"] input:focus-visible{outline:2px solid var(--vibeui-auth-021-accent);outline-offset:1px;border-color:var(--vibeui-auth-021-accent)}
[data-vibeui-block="auth-021"] [data-part="why"]{margin:0.375rem 0 1.125rem;font-size:0.75rem;line-height:1.45;color:var(--vibeui-auth-021-muted)}
[data-vibeui-block="auth-021"] [data-part="actions"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="auth-021"] [data-part="confirm"],
[data-vibeui-block="auth-021"] [data-part="cancel"]{
appearance:none;cursor:pointer;height:2.625rem;padding:0 1rem;
border-radius:0.625rem;font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-021"] [data-part="confirm"]{border:0;background:var(--vibeui-auth-021-accent);color:var(--vibeui-auth-021-on-accent)}
[data-vibeui-block="auth-021"] [data-part="cancel"]{border:1px solid var(--vibeui-auth-021-border);background:none;color:inherit}
[data-vibeui-block="auth-021"] [data-part="confirm"]:focus-visible,
[data-vibeui-block="auth-021"] [data-part="cancel"]:focus-visible{outline:2px solid var(--vibeui-auth-021-accent);outline-offset:2px}
[data-vibeui-block="auth-021"] [data-part="foot"]{margin:1rem 0 0;font-size:0.6875rem;line-height:1.5;color:var(--vibeui-auth-021-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-021"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_EFFECTS = [
  "Все 128 блоков проекта станут недоступны команде из 12 человек.",
  "Публичные ссылки на превью перестанут открываться.",
  "Восстановить можно 30 дней, потом данные стираются насовсем.",
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
 * Подтверждение личности перед опасным действием: последствия списком,
 * затем пароль. Один файл, ноль зависимостей.
 */
export function Auth021({
  action = "Передать проект другому владельцу",
  target = "Каталог «Мера»",
  effects = DEFAULT_EFFECTS,
  submit = "Подтвердить и передать",
  cancel = "Отмена",
  targetText = "Объект: {target}",
  passwordLabel = "Введите пароль от аккаунта",
  whyText = "Спрашиваем повторно, потому что действие необратимо, а сессия открыта уже больше часа.",
  footText = "Событие попадёт в журнал безопасности проекта с указанием времени и устройства.",
  background = "",
  accent,
  className,
  style,
}: Auth021Props) {
  const [targetBefore, targetAfter = ""] = targetText.split("{target}")

  const palette = {
    ...(accent ? { "--vibeui-auth-021-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-021-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-021" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-021"
        className={className}
        style={palette}
        aria-label={action}
      >
        <div data-part="shell">
          <div data-part="head">
            <span data-part="glyph" aria-hidden="true">
              !
            </span>
            <div>
              <h2>{action}</h2>
              <p data-part="target">
                {targetBefore}
                <b>{target}</b>
                {targetAfter}
              </p>
            </div>
          </div>

          <ul data-part="effects">
            {effects.map((effect) => (
              <li key={effect} data-part="effect">
                <span data-part="bullet" aria-hidden="true">
                  →
                </span>
                <span>{effect}</span>
              </li>
            ))}
          </ul>

          <form>
            <label htmlFor="vibeui-auth-021-password">{passwordLabel}</label>
            <input
              id="vibeui-auth-021-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
            <p data-part="why">{whyText}</p>

            <div data-part="actions">
              <button type="submit" data-part="confirm">
                {submit}
              </button>
              <button type="button" data-part="cancel">
                {cancel}
              </button>
            </div>
          </form>

          <p data-part="foot">{footText}</p>
        </div>
      </section>
    </>
  )
}
