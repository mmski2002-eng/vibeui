"use client"

import { useState, type CSSProperties } from "react"

type Roadmap003Idea = {
  title: string
  note: string
  votes: number
}

export type Roadmap003Props = {
  eyebrow?: string
  title?: string
  ideas?: Roadmap003Idea[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Роадмап с голосованием: карточки идей с кнопкой-голосом и счётчиком.
// Голос учитывается на клиенте (демо без бэкенда), повторное нажатие
// снимает голос. Кнопка объявляет состояние через aria-pressed, счётчик
// живёт рядом. Формат публичного борда «за что проголосовали больше».
const STYLES = `
:where([data-vibeui-block="roadmap-003"]){
--vibeui-roadmap-003-bg:transparent;
--vibeui-roadmap-003-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-roadmap-003-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-roadmap-003-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-roadmap-003-card:light-dark(oklch(1 0 0),oklch(0.2 0 0));
--vibeui-roadmap-003-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-roadmap-003-on-accent:oklch(0.15 0.02 39.8);
--vibeui-roadmap-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="roadmap-003"]{color-scheme:dark}
[data-vibeui-block="roadmap-003"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-roadmap-003-bg);color:var(--vibeui-roadmap-003-ink);
font-family:var(--vibeui-roadmap-003-font);
}
[data-vibeui-block="roadmap-003"] [data-part="shell"]{max-width:44rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="roadmap-003"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-roadmap-003-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="roadmap-003"] [data-part="title"]{margin:0 0 1.75rem;font-size:clamp(1.5rem,4.5cqi,2.25rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="roadmap-003"] [data-part="list"]{list-style:none;margin:0;padding:0;display:grid;gap:0.75rem}
[data-vibeui-block="roadmap-003"] [data-part="card"]{
display:grid;grid-template-columns:auto 1fr;gap:1rem;align-items:center;
padding:1rem;border:1px solid var(--vibeui-roadmap-003-border);border-radius:1rem;
background:var(--vibeui-roadmap-003-card);
}
[data-vibeui-block="roadmap-003"] [data-part="vote"]{
display:flex;flex-direction:column;align-items:center;gap:0.125rem;
min-width:3.5rem;padding:0.5rem;border-radius:0.75rem;cursor:pointer;
border:1px solid var(--vibeui-roadmap-003-border);background:transparent;color:inherit;font:inherit;
transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-vibeui-block="roadmap-003"] [data-part="vote"]:hover{border-color:var(--vibeui-roadmap-003-accent)}
[data-vibeui-block="roadmap-003"] [data-part="vote"][aria-pressed="true"]{
background:var(--vibeui-roadmap-003-accent);border-color:transparent;color:var(--vibeui-roadmap-003-on-accent);
}
[data-vibeui-block="roadmap-003"] [data-part="vote"]:focus-visible{outline:2px solid var(--vibeui-roadmap-003-accent);outline-offset:2px}
[data-vibeui-block="roadmap-003"] [data-part="arrow"]{font-size:0.875rem;line-height:1}
[data-vibeui-block="roadmap-003"] [data-part="count"]{font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="roadmap-003"] [data-part="idea-title"]{margin:0;font-size:1rem;font-weight:640}
[data-vibeui-block="roadmap-003"] [data-part="idea-note"]{margin:0.25rem 0 0;font-size:0.875rem;line-height:1.45;color:var(--vibeui-roadmap-003-muted)}
@container (min-width: 40rem){[data-vibeui-block="roadmap-003"] [data-part="shell"]{padding:4rem 2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="roadmap-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_IDEAS: Roadmap003Idea[] = [
  { title: "Плагин для Figma", note: "Вставлять блоки прямо в макет", votes: 214 },
  { title: "Тёмные варианты по умолчанию", note: "Отдельная тёмная версия каждого блока", votes: 158 },
  { title: "Командные пресеты", note: "Общая палитра и токены на команду", votes: 96 },
  { title: "Экспорт в Vue", note: "Тот же реестр под Vue-проекты", votes: 73 },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Роадмап с голосованием за идеи: клиентский счётчик, повторный клик снимает голос. */
export function Roadmap003({
  eyebrow = "Планы развития",
  title = "Голосуйте за следующие фичи",
  ideas = DEFAULT_IDEAS,
  background = "",
  accent,
  className,
  style,
}: Roadmap003Props) {
  const [voted, setVoted] = useState<Record<number, boolean>>({})
  const palette = {
    ...(accent ? { "--vibeui-roadmap-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-roadmap-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-roadmap-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="roadmap-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <ul data-part="list">
            {ideas.map((idea, index) => {
              const isVoted = voted[index] ?? false
              return (
                <li key={idea.title} data-part="card">
                  <button
                    type="button"
                    data-part="vote"
                    aria-pressed={isVoted}
                    aria-label={`Проголосовать за «${idea.title}»`}
                    onClick={() =>
                      setVoted((prev) => ({ ...prev, [index]: !prev[index] }))
                    }
                  >
                    <span data-part="arrow" aria-hidden="true">
                      ▲
                    </span>
                    <span data-part="count">
                      {idea.votes + (isVoted ? 1 : 0)}
                    </span>
                  </button>
                  <div>
                    <p data-part="idea-title">{idea.title}</p>
                    <p data-part="idea-note">{idea.note}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
