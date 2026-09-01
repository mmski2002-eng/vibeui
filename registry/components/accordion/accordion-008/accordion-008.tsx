import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Accordion008Child = {
  title: string
  body: string
}

export type Accordion008Section = {
  title: string
  /** Подпись справа от раздела: сколько внутри, кем обновлено. */
  meta?: string
  children: Accordion008Child[]
}

/** Значок раздела. Все фигуры рисует компонент, картинка одна во всех движках. */
export type Accordion008Marker =
  "chevron" | "triangle" | "square" | "plus" | "none"

export type Accordion008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  sections?: Accordion008Section[]
  defaultOpen?: number
  marker?: Accordion008Marker
  /** Линия от заголовка главы вдоль её статей. */
  guide?: "line" | "none"
  /** Пусто — заливки нет, справочник лежит на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: два уровня вложенности для документации и справки.
// Внешний раздел — глава, внутренний — статья; вложенность видна не отступом,
// а линией, идущей от заголовка главы вниз вдоль её пунктов. Оба уровня —
// нативные details, поэтому поиск по странице раскрывает сразу оба.
const STYLES = `
:where([data-vibeui-block="accordion-008"]){
--vibeui-accordion-008-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-accordion-008-muted:light-dark(oklch(0.52 0.014 265),oklch(0.68 0.01 265));
--vibeui-accordion-008-bg:transparent;
--vibeui-accordion-008-border:light-dark(oklch(0.91 0.006 265),oklch(0.31 0.01 265));
--vibeui-accordion-008-accent:light-dark(oklch(0.55 0.2 262),oklch(0.75 0.16 262));
--vibeui-accordion-008-radius:0.875rem;
--vibeui-accordion-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-008"]{
display:flex;flex-direction:column;
width:100%;max-width:42rem;box-sizing:border-box;overflow:hidden;
border:1px solid var(--vibeui-accordion-008-border);
border-radius:var(--vibeui-accordion-008-radius);
background:var(--vibeui-accordion-008-bg);
color:var(--vibeui-accordion-008-fg);font-family:var(--vibeui-accordion-008-font);
}
[data-vibeui-block="accordion-008"] > details + details{border-top:1px solid var(--vibeui-accordion-008-border)}
[data-vibeui-block="accordion-008"] summary{
display:flex;align-items:center;gap:0.75rem;
cursor:pointer;list-style:none;
}
[data-vibeui-block="accordion-008"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-008"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-008-accent);outline-offset:-2px}
[data-vibeui-block="accordion-008"] > details > summary{
padding:0.9375rem 1.0625rem;font-size:0.9375rem;font-weight:600;line-height:1.35;
}
[data-vibeui-block="accordion-008"] [data-part="title"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="accordion-008"] [data-part="meta"]{
flex:none;font-size:0.75rem;color:var(--vibeui-accordion-008-muted);
font-variant-numeric:tabular-nums;
}
/* Бокс значка постоянного размера: строки остаются выровненными при любой
   фигуре, а отступ ответа считается от него. */
