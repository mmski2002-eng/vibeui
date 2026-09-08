"use client"

import { useEffect, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Text002Props = Omit<ComponentProps<"p">, "children"> & {
  /** Абзац целиком: он разбирается на слова здесь, в разметке. */
  text?: string
  /** Фразы этого же абзаца, которые маркер обходит по кругу. */
  highlights?: string[]
  accent?: string
  /** Цвет самих слов под маркером. Пусто — берётся из палитры. */
  accentText?: string
  /** Секунд на одну фразу: столько маркер стоит, прежде чем перейти. */
  interval?: number
}

// Идея: абзац проявляется слово за словом снизу вверх, из размытия, а
// когда собрался — по нему начинает ходить маркер, подсвечивая по очереди
// смысловые куски. Подсветка не нарисована в тексте заранее: фразы
// задаются словами, и компонент сам находит их в абзаце.
const STYLES = `
:where([data-vibeui-block="text-002"]){
--vibeui-text-002-fg:light-dark(oklch(0.18 0 0),oklch(0.96 0 0));
--vibeui-text-002-accent:#ff5900;
/* Подсветка непрозрачная: у соседних слов кромки заходят друг на
   друга, и на полупрозрачной краске стык проявился бы полосой. */
--vibeui-text-002-mark:light-dark(color-mix(in oklab,var(--vibeui-text-002-accent) 22%,#fff),color-mix(in oklab,var(--vibeui-text-002-accent) 26%,#000));
/* Слово под маркером берёт акцент. В тёмной теме он высветлен: чистый
   оранжевый на тёмной подложке того же тона не читается. */
--vibeui-text-002-accent-text:light-dark(var(--vibeui-text-002-accent),oklch(0.82 0.15 48));
--vibeui-text-002-rise:30%;
--vibeui-text-002-blur:10px;
--vibeui-text-002-stagger:45ms;
--vibeui-text-002-reveal:550ms;
--vibeui-text-002-swap:300ms;
/* Пружина без библиотеки: та же кривая, только выписанная точками. */
--vibeui-text-002-spring:linear(0,0.0371,0.1236,0.2323,0.3463,0.4555,0.5545,0.6411,0.7148,0.776,0.826,0.8663,0.8983,0.9234,0.9429,0.9578,0.9692,0.9778,0.9841,0.9888,0.9923,0.9947,0.9965,0.9978,0.9986,0.9992,0.9996,1,1,1);
--vibeui-text-002-ease:cubic-bezier(0.16,1,0.3,1);
--vibeui-text-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="text-002"]{color-scheme:dark}
[data-vibeui-block="text-002"]{
display:block;box-sizing:border-box;width:100%;max-width:44rem;margin-inline:auto;margin-block:0;
color:var(--vibeui-text-002-fg);font-family:var(--vibeui-text-002-font);
font-weight:550;letter-spacing:-0.04em;text-wrap:pretty;
}
[data-vibeui-block="text-002"] *{box-sizing:border-box}
/* Кегль стоит на слове, а не на абзаце: контейнерные единицы
   считаются от предка-контейнера, и на самом контейнере cqi
   уехал бы к чужой ширине выше по дереву. */
[data-vibeui-block="text-002"] [data-part="slot"]{
font-size:clamp(0.95rem,6.5cqi,3.25rem);line-height:1.18;
}
/* isolate держит маркер под своим словом: иначе отрицательный z-index
   утащил бы его за фон абзаца и подсветка пропала бы. */
[data-vibeui-block="text-002"] [data-part="word"]{
position:relative;isolation:isolate;display:inline-block;
transition:color var(--vibeui-text-002-swap) var(--vibeui-text-002-ease);
animation:vibeui-text-002-rise var(--vibeui-text-002-reveal) var(--vibeui-text-002-ease) both;
animation-delay:calc(var(--vibeui-text-002-stagger) * var(--vibeui-text-002-index));
}
/* Включённое состояние подсветки приходит инлайном, а не правилом на
   data-атрибут: перерисовка меняет атрибуты у слова и его подложки
   разом, и браузер пересчитывал такое правило с отставанием на шаг —
   горела предыдущая фраза. Инлайн применяется сразу. */
[data-vibeui-block="text-002"] [data-part="mark"]{
position:absolute;z-index:-1;inset-block:0.03em;left:-0.12em;right:-0.12em;
background:var(--vibeui-text-002-mark);
transform:scaleX(0.78);opacity:0;
transition:
transform var(--vibeui-text-002-swap) var(--vibeui-text-002-spring),
opacity var(--vibeui-text-002-swap) var(--vibeui-text-002-spring);
}
/* Слово в середине фразы дотягивает подсветку до следующего: иначе
   между словами оставался бы непрокрашенный пробел. */
[data-vibeui-block="text-002"] [data-part="mark"][data-edge="inner"]{right:-0.3em}
@keyframes vibeui-text-002-rise{
from{transform:translateY(var(--vibeui-text-002-rise));opacity:0;filter:blur(var(--vibeui-text-002-blur))}
to{transform:translateY(0);opacity:1;filter:blur(0)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="text-002"] [data-part="word"]{animation:none;transition:none}
[data-vibeui-block="text-002"] [data-part="mark"]{
transition:none;transform:scaleX(1);opacity:1;
}
}
`

const DEFAULT_TEXT =
  "Мы превращаем идеи в интерфейсы, где движение создаёт ясность, ритм рождает доверие, а каждое действие имеет смысл."

const DEFAULT_HIGHLIGHTS = [
  "идеи в интерфейсы",
  "движение создаёт ясность",
  "имеет смысл",
]

/** Включённая подсветка. Инлайн, а не правило на data-атрибут: см. STYLES. */
const MARK_ON: CSSProperties = { transform: "scaleX(1)", opacity: 1 }

/** Слово без окружающей пунктуации: «ясность,» и «ясность» — одно слово. */
function bare(word: string): string {
  return word.replace(/^[^0-9A-Za-zА-Яа-яЁё]+|[^0-9A-Za-zА-Яа-яЁё]+$/g, "")
}

/**
 * Номер фразы для каждого слова абзаца, −1 у неподсвеченных. Фраза ищется
 * как подряд идущая цепочка слов: так подсветка задаётся текстом, а не
 * индексами, и переживает правку абзаца.
 */
function phraseOf(words: string[], phrases: string[]): number[] {
  const marks = words.map(() => -1)

  phrases.forEach((phrase, phraseIndex) => {
    const target = phrase.trim().split(/\s+/).map(bare).filter(Boolean)

    if (target.length === 0) {
      return
    }

    for (let start = 0; start + target.length <= words.length; start += 1) {
      const found = target.every(
        (piece, offset) =>
          bare(words[start + offset]).toLowerCase() === piece.toLowerCase(),
      )

      if (found) {
        for (let offset = 0; offset < target.length; offset += 1) {
          marks[start + offset] = phraseIndex
        }

        return
      }
    }
  })

  return marks
}

/**
 * Абзац, который проявляется по словам, а потом маркер бесконечно
 * перебирает в нём смысловые фразы. Один файл, ноль зависимостей,
 * собственная палитра.
 */
export function Text002({
  text = DEFAULT_TEXT,
  highlights = DEFAULT_HIGHLIGHTS,
  accent,
  accentText,
  interval = 1.8,
  className,
  style,
  ...props
}: Text002Props) {
  const words = text.trim().split(/\s+/)
  const marks = phraseOf(words, highlights)
  const phrases = highlights.length
  // Маркер вступает, когда абзац дособрался: раньше он подсвечивал бы
  // слова, которые ещё летят из размытия.
  const startDelay = words.length * 45 + 550 + 500
  const [active, setActive] = useState(-1)

  useEffect(() => {
    if (
      phrases === 0 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }

    const timer = window.setTimeout(() => setActive(0), startDelay)

    return () => window.clearTimeout(timer)
  }, [phrases, startDelay])

  useEffect(() => {
    if (active < 0) {
      return
    }

    const timer = window.setTimeout(
      () => setActive((current) => (current + 1) % phrases),
      Math.max(600, interval * 1000),
    )

    return () => window.clearTimeout(timer)
  }, [active, interval, phrases])

  const palette = {
    ...(accent ? { "--vibeui-text-002-accent": accent } : null),
    ...(accentText ? { "--vibeui-text-002-accent-text": accentText } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-text-002" precedence="medium">
        {STYLES}
      </style>
      <p
        {...props}
        data-vibeui-block="text-002"
        data-slot="text-highlight"
        className={className}
        style={palette}
      >
        {words.map((word, index) => {
          const on = marks[index] >= 0 && marks[index] === active

          return (
            <span data-part="slot" key={`${index}-${word}`}>
              <span
                data-part="word"
                data-on={on}
                style={
                  {
                    "--vibeui-text-002-index": index,
                    ...(on
                      ? { color: "var(--vibeui-text-002-accent-text)" }
                      : null),
                  } as CSSProperties
                }
              >
                {marks[index] >= 0 ? (
                  <span
                    data-part="mark"
                    data-edge={
                      marks[index + 1] === marks[index] ? "inner" : "last"
                    }
                    data-on={on}
                    aria-hidden="true"
                    style={on ? MARK_ON : undefined}
                  />
                ) : null}
                {word}
              </span>{" "}
            </span>
          )
        })}
      </p>
    </>
  )
}
