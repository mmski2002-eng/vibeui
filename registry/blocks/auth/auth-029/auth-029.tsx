"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Auth029Props = {
  title?: string
  account?: string
  losses?: string[]
  keeps?: string[]
  graceDays?: number
  submit?: string
  /** Пояснение под заголовком; {account} выделяется жирным. */
  lead?: string
  /** Заголовок колонки потерь. */
  lossesTitle?: string
  /** Заголовок колонки того, что остаётся у сервиса. */
  keepsTitle?: string
  /** Срок восстановления; {days} подставляется числом. */
  graceText?: string
  /** Подпись поля подтверждения; {account} подставляется адресом. */
  confirmLabel?: string
  /** Пояснение под полем подтверждения. */
  hintText?: string
  /** Кнопка отказа от удаления. */
  keepText?: string
  /** Текст сноски перед ссылкой на заморозку. */
  footText?: string
  /** Подпись ссылки на заморозку. */
  freezeText?: string
  /** Хвост сноски после ссылки. */
  footTailText?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: удаление аккаунта, где последствия названы до кнопки и
// разделены на две колонки — что пропадёт и что останется. Вторая колонка
// важнее первой: человек чаще всего боится не потерять данные, а оставить их
// у сервиса, и молчание об этом останавливает удаление вернее любых
// предупреждений. Срок восстановления вынесен отдельной строкой: удаление,
// про которое неизвестно, обратимо ли оно, откладывают «на потом» вместе
// с подпиской.
// Подтверждение — ввод собственной почты, а не слова «удалить»: почта не
// набирается механически и не копируется из соседней строки, поэтому кнопка
// не нажимается по инерции. Регистр при сравнении не учитывается.
//
// Демонстрация интерфейса: ничего не удаляется, реальное удаление —
// за вызывающим кодом, вместе с повторной проверкой пароля на сервере.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="auth-029"]){
--vibeui-auth-029-bg:transparent;
--vibeui-auth-029-card:light-dark(oklch(1 0 0),oklch(0.22 0.014 20));
--vibeui-auth-029-fg:light-dark(oklch(0.23 0.016 20),oklch(0.94 0.006 20));
--vibeui-auth-029-muted:light-dark(oklch(0.54 0.014 20),oklch(0.71 0.012 20));
--vibeui-auth-029-border:light-dark(oklch(0.9 0.008 20),oklch(0.37 0.014 20));
--vibeui-auth-029-accent:light-dark(oklch(0.54 0.2 25),oklch(0.72 0.17 25));
--vibeui-auth-029-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.03 25));
--vibeui-auth-029-bad-soft:light-dark(oklch(0.54 0.2 25 / 7%),oklch(0.72 0.17 25 / 14%));
--vibeui-auth-029-ok:light-dark(oklch(0.52 0.12 152),oklch(0.78 0.12 152));
--vibeui-auth-029-ok-soft:light-dark(oklch(0.52 0.12 152 / 8%),oklch(0.78 0.12 152 / 14%));
--vibeui-auth-029-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-029"]{color-scheme:dark}
[data-vibeui-block="auth-029"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-029-bg);color:var(--vibeui-auth-029-fg);
font-family:var(--vibeui-auth-029-sans);
}
[data-vibeui-block="auth-029"] *{box-sizing:border-box}
[data-vibeui-block="auth-029"] [data-part="shell"]{
width:100%;max-width:24rem;margin:0 auto;overflow:hidden;
background:var(--vibeui-auth-029-card);
border:1px solid var(--vibeui-auth-029-border);border-radius:1rem;
}
[data-vibeui-block="auth-029"] [data-part="stripe"]{height:0.25rem;background:var(--vibeui-auth-029-accent)}
[data-vibeui-block="auth-029"] [data-part="body"]{padding:1.5rem}
[data-vibeui-block="auth-029"] [data-part="cols"]{display:grid;grid-template-columns:1fr;gap:0.75rem;margin:0 0 1.125rem}
@container (min-width: 46rem){
[data-vibeui-block="auth-029"] [data-part="shell"]{max-width:38rem}
[data-vibeui-block="auth-029"] [data-part="body"]{padding:2rem}
[data-vibeui-block="auth-029"] [data-part="cols"]{grid-template-columns:1fr 1fr}
[data-vibeui-block="auth-029"] [data-part="actions"]{flex-direction:row-reverse}
}
[data-vibeui-block="auth-029"] h2{margin:0 0 0.375rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-029"] [data-part="lead"]{margin:0 0 1.125rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-029-muted)}
[data-vibeui-block="auth-029"] [data-part="lead"] b{color:var(--vibeui-auth-029-fg);font-weight:650}
[data-vibeui-block="auth-029"] [data-part="panel"]{padding:0.875rem;border-radius:0.75rem}
[data-vibeui-block="auth-029"] [data-part="panel"][data-tone="bad"]{background:var(--vibeui-auth-029-bad-soft)}
[data-vibeui-block="auth-029"] [data-part="panel"][data-tone="good"]{background:var(--vibeui-auth-029-ok-soft)}
[data-vibeui-block="auth-029"] h3{margin:0 0 0.5rem;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em}
[data-vibeui-block="auth-029"] [data-part="panel"][data-tone="bad"] h3{color:var(--vibeui-auth-029-accent)}
[data-vibeui-block="auth-029"] [data-part="panel"][data-tone="good"] h3{color:var(--vibeui-auth-029-ok)}
[data-vibeui-block="auth-029"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.4375rem}
[data-vibeui-block="auth-029"] li{display:flex;gap:0.5rem;font-size:0.8125rem;line-height:1.45}
[data-vibeui-block="auth-029"] [data-part="sign"]{flex:none;font-weight:700}
[data-vibeui-block="auth-029"] [data-part="panel"][data-tone="bad"] [data-part="sign"]{color:var(--vibeui-auth-029-accent)}
[data-vibeui-block="auth-029"] [data-part="panel"][data-tone="good"] [data-part="sign"]{color:var(--vibeui-auth-029-ok)}
[data-vibeui-block="auth-029"] [data-part="grace"]{
display:flex;gap:0.5rem;margin:0 0 1.125rem;padding:0.6875rem 0.8125rem;
border:1px dashed var(--vibeui-auth-029-border);border-radius:0.625rem;
font-size:0.8125rem;line-height:1.45;
}
[data-vibeui-block="auth-029"] label{display:block;margin-bottom:0.3125rem;font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-029"] input{
width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-auth-029-border);border-radius:0.625rem;
background:var(--vibeui-auth-029-card);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-029"] input:focus-visible{outline:2px solid var(--vibeui-auth-029-accent);outline-offset:1px;border-color:var(--vibeui-auth-029-accent)}
[data-vibeui-block="auth-029"] [data-part="hint"]{margin:0.375rem 0 1.125rem;font-size:0.75rem;line-height:1.45;color:var(--vibeui-auth-029-muted)}
[data-vibeui-block="auth-029"] [data-part="actions"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="auth-029"] [data-part="delete"],
[data-vibeui-block="auth-029"] [data-part="keep"]{
flex:1;appearance:none;cursor:pointer;height:2.625rem;padding:0 1rem;
border-radius:0.625rem;font:inherit;font-size:0.875rem;font-weight:650;
transition:opacity .16s ease;
}
[data-vibeui-block="auth-029"] [data-part="delete"]{border:0;background:var(--vibeui-auth-029-accent);color:var(--vibeui-auth-029-on-accent)}
[data-vibeui-block="auth-029"] [data-part="delete"]:disabled{cursor:not-allowed;opacity:.4}
[data-vibeui-block="auth-029"] [data-part="keep"]{border:1px solid var(--vibeui-auth-029-border);background:none;color:inherit}
[data-vibeui-block="auth-029"] [data-part="delete"]:focus-visible,
[data-vibeui-block="auth-029"] [data-part="keep"]:focus-visible{outline:2px solid var(--vibeui-auth-029-accent);outline-offset:2px}
[data-vibeui-block="auth-029"] [data-part="foot"]{margin:1rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-auth-029-muted)}
[data-vibeui-block="auth-029"] [data-part="foot"] a{color:var(--vibeui-auth-029-accent);font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-029"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LOSSES = [
  "5 проектов и 128 установленных блоков",
  "История правок и комментарии команды",
  "Публичные ссылки на превью перестанут открываться",
  "Роль владельца в проекте «Мера» — его придётся передать заранее",
]

