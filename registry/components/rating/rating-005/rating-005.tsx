"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Rating005Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  question?: string
  up?: number
  down?: number
  /** Подписи кнопок для скринридера: ключи up и down. */
  voteLabels?: Record<string, string>
  /** Строка под кнопками, пока голос не отдан. */
  idleNote?: string
  /** Жирная часть строки после голосования. */
  thanksText?: string
  /** Продолжение строки после голосования. */
  undoText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: бинарная оценка вместо шкалы. «Помогла ли статья» — вопрос
// с двумя ответами, и пять звёзд тут только удлиняют выбор. Повторное нажатие
// снимает голос: случайный клик обязан откатываться, иначе человек уходит с
// чужим для себя ответом. Счётчики пересчитываются сразу, включая свой голос,
// потому что «спасибо, учтено» без движения цифры выглядит как обман.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="rating-005"]){
--vibeui-rating-005-surface:transparent;
--vibeui-rating-005-wash:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-rating-005-shell:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-rating-005-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-rating-005-muted:color-mix(in oklab,var(--vibeui-rating-005-fg) 68%,transparent);
--vibeui-rating-005-border:light-dark(oklch(0.88 0 265),oklch(0.38 0 265));
--vibeui-rating-005-up:light-dark(oklch(0.55 0.15 155),oklch(0.76 0.14 158));
--vibeui-rating-005-down:light-dark(oklch(0.56 0.18 25),oklch(0.74 0.16 25));
--vibeui-rating-005-accent:var(--vibeui-rating-005-up);
--vibeui-rating-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="rating-005"]{color-scheme:dark}
/* Подложки по умолчанию нет: блок ложится на фон страницы. */
[data-vibeui-block="rating-005"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-rating-005-surface);
border:1px solid var(--vibeui-rating-005-shell);border-radius:0.875rem;
font-family:var(--vibeui-rating-005-font);color:var(--vibeui-rating-005-fg);
}
[data-vibeui-block="rating-005"] [data-part="question"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="rating-005"] [data-part="row"]{display:flex;gap:0.5rem}
[data-vibeui-block="rating-005"] button{
appearance:none;cursor:pointer;flex:1 1 0;
display:inline-flex;align-items:center;justify-content:center;gap:0.375rem;
height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-rating-005-border);border-radius:0.625rem;
background:var(--vibeui-rating-005-surface);color:var(--vibeui-rating-005-fg);
font:inherit;font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums;
transition:border-color .14s ease,background-color .14s ease,color .14s ease;
}
[data-vibeui-block="rating-005"] button[data-vote="up"]:hover{border-color:var(--vibeui-rating-005-up)}
[data-vibeui-block="rating-005"] button[data-vote="down"]:hover{border-color:var(--vibeui-rating-005-down)}
/* Отданный голос виден заливкой: «учтено» без изменения кнопки не читается. */
[data-vibeui-block="rating-005"] button[data-vote="up"][aria-pressed="true"]{
border-color:transparent;color:var(--vibeui-rating-005-up);
background:color-mix(in oklch,var(--vibeui-rating-005-up) 14%,var(--vibeui-rating-005-wash));
}
[data-vibeui-block="rating-005"] button[data-vote="down"][aria-pressed="true"]{
border-color:transparent;color:var(--vibeui-rating-005-down);
background:color-mix(in oklch,var(--vibeui-rating-005-down) 14%,var(--vibeui-rating-005-wash));
}
[data-vibeui-block="rating-005"] button:focus-visible{outline:2px solid var(--vibeui-rating-005-accent);outline-offset:2px}
[data-vibeui-block="rating-005"] svg{width:1.125rem;height:1.125rem;flex:none}
[data-vibeui-block="rating-005"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-rating-005-muted);
}
[data-vibeui-block="rating-005"] [data-part="note"] b{color:var(--vibeui-rating-005-fg);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="rating-005"] *{animation:none!important;transition:none!important}}
`

const THUMB =
  "M7 21V10.5l4.2-7.1a1.6 1.6 0 0 1 3 .8V9h4.3a1.7 1.7 0 0 1 1.66 2.05l-1.4 7A2 2 0 0 1 16.8 19.7H7Zm-4 0h4V10.5H3Z"

const DEFAULT_VOTE_LABELS: Record<string, string> = {
  up: "Да, помогла",
  down: "Нет, не помогла",
}

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
 * Бинарная оценка «палец вверх / палец вниз» со счётчиками и отзывом голоса.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Rating005({
  question = "Статья оказалась полезной?",
  up = 128,
  down = 6,
  voteLabels = DEFAULT_VOTE_LABELS,
  idleNote = "Голос анонимный и его можно отозвать повторным нажатием.",
  thanksText = "Спасибо, голос учтён.",
  undoText = "Нажмите ту же кнопку ещё раз, чтобы его отозвать.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Rating005Props) {
  const [vote, setVote] = useState<"up" | "down" | null>(null)

  const palette = {
    ...(accent ? { "--vibeui-rating-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-rating-005-surface": background,
          "--vibeui-rating-005-wash": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const counts = {
    up: up + (vote === "up" ? 1 : 0),
    down: down + (vote === "down" ? 1 : 0),
  }

  return (
    <>
      <style href="vibeui-rating-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="rating"
        data-vibeui-block="rating-005"
        className={className}
        style={palette}
      >
        <p data-part="question">{question}</p>
        <div data-part="row">
          {(["up", "down"] as const).map((side) => (
            <button
              key={side}
              type="button"
              data-vote={side}
              aria-pressed={vote === side}
              aria-label={voteLabels[side] ?? DEFAULT_VOTE_LABELS[side]}
              // Повторное нажатие снимает голос: случайный клик надо откатывать.
              onClick={() => setVote(vote === side ? null : side)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                style={
                  side === "down" ? { transform: "rotate(180deg)" } : undefined
                }
              >
                <path d={THUMB} />
              </svg>
              {counts[side]}
            </button>
          ))}
        </div>
        <p data-part="note" aria-live="polite">
          {vote === null ? (
            idleNote
          ) : (
            <>
              <b>{thanksText}</b> {undoText}
            </>
          )}
        </p>
      </div>
    </>
  )
}
