"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Sheet007Section = {
  label: string
  hint: string
  options: string[]
}

export type Sheet007Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  sections?: Sheet007Section[]
  /** Имя кнопки возврата для скринридера: русское по умолчанию. */
  backLabel?: string
  /** Имя кнопки закрытия для скринридера: русское по умолчанию. */
  closeLabel?: string
  /** Открыть лист сразу и без модального режима: он остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
  /** Подложка листа и кнопки открытия. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: лист с двумя уровнями вместо второго диалога поверх
// первого. Уровни лежат в одной дорожке и сдвигаются вбок, поэтому переход
// читается как «вглубь», а не как новое окно. Кнопка «Назад» возвращает на
// уровень, крестик закрывает лист целиком — это разные операции.
//
// Тема берётся из color-scheme окружения через light-dark(): лист темнеет
// там, где тёмный контекст, и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="sheet-007"]){
--vibeui-sheet-007-bg:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-sheet-007-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.006 265));
--vibeui-sheet-007-muted:color-mix(in oklab,var(--vibeui-sheet-007-fg) 68%,transparent);
--vibeui-sheet-007-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-sheet-007-hover:light-dark(oklch(0.96 0.004 265),oklch(0.29 0.012 265));
--vibeui-sheet-007-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.16 265));
--vibeui-sheet-007-shadow:light-dark(oklch(0.2 0.02 265 / 60%),oklch(0.02 0.01 265 / 75%));
--vibeui-sheet-007-scrim:light-dark(oklch(0.19 0.02 265 / 45%),oklch(0.08 0.014 265 / 60%));
--vibeui-sheet-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sheet-007"]{color-scheme:dark}
[data-vibeui-block="sheet-007"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:inline-block;font-family:var(--vibeui-sheet-007-font);color:var(--vibeui-sheet-007-fg);
}
[data-vibeui-block="sheet-007"] [data-part="trigger"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-sheet-007-border);border-radius:0.625rem;
background:var(--vibeui-sheet-007-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="sheet-007"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-sheet-007-accent);outline-offset:2px}
[data-vibeui-block="sheet-007"] dialog{
position:fixed;inset:auto 0 0 0;margin:0;container-type:inline-size;
width:100%;max-width:100vw;height:min(26rem,82dvh);
padding:0;border:0;border-radius:1.25rem 1.25rem 0 0;overflow:hidden;
background:var(--vibeui-sheet-007-bg);color:var(--vibeui-sheet-007-fg);
box-shadow:0 -26px 60px -32px var(--vibeui-sheet-007-shadow);
translate:0 100%;transition:translate .24s ease,overlay .24s allow-discrete,display .24s allow-discrete;
}
[data-vibeui-block="sheet-007"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="sheet-007"] dialog[open]{translate:0 100%}
}
[data-vibeui-block="sheet-007"] dialog::backdrop{background:var(--vibeui-sheet-007-scrim)}
[data-vibeui-block="sheet-007"] [data-part="panel"]{display:flex;flex-direction:column;height:100%;box-sizing:border-box}
[data-vibeui-block="sheet-007"] [data-part="head"]{
display:flex;align-items:center;gap:0.5rem;padding:0.75rem 0.75rem 0.625rem;
border-bottom:1px solid var(--vibeui-sheet-007-border);
}
[data-vibeui-block="sheet-007"] [data-part="back"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.5rem;color:var(--vibeui-sheet-007-muted);
}
[data-vibeui-block="sheet-007"] [data-part="back"]:hover{background:var(--vibeui-sheet-007-hover);color:var(--vibeui-sheet-007-fg)}
[data-vibeui-block="sheet-007"] [data-part="back"]:focus-visible{outline:2px solid var(--vibeui-sheet-007-accent);outline-offset:2px}
/* Стрелка — половина повёрнутого квадрата: рисуем бордюрами, без иконок. */
[data-vibeui-block="sheet-007"] [data-part="arrow"]{
width:0.5rem;height:0.5rem;margin-left:0.1875rem;
border:solid currentColor;border-width:0 0 1.75px 1.75px;transform:rotate(45deg);
}
[data-vibeui-block="sheet-007"] [data-part="title"]{margin:0;font-size:1rem;font-weight:680;flex:1;min-width:0}
[data-vibeui-block="sheet-007"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.5rem;color:var(--vibeui-sheet-007-muted);
}
[data-vibeui-block="sheet-007"] [data-part="close"]:hover{background:var(--vibeui-sheet-007-hover);color:var(--vibeui-sheet-007-fg)}
[data-vibeui-block="sheet-007"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-sheet-007-accent);outline-offset:2px}
[data-vibeui-block="sheet-007"] [data-part="cross"]{position:relative;width:0.625rem;height:0.625rem}
[data-vibeui-block="sheet-007"] [data-part="cross"]::before,
[data-vibeui-block="sheet-007"] [data-part="cross"]::after{
content:"";position:absolute;left:0;top:50%;width:100%;height:1.5px;
margin-top:-0.75px;background:currentColor;border-radius:9999px;
}
[data-vibeui-block="sheet-007"] [data-part="cross"]::before{transform:rotate(45deg)}
[data-vibeui-block="sheet-007"] [data-part="cross"]::after{transform:rotate(-45deg)}
[data-vibeui-block="sheet-007"] [data-part="viewport"]{flex:1;min-height:0;overflow:hidden}
/* Оба уровня лежат в одной дорожке: переход читается как «вглубь». */
[data-vibeui-block="sheet-007"] [data-part="track"]{
display:flex;width:200%;height:100%;
transition:translate .24s ease;
}
[data-vibeui-block="sheet-007"] [data-part="track"][data-level="1"]{translate:-50% 0}
[data-vibeui-block="sheet-007"] [data-part="level"]{width:50%;height:100%;overflow-y:auto;box-sizing:border-box;padding:0 1rem 1rem}
[data-vibeui-block="sheet-007"] [data-part="rows"]{list-style:none;margin:0;padding:0}
[data-vibeui-block="sheet-007"] [data-part="row"]{
appearance:none;border:0;cursor:pointer;width:100%;
display:flex;align-items:center;gap:0.75rem;
padding:0.75rem 0;border-bottom:1px solid var(--vibeui-sheet-007-border);
background:transparent;color:inherit;font:inherit;text-align:left;
}
[data-vibeui-block="sheet-007"] [data-part="row"]:focus-visible{outline:2px solid var(--vibeui-sheet-007-accent);outline-offset:-2px}
[data-vibeui-block="sheet-007"] [data-part="labels"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0}
[data-vibeui-block="sheet-007"] [data-part="label"]{font-size:0.9375rem;font-weight:600}
[data-vibeui-block="sheet-007"] [data-part="hint"]{font-size:0.875rem;color:var(--vibeui-sheet-007-muted)}
[data-vibeui-block="sheet-007"] [data-part="chevron"]{
margin-left:auto;flex:none;width:0.5rem;height:0.5rem;
border:solid var(--vibeui-sheet-007-muted);border-width:1.75px 1.75px 0 0;transform:rotate(45deg);
}
[data-vibeui-block="sheet-007"] [data-part="option"]{
display:flex;align-items:center;gap:0.75rem;cursor:pointer;
padding:0.75rem 0;border-bottom:1px solid var(--vibeui-sheet-007-border);font-size:0.9375rem;
}
[data-vibeui-block="sheet-007"] [data-part="option"] input{
appearance:none;flex:none;width:1.125rem;height:1.125rem;margin:0;
border:1.5px solid var(--vibeui-sheet-007-border);border-radius:9999px;cursor:pointer;position:relative;
}
[data-vibeui-block="sheet-007"] [data-part="option"] input:checked{border-color:var(--vibeui-sheet-007-accent)}
[data-vibeui-block="sheet-007"] [data-part="option"] input:checked::after{
content:"";position:absolute;inset:0.1875rem;border-radius:9999px;background:var(--vibeui-sheet-007-accent);
}
[data-vibeui-block="sheet-007"] [data-part="option"] input:focus-visible{outline:2px solid var(--vibeui-sheet-007-accent);outline-offset:2px}
/* Шкала категории: на планшете и шире лист получает крупный кегль и воздух. */
@container (min-width: 32rem){
[data-vibeui-block="sheet-007"] [data-part="label"]{font-size:1rem}
[data-vibeui-block="sheet-007"] [data-part="hint"]{font-size:0.9375rem}
[data-vibeui-block="sheet-007"] [data-part="option"]{font-size:1rem;padding:0.875rem 0}
[data-vibeui-block="sheet-007"] [data-part="row"]{padding:0.875rem 0}
}
/* Немодальный показ: лист остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так его показывают на витрине и в документации. */
[data-vibeui-block="sheet-007"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:24rem;
}
[data-vibeui-block="sheet-007"] dialog:not(:modal){position:absolute;max-height:100%;z-index:1}
[data-vibeui-block="sheet-007"]:has(dialog:not(:modal)[open]) [data-part="trigger"]{display:none}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="sheet-007"] *{animation:none!important;transition:none!important}
[data-vibeui-block="sheet-007"] dialog{translate:0 0}
}
`

const DEFAULT_SECTIONS: Sheet007Section[] = [
  {
    label: "Язык интерфейса",
    hint: "Русский",
    options: ["Русский", "English", "Қазақша"],
  },
  {
    label: "Тема оформления",
    hint: "Как в системе",
    options: ["Как в системе", "Светлая", "Тёмная"],
  },
  {
    label: "Часовой пояс",
    hint: "Москва, UTC+3",
    options: ["Москва, UTC+3", "Екатеринбург, UTC+5", "Новосибирск, UTC+7"],
  },
]

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
 * Лист с двумя уровнями: список разделов и раздел с возвратом назад.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sheet007({
  triggerLabel = "Настройки приложения",
  title = "Настройки",
  sections = DEFAULT_SECTIONS,
  backLabel = "Назад к списку настроек",
  closeLabel = "Закрыть настройки",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Sheet007Props) {
  const sheet = useRef<HTMLDialogElement>(null)

  // show() вместо showModal(): немодальный лист живёт внутри своего блока и
  // не уводит страницу в верхний слой. Витрине нужен именно такой.
  useEffect(() => {
    if (!defaultOpen) {
      return
    }

    const active = document.activeElement

    sheet.current?.show()

    // show() уводит фокус внутрь листа. Для немодального показа это лишнее:
    // страница не должна прыгать к панели просто потому, что та открыта.
    if (active instanceof HTMLElement && active !== document.body) {
      active.focus()
    } else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [defaultOpen])
  const [openedSection, setOpenedSection] = useState<number | null>(null)
  // Имя радиогруппы уникально на экземпляр: с постоянным именем два листа на
  // странице делили бы одну группу и гасили выбор друг друга.
  const group = useId()

  const palette = {
    ...(accent ? { "--vibeui-sheet-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sheet-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const current = openedSection === null ? null : sections[openedSection]

  function open() {
    setOpenedSection(null)
    sheet.current?.showModal()
  }

  return (
    <>
      <style href="vibeui-sheet-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="sheet"
        data-vibeui-block="sheet-007"
        className={className}
        style={palette}
      >
        <button type="button" data-part="trigger" onClick={open}>
          {triggerLabel}
        </button>
        <dialog
          ref={sheet}
          aria-label={title}
          onClick={(event) => {
            if (event.target === sheet.current) {
              sheet.current.close()
            }
          }}
        >
          <div data-part="panel">
            <div data-part="head">
              {current ? (
                <button
                  type="button"
                  data-part="back"
                  aria-label={backLabel}
                  onClick={() => setOpenedSection(null)}
                >
                  <span data-part="arrow" aria-hidden="true" />
                </button>
              ) : null}
              <h2 data-part="title">{current ? current.label : title}</h2>
              <button
                type="button"
                data-part="close"
                aria-label={closeLabel}
                onClick={() => sheet.current?.close()}
              >
                <span data-part="cross" aria-hidden="true" />
              </button>
            </div>
            <div data-part="viewport">
              <div data-part="track" data-level={current ? 1 : 0}>
                <div data-part="level" inert={Boolean(current)}>
                  <ul data-part="rows">
                    {sections.map((section, index) => (
                      <li key={section.label}>
                        <button
                          type="button"
                          data-part="row"
                          onClick={() => setOpenedSection(index)}
                        >
                          <span data-part="labels">
                            <span data-part="label">{section.label}</span>
                            <span data-part="hint">{section.hint}</span>
                          </span>
                          <span data-part="chevron" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div data-part="level" inert={!current}>
                  {current
                    ? current.options.map((option, index) => (
                        <label key={option} data-part="option">
                          <input
                            type="radio"
                            name={`${group}-${openedSection}`}
                            defaultChecked={index === 0}
                          />
                          <span>{option}</span>
                        </label>
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}
