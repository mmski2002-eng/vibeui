"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Cascader015Node = { name: string; children?: Cascader015Node[] }

export type Cascader015Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange"
> & {
  label?: string
  tree?: Cascader015Node[]
  defaultPath?: string[]
  levelLabels?: string[]
  /** Первый вариант списка, когда уровень заполнен. */
  placeholderText?: string
  /** Первый вариант списка, когда у категории нет этого уровня. */
  emptyLevelText?: string
  /** Итог, {path} — собранный путь по рубрикам. */
  readyText?: string
  /** Итог, пока рубрика не выбрана до конца. */
  hintText?: string
  onChange?: (path: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: рубрику объявления заполняют с телефона, где выпадающий
// список — родной элемент системы, а самодельная панель со списками мешает.
// Поэтому каскад собран из трёх нативных <select>: он работает без JS до
// гидрации, открывается системным колесом на iOS и не ломает автозаполнение.
// Смена верхнего уровня сбрасывает нижние — иначе останется рубрика,
// которой в новом разделе нет.
const STYLES = `
:where([data-vibeui-block="cascader-015"]){
--vibeui-cascader-015-bg:transparent;
--vibeui-cascader-015-fg:light-dark(oklch(0.22 0.014 60),oklch(0.94 0.006 60));
--vibeui-cascader-015-muted:color-mix(in oklab,var(--vibeui-cascader-015-fg) 68%,transparent);
--vibeui-cascader-015-border:light-dark(oklch(0.9 0.008 60),oklch(0.36 0.012 60));
--vibeui-cascader-015-field:light-dark(oklch(0.985 0.004 60),oklch(0.27 0.012 60));
--vibeui-cascader-015-accent:light-dark(oklch(0.55 0.13 39.8),oklch(0.8 0.13 39.8));
--vibeui-cascader-015-accentsoft:light-dark(oklch(0.95 0.05 39.8),oklch(0.33 0.05 39.8));
--vibeui-cascader-015-radius:0.625rem;
--vibeui-cascader-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cascader-015"]{color-scheme:dark}
[data-vibeui-block="cascader-015"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;
margin:0;padding:0.875rem;
background:var(--vibeui-cascader-015-bg);
border:1px solid var(--vibeui-cascader-015-border);
border-radius:calc(var(--vibeui-cascader-015-radius) + 0.25rem);
color:var(--vibeui-cascader-015-fg);
font-family:var(--vibeui-cascader-015-font);
}
[data-vibeui-block="cascader-015"] legend{
padding:0;font-size:0.875rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="cascader-015"] [data-part="level"]{
display:flex;flex-direction:column;gap:0.1875rem;
}
[data-vibeui-block="cascader-015"] [data-part="level"] label{
font-size:0.6875rem;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-cascader-015-muted);
}
[data-vibeui-block="cascader-015"] select{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.5625rem;
border:1px solid var(--vibeui-cascader-015-border);
border-radius:var(--vibeui-cascader-015-radius);
background:var(--vibeui-cascader-015-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="cascader-015"] select:focus-visible{
outline:2px solid var(--vibeui-cascader-015-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="cascader-015"] select:disabled{
cursor:not-allowed;opacity:.55;background:var(--vibeui-cascader-015-bg);
}
[data-vibeui-block="cascader-015"] [data-part="path"]{
margin:0;padding:0.5rem 0.625rem;border-radius:var(--vibeui-cascader-015-radius);
background:var(--vibeui-cascader-015-accentsoft);
font-size:0.8125rem;line-height:1.35;
}
[data-vibeui-block="cascader-015"] [data-part="path"] b{font-weight:700}
[data-vibeui-block="cascader-015"] [data-part="path"][data-ready="false"]{
background:var(--vibeui-cascader-015-field);color:var(--vibeui-cascader-015-muted);
}
`

const RUBRICS: Cascader015Node[] = [
  {
    name: "Транспорт",
    children: [
      {
        name: "Автомобили",
        children: [{ name: "С пробегом" }, { name: "Новые" }],
      },
      { name: "Мотоциклы" },
      {
        name: "Запчасти",
        children: [{ name: "Кузов" }, { name: "Двигатель" }],
      },
    ],
  },
  {
    name: "Недвижимость",
    children: [
      {
        name: "Квартиры",
        children: [{ name: "Продам" }, { name: "Сдам" }],
      },
      { name: "Гаражи" },
    ],
  },
  {
    name: "Работа",
    children: [
      {
        name: "Вакансии",
        children: [{ name: "Полный день" }, { name: "Подработка" }],
      },
      { name: "Резюме" },
    ],
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
 * Рубрика объявления тремя нативными списками с каскадным сбросом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader015({
  label = "Рубрика объявления",
  tree = RUBRICS,
  defaultPath = ["Транспорт", "Автомобили", "С пробегом"],
  levelLabels = ["Раздел", "Категория", "Подрубрика"],
  placeholderText = "не выбрано",
  emptyLevelText = "уровень не нужен",
  readyText = "Объявление уйдёт в рубрику {path}",
  hintText = "Выберите рубрику до конца — от неё зависят поля объявления",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Cascader015Props) {
  const id = useId()
  const [path, setPath] = useState(defaultPath)

  const first = tree
  const second = tree.find((node) => node.name === path[0])?.children ?? []
  const third = second.find((node) => node.name === path[1])?.children ?? []

  const levels = [first, second, third]

  const change = (depth: number, value: string) => {
    const next = [...path.slice(0, depth), value].filter(Boolean)

    setPath(next)
    onChange?.(next)
  }

  const ready = third.length === 0 ? Boolean(path[1]) : Boolean(path[2])

  const [readyBefore, readyAfter] = readyText.split("{path}")

  const palette = {
    ...(accent ? { "--vibeui-cascader-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cascader-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-015" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="cascader"
        data-vibeui-block="cascader-015"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        {levels.map((options, depth) => (
          <div key={levelLabels[depth]} data-part="level">
            <label htmlFor={`${id}-level-${depth}`}>{levelLabels[depth]}</label>
            <select
              id={`${id}-level-${depth}`}
              value={path[depth] ?? ""}
              disabled={options.length === 0}
              onChange={(event) => change(depth, event.target.value)}
            >
              <option value="">
                {options.length === 0 ? emptyLevelText : placeholderText}
              </option>
              {options.map((node) => (
                <option key={node.name} value={node.name}>
                  {node.name}
                </option>
              ))}
            </select>
          </div>
        ))}
        <p data-part="path" data-ready={ready} aria-live="polite">
          {ready ? (
            <>
              {readyBefore}
              <b>{path.join(" / ")}</b>
              {readyAfter}
            </>
          ) : (
            hintText
          )}
        </p>
      </fieldset>
    </>
  )
}
