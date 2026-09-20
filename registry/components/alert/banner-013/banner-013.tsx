"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Banner013Category = {
  id: string
  title: string
  text: string
  /** Технически необходимые: выключить нельзя, и это честно показано. */
  required?: boolean
}

export type Banner013Props = Omit<ComponentProps<"section">, "children"> & {
  title?: string
  text?: string
  categories?: Banner013Category[]
  acceptLabel?: string
  rejectLabel?: string
  settingsLabel?: string
  saveLabel?: string
  accent?: string
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: согласие с настоящим экраном предпочтений. Обычная полоса
// даёт «принять всё» и ссылку «настроить», за которой ничего нет, — а закон
// требует раздельного выбора и отказа не сложнее согласия. Здесь «настроить»
// разворачивает список категорий прямо в панели: без перехода, без модального
// окна поверх, с честной пометкой у необходимых — их не выключить, и об этом
// сказано словом, а не серой галочкой без объяснения. Отказ стоит рядом с
// согласием и выглядит так же: разница только в заливке.
const STYLES = `
:where([data-vibeui-block="banner-013"]){
--vibeui-banner-013-bg:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-banner-013-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-banner-013-muted:color-mix(in oklab,var(--vibeui-banner-013-fg) 68%,transparent);
--vibeui-banner-013-border:light-dark(oklch(0.89 0 265),oklch(0.36 0 265));
--vibeui-banner-013-accent:light-dark(oklch(0.28 0 265),oklch(0.9 0 265));
/* Текст на акценте выводится из его светлоты: проект передаёт один цвет на
   обе ветки темы, и фиксированный однажды окажется тёмным на тёмном. */
--vibeui-banner-013-on-accent:oklch(from var(--vibeui-banner-013-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-banner-013-outline:color-mix(in oklab,var(--vibeui-banner-013-accent) 65%,var(--vibeui-banner-013-fg) 35%);
--vibeui-banner-013-shadow:light-dark(oklch(0.2 0 265 / 50%),oklch(0 0 0 / 62%));
--vibeui-banner-013-radius:0.875rem;
--vibeui-banner-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="banner-013"]{color-scheme:dark}
[data-vibeui-block="banner-013"]{
display:flex;flex-direction:column;gap:0.75rem;
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:34rem;padding:1rem 1.125rem;
background:var(--vibeui-banner-013-bg);
border:1px solid var(--vibeui-banner-013-border);
border-radius:var(--vibeui-banner-013-radius);
box-shadow:0 22px 48px -30px var(--vibeui-banner-013-shadow);
color:var(--vibeui-banner-013-fg);
font-family:var(--vibeui-banner-013-font);
}
[data-vibeui-block="banner-013"] *{box-sizing:border-box}
[data-vibeui-block="banner-013"] [data-part="title"]{
margin:0;font-size:0.9375rem;font-weight:650;line-height:1.3;
}
[data-vibeui-block="banner-013"] [data-part="text"]{
margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-banner-013-muted);
}
/* Список категорий разворачивается в самой панели: переход на отдельную
   страницу теряет половину людей, а модальное окно поверх полосы — приём,
   от которого закон как раз и защищает. */
[data-vibeui-block="banner-013"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.5rem;
margin:0;padding:0.625rem 0.75rem;list-style:none;
border:1px solid var(--vibeui-banner-013-border);
border-radius:0.625rem;
}
[data-vibeui-block="banner-013"] [data-part="row"]{
display:flex;align-items:flex-start;gap:0.625rem;
}
[data-vibeui-block="banner-013"] [data-part="row"] input{
flex:none;margin:0.1875rem 0 0;width:0.9375rem;height:0.9375rem;
accent-color:var(--vibeui-banner-013-accent);
}
[data-vibeui-block="banner-013"] [data-part="row"] input:disabled{opacity:.55}
[data-vibeui-block="banner-013"] [data-part="row-text"]{
display:flex;flex-direction:column;gap:0.0625rem;min-width:0;
}
[data-vibeui-block="banner-013"] [data-part="row-title"]{
font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="banner-013"] [data-part="row-note"]{
font-size:0.75rem;line-height:1.35;color:var(--vibeui-banner-013-muted);
}
[data-vibeui-block="banner-013"] [data-part="required"]{
font-size:0.6875rem;color:var(--vibeui-banner-013-muted);
}
[data-vibeui-block="banner-013"] [data-part="actions"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
}
/* Отказ такой же величины и веса, как согласие: разница только в заливке. */
[data-vibeui-block="banner-013"] [data-part="accept"],
[data-vibeui-block="banner-013"] [data-part="reject"],
[data-vibeui-block="banner-013"] [data-part="save"]{
appearance:none;cursor:pointer;
min-height:2.125rem;padding:0.25rem 1rem;display:inline-flex;align-items:center;justify-content:center;border-radius:0.625rem;
border:1px solid var(--vibeui-banner-013-outline);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="banner-013"] [data-part="accept"],
[data-vibeui-block="banner-013"] [data-part="save"]{
background:var(--vibeui-banner-013-accent);color:oklch(from var(--vibeui-banner-013-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="banner-013"] [data-part="reject"]{
background:transparent;color:var(--vibeui-banner-013-fg);
}
[data-vibeui-block="banner-013"] [data-part="settings"]{
appearance:none;cursor:pointer;border:0;background:transparent;
margin-left:auto;padding:0.25rem 0.375rem;border-radius:0.375rem;
font:inherit;font-size:0.875rem;color:var(--vibeui-banner-013-muted);
text-decoration:underline;text-underline-offset:0.2em;
}
[data-vibeui-block="banner-013"] [data-part="settings"]:hover{color:var(--vibeui-banner-013-fg)}
[data-vibeui-block="banner-013"] :focus-visible{
outline:2px solid var(--vibeui-banner-013-accent);outline-offset:2px;
}
@container (max-width: 26rem){
[data-vibeui-block="banner-013"] [data-part="accept"],
[data-vibeui-block="banner-013"] [data-part="reject"],
[data-vibeui-block="banner-013"] [data-part="save"]{flex:1 1 100%}
[data-vibeui-block="banner-013"] [data-part="settings"]{margin-left:0;width:100%;text-align:left}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CATEGORIES: Banner013Category[] = [
  {
    id: "necessary",
    title: "Необходимые",
    text: "Вход, корзина и защита форм. Без них сайт не работает.",
    required: true,
  },
  {
    id: "analytics",
    title: "Статистика",
    text: "Обезличенные счётчики посещений: какие страницы открывают чаще.",
  },
  {
    id: "marketing",
    title: "Реклама",
    text: "Показ наших объявлений на других сайтах и оценка их отдачи.",
  },
]

/**
 * Согласие с раздельным выбором: категории разворачиваются в самой панели.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner013({
  title = "Cookie и статистика",
  text = "Необходимые файлы уже стоят. Остальные включаются только с вашего согласия — по отдельности.",
  categories = DEFAULT_CATEGORIES,
  acceptLabel = "Принять все",
  rejectLabel = "Только необходимые",
  settingsLabel = "Настроить",
  saveLabel = "Сохранить выбор",
  accent,
  background = "",
  className,
  style,
  ...props
}: Banner013Props) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [chosen, setChosen] = useState<string[]>(
    categories.filter((entry) => entry.required).map((entry) => entry.id),
  )

  const toggle = (entry: Banner013Category) => {
    if (entry.required) {
      return
    }

    setChosen((current) =>
      current.includes(entry.id)
        ? current.filter((value) => value !== entry.id)
        : [...current, entry.id],
    )
  }

  const palette = {
    ...(accent ? { "--vibeui-banner-013-accent": accent } : null),
    ...(background ? { "--vibeui-banner-013-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-banner-013" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="banner"
        data-vibeui-block="banner-013"
        aria-label={title}
        className={className}
        style={palette}
      >
        <h2 data-part="title">{title}</h2>
        <p data-part="text">{text}</p>

        {open ? (
          <ul data-part="list" id={`${id}-list`}>
            {categories.map((entry) => (
              <li key={entry.id} data-part="row">
                {/* Настоящий checkbox: состояние и клавиатура приходят от
                    браузера, а не имитируются ролями. */}
                <input
                  type="checkbox"
                  id={`${id}-${entry.id}`}
                  checked={entry.required || chosen.includes(entry.id)}
                  disabled={entry.required}
                  onChange={() => toggle(entry)}
                />
                <label data-part="row-text" htmlFor={`${id}-${entry.id}`}>
                  <span data-part="row-title">
                    {entry.title}
                    {entry.required ? (
                      <span data-part="required"> · выключить нельзя</span>
                    ) : null}
                  </span>
                  <span data-part="row-note">{entry.text}</span>
                </label>
              </li>
            ))}
          </ul>
        ) : null}

        <div data-part="actions">
          {open ? (
            <button type="button" data-part="save">
              {saveLabel}
            </button>
          ) : (
            <button type="button" data-part="accept">
              {acceptLabel}
            </button>
          )}
          <button type="button" data-part="reject">
            {rejectLabel}
          </button>
          <button
            type="button"
            data-part="settings"
            aria-expanded={open}
            aria-controls={`${id}-list`}
            onClick={() => setOpen((value) => !value)}
          >
            {settingsLabel}
          </button>
        </div>
      </section>
    </>
  )
}
