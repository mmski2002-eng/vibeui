"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Auth016Workspace = {
  name: string
  role: string
  people: number
  plan?: string
}

export type Auth016Props = {
  title?: string
  account?: string
  workspaces?: Auth016Workspace[]
  submit?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: последний шаг входа для тех, у кого аккаунт один, а рабочих
// пространств несколько. Ошибка выбора здесь дороже ошибки пароля: человек
// попадает не в тот проект и правит чужие данные, будучи уверенным, что он
// у себя. Поэтому под каждым названием стоит роль — она и есть ответ на
// вопрос «то ли это место»: одинаковые названия у клиента и подрядчика
// встречаются постоянно, а «Владелец» и «Читатель» не спутать.
// Список — radiogroup из настоящих input'ов: стрелки клавиатуры работают
// без единой строки JS, а поиск нужен начиная примерно с семи пространств.
//
// Демонстрация интерфейса: выбор никуда не отправляется.
const STYLES = `
:where([data-vibeui-block="auth-016"]){
--vibeui-auth-016-bg:oklch(0.96 0.006 285);
--vibeui-auth-016-card:oklch(1 0 0);
--vibeui-auth-016-fg:oklch(0.22 0.014 285);
--vibeui-auth-016-muted:oklch(0.54 0.014 285);
--vibeui-auth-016-border:oklch(0.9 0.006 285);
--vibeui-auth-016-accent:oklch(0.52 0.17 285);
--vibeui-auth-016-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="auth-016"]{
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-016-bg);color:var(--vibeui-auth-016-fg);
font-family:var(--vibeui-auth-016-sans);
}
[data-vibeui-block="auth-016"] *{box-sizing:border-box}
[data-vibeui-block="auth-016"] [data-part="shell"]{
width:100%;max-width:25rem;margin:0 auto;padding:1.5rem;
background:var(--vibeui-auth-016-card);
border:1px solid var(--vibeui-auth-016-border);border-radius:1rem;
}
@container (min-width: 44rem){
[data-vibeui-block="auth-016"] [data-part="shell"]{max-width:30rem;padding:2rem}
[data-vibeui-block="auth-016"] [data-part="list"]{max-height:none}
}
[data-vibeui-block="auth-016"] h2{margin:0 0 0.25rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-016"] [data-part="lead"]{margin:0 0 1rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-auth-016-muted)}
[data-vibeui-block="auth-016"] [data-part="lead"] b{color:var(--vibeui-auth-016-fg);font-weight:650}
[data-vibeui-block="auth-016"] [data-part="search"]{
width:100%;height:2.375rem;padding:0 0.75rem;margin-bottom:0.75rem;
border:1px solid var(--vibeui-auth-016-border);border-radius:0.625rem;
background:var(--vibeui-auth-016-card);color:inherit;font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="auth-016"] [data-part="search"]:focus-visible{outline:2px solid var(--vibeui-auth-016-accent);outline-offset:1px;border-color:var(--vibeui-auth-016-accent)}
[data-vibeui-block="auth-016"] fieldset{border:0;margin:0;padding:0}
[data-vibeui-block="auth-016"] legend{padding:0;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--vibeui-auth-016-muted)}
[data-vibeui-block="auth-016"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.375rem;
margin:0.625rem 0 1rem;max-height:15rem;overflow-y:auto;
}
[data-vibeui-block="auth-016"] [data-part="option"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.625rem;cursor:pointer;
border:1px solid var(--vibeui-auth-016-border);border-radius:0.75rem;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="auth-016"] [data-part="option"]:hover{border-color:var(--vibeui-auth-016-accent)}
[data-vibeui-block="auth-016"] [data-part="option"]:has(input:checked){
border-color:var(--vibeui-auth-016-accent);background:oklch(0.52 0.17 285 / 7%);
}
[data-vibeui-block="auth-016"] [data-part="option"]:has(input:focus-visible){outline:2px solid var(--vibeui-auth-016-accent);outline-offset:2px}
[data-vibeui-block="auth-016"] [data-part="option"] input{flex:none;width:1.0625rem;height:1.0625rem;accent-color:var(--vibeui-auth-016-accent)}
[data-vibeui-block="auth-016"] [data-part="avatar"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.625rem;
background:oklch(0.9 0.06 var(--vibeui-auth-016-hue));
color:oklch(0.35 0.11 var(--vibeui-auth-016-hue));
font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="auth-016"] [data-part="body"]{display:flex;flex-direction:column;gap:0.0625rem;min-width:0}
[data-vibeui-block="auth-016"] [data-part="name"]{font-size:0.875rem;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="auth-016"] [data-part="meta"]{font-size:0.75rem;color:var(--vibeui-auth-016-muted)}
[data-vibeui-block="auth-016"] [data-part="plan"]{
margin-left:auto;flex:none;padding:0.125rem 0.4375rem;border-radius:9999px;
background:oklch(0.55 0.02 285 / 10%);font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="auth-016"] [data-part="empty"]{margin:0 0 1rem;font-size:0.8125rem;color:var(--vibeui-auth-016-muted)}
[data-vibeui-block="auth-016"] [data-part="submit"]{
width:100%;appearance:none;cursor:pointer;height:2.625rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-016-accent);color:oklch(1 0 0);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-016"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-016-accent);outline-offset:2px}
[data-vibeui-block="auth-016"] [data-part="foot"]{margin:0.875rem 0 0;font-size:0.8125rem;color:var(--vibeui-auth-016-muted);text-align:center}
[data-vibeui-block="auth-016"] [data-part="foot"] a{color:var(--vibeui-auth-016-accent);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_WORKSPACES: Auth016Workspace[] = [
  { name: "Мера — продукт", role: "Владелец", people: 12, plan: "Команда" },
  { name: "Мера — клиенты", role: "Редактор", people: 34, plan: "Бизнес" },
  { name: "Каталог VibeUI", role: "Читатель", people: 6 },
  { name: "Личное пространство", role: "Владелец", people: 1, plan: "Free" },
]

/**
 * Выбор рабочего пространства после входа: radiogroup с ролью
 * под каждым названием и поиском. Один файл, ноль зависимостей.
 */
export function Auth016({
  title = "Куда войти",
  account = "anna@vibeui.ru",
  workspaces = DEFAULT_WORKSPACES,
  submit = "Продолжить",
  accent,
  className,
  style,
}: Auth016Props) {
  const [query, setQuery] = useState("")
  const [chosen, setChosen] = useState(workspaces[0]?.name ?? "")

  const shown = workspaces.filter((workspace) =>
    workspace.name.toLowerCase().includes(query.trim().toLowerCase()),
  )

  const palette = {
    ...(accent ? { "--vibeui-auth-016-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-016" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-016"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">
            Вы вошли как <b>{account}</b>. Аккаунт один, пространств несколько —
            выберите нужное.
          </p>

          <input
            data-part="search"
            type="search"
            value={query}
            aria-label="Поиск по пространствам"
            placeholder="Поиск по названию"
            onChange={(event) => setQuery(event.target.value)}
          />

          <form
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <fieldset>
              <legend>Пространства</legend>
              <div data-part="list">
                {shown.map((workspace) => (
                  <label
                    key={workspace.name}
                    data-part="option"
                    style={
                      {
                        "--vibeui-auth-016-hue": `${hue(workspace.name)}`,
                      } as CSSProperties
                    }
                  >
                    <input
                      type="radio"
                      name="workspace"
                      value={workspace.name}
                      checked={chosen === workspace.name}
                      onChange={() => setChosen(workspace.name)}
                    />
                    <span data-part="avatar" aria-hidden="true">
                      {workspace.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span data-part="body">
                      <span data-part="name">{workspace.name}</span>
                      <span data-part="meta">
                        {workspace.role} · {workspace.people} участников
                      </span>
                    </span>
                    {workspace.plan ? (
                      <span data-part="plan">{workspace.plan}</span>
                    ) : null}
                  </label>
                ))}
              </div>
            </fieldset>

            {shown.length === 0 ? (
              <p data-part="empty">
                Ничего не нашлось. Проверьте название или попросите
                администратора выслать приглашение.
              </p>
            ) : null}

            <button type="submit" data-part="submit">
              {submit}
            </button>
          </form>

          <p data-part="foot">
            Нужного нет? <a href="#">Создать пространство</a>
          </p>
        </div>
      </section>
    </>
  )
}
