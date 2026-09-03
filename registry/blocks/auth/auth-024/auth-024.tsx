"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Auth024Goal = {
  title: string
  text: string
  glyph: string
}

export type Auth024Props = {
  title?: string
  lead?: string
  goals?: Auth024Goal[]
  submit?: string
  limit?: number
  /** Метка над заголовком: блок несёт русскую. */
  hiText?: string
  /** Счётчик выбранного; {count} и {limit} подставляются числами. */
  countText?: string
  /** Хвост счётчика, когда предел выбран. */
  fullText?: string
  /** Подпись кнопки «пропустить». */
  skipText?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: первый экран после регистрации, который спрашивает про цели.
// Такой опрос оправдан ровно тогда, когда ответ на что-то влияет, поэтому под
// каждой целью написано, что именно изменится, а не «поможет нам стать лучше».
// Выбор ограничен сверху: человек, отметивший всё, не сообщил ничего, и
// счётчик с пределом честнее, чем молча проигнорированные ответы.
// Карточки — обычные чекбоксы внутри label: клавиатура и скринридер работают
// без ролей и обработчиков, подсветка выбранной карточки держится на :has().
// «Пропустить» стоит рядом с кнопкой, а не спрятано: онбординг, из которого
// нельзя выйти, воспринимается как платёжная форма.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственной подложки.
//
// Демонстрация интерфейса: ответы никуда не уходят.
const STYLES = `
:where([data-vibeui-block="auth-024"]){
--vibeui-auth-024-bg:transparent;
--vibeui-auth-024-card:light-dark(oklch(1 0 0),oklch(0.22 0.013 265));
--vibeui-auth-024-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-auth-024-muted:light-dark(oklch(0.54 0.014 265),oklch(0.7 0.012 265));
--vibeui-auth-024-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-auth-024-accent:light-dark(oklch(0.53 0.18 275),oklch(0.76 0.14 275));
--vibeui-auth-024-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.02 265));
--vibeui-auth-024-tint:light-dark(oklch(0.53 0.18 275 / 12%),oklch(0.76 0.14 275 / 18%));
--vibeui-auth-024-soft:light-dark(oklch(0.53 0.18 275 / 10%),oklch(0.76 0.14 275 / 16%));
--vibeui-auth-024-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-024"]{color-scheme:dark}
[data-vibeui-block="auth-024"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1.75rem 1rem;
background:var(--vibeui-auth-024-bg);color:var(--vibeui-auth-024-fg);
font-family:var(--vibeui-auth-024-sans);
}
[data-vibeui-block="auth-024"] *{box-sizing:border-box}
[data-vibeui-block="auth-024"] [data-part="shell"]{width:100%;max-width:24rem;margin:0 auto}
[data-vibeui-block="auth-024"] [data-part="grid"]{display:grid;grid-template-columns:1fr;gap:0.625rem;margin:0 0 1.25rem;padding:0;list-style:none}
@container (min-width: 44rem){
[data-vibeui-block="auth-024"] [data-part="shell"]{max-width:44rem}
[data-vibeui-block="auth-024"] [data-part="grid"]{grid-template-columns:1fr 1fr}
[data-vibeui-block="auth-024"] [data-part="foot"]{flex-direction:row;align-items:center}
[data-vibeui-block="auth-024"] [data-part="submit"]{margin-left:auto;width:auto;min-width:14rem}
}
[data-vibeui-block="auth-024"] [data-part="hi"]{
display:inline-block;margin-bottom:0.5rem;padding:0.1875rem 0.5rem;border-radius:9999px;
background:var(--vibeui-auth-024-tint);color:var(--vibeui-auth-024-accent);
font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="auth-024"] h2{margin:0 0 0.375rem;font-size:1.375rem;font-weight:700;line-height:1.2;letter-spacing:-0.02em}
[data-vibeui-block="auth-024"] [data-part="lead"]{margin:0 0 1.25rem;font-size:0.875rem;line-height:1.55;color:var(--vibeui-auth-024-muted)}
[data-vibeui-block="auth-024"] [data-part="goal"]{
display:flex;gap:0.75rem;padding:0.875rem;cursor:pointer;height:100%;
background:var(--vibeui-auth-024-card);
border:1px solid var(--vibeui-auth-024-border);border-radius:0.875rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="auth-024"] [data-part="goal"]:hover{border-color:var(--vibeui-auth-024-accent)}
[data-vibeui-block="auth-024"] [data-part="goal"]:has(input:checked){
border-color:var(--vibeui-auth-024-accent);
box-shadow:inset 0 0 0 1px var(--vibeui-auth-024-accent);
}
[data-vibeui-block="auth-024"] [data-part="goal"]:has(input:focus-visible){outline:2px solid var(--vibeui-auth-024-accent);outline-offset:2px}
[data-vibeui-block="auth-024"] [data-part="goal"]:has(input:disabled){opacity:.5;cursor:not-allowed}
[data-vibeui-block="auth-024"] [data-part="goal"] input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
[data-vibeui-block="auth-024"] [data-part="glyph"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;border-radius:0.625rem;
background:var(--vibeui-auth-024-soft);font-size:1rem;line-height:1;
}
[data-vibeui-block="auth-024"] [data-part="goal"]:has(input:checked) [data-part="glyph"]{background:var(--vibeui-auth-024-accent);color:var(--vibeui-auth-024-on-accent)}
[data-vibeui-block="auth-024"] [data-part="gtitle"]{display:block;font-size:0.875rem;font-weight:650}
[data-vibeui-block="auth-024"] [data-part="gtext"]{display:block;margin-top:0.1875rem;font-size:0.75rem;line-height:1.45;color:var(--vibeui-auth-024-muted)}
[data-vibeui-block="auth-024"] [data-part="tick"]{
flex:none;align-self:flex-start;display:inline-flex;align-items:center;justify-content:center;
width:1.25rem;height:1.25rem;border-radius:9999px;margin-left:auto;
border:1px solid var(--vibeui-auth-024-border);font-size:0.6875rem;color:transparent;
}
[data-vibeui-block="auth-024"] [data-part="goal"]:has(input:checked) [data-part="tick"]{
background:var(--vibeui-auth-024-accent);border-color:var(--vibeui-auth-024-accent);color:var(--vibeui-auth-024-on-accent);
}
[data-vibeui-block="auth-024"] [data-part="foot"]{display:flex;flex-direction:column;gap:0.75rem}
[data-vibeui-block="auth-024"] [data-part="count"]{margin:0;font-size:0.8125rem;color:var(--vibeui-auth-024-muted)}
[data-vibeui-block="auth-024"] [data-part="submit"]{
width:100%;appearance:none;cursor:pointer;height:2.75rem;padding:0 1.25rem;
border:0;border-radius:0.75rem;
background:var(--vibeui-auth-024-accent);color:var(--vibeui-auth-024-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
transition:opacity .16s ease;
}
[data-vibeui-block="auth-024"] [data-part="submit"]:disabled{cursor:not-allowed;opacity:.45}
[data-vibeui-block="auth-024"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-024-accent);outline-offset:2px}
[data-vibeui-block="auth-024"] [data-part="skip"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0;
color:var(--vibeui-auth-024-muted);font:inherit;font-size:0.8125rem;text-decoration:underline;
}
[data-vibeui-block="auth-024"] [data-part="skip"]:focus-visible{outline:2px solid var(--vibeui-auth-024-accent);outline-offset:2px;border-radius:0.25rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-024"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GOALS: Auth024Goal[] = [
  {
    title: "Собрать лендинг",
    text: "Каталог откроется на секциях-героях и формах.",
    glyph: "◆",
  },
  {
    title: "Сделать админку",
    text: "Наверх поднимутся таблицы, фильтры и графики.",
    glyph: "▤",
  },
  {
    title: "Прототипировать быстро",
    text: "Copy for AI будет отдавать сразу целые экраны.",
    glyph: "⚡",
  },
  {
    title: "Навести порядок в дизайне",
    text: "Подскажем, какие блоки в проекте расходятся по стилю.",
    glyph: "☰",
  },
  {
    title: "Работать командой",
    text: "Включим общую историю установок и комментарии.",
    glyph: "◎",
  },
  {
    title: "Просто посмотреть",
    text: "Никаких писем и подсказок — откроем пустой каталог.",
    glyph: "◐",
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
 * Онбординг после регистрации: цели карточками, предел выбора
 * и честное «пропустить». Один файл, ноль зависимостей.
 */
export function Auth024({
  title = "С чего начнём?",
  lead = "Отметьте, зачем вы здесь — каталог сразу откроется на нужных блоках. Ответы влияют только на порядок карточек.",
  goals = DEFAULT_GOALS,
  submit = "Открыть каталог",
  limit = 3,
  hiText = "Аккаунт создан",
  countText = "Выбрано {count} из {limit}",
  fullText = " — больше не нужно, порядок уже понятен",
  skipText = "Пропустить",
  background = "",
  accent,
  className,
  style,
}: Auth024Props) {
  const [chosen, setChosen] = useState<string[]>([])

  const full = chosen.length >= limit

  const palette = {
    ...(accent ? { "--vibeui-auth-024-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-024-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-024" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-024"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <span data-part="hi">{hiText}</span>
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <ul data-part="grid">
            {goals.map((goal) => {
              const picked = chosen.includes(goal.title)

              return (
                <li key={goal.title}>
                  <label data-part="goal">
                    <input
                      type="checkbox"
                      name="goals"
                      value={goal.title}
                      checked={picked}
                      disabled={!picked && full}
                      onChange={() =>
                        setChosen((current) =>
                          picked
                            ? current.filter((item) => item !== goal.title)
                            : [...current, goal.title],
                        )
                      }
                    />
                    <span data-part="glyph" aria-hidden="true">
                      {goal.glyph}
                    </span>
                    <span>
                      <span data-part="gtitle">{goal.title}</span>
                      <span data-part="gtext">{goal.text}</span>
                    </span>
                    <span data-part="tick" aria-hidden="true">
                      ✓
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>

          <div data-part="foot">
            <p data-part="count" role="status">
              {countText
                .replace("{count}", String(chosen.length))
                .replace("{limit}", String(limit))}
              {full ? fullText : ""}
            </p>
            <button type="button" data-part="skip">
              {skipText}
            </button>
            <button
              type="button"
              data-part="submit"
              disabled={chosen.length === 0}
            >
              {submit}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