const DEFAULT_KEEPS = [
  "Счета и чеки — их обязывает хранить закон, 5 лет",
  "Обезличенная статистика без связи с вашей почтой",
  "Сообщения в поддержку — по вашему запросу удалим отдельно",
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
 * Удаление аккаунта: что пропадёт и что останется у сервиса,
 * срок восстановления и ввод почты вместо слова. Один файл.
 */
export function Auth029({
  title = "Удалить аккаунт",
  account = "anna@vibeui.ru",
  losses = DEFAULT_LOSSES,
  keeps = DEFAULT_KEEPS,
  graceDays = 30,
  submit = "Удалить аккаунт",
  lead = "Удаляется учётная запись {account}. Прочитайте обе колонки — вторая обычно оказывается неожиданной.",
  lossesTitle = "Что пропадёт",
  keepsTitle = "Что останется у нас",
  graceText = "{days} дней аккаунт можно вернуть — просто войдите как обычно. После этого срока данные стираются насовсем.",
  confirmLabel = "Наберите {account}, чтобы подтвердить",
  hintText = "Просим набрать почту, а не слово «удалить»: так кнопка не нажимается по инерции.",
  keepText = "Оставить аккаунт",
  footText = "Не хотите терять проекты?",
  freezeText = "Заморозьте аккаунт",
  footTailText = " — доступ закроется, данные останутся, оплата остановится.",
  background = "",
  accent,
  className,
  style,
}: Auth029Props) {
  const [typed, setTyped] = useState("")

  const matches = typed.trim().toLowerCase() === account.toLowerCase()
  const [leadBefore, leadAfter = ""] = lead.split("{account}")

  const palette = {
    ...(accent ? { "--vibeui-auth-029-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-029-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-029" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-029"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="stripe" aria-hidden="true" />
          <div data-part="body">
            <h2>{title}</h2>
            <p data-part="lead">
              {leadBefore}
              <b>{account}</b>
              {leadAfter}
            </p>

            <div data-part="cols">
              <div data-part="panel" data-tone="bad">
                <h3>{lossesTitle}</h3>
                <ul>
                  {losses.map((loss) => (
                    <li key={loss}>
                      <span data-part="sign" aria-hidden="true">
                        −
                      </span>
                      <span>{loss}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div data-part="panel" data-tone="good">
                <h3>{keepsTitle}</h3>
                <ul>
                  {keeps.map((keep) => (
                    <li key={keep}>
                      <span data-part="sign" aria-hidden="true">
                        =
                      </span>
                      <span>{keep}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p data-part="grace">
              <span aria-hidden="true">⏳</span>
              <span>{graceText.replace("{days}", String(graceDays))}</span>
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault()
              }}
            >
              <label htmlFor="vibeui-auth-029-confirm">
                {confirmLabel.replace("{account}", account)}
              </label>
              <input
                id="vibeui-auth-029-confirm"
                name="confirm"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={typed}
                onChange={(event) => setTyped(event.target.value)}
              />
              <p data-part="hint">{hintText}</p>

              <div data-part="actions">
                <button type="submit" data-part="delete" disabled={!matches}>
                  {submit}
                </button>
                <button type="button" data-part="keep">
                  {keepText}
                </button>
              </div>
            </form>

            <p data-part="foot">
              {footText} <a href="#">{freezeText}</a>
              {footTailText}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
