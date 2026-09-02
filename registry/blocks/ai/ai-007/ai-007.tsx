"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Ai007Prompt = {
  group: string
  title: string
  body: string
  badge?: string
}

export type Ai007Props = {
  title?: string
  description?: string
  groups?: string[]
  prompts?: Ai007Prompt[]
  actionLabel?: string
  emptyLabel?: string
  /** Название переключателя рубрик для скринридера. */
  tabsLabel?: string
  onPick?: (prompt: Ai007Prompt) => void
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: библиотека готовых запросов. Пустое поле ввода — главная
// причина, по которой ассистентом перестают пользоваться, поэтому здесь
// показывают не «что умеет модель», а конкретные формулировки, которые можно
// взять целиком.
//
// Переключатель рубрик собран как настоящий tablist: кнопки несут
// role="tab" и aria-selected, список — role="tabpanel" с aria-live, чтобы
// смена рубрики была услышана. Карточка промпта — кнопка целиком: класть
// внутрь неё отдельную маленькую кнопку значило бы делать вложенную
// интерактивность, которую не пройти с клавиатуры.
const STYLES = `
:where([data-vibeui-block="ai-007"]){
--vibeui-ai-007-bg:transparent;
--vibeui-ai-007-card:light-dark(oklch(1 0 0),oklch(0.25 0.011 265));
--vibeui-ai-007-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-ai-007-muted:light-dark(oklch(0.53 0.014 265),oklch(0.69 0.012 265));
--vibeui-ai-007-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-ai-007-accent:light-dark(oklch(0.53 0.19 300),oklch(0.76 0.15 300));
--vibeui-ai-007-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="ai-007"]{
background:var(--vibeui-ai-007-bg);color:var(--vibeui-ai-007-fg);
font-family:var(--vibeui-ai-007-sans);
border:1px solid var(--vibeui-ai-007-border);border-radius:1.125rem;
}
[data-vibeui-block="ai-007"] *{box-sizing:border-box}
[data-vibeui-block="ai-007"] [data-part="shell"]{padding:1.25rem;display:grid;gap:0.9375rem}
[data-vibeui-block="ai-007"] h2{margin:0;font-size:1.0625rem;font-weight:680;letter-spacing:-0.01em}
[data-vibeui-block="ai-007"] [data-part="lede"]{
margin:0.25rem 0 0;max-width:52ch;font-size:0.8125rem;line-height:1.6;color:var(--vibeui-ai-007-muted);
}
[data-vibeui-block="ai-007"] [data-part="tabs"]{display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="ai-007"] [data-part="tab"]{
appearance:none;cursor:pointer;
height:1.9375rem;padding:0 0.75rem;border-radius:9999px;
border:1px solid var(--vibeui-ai-007-border);background:var(--vibeui-ai-007-card);
color:var(--vibeui-ai-007-muted);font:inherit;font-size:0.75rem;font-weight:600;
transition:color .14s ease,border-color .14s ease;
}
[data-vibeui-block="ai-007"] [data-part="tab"][aria-selected="true"]{
color:var(--vibeui-ai-007-accent);
border-color:color-mix(in oklab,var(--vibeui-ai-007-accent) 45%,var(--vibeui-ai-007-border));
background:color-mix(in oklab,var(--vibeui-ai-007-accent) 9%,var(--vibeui-ai-007-card));
}
[data-vibeui-block="ai-007"] [data-part="list"]{display:grid;gap:0.625rem}
/* Карточка — одна кнопка: вложенная интерактивность не проходится клавишами. */
[data-vibeui-block="ai-007"] [data-part="card"]{
appearance:none;cursor:pointer;text-align:left;display:grid;gap:0.3125rem;
padding:0.8125rem 0.9375rem;border-radius:0.9375rem;
border:1px solid var(--vibeui-ai-007-border);background:var(--vibeui-ai-007-card);
color:inherit;font:inherit;
transition:border-color .14s ease,transform .14s ease;
}
[data-vibeui-block="ai-007"] [data-part="card"]:hover{
border-color:color-mix(in oklab,var(--vibeui-ai-007-accent) 45%,var(--vibeui-ai-007-border));
transform:translateY(-1px);
}
[data-vibeui-block="ai-007"] [data-part="top"]{display:flex;align-items:center;gap:0.5rem}
[data-vibeui-block="ai-007"] [data-part="name"]{font-size:0.8125rem;font-weight:660}
[data-vibeui-block="ai-007"] [data-part="badge"]{
margin-left:auto;padding:0.0625rem 0.4375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-ai-007-accent) 12%,transparent);
color:var(--vibeui-ai-007-accent);font-size:0.625rem;font-weight:650;
}
[data-vibeui-block="ai-007"] [data-part="body"]{
margin:0;font-size:0.75rem;line-height:1.55;color:var(--vibeui-ai-007-muted);
}
[data-vibeui-block="ai-007"] [data-part="cta"]{
font-size:0.6875rem;font-weight:650;color:var(--vibeui-ai-007-accent);
}
[data-vibeui-block="ai-007"] [data-part="empty"]{
margin:0;padding:1.25rem;border-radius:0.9375rem;
border:1px dashed var(--vibeui-ai-007-border);
font-size:0.8125rem;color:var(--vibeui-ai-007-muted);text-align:center;
}
[data-vibeui-block="ai-007"] :focus-visible{outline:2px solid var(--vibeui-ai-007-accent);outline-offset:2px}
@container (min-width: 44rem){
[data-vibeui-block="ai-007"] [data-part="shell"]{padding:1.5rem 1.75rem}
[data-vibeui-block="ai-007"] [data-part="list"]{grid-template-columns:1fr 1fr}
}
@container (min-width: 66rem){
[data-vibeui-block="ai-007"] [data-part="list"]{grid-template-columns:repeat(3,1fr)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS = ["Сайт", "Тексты", "Код", "Аналитика"]

const DEFAULT_PROMPTS: Ai007Prompt[] = [
  {
    group: "Сайт",
    title: "Лендинг из каталога",
    body: "Собери одностраничник для студии: hero, три преимущества, тарифы и форма заявки. Бери только блоки без зависимостей.",
    badge: "Часто",
  },
  {
    group: "Сайт",
    title: "Перебрать структуру",
    body: "Посмотри текущую страницу и предложи другой порядок экранов под цель «оставить заявку».",
  },
  {
    group: "Тексты",
    title: "Заголовок без воды",
    body: "Перепиши заголовок так, чтобы в нём было одно обещание и ни одного прилагательного вроде «инновационный».",
    badge: "Часто",
  },
  {
    group: "Тексты",
    title: "Развернуть описание",
    body: "Разверни строчку из карточки товара в абзац на 40 слов, сохранив факты и не добавив новых.",
  },
  {
    group: "Код",
    title: "Объясни диффи",
    body: "Разбери этот диф по шагам: что изменилось, зачем и какие места стоит проверить руками.",
  },
  {
    group: "Код",
    title: "Тест на регрессию",
    body: "Напиши тест, который падал бы до правки и проходит после неё. Без моков там, где можно без них.",
  },
  {
    group: "Аналитика",
    title: "Сводка по неделе",
    body: "Собери из выгрузки три цифры, которые изменились сильнее всего, и объясни каждую одной фразой.",
  },
  {
    group: "Аналитика",
    title: "Проверка гипотезы",
    body: "Оцени, хватает ли данных для вывода, и назови, чего не хватает, чтобы вывод стал надёжным.",
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
 * Библиотека промптов-заготовок с рубриками-вкладками.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Ai007({
  title = "Заготовки запросов",
  description = "Готовые формулировки вместо пустого поля: выберите рубрику и подставьте запрос целиком.",
  groups = DEFAULT_GROUPS,
  prompts = DEFAULT_PROMPTS,
  actionLabel = "Подставить в поле",
  emptyLabel = "В этой рубрике пока нет заготовок.",
  tabsLabel = "Рубрики заготовок",
  onPick,
  accent,
  background = "",
  className,
  style,
}: Ai007Props) {
  const [active, setActive] = useState(groups[0] ?? "")

  const palette = {
    ...(accent ? { "--vibeui-ai-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-ai-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const visible = prompts.filter((prompt) => prompt.group === active)

  return (
    <>
      <style href="vibeui-ai-007" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-007"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header>
            <h2>{title}</h2>
            <p data-part="lede">{description}</p>
          </header>

          <div data-part="tabs" role="tablist" aria-label={tabsLabel}>
            {groups.map((group) => (
              <button
                key={group}
                type="button"
                role="tab"
                data-part="tab"
                aria-selected={group === active}
                onClick={() => setActive(group)}
              >
                {group}
              </button>
            ))}
          </div>

          <div data-part="list" role="tabpanel" aria-live="polite">
            {visible.length === 0 ? (
              <p data-part="empty">{emptyLabel}</p>
            ) : (
              visible.map((prompt) => (
                <button
                  key={prompt.title}
                  type="button"
                  data-part="card"
                  onClick={() => onPick?.(prompt)}
                >
                  <span data-part="top">
                    <span data-part="name">{prompt.title}</span>
                    {prompt.badge ? (
                      <span data-part="badge">{prompt.badge}</span>
                    ) : null}
                  </span>
                  <span data-part="body">{prompt.body}</span>
                  <span data-part="cta">{actionLabel}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  )
}
