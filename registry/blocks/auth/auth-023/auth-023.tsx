"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Auth023Props = {
  title?: string
  firstStep?: string
  secondStep?: string
  submit?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: регистрация, разрезанная на два шага. Смысл разреза не в
// красоте: аккаунт заводится уже после первого шага, поэтому человек,
// бросивший форму на втором, всё равно остаётся пользователем, а не уходит
// в никуда. Отсюда подпись «профиль можно дозаполнить позже» и кнопка
// «пропустить» на втором шаге — без неё разрез теряет смысл и превращается
// в ту же длинную форму, только с прокруткой.
// Индикатор шагов — не украшение, а обещание: он говорит, что шагов ровно
// два, и снимает страх бесконечной анкеты. Пройденный шаг можно открыть
// назад, будущий — нет: это единственная честная модель, пока данные
// первого шага не отправлены.
//
// Демонстрация интерфейса: ничего не отправляется и не сохраняется.
const STYLES = `
:where([data-vibeui-block="auth-023"]){
--vibeui-auth-023-bg:oklch(0.96 0.008 175);
--vibeui-auth-023-card:oklch(1 0 0);
--vibeui-auth-023-fg:oklch(0.22 0.016 190);
--vibeui-auth-023-muted:oklch(0.53 0.014 190);
--vibeui-auth-023-border:oklch(0.89 0.01 190);
--vibeui-auth-023-accent:oklch(0.5 0.13 190);
--vibeui-auth-023-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="auth-023"]{
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-023-bg);color:var(--vibeui-auth-023-fg);
font-family:var(--vibeui-auth-023-sans);
}
[data-vibeui-block="auth-023"] *{box-sizing:border-box}
[data-vibeui-block="auth-023"] [data-part="shell"]{
width:100%;max-width:24rem;margin:0 auto;padding:1.5rem;
background:var(--vibeui-auth-023-card);
border:1px solid var(--vibeui-auth-023-border);border-radius:1rem;
}
@container (min-width: 42rem){
[data-vibeui-block="auth-023"] [data-part="shell"]{max-width:27rem;padding:2rem}
[data-vibeui-block="auth-023"] [data-part="pair"]{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
[data-vibeui-block="auth-023"] [data-part="actions"]{flex-direction:row-reverse}
}
[data-vibeui-block="auth-023"] [data-part="steps"]{
display:flex;align-items:center;gap:0.5rem;margin-bottom:1.25rem;
list-style:none;padding:0;
}
[data-vibeui-block="auth-023"] [data-part="step"]{display:flex;align-items:center;gap:0.4375rem;font-size:0.75rem;font-weight:650;color:var(--vibeui-auth-023-muted)}
[data-vibeui-block="auth-023"] [data-part="step"][data-active="true"]{color:var(--vibeui-auth-023-accent)}
[data-vibeui-block="auth-023"] [data-part="num"]{
display:inline-flex;align-items:center;justify-content:center;
width:1.375rem;height:1.375rem;border-radius:9999px;
border:1px solid currentColor;font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="auth-023"] [data-part="step"][data-active="true"] [data-part="num"]{background:var(--vibeui-auth-023-accent);border-color:var(--vibeui-auth-023-accent);color:oklch(1 0 0)}
[data-vibeui-block="auth-023"] [data-part="rail"]{flex:1;height:1px;background:var(--vibeui-auth-023-border)}
[data-vibeui-block="auth-023"] h2{margin:0 0 0.25rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-023"] [data-part="lead"]{margin:0 0 1.125rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-023-muted)}
[data-vibeui-block="auth-023"] [data-part="field"]{display:flex;flex-direction:column;gap:0.3125rem;margin-bottom:0.875rem}
[data-vibeui-block="auth-023"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-023"] input,
[data-vibeui-block="auth-023"] select{
width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-auth-023-border);border-radius:0.625rem;
background:var(--vibeui-auth-023-card);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-023"] input:focus-visible,
[data-vibeui-block="auth-023"] select:focus-visible{outline:2px solid var(--vibeui-auth-023-accent);outline-offset:1px;border-color:var(--vibeui-auth-023-accent)}
[data-vibeui-block="auth-023"] [data-part="actions"]{display:flex;flex-direction:column;gap:0.5rem;margin-top:0.25rem}
[data-vibeui-block="auth-023"] [data-part="next"],
[data-vibeui-block="auth-023"] [data-part="back"]{
flex:1;appearance:none;cursor:pointer;height:2.625rem;padding:0 1rem;
border-radius:0.625rem;font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-023"] [data-part="next"]{border:0;background:var(--vibeui-auth-023-accent);color:oklch(1 0 0)}
[data-vibeui-block="auth-023"] [data-part="back"]{border:1px solid var(--vibeui-auth-023-border);background:none;color:inherit}
[data-vibeui-block="auth-023"] [data-part="next"]:focus-visible,
[data-vibeui-block="auth-023"] [data-part="back"]:focus-visible{outline:2px solid var(--vibeui-auth-023-accent);outline-offset:2px}
[data-vibeui-block="auth-023"] [data-part="skip"]{
display:block;margin:0.875rem auto 0;appearance:none;border:0;background:none;cursor:pointer;
color:var(--vibeui-auth-023-muted);font:inherit;font-size:0.8125rem;text-decoration:underline;
}
[data-vibeui-block="auth-023"] [data-part="skip"]:focus-visible{outline:2px solid var(--vibeui-auth-023-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="auth-023"] [data-part="done"]{margin:0.875rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-auth-023-muted);text-align:center}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-023"] *{animation:none!important;transition:none!important}}
`

