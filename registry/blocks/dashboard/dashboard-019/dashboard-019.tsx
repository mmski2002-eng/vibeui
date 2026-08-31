"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Dashboard019Props = {
  title?: string
  hint?: string
  name?: string
  role?: string
  bio?: string
  city?: string
  visibility?: string
  visibilities?: string[]
  saveLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: форма профиля рядом с живой карточкой, которая перерисовывается
// на каждый символ. Настройки профиля — редкий случай, когда результат нельзя
// увидеть, не сохранив и не уйдя на чужую страницу; превью снимает этот
// разрыв. Оттенок карточки считается хешем имени, поэтому она меняется даже
// без загруженной фотографии, а счётчик остатка у «о себе» показывает, сколько
// символов осталось, вместо того чтобы молча обрезать текст.
const STYLES = `
:where([data-vibeui-block="dashboard-019"]){
--vibeui-dashboard-019-bg:oklch(1 0 0);
--vibeui-dashboard-019-panel:oklch(0.985 0.003 265);
--vibeui-dashboard-019-fg:oklch(0.22 0.014 265);
--vibeui-dashboard-019-muted:oklch(0.55 0.014 265);
--vibeui-dashboard-019-border:oklch(0.91 0.006 265);
--vibeui-dashboard-019-accent:oklch(0.55 0.2 262);
--vibeui-dashboard-019-hue:262;
--vibeui-dashboard-019-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-019"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-019-bg);
color:var(--vibeui-dashboard-019-fg);
font-family:var(--vibeui-dashboard-019-sans);
border:1px solid var(--vibeui-dashboard-019-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-019"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-019"] [data-part="shell"]{
display:grid;grid-template-columns:1fr;gap:1.25rem;padding:1.125rem;
}
[data-vibeui-block="dashboard-019"] h2{margin:0 0 0.125rem;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-019"] [data-part="hint"]{margin:0 0 1rem;font-size:0.75rem;color:var(--vibeui-dashboard-019-muted)}
[data-vibeui-block="dashboard-019"] [data-part="field"]{display:block;margin-bottom:0.75rem}
[data-vibeui-block="dashboard-019"] [data-part="fieldlabel"]{
display:flex;align-items:baseline;gap:0.375rem;margin-bottom:0.25rem;
font-size:0.6875rem;font-weight:650;color:var(--vibeui-dashboard-019-muted);
}
[data-vibeui-block="dashboard-019"] [data-part="left"]{
margin-left:auto;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-019"] :is(input,textarea,select){
appearance:none;font:inherit;font-size:0.8125rem;color:inherit;width:100%;
padding:0.5rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-019-border);
background:var(--vibeui-dashboard-019-bg);
}
[data-vibeui-block="dashboard-019"] textarea{resize:vertical;min-height:4.5rem;line-height:1.45}
[data-vibeui-block="dashboard-019"] select{
padding-right:1.75rem;
background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23777' stroke-width='1.6'/%3E%3C/svg%3E");
background-repeat:no-repeat;background-position:right 0.5rem center;background-size:0.625rem;
}
[data-vibeui-block="dashboard-019"] :is(input,textarea,select,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-019-accent);outline-offset:2px;
}
[data-vibeui-block="dashboard-019"] [data-part="pair"]{display:grid;grid-template-columns:1fr;gap:0 0.75rem}
[data-vibeui-block="dashboard-019"] [data-part="actions"]{display:flex;gap:0.5rem;margin-top:0.25rem}
[data-vibeui-block="dashboard-019"] [data-part="save"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:650;
padding:0.5rem 0.875rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-019-accent);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-019"] [data-part="reset"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:650;
padding:0.5rem 0.875rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-019-border);
background:var(--vibeui-dashboard-019-bg);color:inherit;
}
[data-vibeui-block="dashboard-019"] [data-part="preview"]{
align-self:start;
background:var(--vibeui-dashboard-019-panel);
border:1px solid var(--vibeui-dashboard-019-border);border-radius:0.875rem;
padding:0.875rem;
}
[data-vibeui-block="dashboard-019"] [data-part="previewhead"]{
margin:0 0 0.625rem;font-size:0.625rem;font-weight:650;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-dashboard-019-muted);
}
[data-vibeui-block="dashboard-019"] [data-part="card"]{
background:var(--vibeui-dashboard-019-bg);
border:1px solid var(--vibeui-dashboard-019-border);border-radius:0.75rem;
overflow:hidden;
}
[data-vibeui-block="dashboard-019"] [data-part="cover"]{
height:3.25rem;
background:linear-gradient(120deg,oklch(0.72 0.14 var(--vibeui-dashboard-019-hue)),oklch(0.88 0.07 var(--vibeui-dashboard-019-hue)));
}
[data-vibeui-block="dashboard-019"] [data-part="body"]{padding:0 0.875rem 0.875rem}
[data-vibeui-block="dashboard-019"] [data-part="avatar"]{
width:3rem;height:3rem;margin-top:-1.5rem;border-radius:9999px;
display:grid;place-items:center;font-size:0.9375rem;font-weight:700;
border:3px solid var(--vibeui-dashboard-019-bg);
background:oklch(0.94 0.04 var(--vibeui-dashboard-019-hue));
color:oklch(0.36 0.1 var(--vibeui-dashboard-019-hue));
}
[data-vibeui-block="dashboard-019"] [data-part="cardname"]{margin:0.5rem 0 0;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="dashboard-019"] [data-part="cardrole"]{margin:0.0625rem 0 0;font-size:0.75rem;color:var(--vibeui-dashboard-019-muted)}
[data-vibeui-block="dashboard-019"] [data-part="cardbio"]{margin:0.5rem 0 0;font-size:0.75rem;line-height:1.5}
[data-vibeui-block="dashboard-019"] [data-part="chip"]{
display:inline-block;margin-top:0.625rem;
font-size:0.625rem;font-weight:650;letter-spacing:0.03em;text-transform:uppercase;
padding:0.125rem 0.4375rem;border-radius:9999px;
color:var(--vibeui-dashboard-019-muted);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-019-border);
}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-019"] [data-part="shell"]{grid-template-columns:1fr 16rem;padding:1.375rem}
[data-vibeui-block="dashboard-019"] [data-part="pair"]{grid-template-columns:1fr 1fr}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-019"] *{animation:none!important;transition:none!important}}
`

