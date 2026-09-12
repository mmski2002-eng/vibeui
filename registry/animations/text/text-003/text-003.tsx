"use client"

import { useEffect, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Text003Props = Omit<ComponentProps<"p">, "children"> & {
  /** Абзац целиком: он разбирается на слова здесь, в разметке. */
  text?: string
  /** Фразы этого же абзаца, которые подсвечиваются одна за другой. */
  highlights?: string[]
  accent?: string
  /** Цвет самих слов под подсветкой. Пусто — берётся из палитры. */
  accentText?: string
  /** Секунд между зажиганием соседних фраз. */
  step?: number
}

// Идея: тот же проявляющийся абзац, но подсветка не бегает по кругу, а
// накапливается — фразы зажигаются по очереди и стоят все вместе. Читатель
// получает не мелькающий акцент, а собранный конспект абзаца; собранный
// конспект держится паузу, гаснет целиком, и круг начинается заново.
const STYLES = `
:where([data-vibeui-block="text-003"]){
--vibeui-text-003-fg:light-dark(oklch(0.18 0 0),oklch(0.96 0 0));
--vibeui-text-003-accent:light-dark(#1a1a1a,#f2f2f2);
/* Подсветка непрозрачная: у соседних слов кромки заходят друг на
   друга, и на полупрозрачной краске стык проявился бы полосой. */
--vibeui-text-003-mark:light-dark(color-mix(in oklab,var(--vibeui-text-003-accent) 22%,#fff),color-mix(in oklab,var(--vibeui-text-003-accent) 26%,#000));
/* Слово под подсветкой берёт акцент. В тёмной теме он высветлен: чистый
   оранжевый на тёмной подложке того же тона не читается. */
--vibeui-text-003-accent-text:light-dark(var(--vibeui-text-003-accent),oklch(0.82 0 0));
--vibeui-text-003-rise:30%;
--vibeui-text-003-blur:10px;
--vibeui-text-003-stagger:45ms;
--vibeui-text-003-reveal:550ms;
--vibeui-text-003-draw:300ms;
/* Пружина без библиотеки: та же кривая, только выписанная точками. */
--vibeui-text-003-spring:linear(0,0.0371,0.1236,0.2323,0.3463,0.4555,0.5545,0.6411,0.7148,0.776,0.826,0.8663,0.8983,0.9234,0.9429,0.9578,0.9692,0.9778,0.9841,0.9888,0.9923,0.9947,0.9965,0.9978,0.9986,0.9992,0.9996,1,1,1);
--vibeui-text-003-ease:cubic-bezier(0.16,1,0.3,1);
--vibeui-text-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="text-003"]{color-scheme:dark}
[data-vibeui-block="text-003"]{
display:block;box-sizing:border-box;width:100%;max-width:44rem;margin-inline:auto;margin-block:0;
color:var(--vibeui-text-003-fg);font-family:var(--vibeui-text-003-font);
font-weight:550;letter-spacing:-0.04em;text-wrap:pretty;
}
[data-vibeui-block="text-003"] *{box-sizing:border-box}
/* Кегль стоит на слове, а не на абзаце: контейнерные единицы
   считаются от предка-контейнера, и на самом контейнере cqi
   уехал бы к чужой ширине выше по дереву. */
[data-vibeui-block="text-003"] [data-part="slot"]{
font-size:clamp(0.95rem,6.5cqi,3.25rem);line-height:1.18;
}
/* isolate держит подсветку под своим словом: иначе отрицательный z-index
   утащил бы её за фон абзаца и она пропала бы. */
[data-vibeui-block="text-003"] [data-part="word"]{
position:relative;isolation:isolate;display:inline-block;
transition:color var(--vibeui-text-003-draw) var(--vibeui-text-003-ease);
animation:vibeui-text-003-rise var(--vibeui-text-003-reveal) var(--vibeui-text-003-ease) both;
animation-delay:calc(var(--vibeui-text-003-stagger) * var(--vibeui-text-003-index));
}
/* Растёт от левого края, а не из центра: подсветка читается как штрих
   маркером по строке слева направо. */
/* Включённое состояние подсветки приходит инлайном, а не правилом на
   data-атрибут: перерисовка меняет атрибуты у слова и его подложки
   разом, и браузер пересчитывал такое правило с отставанием на шаг —
   горела предыдущая фраза. Инлайн применяется сразу. */
[data-vibeui-block="text-003"] [data-part="mark"]{
position:absolute;z-index:-1;inset-block:0.03em;left:-0.12em;right:-0.12em;
background:var(--vibeui-text-003-mark);
transform-origin:left center;transform:scaleX(0.78);opacity:0;
transition:
transform var(--vibeui-text-003-draw) var(--vibeui-text-003-spring),
opacity var(--vibeui-text-003-draw) var(--vibeui-text-003-spring);
}
/* Слово в середине фразы дотягивает подсветку до следующего: иначе
   между словами оставался бы непрокрашенный пробел. */
[data-vibeui-block="text-003"] [data-part="mark"][data-edge="inner"]{right:-0.3em}
@keyframes vibeui-text-003-rise{
from{transform:translateY(var(--vibeui-text-003-rise));opacity:0;filter:blur(var(--vibeui-text-003-blur))}
to{transform:translateY(0);opacity:1;filter:blur(0)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="text-003"] [data-part="word"]{animation:none;transition:none}
[data-vibeui-block="text-003"] [data-part="mark"]{
transition:none;transform:scaleX(1);opacity:1;
}
}
`

const DEFAULT_TEXT =
  "Хорошие продукты рождаются, когда ясное мышление встречает внимание к деталям, уверенное движение и терпение доводить начатое до конца."

const DEFAULT_HIGHLIGHTS = [
  "ясное мышление",
  "внимание к деталям",
  "доводить начатое до конца",
]

/** Сколько собранный конспект держится перед тем, как погаснуть, мс. */
const HOLD = 1800

/** Пауза между гашением и следующим кругом, мс. */
const PAUSE = 700

/** Включённая подсветка. Инлайн, а не правило на data-атрибут: см. STYLES. */
const MARK_ON: CSSProperties = { transform: "scaleX(1)", opacity: 1 }

/** Слово без окружающей пунктуации: «деталям,» и «деталям» — одно слово. */
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
 * Абзац, который проявляется по словам, а затем по очереди зажигает
 * подсветку на смысловых фразах, держит собранный конспект и начинает
 * круг заново. Один файл, ноль зависимостей, собственная палитра.
 */
export function Text003({
  text = DEFAULT_TEXT,
  highlights = DEFAULT_HIGHLIGHTS,
  accent,
  accentText,
  step = 0.9,
  className,
  style,
  ...props
}: Text003Props) {
  const words = text.trim().split(/\s+/)
  const marks = phraseOf(words, highlights)
  const phrases = highlights.length
  // Подсветка вступает, когда абзац дособрался: раньше она красила бы
  // слова, которые ещё летят из размытия.
  const startDelay = words.length * 45 + 550 + 500
  // Сколько фраз уже горит. −1 — абзац ещё собирается, 0 — конспект погас
  // и ждёт следующего круга.
  const [lit, setLit] = useState(-1)

  useEffect(() => {
    if (
      phrases === 0 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }

    const delay =
      lit < 0
        ? startDelay
        : lit === 0
          ? PAUSE
          : lit >= phrases
            ? HOLD
            : Math.max(200, step * 1000)

    const timer = window.setTimeout(
      () => setLit((current) => (current >= phrases ? 0 : current + 1)),
      delay,
    )

    return () => window.clearTimeout(timer)
  }, [lit, phrases, startDelay, step])

  const palette = {
    ...(accent ? { "--vibeui-text-003-accent": accent } : null),
    ...(accentText ? { "--vibeui-text-003-accent-text": accentText } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-text-003" precedence="medium">
        {STYLES}
      </style>
      <p
        {...props}
        data-vibeui-block="text-003"
        data-slot="text-highlight"
        className={className}
        style={palette}
      >
        {words.map((word, index) => {
          const on = marks[index] >= 0 && marks[index] < lit

          return (
            <span data-part="slot" key={`${index}-${word}`}>
              <span
                data-part="word"
                data-on={on}
                style={
                  {
                    "--vibeui-text-003-index": index,
                    ...(on
                      ? { color: "var(--vibeui-text-003-accent-text)" }
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
