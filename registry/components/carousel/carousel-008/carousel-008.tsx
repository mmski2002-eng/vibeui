"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Carousel008Step = {
  title: string
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  text: string
}

export type Carousel008Props = Omit<ComponentProps<"section">, "children"> & {
  steps?: Carousel008Step[]
  label?: string
  nextLabel?: string
  doneLabel?: string
  skipLabel?: string
  /** Роль секции для скринридера. */
  roleText?: string
  /** Шаблон подписи точек: {index}, {total}. */
  dotsText?: string
  /** Пусто — подложка своя; цвет заменяет её целиком. */
  background?: string
  accent?: string
}

// Идея компонента: карусель-онбординг с явной кнопкой «дальше». Она отличается
// от слайдера тем, что у неё есть конец: на последнем шаге кнопка меняет
// подпись и становится завершением. Пропустить можно с первого шага — вести
// человека силой через пять экранов нельзя.
//
// Тема берётся из color-scheme окружения через light-dark(): карточка и текст
// темнеют вместе со страницей, своей тёмной темы компонент не носит.
const STYLES = `
:where([data-vibeui-block="carousel-008"]){
--vibeui-carousel-008-bg:light-dark(oklch(1 0 0),oklch(0.21 0 265));
--vibeui-carousel-008-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-carousel-008-muted:color-mix(in oklab,var(--vibeui-carousel-008-fg) 68%,transparent);
--vibeui-carousel-008-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-carousel-008-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.7 0.16 39.8));
--vibeui-carousel-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="carousel-008"]{color-scheme:dark}
[data-vibeui-block="carousel-008"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-carousel-008-bg);
border:1px solid var(--vibeui-carousel-008-border);border-radius:0.875rem;
font-family:var(--vibeui-carousel-008-font);color:var(--vibeui-carousel-008-fg);
}
/* Картинка шага стоит вместо иллюстрации: градиент и светлый номер на нём
   одинаковы в любой теме страницы, поэтому второй ветки у них нет. */
[data-vibeui-block="carousel-008"] [data-part="art"]{
position:relative;display:flex;align-items:center;justify-content:center;
aspect-ratio:16 / 9;border-radius:0.75rem;
color:oklch(0.99 0 265);font-size:1.5rem;font-weight:700;
font-variant-numeric:tabular-nums;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="carousel-008"] [data-part="art"][data-empty="true"]{background:
radial-gradient(90% 80% at 25% 20%,oklch(0.92 0.06 var(--vibeui-carousel-008-hue,250)),transparent 70%),
linear-gradient(150deg,oklch(0.82 0.08 var(--vibeui-carousel-008-hue,250)),oklch(0.58 0.1 var(--vibeui-carousel-008-hue,250)));}
[data-vibeui-block="carousel-008"] [data-part="art"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="carousel-008"] [data-part="body"]{display:grid}
/* Шаги лежат в одной ячейке грида: высота держится по самому длинному. */
[data-vibeui-block="carousel-008"] [data-part="step"]{grid-area:1 / 1;display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-block="carousel-008"] [data-part="step"][data-hidden="true"]{visibility:hidden}
[data-vibeui-block="carousel-008"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;line-height:1.3}
[data-vibeui-block="carousel-008"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-carousel-008-muted)}
[data-vibeui-block="carousel-008"] [data-part="foot"]{display:flex;align-items:center;justify-content:space-between;gap:0.75rem}
[data-vibeui-block="carousel-008"] [data-part="dots"]{display:flex;gap:0.3125rem}
[data-vibeui-block="carousel-008"] [data-part="dot"]{
width:0.4375rem;height:0.4375rem;border-radius:9999px;background:var(--vibeui-carousel-008-border);
}
[data-vibeui-block="carousel-008"] [data-part="dot"][data-on="true"]{background:var(--vibeui-carousel-008-accent);width:1.125rem}
[data-vibeui-block="carousel-008"] [data-part="actions"]{display:flex;align-items:center;gap:0.5rem}
[data-vibeui-block="carousel-008"] button{
appearance:none;cursor:pointer;
height:2.125rem;padding:0 0.875rem;
border:0;border-radius:0.5rem;
background:var(--vibeui-carousel-008-accent);color:light-dark(oklch(0.99 0 265),oklch(0.17 0 265));
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="carousel-008"] [data-part="skip"]{
background:transparent;color:var(--vibeui-carousel-008-muted);font-weight:600;padding:0;height:auto;
}
[data-vibeui-block="carousel-008"] button:focus-visible{outline:2px solid var(--vibeui-carousel-008-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="carousel-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Carousel008Step[] = [
  {
    title: "Выберите компонент",
    text: "Каталог показывает живое превью и категорию — картинок нет, всё настоящее.",
  },
  {
    title: "Скопируйте инструкцию",
    text: "Copy for AI соберёт команду установки и правила, которые нельзя нарушать.",
  },
  {
    title: "Отдайте агенту",
    text: "Он поставит компонент одной командой и не станет пересобирать его заново.",
  },
]

/** Подстановка чисел в подпись: перевод остаётся одной строкой. */
function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Карусель-онбординг: у неё есть конец, а пропустить можно с первого шага.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel008({
  steps = DEFAULT_STEPS,
  label = "Знакомство",
  nextLabel = "Дальше",
  doneLabel = "Начать",
  skipLabel = "Пропустить",
  roleText = "карусель",
  dotsText = "Шаг {index} из {total}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Carousel008Props) {
  const [index, setIndex] = useState(0)
  const last = index === steps.length - 1

  const palette = {
    "--vibeui-carousel-008-hue": 250 + index * 40,
    ...(accent ? { "--vibeui-carousel-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-carousel-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-carousel-008" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="carousel"
        data-vibeui-block="carousel-008"
        aria-roledescription={roleText}
        aria-label={label}
        className={className}
        style={palette}
      >
        <div
          data-part="art"
          data-empty={steps[index]?.image ? undefined : "true"}
          aria-hidden="true"
        >
          {steps[index]?.image ? (
            <img
              src={steps[index]?.image}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ) : null}
          {index + 1}
        </div>
        <div data-part="body" aria-live="polite">
          {steps.map((step, position) => (
            <div
              key={step.title}
              data-part="step"
              data-hidden={position !== index}
              aria-hidden={position !== index}
            >
              <h3 data-part="title">{step.title}</h3>
              <p data-part="text">{step.text}</p>
            </div>
          ))}
        </div>
        <div data-part="foot">
          {/* role нужен ради подписи: на голом div aria-label не читается. */}
          <div
            data-part="dots"
            role="group"
            aria-label={fill(dotsText, {
              index: index + 1,
              total: steps.length,
            })}
          >
            {steps.map((step, position) => (
              <span
                key={step.title}
                data-part="dot"
                data-on={position === index}
                aria-hidden="true"
              />
            ))}
          </div>
          <div data-part="actions">
            {last ? null : (
              <button
                type="button"
                data-part="skip"
                onClick={() => setIndex(steps.length - 1)}
              >
                {skipLabel}
              </button>
            )}
            <button
              type="button"
              onClick={() => setIndex(last ? 0 : index + 1)}
            >
              {last ? doneLabel : nextLabel}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
