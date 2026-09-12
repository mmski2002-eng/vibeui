"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Card007Props = Omit<
  ComponentProps<"article">,
  "children" | "title"
> & {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  avatarImage?: string
  from?: string
  title?: string
  body?: string
  time?: string
  primaryLabel?: string
  secondaryLabel?: string
  /** Подпись точки непрочитанного для скринридера. */
  unreadLabel?: string
  /** Отчёт после ответа. {label} — подпись нажатой кнопки. */
  resultText?: Record<"primary" | "secondary", string>
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: карточка уведомления с действиями внутри. Ответить или
// отклонить можно прямо здесь, не открывая письмо: половина уведомлений
// требует одного нажатия. После ответа карточка не исчезает, а показывает,
// что именно произошло — исчезнувшая строка выглядит как потерянная.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте рамка светлее подложки, а не темнее.
const STYLES = `
:where([data-vibeui-block="card-007"]){
--vibeui-card-007-bg:transparent;
--vibeui-card-007-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-card-007-muted:color-mix(in oklab,var(--vibeui-card-007-fg) 68%,transparent);
--vibeui-card-007-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-card-007-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-card-007-on-accent:light-dark(oklch(0.99 0 265),oklch(0.18 0 265));
--vibeui-card-007-done:light-dark(oklch(0.55 0.15 152),oklch(0.76 0.14 152));
--vibeui-card-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-007"]{color-scheme:dark}
[data-vibeui-block="card-007"]{
position:relative;display:flex;gap:0.625rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-card-007-bg);
border:1px solid var(--vibeui-card-007-border);border-radius:0.875rem;
color:var(--vibeui-card-007-fg);font-family:var(--vibeui-card-007-font);
}
[data-vibeui-block="card-007"] [data-part="face"]{
position:relative;display:flex;align-items:center;justify-content:center;flex:none;
width:2.25rem;height:2.25rem;border-radius:9999px;
color:light-dark(oklch(0.38 0.09 var(--vibeui-card-007-hue,250)),oklch(0.92 0.05 var(--vibeui-card-007-hue,250)));
font-size:0.75rem;font-weight:700;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="card-007"] [data-part="face"][data-empty="true"]{background:light-dark(oklch(0.92 0.05 var(--vibeui-card-007-hue,250)),oklch(0.33 0.07 var(--vibeui-card-007-hue,250)));}
[data-vibeui-block="card-007"] [data-part="face"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;
}
[data-vibeui-block="card-007"] [data-part="body"]{display:flex;flex-direction:column;gap:0.25rem;min-width:0;flex:1}
[data-vibeui-block="card-007"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="card-007"] [data-part="from"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="card-007"] [data-part="time"]{flex:none;font-size:0.6875rem;color:var(--vibeui-card-007-muted)}
[data-vibeui-block="card-007"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:600;line-height:1.3}
[data-vibeui-block="card-007"] [data-part="text"]{
margin:0;font-size:0.8125rem;line-height:1.4;color:var(--vibeui-card-007-muted);
display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
}
[data-vibeui-block="card-007"] [data-part="actions"]{display:flex;gap:0.375rem;margin-top:0.25rem}
[data-vibeui-block="card-007"] button{
appearance:none;cursor:pointer;
height:2rem;padding:0 0.75rem;
border:1px solid var(--vibeui-card-007-border);border-radius:0.5rem;
background:transparent;color:inherit;font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="card-007"] button[data-primary="true"]{
border-color:transparent;background:var(--vibeui-card-007-accent);color:oklch(from var(--vibeui-card-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="card-007"] button:focus-visible{outline:2px solid var(--vibeui-card-007-accent);outline-offset:2px}
/* После ответа карточка остаётся на месте с отчётом: исчезнувшая строка
   читается как потерянная. */
[data-vibeui-block="card-007"] [data-part="result"]{
display:inline-flex;align-items:center;gap:0.375rem;margin-top:0.375rem;
font-size:0.8125rem;font-weight:600;color:var(--vibeui-card-007-done);
}
[data-vibeui-block="card-007"] [data-part="tick"]{
width:0.3125rem;height:0.5625rem;
border-right:2px solid currentColor;border-bottom:2px solid currentColor;
transform:rotate(45deg);
}
[data-vibeui-block="card-007"] [data-part="unread"]{
position:absolute;right:0.75rem;top:0.75rem;
width:0.4375rem;height:0.4375rem;border-radius:9999px;background:var(--vibeui-card-007-accent);color:oklch(from var(--vibeui-card-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-007"] *{animation:none!important;transition:none!important}}
`

function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

const UNREAD_LABEL = "Не прочитано"

const RESULT_TEXT: Record<"primary" | "secondary", string> = {
  primary: "{label}: приглашение принято",
  secondary: "{label}: приглашение отклонено",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Уведомление с действиями внутри и отчётом вместо исчезновения.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card007({
  from = "Анна Петрова",
  avatarImage = "",
  title = "Приглашает в проект «Каталог»",
  body = "Нужен взгляд на карточки товаров и вычитка описаний перед релизом.",
  time = "12 мин",
  primaryLabel = "Принять",
  secondaryLabel = "Отклонить",
  unreadLabel = UNREAD_LABEL,
  resultText = RESULT_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Card007Props) {
  const [answer, setAnswer] = useState<string | null>(null)

  const palette = {
    "--vibeui-card-007-hue": hue(from),
    ...(accent ? { "--vibeui-card-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-card-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-007" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-007"
        className={className}
        style={palette}
      >
        {answer ? null : <span data-part="unread" aria-label={unreadLabel} />}
        <span
          data-part="face"
          data-empty={avatarImage ? undefined : "true"}
          aria-hidden="true"
        >
          {avatarImage ? (
            <img src={avatarImage} alt="" loading="lazy" decoding="async" />
          ) : null}
          {initials(from)}
        </span>
        <div data-part="body">
          <p data-part="head">
            <span data-part="from">{from}</span>
            <span data-part="time">{time}</span>
          </p>
          <h3 data-part="title">{title}</h3>
          <p data-part="text">{body}</p>
          {answer ? (
            <p data-part="result" role="status">
              <span data-part="tick" aria-hidden="true" />
              {answer}
            </p>
          ) : (
            <div data-part="actions">
              <button
                type="button"
                data-primary="true"
                onClick={() =>
                  setAnswer(resultText.primary.replace("{label}", primaryLabel))
                }
              >
                {primaryLabel}
              </button>
              <button
                type="button"
                onClick={() =>
                  setAnswer(
                    resultText.secondary.replace("{label}", secondaryLabel),
                  )
                }
              >
                {secondaryLabel}
              </button>
            </div>
          )}
        </div>
      </article>
    </>
  )
}