/**
 * Регистрация в два шага: сначала доступ, потом профиль,
 * который можно пропустить. Один файл, ноль зависимостей.
 */
export function Auth023({
  title = "Регистрация",
  firstStep = "Доступ",
  secondStep = "Профиль",
  submit = "Готово, в каталог",
  accent,
  className,
  style,
}: Auth023Props) {
  const [step, setStep] = useState(1)

  const palette = {
    ...(accent ? { "--vibeui-auth-023-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-023" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-023"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <ol data-part="steps">
            <li data-part="step" data-active={step === 1}>
              <span data-part="num" aria-hidden="true">
                1
              </span>
              <span>{firstStep}</span>
            </li>
            <li data-part="rail" aria-hidden="true" />
            <li data-part="step" data-active={step === 2}>
              <span data-part="num" aria-hidden="true">
                2
              </span>
              <span>{secondStep}</span>
            </li>
          </ol>

          {step === 1 ? (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                setStep(2)
              }}
            >
              <h2>{title}: шаг 1 из 2</h2>
              <p data-part="lead">
                Двух полей достаточно, чтобы аккаунт заработал. Профиль заполним
                следующим шагом или позже.
              </p>

              <div data-part="field">
                <label htmlFor="vibeui-auth-023-email">Рабочая почта</label>
                <input
                  id="vibeui-auth-023-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="name@company.ru"
                  required
                />
              </div>
              <div data-part="field">
                <label htmlFor="vibeui-auth-023-password">Пароль</label>
                <input
                  id="vibeui-auth-023-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={10}
                  required
                />
              </div>

              <div data-part="actions">
                <button type="submit" data-part="next">
                  Дальше — профиль
                </button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault()
              }}
            >
              <h2>{title}: шаг 2 из 2</h2>
              <p data-part="lead">
                Аккаунт уже создан. Эти данные помогают команде узнавать вас в
                комментариях — их можно изменить в любой момент.
              </p>

              <div data-part="pair">
                <div data-part="field">
                  <label htmlFor="vibeui-auth-023-name">Имя</label>
                  <input
                    id="vibeui-auth-023-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Анна Соколова"
                  />
                </div>
                <div data-part="field">
                  <label htmlFor="vibeui-auth-023-role">Чем занимаетесь</label>
                  <select id="vibeui-auth-023-role" name="role" defaultValue="">
                    <option value="" disabled>
                      Выберите
                    </option>
                    <option>Дизайн</option>
                    <option>Фронтенд</option>
                    <option>Продукт</option>
                    <option>Другое</option>
                  </select>
                </div>
              </div>

              <div data-part="field">
                <label htmlFor="vibeui-auth-023-company">Компания</label>
                <input
                  id="vibeui-auth-023-company"
                  name="organization"
                  type="text"
                  autoComplete="organization"
                  placeholder="Студия «Мера»"
                />
              </div>

              <div data-part="actions">
                <button type="submit" data-part="next">
                  {submit}
                </button>
                <button
                  type="button"
                  data-part="back"
                  onClick={() => setStep(1)}
                >
                  Назад
                </button>
              </div>

              <button type="button" data-part="skip">
                Пропустить — заполню позже
              </button>
            </form>
          )}

          <p data-part="done">
            Шаг 1 создаёт аккаунт. Шаг 2 ни на что не влияет, кроме подписи в
            комментариях.
          </p>
        </div>
      </section>
    </>
  )
}