const BIO_LIMIT = 160

function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0) ?? 0
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) {
    return "—"
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}

/**
 * Настройки профиля с живой карточкой: превью перерисовывается на каждый
 * символ. Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard019({
  title = "Профиль",
  hint = "Так вас видят другие участники проекта",
  name = "Анна Реброва",
  role = "Дизайнер интерфейсов",
  bio = "Собираю библиотеку блоков VibeUI и слежу, чтобы установленный компонент выглядел как в превью.",
  city = "Казань",
  visibility = "Видно команде",
  visibilities = ["Видно всем", "Видно команде", "Только мне"],
  saveLabel = "Сохранить",
  accent,
  className,
  style,
}: Dashboard019Props) {
  const [draftName, setDraftName] = useState(name)
  const [draftRole, setDraftRole] = useState(role)
  const [draftBio, setDraftBio] = useState(bio)
  const [draftVisibility, setDraftVisibility] = useState(visibility)

  const palette = {
    ...(accent ? { "--vibeui-dashboard-019-accent": accent } : null),
    "--vibeui-dashboard-019-hue": `${hue(draftName)}`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-019" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-019"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <form
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>

            <label data-part="field">
              <span data-part="fieldlabel">Имя</span>
              <input
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
              />
            </label>

            <div data-part="pair">
              <label data-part="field">
                <span data-part="fieldlabel">Роль</span>
                <input
                  value={draftRole}
                  onChange={(event) => setDraftRole(event.target.value)}
                />
              </label>
              <label data-part="field">
                <span data-part="fieldlabel">Город</span>
                <input defaultValue={city} />
              </label>
            </div>

            <label data-part="field">
              <span data-part="fieldlabel">
                О себе
                <span data-part="left">
                  осталось {Math.max(0, BIO_LIMIT - draftBio.length)}
                </span>
              </span>
              <textarea
                maxLength={BIO_LIMIT}
                value={draftBio}
                onChange={(event) => setDraftBio(event.target.value)}
              />
            </label>

            <label data-part="field">
              <span data-part="fieldlabel">Кому виден профиль</span>
              <select
                value={draftVisibility}
                onChange={(event) => setDraftVisibility(event.target.value)}
              >
                {visibilities.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <div data-part="actions">
              <button type="submit" data-part="save">
                {saveLabel}
              </button>
              <button
                type="button"
                data-part="reset"
                onClick={() => {
                  setDraftName(name)
                  setDraftRole(role)
                  setDraftBio(bio)
                  setDraftVisibility(visibility)
                }}
              >
                Вернуть как было
              </button>
            </div>
          </form>

          <aside data-part="preview" aria-live="polite">
            <p data-part="previewhead">Превью карточки</p>
            <div data-part="card">
              <div data-part="cover" />
              <div data-part="body">
                <div data-part="avatar" aria-hidden="true">
                  {initials(draftName)}
                </div>
                <p data-part="cardname">{draftName || "Без имени"}</p>
                <p data-part="cardrole">{draftRole || "Роль не указана"}</p>
                <p data-part="cardbio">{draftBio}</p>
                <span data-part="chip">{draftVisibility}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
