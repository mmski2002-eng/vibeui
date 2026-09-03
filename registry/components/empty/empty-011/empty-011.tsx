"use client"

import { useId, useState, type CSSProperties } from "react"

export type Empty011Role = {
  id: string
  label: string
  hint: string
}

export type Empty011Props = {
  title?: string
  text?: string
  roles?: Empty011Role[]
  defaultRoleId?: string
  /** Заголовок радиогруппы ролей. */
  legendLabel?: string
  actionLabel?: string
  pendingTitle?: string
  pendingText?: string
  onRequest?: (roleId: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: отказ в доступе, где запрос — это форма, а не письмо
// в пустоту. Человек выбирает нужную роль из объяснённого списка и
// отправляет запрос сам; после отправки карточка сменяется подтверждением,
// чтобы кнопка "Запросить" не приглашала нажать её повторно.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="empty-011"]){
--vibeui-empty-011-bg:transparent;
--vibeui-empty-011-fg:light-dark(oklch(0.21 0.014 265),oklch(0.95 0.005 265));
--vibeui-empty-011-muted:color-mix(in oklab,var(--vibeui-empty-011-fg) 68%,transparent);
--vibeui-empty-011-border:light-dark(oklch(0.91 0.006 265),oklch(0.37 0.012 265));
--vibeui-empty-011-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-empty-011-accent-fg:light-dark(oklch(0.99 0.01 265),oklch(0.18 0.03 265));
--vibeui-empty-011-ok:light-dark(oklch(0.6 0.14 152),oklch(0.78 0.13 152));
--vibeui-empty-011-ok-soft:light-dark(oklch(0.95 0.03 152),oklch(0.32 0.05 152));
--vibeui-empty-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="empty-011"]{color-scheme:dark}
[data-vibeui-block="empty-011"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1.5rem 1.25rem;
text-align:center;
background:var(--vibeui-empty-011-bg);
border:1px solid var(--vibeui-empty-011-border);border-radius:1rem;
font-family:var(--vibeui-empty-011-font);color:var(--vibeui-empty-011-fg);
}
[data-vibeui-block="empty-011"] [data-part="mark"]{
color:var(--vibeui-empty-011-muted);width:2.5rem;height:2.5rem;
}
[data-vibeui-block="empty-011"] [data-part="title"]{margin:0.125rem 0 0;font-size:1rem;font-weight:680;line-height:1.3}
[data-vibeui-block="empty-011"] [data-part="text"]{
margin:0;max-width:34ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-empty-011-muted);
}
[data-vibeui-block="empty-011"] form{width:100%}
[data-vibeui-block="empty-011"] fieldset{
border:0;margin:0.375rem 0 0;padding:0;width:100%;display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="empty-011"] legend{
padding:0;margin:0 0 0.375rem;font-size:0.75rem;font-weight:650;color:var(--vibeui-empty-011-muted);
}
[data-vibeui-block="empty-011"] [data-part="option"]{
display:flex;align-items:flex-start;gap:0.625rem;text-align:left;
padding:0.625rem 0.75rem;border:1px solid var(--vibeui-empty-011-border);border-radius:0.75rem;
cursor:pointer;
}
[data-vibeui-block="empty-011"] [data-part="option"]:has(input:checked){
border-color:var(--vibeui-empty-011-accent);
background:color-mix(in oklab,var(--vibeui-empty-011-accent) 6%,transparent);
}
[data-vibeui-block="empty-011"] [data-part="option"] input{
margin-top:0.1875rem;accent-color:var(--vibeui-empty-011-accent);flex:none;
}
[data-vibeui-block="empty-011"] [data-part="option"] input:focus-visible{
outline:2px solid var(--vibeui-empty-011-accent);outline-offset:2px;
}
[data-vibeui-block="empty-011"] [data-part="option-body"]{display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="empty-011"] [data-part="option-label"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="empty-011"] [data-part="option-hint"]{font-size:0.75rem;color:var(--vibeui-empty-011-muted)}
[data-vibeui-block="empty-011"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;margin-top:0.5rem;width:100%;
height:2.5rem;padding:0 1.125rem;border-radius:0.75rem;
background:var(--vibeui-empty-011-accent);color:var(--vibeui-empty-011-accent-fg);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="empty-011"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-empty-011-accent);outline-offset:2px;
}
[data-vibeui-block="empty-011"] [data-part="pending-mark"]{
width:2.5rem;height:2.5rem;border-radius:9999px;
background:var(--vibeui-empty-011-ok-soft);color:var(--vibeui-empty-011-ok);
display:flex;align-items:center;justify-content:center;
}
[data-vibeui-block="empty-011"] [data-part="pending-mark"] svg{width:1.375rem;height:1.375rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROLES: Empty011Role[] = [
  {
    id: "viewer-plus",
    label: "Просмотр отчётов",
    hint: "Видеть аналитику без права менять её",
  },
  { id: "editor", label: "Редактор", hint: "Создавать и менять дашборды" },
  {
    id: "temp",
    label: "Временный доступ на 7 дней",
    hint: "Снимается автоматически",
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
 * Отказ в доступе с формой запроса: выбор роли, отправка, подтверждение.
 * Один файл, ноль внешних зависимостей.
 */
export function Empty011({
  title = "Раздел закрыт для вашей роли",
  text = "Выберите, какой доступ нужен, — запрос уйдёт владельцу пространства.",
  roles = DEFAULT_ROLES,
  defaultRoleId,
  legendLabel = "Какой доступ нужен",
  actionLabel = "Запросить доступ",
  pendingTitle = "Запрос отправлен",
  pendingText = "Ответ придёт в уведомления. Обычно это занимает не больше рабочего дня.",
  onRequest,
  background = "",
  accent,
  className,
  style,
}: Empty011Props) {
  const [selected, setSelected] = useState(defaultRoleId ?? roles[0]?.id ?? "")
  const [submitted, setSubmitted] = useState(false)
  const groupId = useId()
  const palette = {
    ...(accent ? { "--vibeui-empty-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-empty-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-empty-011" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="empty"
        data-vibeui-block="empty-011"
        role="status"
        className={className}
        style={palette}
      >
        {submitted ? (
          <>
            <span data-part="pending-mark" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="5 13 10 18 19 7" />
              </svg>
            </span>
            <h3 data-part="title">{pendingTitle}</h3>
            <p data-part="text">{pendingText}</p>
          </>
        ) : (
          <>
            <svg
              data-part="mark"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            <h3 data-part="title">{title}</h3>
            <p data-part="text">{text}</p>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                onRequest?.(selected)
                setSubmitted(true)
              }}
            >
              <fieldset>
                <legend>{legendLabel}</legend>
                {roles.map((role) => (
                  <label key={role.id} data-part="option">
                    <input
                      type="radio"
                      name={groupId}
                      value={role.id}
                      checked={selected === role.id}
                      onChange={() => setSelected(role.id)}
                    />
                    <span data-part="option-body">
                      <span data-part="option-label">{role.label}</span>
                      <span data-part="option-hint">{role.hint}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
              <button type="submit" data-part="action">
                {actionLabel}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  )
}