[data-vibeui-block="accordion-008"] [data-part="marker"]{
position:relative;flex:none;width:0.625rem;height:0.625rem;
}
[data-vibeui-block="accordion-008"] [data-part="marker"]::before{
content:"";position:absolute;left:50%;top:50%;
transition:transform .18s ease,border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="accordion-008"][data-marker="chevron"] [data-part="marker"]::before{
width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-accordion-008-muted);
border-bottom:1.5px solid var(--vibeui-accordion-008-muted);
transform:translate(-70%,-50%) rotate(-45deg);
}
[data-vibeui-block="accordion-008"][data-marker="chevron"] details[open] > summary [data-part="marker"]::before{
transform:translate(-50%,-70%) rotate(45deg);
border-right-color:var(--vibeui-accordion-008-accent);border-bottom-color:var(--vibeui-accordion-008-accent);
}
[data-vibeui-block="accordion-008"][data-marker="triangle"] [data-part="marker"]::before{
width:0.5rem;height:0.5rem;transform:translate(-50%,-50%);
background:var(--vibeui-accordion-008-muted);clip-path:polygon(15% 0,100% 50%,15% 100%);
}
[data-vibeui-block="accordion-008"][data-marker="triangle"] details[open] > summary [data-part="marker"]::before{
transform:translate(-50%,-50%) rotate(90deg);background:var(--vibeui-accordion-008-accent);
}
[data-vibeui-block="accordion-008"][data-marker="square"] [data-part="marker"]::before{
width:0.5rem;height:0.5rem;border-radius:1px;transform:translate(-50%,-50%);
box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-008-muted);
}
[data-vibeui-block="accordion-008"][data-marker="square"] details[open] > summary [data-part="marker"]::before{
transform:translate(-50%,-50%) rotate(45deg);
background:var(--vibeui-accordion-008-accent);box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-008-accent);
}
[data-vibeui-block="accordion-008"][data-marker="plus"] [data-part="marker"]::before,
[data-vibeui-block="accordion-008"][data-marker="plus"] [data-part="marker"]::after{
content:"";position:absolute;left:0;top:50%;
width:100%;height:1.5px;margin-top:-0.75px;border-radius:1px;transform:none;
background:var(--vibeui-accordion-008-muted);
transition:transform .18s ease,background-color .16s ease;
}
[data-vibeui-block="accordion-008"][data-marker="plus"] [data-part="marker"]::after{transform:rotate(90deg)}
[data-vibeui-block="accordion-008"][data-marker="plus"] details[open] > summary [data-part="marker"]::after{transform:rotate(0deg)}
[data-vibeui-block="accordion-008"][data-marker="plus"] details[open] > summary [data-part="marker"]::before,
[data-vibeui-block="accordion-008"][data-marker="plus"] details[open] > summary [data-part="marker"]::after{background:var(--vibeui-accordion-008-accent)}
/* Второй уровень: линия слева вместо отступа — она связывает пункты с главой. */
[data-vibeui-block="accordion-008"] [data-part="children"]{
margin:0 0 0.625rem 1.6875rem;padding-left:0.9375rem;
border-left:1px solid var(--vibeui-accordion-008-border);
}
[data-vibeui-block="accordion-008"] [data-part="children"] details{border:0}
[data-vibeui-block="accordion-008"] [data-part="children"] summary{
padding:0.4375rem 0;font-size:0.875rem;font-weight:500;color:var(--vibeui-accordion-008-muted);
transition:color .16s ease;
}
[data-vibeui-block="accordion-008"] [data-part="children"] summary:hover{color:var(--vibeui-accordion-008-fg)}
[data-vibeui-block="accordion-008"] [data-part="children"] details[open] > summary{color:var(--vibeui-accordion-008-accent)}
[data-vibeui-block="accordion-008"] [data-part="children"] [data-part="marker"]{width:0.5rem;height:0.5rem}
/* Вложенность показывает линия от заголовка главы. Отключается на guide. */
[data-vibeui-block="accordion-008"][data-guide="none"] [data-part="children"]{border-left-color:transparent}
[data-vibeui-block="accordion-008"] [data-part="body"]{
margin:0;padding:0 0 0.75rem;
font-size:0.875rem;line-height:1.6;color:var(--vibeui-accordion-008-muted);max-width:58ch;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SECTIONS: Accordion008Section[] = [
  {
    title: "Установка",
    meta: "3",
    children: [
      {
        title: "Через shadcn CLI",
        body: "Одна команда с адресом реестра: файл кладётся в components/vibeui, зависимости объявлены в метаданных item'а.",
      },
      {
        title: "Без CLI",
        body: "Скачайте файл по прямой ссылке и положите в проект. Ничего собирать и настраивать не нужно.",
      },
      {
        title: "Проверка после установки",
        body: "Откройте страницу с компонентом: он обязан выглядеть так же, как в превью каталога. Расхождение — повод сообщить нам.",
      },
    ],
  },
  {
    title: "Темы и палитра",
    meta: "2",
    children: [
      {
        title: "Переопределение переменных",
        body: "Каждый компонент несёт локальные переменные --vibeui-*. Переопределите их у родителя — компонент встанет в вашу тему, файл трогать не нужно.",
      },
      {
        title: "Тёмная тема",
        body: "Палитра объявлена в :where() с нулевой специфичностью, поэтому ваши правила для тёмной темы перекрывают её без !important.",
      },
    ],
  },
  {
    title: "Обновления",
    meta: "1",
    children: [
      {
        title: "Как приходят изменения",
        body: "Установленный файл принадлежит проекту и сам не обновляется. Новая версия ставится той же командой и перезаписывает файл — правки сохраняйте отдельно.",
      },
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
 * Двухуровневый аккордеон для справки: главы и статьи внутри них.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion008({
  sections = DEFAULT_SECTIONS,
  defaultOpen = -1,
  marker = "chevron",
  guide = "line",
  background = "",
  accent,
  className,
  style,
  ...props
}: Accordion008Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-accordion-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="accordion-008"
        data-marker={marker}
        data-guide={guide}
        className={className}
        style={palette}
      >
        {sections.map((section, index) => (
          <details key={section.title} open={index === defaultOpen}>
            <summary>
              <span data-part="title">{section.title}</span>
              {section.meta ? (
                <span data-part="meta">{section.meta}</span>
              ) : null}
              {marker === "none" ? null : (
                <span data-part="marker" aria-hidden="true" />
              )}
            </summary>
            <div data-part="children">
              {section.children.map((child) => (
                <details key={child.title}>
                  <summary>
                    <span data-part="title">{child.title}</span>
                    {marker === "none" ? null : (
                      <span data-part="marker" aria-hidden="true" />
                    )}
                  </summary>
                  <p data-part="body">{child.body}</p>
                </details>
              ))}
            </div>
          </details>
        ))}
      </div>
    </>
  )
}
